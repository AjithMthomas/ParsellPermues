"""
Pura image pipeline.

Builds every picture the site ships from the client's own campaign photography in
art/originals/. Nothing here is drawn from scratch: new fragrances are the real
Pura bottle with its liquid re-tinted and its label re-coloured and re-lettered,
so glass, cap, collar and reflections stay photographic.

    python -I art/build_images.py            # everything
    python -I art/build_images.py bottles    # one step: bottles | scenes | brand | grounds

Outputs land in public/images (WebP) and public/brand. Label lettering uses
Century Gothic (C:/Windows/Fonts/GOTHIC.TTF), the nearest system face to the
label's own geometric capitals.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage as ndi
from skimage import color as skcolor
from skimage.restoration import inpaint_biharmonic

ROOT = Path(__file__).resolve().parent.parent
ORIG = ROOT / "art" / "originals"
OUT = ROOT / "public" / "images"
BRAND = ROOT / "public" / "brand"
LABEL_FONT = "C:/Windows/Fonts/GOTHIC.TTF"


# ---------------------------------------------------------------- helpers

def load(path: Path) -> np.ndarray:
    return np.asarray(Image.open(path).convert("RGBA")).astype(np.float32) / 255.0


def to_img(arr: np.ndarray) -> Image.Image:
    arr = np.clip(arr * 255.0 + 0.5, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGBA" if arr.shape[-1] == 4 else "RGB")


def smoothstep(x, a, b):
    t = np.clip((x - a) / (b - a), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def save_webp(img: Image.Image, path: Path, widths: list[int], quality: int = 82) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    for w in widths:
        im = img
        if img.width != w:
            h = round(img.height * w / img.width)
            im = img.resize((w, h), Image.LANCZOS)
        name = path.with_name(f"{path.stem}-{w}.webp")
        im.save(name, "WEBP", quality=quality, method=6)
        print(f"  {name.relative_to(ROOT)}  {im.width}x{im.height}  {name.stat().st_size // 1024} KB")


def premul_resize(rgba: np.ndarray, scale: float) -> np.ndarray:
    h, w = rgba.shape[:2]
    nw, nh = round(w * scale), round(h * scale)
    a = rgba[..., 3:4]
    pm = np.concatenate([rgba[..., :3] * a, a], axis=-1)
    chans = []
    for c in range(4):
        im = Image.fromarray(pm[..., c].astype(np.float32), "F").resize((nw, nh), Image.LANCZOS)
        chans.append(np.asarray(im))
    out = np.stack(chans, axis=-1)
    out = np.clip(out, 0, 1)
    a2 = out[..., 3:4]
    rgb = np.where(a2 > 1e-4, out[..., :3] / np.maximum(a2, 1e-4), 0)
    return np.concatenate([np.clip(rgb, 0, 1), a2], axis=-1)


def unsharp(rgb: np.ndarray, radius=1.2, amount=0.55) -> np.ndarray:
    blur = np.stack([ndi.gaussian_filter(rgb[..., c], radius) for c in range(3)], -1)
    return np.clip(rgb + (rgb - blur) * amount, 0, 1)


# ---------------------------------------------------------------- bottle templates
# Coordinates are in the original 1x cutout pixels.

TEMPLATES = {
    "symphony": dict(src="pura-symphony/cutout.png", top=46, bottom=733,
                     label=(96, 292, 348, 650), band=(393, 415), light=True),
    "obsidian": dict(src="pura-obsidian/cutout.png", top=48, bottom=733,
                     label=(102, 295, 347, 646), band=(395, 422), light=False),
    "elin": dict(src="pura-elin-lush/cutout.png", top=59, bottom=718,
                 label=(108, 295, 344, 639), band=(396, 424), light=False),
}


def clean_bottle(t: dict) -> tuple[np.ndarray, dict]:
    """Rebuild a clean, symmetric silhouette and keep the photo's own alpha inside it."""
    rgba = load(ORIG / t["src"])
    a = rgba[..., 3]
    h, w = a.shape
    solid = a > 0.5
    # centre axis from the body rows
    cs = []
    for y in range(t["label"][1], t["label"][3]):
        xs = np.where(solid[y])[0]
        if len(xs) > 50:
            cs.append((xs.min() + xs.max()) / 2)
    cx = float(np.median(cs))
    half = np.zeros(h, np.float32)
    present = a > 0.16
    for y in range(t["top"], t["bottom"] + 1):
        row = present[y]
        lo = int(max(0, cx - 205))
        hi = int(min(w - 1, cx + 205))
        xs = np.where(row[lo:hi + 1])[0] + lo
        if len(xs) == 0:
            continue
        # contiguous run that holds the centre (or nearest to it)
        runs = np.split(xs, np.where(np.diff(xs) > 2)[0] + 1)
        best = min(runs, key=lambda r: 0 if r[0] <= cx <= r[-1] else min(abs(r[0] - cx), abs(r[-1] - cx)))
        left = cx - best[0]
        right = best[-1] - cx
        half[y] = max(0.0, min(left, right) - 1.0)
    half = ndi.median_filter(half, size=5)
    xx = np.arange(w)[None, :]
    sil = np.clip(half[:, None] - np.abs(xx - cx) + 0.5, 0, 1)
    sil[: t["top"]] = 0
    sil[t["bottom"] + 1:] = 0
    # soften the very top and bottom rows a touch
    alpha = np.minimum(a, sil)
    # inside the solid body, trust the silhouette fully (photo alpha can be patchy)
    core = ndi.binary_erosion(sil > 0.99, iterations=3)
    body_rows = np.zeros_like(core)
    body_rows[t["top"] + 4: t["bottom"] - 30] = True
    alpha = np.where(core & body_rows, np.maximum(alpha, 0.985), alpha)
    rgba = rgba.copy()
    rgba[..., 3] = alpha
    info = dict(cx=cx, half=half)
    return rgba, info


