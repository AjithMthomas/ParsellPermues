# BEAUX DE PARIS — Image prompts for ChatGPT

Paste the **MASTER BOTTLE** block at the top of every generation, then the
variation you need. Generate one image at a time and check it before the next
— consistency comes from keeping the bottle identical.

---

## MASTER BOTTLE (copy into every prompt)

> A single luxury perfume flacon photographed straight-on, centered. The
> bottle: a tall, slender rectangular clear-glass body with softly bevelled
> edges and rounded shoulders, filled with champagne-gold eau de parfum —
> luminous pale gold at the top of the liquid deepening to warm amber at the
> bottom (like the colour of #C7B281). The cap is a short rectangular
> polished stopper in dark espresso brown with a very thin warm-gold ring at
> its base. In the lower third of the glass sits a small ivory paper label
> with a thin hairline gold border, printed in elegant thin lettering:
> "BEAUX DE PARIS" above a fine gold rule, and beneath it
> "Nº1 · EAU DE PARFUM". Realistic glass reflections, physically believable
> refraction and shadow, high-end studio product photography, crisp focus on
> the label, 8k, photorealistic.

> ⚠️ If ChatGPT changes the label wording, the cap shape or the bottle
> proportions, say: "Keep the bottle EXACTLY as in my reference image —
> same shape, same cap, same label text — only change the scene." For label
> text problems, generate with a **blank ivory label** and tell me — I will
> letter it in code.

---

## FILE 1 — CUTOUT of Nº1 (the single most important image)

**Format:** 3:4 portrait · **transparent background** · bottle filling
~85–90 % of the frame height, centered, generous even space around it · no
pedestal, no props, no text anywhere else in the image.

> [MASTER BOTTLE] Photograph the bottle alone against a fully transparent
> background — remove the background entirely and output a true transparent
> PNG cutout, so only the bottle and its own glass reflections are visible.
> No pedestal, no props, no background, no shadow plane. The entire bottle
> visible upright and centered with even empty transparent space around it.
> Soft even diffuse lighting. Aspect ratio 3:4 portrait.

**After generating:** verify the file really has transparency (open it — if
you see a white or checkered backdrop baked in, tell ChatGPT “output the
image as a real transparent-background PNG, no background at all”). If it
still adds a background, fall back to remove.bg / Photoroom once.

**Save as:** `src/assets/products/laube/cutout.png`

---

## FILE 2 + 3 — Cutouts of the other two editions (same bottle, new liquid)

Same 3:4 format and background rules as FILE 1. Keep the bottle identical —
only change what each variation says.

**Nº2 Le Velours (amber):**
> [MASTER BOTTLE] Same bottle, but the liquid is now a deep amber-brown,
> rich and dark, glowing only where light passes through the glass. Output a
> true transparent-background PNG cutout — only the bottle visible, no
> pedestal, no background, no shadow plane, even empty transparent space
> around it, 3:4 portrait.

**Nº3 Jardin de Lune (moon-gold green):**
> [MASTER BOTTLE] Same bottle, but the liquid is now a pale moonlit
> sage-gold, almost translucent with a faint green cast. Output a true
> transparent-background PNG cutout — only the bottle visible, no pedestal,
> no background, no shadow plane, even empty transparent space around it,
> 3:4 portrait.

**Save as:** `src/assets/products/le-velours/cutout.png` and
`src/assets/products/jardin-de-lune/cutout.png`

---

## FILES 4–6 — Campaign scenes (one world per fragrance)

Same bottle, photographed as if by the same campaign photographer. Include
the bottle standing on something — the site already adds grounding, but a
real pedestal makes the plate photographic.

**Nº1 L'Aube — ivory daylight scene** (4:5 or 3:4):
> [MASTER BOTTLE] The bottle stands upright on a low natural sculptural
> beige stone pedestal, set slightly right of center. Around it, delicate
> dried branches and a few pale ivory flowers, warm morning sunlight,
> soft atmospheric haze, generous ivory negative space, editorial luxury
> fragrance campaign composition, shallow depth of field, photorealistic.

**Nº2 Le Velours — dark night scene** (3:4):
> [MASTER BOTTLE, with deep amber liquid] The bottle stands on a dark
> basalt stone in a near-dark espresso studio. A single low warm light
> traces the edge of the glass, deep velvet shadow, faint bronze highlights,
> an air of midnight, editorial luxury fragrance campaign, photorealistic.

**Nº3 Jardin de Lune — moonlit garden** (4:5):
> [MASTER BOTTLE, with pale sage liquid] The bottle stands on a pale
> moonstone in a night garden silvered by moonlight, white moonflowers and
> fig leaves around it, cool pale-green light, fine mist at ground level,
> editorial luxury fragrance campaign, photorealistic.

**Save as:** `src/assets/products/laube/scene.png`,
`src/assets/products/le-velours/scene.png`,
`src/assets/products/jardin-de-lune/scene.png`

---

## OPTIONAL — Ingredient macros (notes act)

Macro photographs, same warm light for all three:

- **Top:** bergamot fruit, a citrus leaf, morning light → `laube/notes-top.png`
- **Heart:** white magnolia / neroli flowers with petals → `laube/notes-heart.png`
- **Base:** blond wood with a small piece of amber resin → `laube/notes-base.png`

---

## Handing files to me

Drop the files **anywhere in the `from-you/` folder** at the project root, or
straight into the folders named above. I will optimise them (sizes, formats,
naming) and the whole site will switch to your real bottle automatically —
no code changes needed.
