# Pura Perfumes

Shop site for Pura eau de parfum. Next.js 16, React 19, Tailwind 4, motion, Lenis.
Built as a static export: `npm run build` writes plain files to `out/`, which Vercel serves.

## Run

    npm install
    npm run dev      # http://localhost:3000
    npm run build    # static site in out/

## Edit products and prices

Everything lives in `data/products.ts`: names, notes, copy, prices per size, For Her / For Him.
Orders go to WhatsApp through `lib/site.ts` (number, email, Instagram).

## Images

All pictures are built from the campaign photos in `art/originals/` by `art/build_images.py`
(Python 3 with Pillow, numpy, scipy, scikit-image; label lettering uses Windows' Century Gothic).

    python -I art/build_images.py             # everything
    python -I art/build_images.py bottles     # bottles | scenes | brand | grounds | meta

New fragrances are the real Pura bottle with a re-tinted liquid and a re-coloured, re-lettered label.
Add one by adding an entry to `VARIANTS` in the script and a product in `data/products.ts`.
