# BEAUX DE PARIS — Campaign asset brief

The site is **already wired** to use these files the moment you drop them in:
every scene (hero, mist, collection worlds, signature, house, cart & search
thumbs) automatically switches from the placeholder artwork to your real
bottle. Nothing else needs changing on your side except placing the files.

## 1. The single most important file (start here)

A clean **product cutout** of the real BEAUX DE PARIS flacon:

```
src/assets/products/laube/cutout.webp
```

Accepted names: `cutout.webp|png|jpg`, `bottle-cutout.*`, `product-cutout.*`, `product.*`

**Specs**
- Transparent background (no shadow baked in — the site adds its own)
- Full front or slightly ¾-front angle, upright, label facing the camera
- Longest side ≈ 2000–2500 px, PNG or high-quality WebP
- The bottle should fill ~85–90 % of the canvas height, centered
- Label text as printed on the real bottle: `BEAUX DE PARIS — Nº1 · EAU DE PARFUM`

The same file powers the hero, the mist scene, the signature pedestal, the
house still, the bag and the search. One good cutout upgrades the whole site.

## 2. Cutouts for the other two fragrances (collection & finder)

```
src/assets/products/le-velours/cutout.webp      (amber liquid, same bottle)
src/assets/products/jardin-de-lune/cutout.webp  (pale moon-gold liquid, same bottle)
```
Same geometry, same label layout, different liquid colour — like a real trio.

## 3. Optional campaign scenes (raise the “photography” level)

One photographic scene per fragrance, for the magazine worlds + finale. If
you generate these, use the **same flacon and lighting language** in all three.

```
src/assets/products/laube/scene.webp          ivory daylight, stone, botanicals
src/assets/products/le-velours/scene.webp     deep espresso night, dark materials
src/assets/products/jardin-de-lune/scene.webp  moonlit pale-green garden
```

## 4. Ingredient / botanical macros (notes act, optional)

Macro photographs (or clean generated ones) of the actual ingredients —
bergamot, neroli/white blossom, blond wood, iris, amber, etc.

```
src/assets/products/laube/notes-top.webp   bergamot + citrus + leaves
src/assets/products/laube/notes-heart.webp white flowers
src/assets/products/laube/notes-base.webp  blond wood + amber
```

## Free tools that can create all of this

| Need | Free tool | Notes |
| --- | --- | --- |
| Photoreal product/scene images | **Ideogram.ai** | Best text rendering + best “keep the same bottle” consistency; free daily credits |
| Photoreal images | **Bing Image Creator / Microsoft Designer** | Free with a Microsoft account (DALL·E) |
| Photoreal images | **Adobe Firefly** | Free monthly credits, clean commercial terms |
| Photoreal images | **Leonardo.ai** | Daily free credits, good style control |
| Image variety / logos | **Recraft.ai** | Generous free tier |
| Transparent cutout from any photo | **remove.bg** or **Photoroom** | Free for low-res; keep cutout simple, no need for extreme res |
| Upscale a good cutout | **Pixelcut / Photoroom upscale** | Optional |

## Prompt pack (copy-paste)

**Master bottle (use as the opening of every prompt):**

> Luxury perfume flacon, tall slender clear glass body with softly bevelled
> shoulders, heavy polished clear-glass rectangular stopper, champagne-gold
> liquid (Nº1), small elegant ivory label in the lower third printed with
> “BEAUX DE PARIS” and “Nº1 · EAU DE PARFUM”, front view, studio product
> photography, soft diffused daylight, warm ivory background, subtle
> realistic glass reflections, high-end fragrance campaign, 8k, photorealistic.

Variations — replace the last clause and liquid words for each scene:

1. **Cutout** → “…, isolated on pure white background, full product cutout,
   no shadow.” → remove background with remove.bg/Photoroom.
2. **Hero stone** → “… resting upright on a natural sculptural beige stone
   pedestal, delicate dried branches and pale flowers beside it, warm ivory
   haze, generous negative space, editorial composition, soft sunlight.”
3. **Le Velours** → liquid “deep amber-brown”, scene “… in a dark espresso
   studio, low candlelight, velvet shadow, bronze highlights.”
4. **Jardin de Lune** → liquid “pale moon-gold green”, scene “… moonlit
   garden at night, pale sage-green light, white moonflowers.”
5. **Signature marble** → “… standing on a slim ivory marble plinth, soft
   warm spotlight from above, museum light.”
6. **Dark finale** → “… in near-darkness on dark stone, single warm rim of
   light on the glass edge, deep espresso background.”
7. **Mist** → “… golden glass catching light, fine luminous mist veil rising,
   bright ivory air, floating particles.”

Tips:
- Generate the **same bottle in the same prompt style** for every shot, and
  inspect each output before generating the next.
- Text on the label is where AI fails — regenerate or fix the label spelling;
  or generate with a **blank ivory label** and tell me — I can letter it in code.
- For the three-fragrance trio, keep everything identical except the liquid
  colour: same bottle, same label, same pose.

## Handing files to me

Simplest: **paste files anywhere in the `from-you/` folder in the project** —
any names, any order. I will name, optimise and slot them into the folders
above. Or drop them straight into the product folders with the names above.
