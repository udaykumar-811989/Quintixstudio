# QUINTIX STUDIO

Premium immersive 3D creative-agency website. Cinematic black/charcoal/silver
design language, procedural Three.js sculptures, GSAP + ScrollTrigger motion and
Lenis smooth scrolling.

Built with **React 19 + Vite 8**.

## Run it locally

```bash
npm install
npm run dev      # development server → http://localhost:5173
```

Production build & preview:

```bash
npm run build
npm run preview
```

Verify the site end-to-end in a headless browser (layout, interactions, form,
mobile, reduced-motion, no-WebGL fallback):

```bash
npm run dev            # in one terminal
npm run verify         # in another (requires local Chrome)
```

## Project structure

```
src/
├── App.jsx                     # page composition
├── data/
│   ├── contact.js              # ← edit business info & form endpoint here
│   ├── content.js              # services, capabilities, methodology, industries…
│   └── projects.js             # showcase projects (swap images here)
├── lib/                        # gsap setup, scroll store, webgl detection
├── hooks/                      # Lenis, in-view, media query, motion prefs
└── components/
    ├── layout/                 # nav, footer, preloader, custom cursor
    ├── sections/               # one file per page section
    ├── three/                  # 3D scenes (isolated from content)
    └── ui/                     # reveal animations, ticker, icons
public/images/                  # showcase concept art (replaceable)
```

## Common edits

- **Phone / email / Instagram** → `src/data/contact.js`
- **Inquiry form delivery** → `src/data/contact.js` → `inquiryForm.endpoint`
  - `null` (default): the form opens the visitor's email app (mailto fallback).
  - Set to a form-service URL (Formspree, Basin, Web3Forms, your API…) and the
    form will POST to it with real loading/success/error states.
- **Showcase images** → drop files in `public/images/` and update `image` in
  `src/data/projects.js`.
- **All copy** → `src/data/content.js`

## Accessibility & performance notes

- `prefers-reduced-motion` disables smooth scrolling, tickers, reveals and 3D
  animation (static renders instead).
- No WebGL? A CSS-based chrome sculpture fallback renders instead — the site
  stays fully usable.
- 3D canvases lazy-mount and pause their frameloop when off screen; device-aware
  pixel ratio; particle counts reduced on mobile.
- Keyboard-accessible nav, filters and form; skip link; visible focus states.

## Legal note

The three showcase projects are **self-initiated creative concepts**, not
verified client campaigns, and the figures shown are concept projections. This
is stated on the page itself. Do not present them as client results.
