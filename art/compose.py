"""
Composed stills for the home page, from the bottles build_images.py made:
  - the hero line-up: the range standing in one row on the page's ground (transparent, 2400 wide)
  - her and him: three bottles each on their satin (1200x900)

    python -I art/compose.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
B = ROOT / "public" / "images" / "bottle"
OUT = ROOT / "public" / "images"


def bottle(slug: str, h: int) -> Image.Image:
    im = Image.open(B / f"{slug}-640.webp").convert("RGBA")
    return im.resize((round(im.width * h / im.height), h), Image.LANCZOS)


def shadow_layer(size, boxes, blur, strength):
    sh = Image.new("L", size, 0)
    d = ImageDraw.Draw(sh)
    for b in boxes:
        d.ellipse(b, fill=strength)
    return sh.filter(ImageFilter.GaussianBlur(blur))


def place(canvas: Image.Image, items, floor_y: int, refl=0.22, shadow_rgb=(40, 26, 14)):
    """items: (image, centre x). Draw shadows, reflections, then bottles back to front."""
    W, H = canvas.size
    boxes_soft, boxes_contact = [], []
    for im, cx in items:
        w = im.width
        boxes_soft.append([cx - w * 0.62, floor_y - 26, cx + w * 0.62, floor_y + 46])
        boxes_contact.append([cx - w * 0.47, floor_y - 9, cx + w * 0.47, floor_y + 11])
    soft = shadow_layer((W, H), boxes_soft, 30, 80)
    contact = shadow_layer((W, H), boxes_contact, 7, 150)
    a = np.maximum(np.asarray(soft), np.asarray(contact)).astype(np.uint8)
    layer = Image.new("RGBA", (W, H), shadow_rgb + (0,))
    layer.putalpha(Image.fromarray(a))
    canvas.alpha_composite(layer)
    for im, cx in items:
        if refl:
            rh = int(im.height * 0.26)
            r = im.transpose(Image.FLIP_TOP_BOTTOM).crop((0, 0, im.width, rh))
            arr = np.asarray(r).astype(np.float32)
            arr[..., 3] *= (np.linspace(refl, 0, rh) ** 1.3)[:, None]
            r = Image.fromarray(arr.astype(np.uint8), "RGBA").filter(ImageFilter.GaussianBlur(1.5))
            canvas.alpha_composite(r, (int(cx - im.width / 2), floor_y + 2))
    for im, cx in items:
        canvas.alpha_composite(im, (int(cx - im.width / 2), floor_y - im.height))
    return canvas


def lineup():
    # her on the left, him on the right, the bestseller in the middle and tallest
    order = ["pura-bloom", "pura-rosa", "pura-iris", "pura-symphony", "pura-obsidian", "pura-azure", "pura-ember"]
    heights = [560, 620, 690, 820, 690, 620, 560]
    W, H, floor = 2400, 1000, 860
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gap = 300
    xs = [W / 2 + (i - 3) * gap for i in range(len(order))]
    items = [(bottle(s, h), x) for s, h, x in zip(order, heights, xs)]
    # draw the outer bottles first so the middle ones stand in front
    by_depth = sorted(items, key=lambda it: -abs(it[1] - W / 2))
    canvas = place(canvas, by_depth, floor)
    bb = canvas.getbbox()
    canvas = canvas.crop((bb[0] - 20, bb[1] - 20, bb[2] + 20, bb[3] + 4))
    canvas.save(OUT / "hero" / "lineup-2400.webp", "WEBP", quality=86, method=6)
    canvas.resize((1200, round(canvas.height * 1200 / canvas.width)), Image.LANCZOS).save(OUT / "hero" / "lineup-1200.webp", "WEBP", quality=86, method=6)
    print("lineup", canvas.size)


def satin_trio(ground: str, slugs, name: str):
    g = Image.open(OUT / "grounds" / f"{ground}-1800.webp").convert("RGBA")
    g = g.crop((300, 60, 1500, 810))
    W, H = g.size
    floor = 690
    items = [(bottle(slugs[0], 500), W / 2 - 250), (bottle(slugs[2], 500), W / 2 + 250), (bottle(slugs[1], 630), W / 2)]
    g = place(g, items, floor, refl=0.16, shadow_rgb=(0, 0, 0))
    g.convert("RGB").save(OUT / "scenes" / f"{name}-1200.webp", "WEBP", quality=84, method=6)
    g.convert("RGB").resize((720, 450), Image.LANCZOS).save(OUT / "scenes" / f"{name}-720.webp", "WEBP", quality=84, method=6)
    print(name, g.size)


if __name__ == "__main__":
    lineup()
    satin_trio("satin-her", ["pura-rosa", "pura-symphony", "pura-iris"], "her-trio")
    satin_trio("satin-him", ["pura-azure", "pura-obsidian", "pura-ember"], "him-trio")


def duo():
    """The His & Hers Duo on cream satin, square, for the sizes section."""
    g = Image.open(OUT / "grounds" / "satin-cream-1800.webp").convert("RGBA").crop((500, 0, 1500, 1000))
    W, H = g.size
    items = [(bottle("pura-obsidian", 600), W / 2 + 150), (bottle("pura-symphony", 700), W / 2 - 130)]
    g = place(g, items, 900, refl=0.18, shadow_rgb=(60, 40, 20))
    g.convert("RGB").save(OUT / "scenes" / "duo-1000.webp", "WEBP", quality=84, method=6)
    g.convert("RGB").resize((640, 640), Image.LANCZOS).save(OUT / "scenes" / "duo-640.webp", "WEBP", quality=84, method=6)
    print("duo", g.size)


if __name__ == "__main__":
    duo()


def lineup_phone():
    """Three bottles for a phone's hero, so the product stays big at 342px."""
    W, H, floor = 1200, 1000, 900
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    items = [(bottle("pura-iris", 640), W / 2 - 330), (bottle("pura-obsidian", 640), W / 2 + 330), (bottle("pura-symphony", 800), W / 2)]
    canvas = place(canvas, items, floor)
    bb = canvas.getbbox()
    canvas = canvas.crop((bb[0] - 10, bb[1] - 10, bb[2] + 10, bb[3] + 4))
    canvas.save(OUT / "hero" / "lineup-phone.webp", "WEBP", quality=86, method=6)
    print("lineup-phone", canvas.size)


if __name__ == "__main__":
    lineup_phone()