def lab(rgb):
    return skcolor.rgb2lab(np.clip(rgb, 0, 1))


def rgb_from_lab(L):
    return np.clip(skcolor.lab2rgb(L), 0, 1)


def hex_lab(hexstr: str) -> np.ndarray:
    hexstr = hexstr.lstrip("#")
    rgb = np.array([int(hexstr[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255.0
    return skcolor.rgb2lab(rgb[None, None, :])[0, 0]


def gold_weight(Lab: np.ndarray) -> np.ndarray:
    L, A, B = Lab[..., 0], Lab[..., 1], Lab[..., 2]
    chroma = np.hypot(A, B)
    hue = np.degrees(np.arctan2(B, A))
    return smoothstep(chroma, 17, 27) * smoothstep(L, 28, 40) * smoothstep(hue, 40, 55) * (1 - smoothstep(hue, 105, 120))


def recolor_label(rgb, rect, target_hex, light: bool):
    x0, y0, x1, y1 = rect
    sub = rgb[y0:y1, x0:x1]
    Lab = lab(sub)
    g = gold_weight(Lab)
    t = hex_lab(target_hex)
    L = Lab[..., 0]
    if light:
        ink = 1 - smoothstep(L, 30, 48)          # black leaves stay black
        w = (1 - g) * (1 - ink)
        ref = np.median(Lab[w > 0.8], axis=0)
        new = Lab.copy()
        new[..., 0] = L + (t[0] - ref[0])
        new[..., 1] = t[1] + (Lab[..., 1] - ref[1]) * 0.5
        new[..., 2] = t[2] + (Lab[..., 2] - ref[2]) * 0.5
    else:
        w = 1 - g
        ref = np.median(Lab[w > 0.85], axis=0)
        new = Lab.copy()
        new[..., 0] = t[0] + (L - ref[0]) * 1.05
        new[..., 1] = t[1] + (Lab[..., 1] - ref[1]) * 0.35
        new[..., 2] = t[2] + (Lab[..., 2] - ref[2]) * 0.35
    out = rgb_from_lab(new)
    w = w[..., None]
    rgb[y0:y1, x0:x1] = sub * (1 - w) + out * w
    return rgb


def name_bbox(rgb, rect, band, light: bool):
    x0, y0, x1, y1 = rect
    by0, by1 = band
    xa = x0 + int((x1 - x0) * 0.27)   # skip the leaf of the p
    xb = x1 - 6
    sub = rgb[by0:by1, xa:xb]
    Lab = lab(sub)
    if light:
        bg = np.median(Lab[..., 0])
        m = Lab[..., 0] < bg - 12
    else:
        m = gold_weight(Lab) > 0.35
    m = ndi.binary_opening(m, iterations=1) | m
    ys, xs = np.where(m)
    # drop isolated specks
    lab_, n = ndi.label(ndi.binary_dilation(m, iterations=2))
    sizes = ndi.sum(m, lab_, range(1, n + 1))
    keep = np.isin(lab_, np.where(sizes > 6)[0] + 1) & m
    ys, xs = np.where(keep)
    return (xa + xs.min(), by0 + ys.min(), xa + xs.max() + 1, by0 + ys.max() + 1), keep, (xa, by0)


def text_colors(rgb, box, light):
    x0, y0, x1, y1 = box
    sub = rgb[y0:y1, x0:x1]
    Lab = lab(sub)
    if light:
        m = Lab[..., 0] < np.median(Lab[..., 0]) - 12
    else:
        m = gold_weight(Lab) > 0.5
    pix = sub[m]
    if len(pix) < 10:
        return np.array([0.85, 0.7, 0.45]), np.array([0.7, 0.55, 0.32])
    lum = pix.mean(-1)
    hi = pix[lum >= np.median(lum)].mean(0)
    lo = pix[lum < np.median(lum)].mean(0)
    return hi, lo


def erase(rgb, box, pad=7):
    x0, y0, x1, y1 = box
    X0, Y0, X1, Y1 = x0 - pad - 6, y0 - pad - 6, x1 + pad + 6, y1 + pad + 6
    region = rgb[Y0:Y1, X0:X1].copy()
    mask = np.zeros(region.shape[:2], bool)
    mask[6:-6, 6:-6] = True
    filled = inpaint_biharmonic(region, mask, channel_axis=-1)
    # add back a little grain so the patch does not read as flat
    rng = np.random.default_rng(7)
    grain = rng.normal(0, 0.006, filled.shape).astype(np.float32)
    filled = np.clip(filled + grain * mask[..., None], 0, 1)
    rgb[Y0:Y1, X0:X1] = filled
    return rgb


def fit_font(text, cap_h_px, width_px):
    size = 10
    font = ImageFont.truetype(LABEL_FONT, size)
    while True:
        font = ImageFont.truetype(LABEL_FONT, size)
        bb = font.getbbox("H")
        if bb[3] - bb[1] >= cap_h_px:
            break
        size += 1
    # tracking so the original word length is matched
    n = len(text)
    raw = sum(font.getlength(ch) for ch in text)
    track = (width_px - raw) / max(1, n - 1)
    return font, track


def draw_name(rgb, text, center_x, top_y, font, track, c_hi, c_lo, ss=4):
    """Letter the name with a soft foil gradient, rendered supersampled."""
    widths = [font.getlength(ch) for ch in text]
    total = sum(widths) + track * (len(text) - 1)
    bb = font.getbbox("H")
    cap_top, cap_bottom = bb[1], bb[3]
    W = int(total + 8)
    H = int(cap_bottom - cap_top + 8)
    big = Image.new("L", (W * ss, H * ss), 0)
    d = ImageDraw.Draw(big)
    bigfont = ImageFont.truetype(LABEL_FONT, font.size * ss)
    x = 4 * ss
    for ch, cw in zip(text, widths):
        d.text((x, 4 * ss - cap_top * ss), ch, font=bigfont, fill=255)
        x += (cw + track) * ss
    mask = np.asarray(big.resize((W, H), Image.LANCZOS)).astype(np.float32) / 255.0
    ox = int(round(center_x - W / 2))
    oy = int(round(top_y - 4))
    grad = np.linspace(0, 1, H)[:, None, None]
    col = c_hi[None, None, :] * (1 - grad) + c_lo[None, None, :] * grad
    region = rgb[oy:oy + H, ox:ox + W]
    m = mask[..., None]
    rgb[oy:oy + H, ox:ox + W] = region * (1 - m) + col * m
    return rgb


def recolor_liquid(rgb, alpha, body_top, label_rect, target_hex, l_shift=0.0, strength=1.0):
    h, w = alpha.shape
    region = np.zeros((h, w), np.float32)
    region[body_top:] = 1.0
    x0, y0, x1, y1 = label_rect
    region[y0 + 3:y1 - 3, x0 + 3:x1 - 3] = 0.0
    region *= (alpha > 0.05)
    region = ndi.gaussian_filter(region, 2.0)
    Lab = lab(rgb)
    L, A, B = Lab[..., 0], Lab[..., 1], Lab[..., 2]
    chroma = np.hypot(A, B)
    liquid = (region > 0.5) & (chroma > 20)
    ref = np.median(Lab[liquid], axis=0)
    ref_c = float(np.hypot(ref[1], ref[2]))
    t = hex_lab(target_hex)
    tc = float(np.hypot(t[1], t[2]))
    dir_ = np.array([t[1], t[2]]) / max(tc, 1e-3)
    ratio = np.clip(chroma / max(ref_c, 1e-3), 0, 1.6)
    new = Lab.copy()
    new[..., 1] = dir_[0] * tc * ratio
    new[..., 2] = dir_[1] * tc * ratio
    hl = smoothstep(L, 82, 96)
    new[..., 0] = np.clip(L + ((t[0] - ref[0]) * 0.75 + l_shift) * (1 - hl), 0, 100)
    out = rgb_from_lab(new)
    wgt = (region * smoothstep(chroma, 4, 14) * strength)[..., None]
    return rgb * (1 - wgt) + out * wgt


def body_top_of(half: np.ndarray, label_y0: int) -> int:
    body = np.median(half[label_y0:label_y0 + 200])
    for y in range(label_y0, 0, -1):
        if half[y] < body * 0.82:
            return y + 1
    return label_y0 - 40


def iris_label(rgb2, rect2):
    """Pura Iris: the black label with the iris art from the client's own Iris bottle."""
    x0, y0, x1, y1 = rect2
    lw, lh = x1 - x0, y1 - y0
    # clear the marble from the lower part of the label, keep the border
    clear_top = y0 + int(lh * 0.42)
    inner = (x0 + 14, clear_top, x1 - 14, y1 - 14)
    patch = rgb2[y0 + 16:y0 + 70, x0 + 16:x0 + 70].copy()
    ix0, iy0, ix1, iy1 = inner
    tile = np.concatenate([patch, patch[:, ::-1]], axis=1)
    tile = np.concatenate([tile, tile[::-1]], axis=0)
    reps_y = (iy1 - iy0) // tile.shape[0] + 2
    reps_x = (ix1 - ix0) // tile.shape[1] + 2
    big = np.tile(tile, (reps_y, reps_x, 1))[: iy1 - iy0, : ix1 - ix0]
    big = np.stack([ndi.gaussian_filter(big[..., c], 1.0) for c in range(3)], -1)
    fade = smoothstep(np.arange(iy1 - iy0, dtype=np.float32), 0, 40)[:, None, None]
    rgb2[iy0:iy1, ix0:ix1] = rgb2[iy0:iy1, ix0:ix1] * (1 - fade) + big * fade
    # the iris art
    src = load(ORIG / "pura-iris" / "cutout.png")[..., :3]
    art = src[548:652, 88:220]
    lum = art.mean(-1)
    art_a = smoothstep(lum, 0.10, 0.26)
    sat = art.max(-1) - art.min(-1)
    art_a = np.maximum(art_a, smoothstep(sat, 0.10, 0.24))
    ah0, aw0 = art_a.shape
    ey = smoothstep(np.minimum(np.arange(ah0), np.arange(ah0)[::-1]).astype(np.float32), 0, 14)[:, None]
    ex = smoothstep(np.minimum(np.arange(aw0), np.arange(aw0)[::-1]).astype(np.float32), 0, 8)[None, :]
    art_a = art_a * ey * ex
    target_w = int(lw * 0.78)
    scale = target_w / art.shape[1]
    art_rgba = np.concatenate([art, art_a[..., None]], -1)
    art_big = premul_resize(art_rgba, scale)
    art_big[..., :3] = unsharp(art_big[..., :3], 1.6, 0.6)
    ah, aw = art_big.shape[:2]
    ox = x0 + (lw - aw) // 2
    oy = y1 - 18 - ah
    region = rgb2[oy:oy + ah, ox:ox + aw]
    m = art_big[..., 3:4]
    rgb2[oy:oy + ah, ox:ox + aw] = region * (1 - m) + art_big[..., :3] * m
    return rgb2


# Every fragrance the site sells. All share one mould (the Symphony bottle, the
# cleanest photograph of it); `t` names whose printed label goes on it.
VARIANTS = {
    "pura-symphony": dict(t="symphony"),
    "pura-obsidian": dict(t="obsidian"),
    "pura-elin-lush": dict(t="elin"),
    "pura-iris": dict(t="obsidian", name="IRIS", iris=True, label="#0d0b0c"),
    "pura-rosa": dict(t="symphony", name="ROSA", label="#ecc9c2", liquid="#e9a59a", l_shift=4),
    "pura-bloom": dict(t="symphony", name="BLOOM", label="#f0d8c2", liquid="#f1c296", l_shift=6),
    "pura-santal": dict(t="symphony", name="SANTAL", label="#d8c1a0", liquid="#dcc08a", l_shift=2),
    "pura-lumiere": dict(t="elin", name="LUMIERE", label="#3a2317", liquid="#d99a3a", l_shift=-4),
    "pura-azure": dict(t="obsidian", name="AZURE", label="#14243b", liquid="#7fb8d6", l_shift=6, strength=0.95),
    "pura-ember": dict(t="obsidian", name="EMBER", label="#4a1616", liquid="#a6521f", l_shift=-14),
    "pura-monarch": dict(t="obsidian", name="MONARCH", label="#262d35", liquid="#c9c47e", l_shift=4),
    "pura-oud-royale": dict(t="elin", name="OUD ROYALE", label="#0f2c24", liquid="#7d3912", l_shift=-24),
}


def build_bottle(slug: str, v: dict) -> Image.Image:
    mould = TEMPLATES["symphony"]
    lt = TEMPLATES[v["t"]]
    rgba, info = clean_bottle(mould)
    body_top = body_top_of(info["half"], mould["label"][1])
    # work at 2x so the new lettering is crisp
    S = 2
    big = premul_resize(rgba, S)
    rgb = big[..., :3].copy()
    alpha = big[..., 3]
    rgb = unsharp(rgb, 1.0, 0.45)
    rect2 = tuple(int(c * S) for c in mould["label"])
    band2 = tuple(int(c * S) for c in mould["band"])
    orig_text = {"symphony": "SYMPHONY", "obsidian": "OBSIDIAN", "elin": "ELIN LUSH"}[v["t"]]
    if v["t"] != "symphony":
        # same mould: lay that bottle's printed label over this one's
        src = load(ORIG / lt["src"])[..., :3]
        sx0, sy0, sx1, sy1 = lt["label"]
        crop = np.concatenate([src[sy0:sy1, sx0:sx1], np.ones((sy1 - sy0, sx1 - sx0, 1), np.float32)], -1)
        tw, th = rect2[2] - rect2[0], rect2[3] - rect2[1]
        lab_big = premul_resize(crop, tw / (sx1 - sx0))
        lab_big = np.asarray(Image.fromarray((lab_big[..., :3] * 255).astype(np.uint8)).resize((tw, th), Image.LANCZOS)).astype(np.float32) / 255.0
        lab_big = unsharp(lab_big, 1.0, 0.45)
        fy = smoothstep(np.minimum(np.arange(th), np.arange(th)[::-1]).astype(np.float32), 0, 2.5)[:, None]
        fx = smoothstep(np.minimum(np.arange(tw), np.arange(tw)[::-1]).astype(np.float32), 0, 2.5)[None, :]
        f = (fy * fx)[..., None]
        rgb[rect2[1]:rect2[3], rect2[0]:rect2[2]] = rgb[rect2[1]:rect2[3], rect2[0]:rect2[2]] * (1 - f) + lab_big * f
        k = th / (sy1 - sy0)
        band2 = (int(rect2[1] + (lt["band"][0] - sy0) * k), int(rect2[1] + (lt["band"][1] - sy0) * k))
    light = lt["light"]
    if "name" in v:
        box, _, _ = name_bbox(rgb, rect2, band2, light)
        hi, lo = text_colors(rgb, box, light)
        if "label" in v:
            rgb = recolor_label(rgb, rect2, v["label"], light)
        if v.get("iris"):
            rgb = iris_label(rgb, rect2)
        rgb = erase(rgb, box)
        cap_h = box[3] - box[1]
        font, track = fit_font(orig_text, cap_h, box[2] - box[0])
        # keep a long name clear of the leaf and the label's edge
        lw = rect2[2] - rect2[0]
        left_lim = rect2[0] + int(lw * 0.30)
        right_lim = rect2[2] - 26
        def width(f, tr):
            return sum(f.getlength(ch) for ch in v["name"]) + tr * (len(v["name"]) - 1)
        while width(font, track) > right_lim - left_lim and track > font.size * 0.14:
            track -= 0.5
        while width(font, track) > right_lim - left_lim and font.size > 10:
            font = ImageFont.truetype(LABEL_FONT, font.size - 1)
        cx = (box[0] + box[2]) / 2
        half_w = width(font, track) / 2
        cx = min(max(cx, left_lim + half_w), right_lim - half_w)
        if light:
            hi, lo = hi * 0.82, lo * 0.82
        rgb = draw_name(rgb, v["name"], cx, box[1], font, track, hi, lo)
    if "liquid" in v:
        rgb = recolor_liquid(rgb, alpha, body_top * S, rect2, v["liquid"], v.get("l_shift", 0.0), v.get("strength", 1.0))
    out = np.concatenate([rgb, alpha[..., None]], -1)
    # trim to the bottle
    ys, xs = np.where(alpha > 0.02)
    out = out[ys.min(): ys.max() + 1, xs.min(): xs.max() + 1]
    return to_img(out)


def packshot(bottle: Image.Image, canvas_w=900, canvas_h=1760) -> Image.Image:
    """Bottle standing on a glossy floor: contact shadow, soft shadow and reflection, on transparency."""
    bw, bh = bottle.size
    scale = min((canvas_w - 120) / bw, 1340 / bh)
    if abs(scale - 1) > 1e-3:
        bottle = bottle.resize((round(bw * scale), round(bh * scale)), Image.LANCZOS)
        bw, bh = bottle.size
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    base_y = 40 + bh
    x = (canvas_w - bw) // 2
    # soft and contact shadows
    sh = Image.new("L", (canvas_w, canvas_h), 0)
    d = ImageDraw.Draw(sh)
    d.ellipse([x - bw * 0.08, base_y - 34, x + bw * 1.08, base_y + 70], fill=70)
    sh = sh.filter(ImageFilter.GaussianBlur(38))
    sh2 = Image.new("L", (canvas_w, canvas_h), 0)
    d2 = ImageDraw.Draw(sh2)
    d2.ellipse([x + bw * 0.03, base_y - 12, x + bw * 0.97, base_y + 16], fill=150)
    sh2 = sh2.filter(ImageFilter.GaussianBlur(9))
    shadow = np.maximum(np.asarray(sh, np.float32), np.asarray(sh2, np.float32)) / 255.0
    sh_rgba = np.zeros((canvas_h, canvas_w, 4), np.float32)
    sh_rgba[..., :3] = np.array([0.09, 0.06, 0.04])
    sh_rgba[..., 3] = shadow
    canvas = Image.alpha_composite(canvas, to_img(sh_rgba))
    # reflection: the lower part of the bottle, mirrored, fading out
    refl_h = int(bh * 0.30)
    refl = bottle.transpose(Image.FLIP_TOP_BOTTOM).crop((0, 0, bw, refl_h))
    r = np.asarray(refl).astype(np.float32) / 255.0
    fade = (np.linspace(0.30, 0.0, refl_h) ** 1.4)[:, None]
    r[..., 3] *= fade
    refl = to_img(r).filter(ImageFilter.GaussianBlur(1.6))
    canvas.alpha_composite(refl, (x, base_y + 3))
    canvas.alpha_composite(bottle, (x, 40))
    return canvas


def step_bottles():
    print("bottles")
    for slug, v in VARIANTS.items():
        b = build_bottle(slug, v)
        b.save(ROOT / "art" / "build" / f"{slug}.png") if (ROOT / "art" / "build").exists() else None
        pack = packshot(b)
        save_webp(pack, OUT / "pack" / f"{slug}.webp", [900, 480], quality=84)
        thumb = b.resize((200, round(b.height * 200 / b.width)), Image.LANCZOS)
        save_webp(thumb, OUT / "thumb" / f"{slug}.webp", [200], quality=84)


# ---------------------------------------------------------------- scenes

SCENES = {
    # name: (source, crop box x0, y0, x1, y1) inside the 1024x1536 campaign frames,
    # between the printed logo at the top and the icon row at the foot.
    "symphony-arch": ("pura-symphony/scene.png", (430, 500, 990, 1270)),
    "obsidian-arch": ("pura-obsidian/scene.png", (420, 500, 980, 1270)),
    "symphony-wide": ("pura-symphony/scene.png", (0, 500, 1024, 1268)),
    "obsidian-wide": ("pura-obsidian/scene.png", (0, 500, 1024, 1268)),
    "elin-lush-wide": ("pura-elin-lush/scene.png", (0, 500, 1024, 1268)),
    "iris-wide": ("pura-iris/scene.png", (0, 500, 1024, 1268)),
    "symphony-display": ("pura-symphony/display-square.png", None),
    "obsidian-alt": ("pura-obsidian/ad.png", (0, 500, 1024, 1268)),
    "elin-lush-alt": ("pura-elin-lush/nature.png", (0, 500, 1024, 1268)),
    "iris-alt": ("pura-iris/ad-alt.png", (0, 500, 1024, 1268)),
    "symphony-8ml": ("pura-symphony/bottle-8ml.png", (0, 380, 1024, 1268)),
}


def step_scenes():
    print("scenes")
    for name, (src, box) in SCENES.items():
        im = Image.open(ORIG / src).convert("RGB")
        if box:
            im = im.crop(box)
        widths = [im.width] if im.width <= 1024 else [1024]
        if im.width > 640:
            widths.append(640)
        save_webp(im, OUT / "scenes" / f"{name}.webp", widths, quality=80)
    for n in ("top", "heart", "base"):
        im = Image.open(ORIG / "pura-symphony" / f"notes-{n}.png").convert("RGB")
        save_webp(im, OUT / "notes" / f"{n}.webp", [896, 520], quality=80)


# ---------------------------------------------------------------- brand

def step_brand():
    """The client's own 'pura' mark, lifted from the large Obsidian campaign print."""
    print("brand")
    BRAND.mkdir(parents=True, exist_ok=True)
    im = load(ORIG / "pura-obsidian" / "scene.png")[..., :3]
    x0, y0 = 240, 60
    crop = im[y0:y0 + 300, x0:x0 + 580]
    L = crop.mean(-1)
    bg = ndi.median_filter(L, size=31)
    alpha = smoothstep(L - bg, 0.10, 0.30)
    hh, ww = alpha.shape
    yy, xx = np.mgrid[0:hh, 0:ww]
    keep = (yy < 190) | ((xx < 140) & (yy < 250)) | (xx < 75)
    alpha = alpha * keep
    lab_, n = ndi.label(alpha > 0.2)
    sizes = ndi.sum(alpha > 0.2, lab_, range(1, n + 1))
    big = np.isin(lab_, np.where(sizes > 40)[0] + 1)
    big = ndi.binary_dilation(big, iterations=2)
    alpha = alpha * big
    ys, xs = np.where(alpha > 0.03)
    pad = 6
    sl = (slice(ys.min() - pad, ys.max() + pad), slice(xs.min() - pad, xs.max() + pad))
    a = alpha[sl]
    rgb = np.clip(crop[sl] * 1.04, 0, 1)
    foil = np.concatenate([rgb, a[..., None]], -1)
    to_img(foil).save(BRAND / "pura-foil.png", optimize=True)
    mask = np.concatenate([np.zeros_like(rgb), a[..., None]], -1)
    to_img(mask).save(BRAND / "pura-mask.png", optimize=True)
    print("  wordmark", a.shape[1], "x", a.shape[0])


# ---------------------------------------------------------------- grounds

def satin(w, h, base, sheen, shadow, seed, folds=7, angle=-0.55):
    """A draped silk ground: folded height field, broad satin sheen, film grain."""
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    u = (xx * np.cos(angle) - yy * np.sin(angle)) / w
    v = (xx * np.sin(angle) + yy * np.cos(angle)) / h
    warp = np.zeros_like(u)
    for i in range(4):
        f = 1.2 + i * 1.1
        warp += rng.uniform(0.04, 0.09) / (i + 1) * np.sin(2 * np.pi * (f * v + rng.uniform(0, 1)) + 1.7 * np.sin(2 * np.pi * u * (0.6 + i * 0.3)))
    hfield = np.zeros_like(u)
    for i in range(folds):
        f = rng.uniform(1.4, 4.2)
        ph = rng.uniform(0, 2 * np.pi)
        amp = rng.uniform(0.5, 1.0) / (1 + i * 0.35)
        hfield += amp * np.sin(2 * np.pi * f * (u + warp * (1 + i * 0.2)) + ph + 0.8 * np.sin(2 * np.pi * v * rng.uniform(0.3, 1.1)))
    hfield = ndi.gaussian_filter(hfield, 3)
    gy, gx = np.gradient(hfield)
    k = 38.0
    n = np.stack([-gx * k, -gy * k, np.ones_like(gx)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    l = np.array([-0.45, -0.55, 0.70]); l /= np.linalg.norm(l)
    vdir = np.array([0, 0, 1.0])
    hv = (l + vdir); hv /= np.linalg.norm(hv)
    diff = np.clip((n * l).sum(-1), 0, 1)
    spec = np.clip((n * hv).sum(-1), 0, 1) ** 26
    broad = np.clip((n * hv).sum(-1), 0, 1) ** 6
    base = np.array(base, np.float32)
    sheen = np.array(sheen, np.float32)
    shadow = np.array(shadow, np.float32)
    col = shadow[None, None] * (1 - diff[..., None]) + base[None, None] * diff[..., None]
    col = col + sheen[None, None] * (0.55 * broad[..., None] + 0.9 * spec[..., None])
    # vignette and grain
    vig = 1 - 0.35 * (((xx / w - 0.55) ** 2) * 1.4 + ((yy / h - 0.5) ** 2) * 1.8)
    col *= vig[..., None]
    col += rng.normal(0, 0.012, col.shape)
    return Image.fromarray(np.clip(col * 255, 0, 255).astype(np.uint8), "RGB").filter(ImageFilter.GaussianBlur(0.6))


def step_grounds():
    print("grounds")
    her = satin(1800, 1000, base=(0.30, 0.20, 0.14), sheen=(0.55, 0.40, 0.26), shadow=(0.06, 0.035, 0.025), seed=11)
    save_webp(her, OUT / "grounds" / "satin-her.webp", [1800, 960], quality=78)
    him = satin(1800, 1000, base=(0.13, 0.13, 0.14), sheen=(0.34, 0.31, 0.27), shadow=(0.02, 0.02, 0.025), seed=29, angle=0.45)
    save_webp(him, OUT / "grounds" / "satin-him.webp", [1800, 960], quality=78)
    cream = satin(1800, 1000, base=(0.93, 0.87, 0.79), sheen=(0.10, 0.08, 0.05), shadow=(0.74, 0.65, 0.55), seed=5, angle=-0.3)
    save_webp(cream, OUT / "grounds" / "satin-cream.webp", [1800, 960], quality=78)


def step_meta():
    """Share image and app icons, from the real mark and bottles."""
    print("meta")
    ground = Image.open(OUT / "grounds" / "satin-cream-1800.webp").convert("RGBA").resize((1200, 667)).crop((0, 18, 1200, 648))
    foil = Image.open(BRAND / "pura-foil.png").convert("RGBA")
    foil = foil.resize((420, round(foil.height * 420 / foil.width)), Image.LANCZOS)
    mask = foil.split()[3]
    ink = Image.new("RGBA", foil.size, (34, 24, 15, 255))
    ground.paste(ink, (90, 200), mask)
    for slug, x in (("pura-symphony", 650), ("pura-obsidian", 880)):
        im = Image.open(OUT / "pack" / f"{slug}-480.webp").convert("RGBA")
        im = im.resize((300, round(im.height * 300 / im.width)), Image.LANCZOS)
        ground.alpha_composite(im, (x - 60, 40))
    ground.convert("RGB").save(ROOT / "public" / "og.jpg", quality=86)
    # icon: the p and its leaf on espresso
    full = Image.open(BRAND / "pura-mask.png").split()[3]
    p_only = full.crop((0, 0, int(full.width * 0.27), full.height))
    bb = p_only.getbbox()
    p_only = p_only.crop(bb)
    for name, size in (("icon.png", 512), ("apple-icon.png", 180)):
        icon = Image.new("RGBA", (size, size), (28, 20, 14, 255))
        h = int(size * 0.74)
        g = p_only.resize((round(p_only.width * h / p_only.height), h), Image.LANCZOS)
        gold = Image.new("RGBA", g.size, (214, 178, 120, 255))
        icon.paste(gold, ((size - g.width) // 2, (size - h) // 2), g)
        icon.save(ROOT / "app" / name)


STEPS = {"bottles": step_bottles, "scenes": step_scenes, "brand": step_brand, "grounds": step_grounds, "meta": step_meta}

if __name__ == "__main__":
    wanted = sys.argv[1:] or list(STEPS)
    for s in wanted:
        STEPS[s]()
