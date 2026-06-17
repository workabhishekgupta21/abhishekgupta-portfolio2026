# Abhishek Gupta — Executive Brand Site

Premium, recruiter-focused personal brand site positioning Abhishek Gupta as a **Head of Performance Marketing / Growth Leader**. Dark luxury SaaS aesthetic (Stripe / Linear / Vercel / Apple register) with cinematic motion. Zero build step.

## Files
- `index.html` — structure & copy
- `styles.css` — "Midnight Aurora" design system (glass, bento, timeline, dock, loader)
- `script.js` — motion: loader, typed engine, count-ups, 3D tilt, mouse-follow glow, GSAP parallax, dock + scrollspy
- `assets/abhishek.jpg` — hero portrait
- `STRATEGY.md` — IA, wireframe, design system, animation strategy

## Feature highlights
- Asymmetric hero: portrait in a glowing ring + floating stat cards
- Typed "command bar" (hero), typed terminal (approach), typed prompt (contact)
- Animated gradient glow borders, mesh gradient, aurora, floating orbs, grid pattern, grain
- Bento KPI dashboard with count-up + animated sparkline
- Premium timeline, infinite logo marquee, floating dock navigation
- Loading screen, scroll progress, magnetic buttons, parallax (GSAP ScrollTrigger), reduced-motion support

## Run locally
```bash
cd abhishek-portfolio
python3 -m http.server 8000
# open http://localhost:8000
```
Or just double-click `index.html` (works over file://).

## Deploy
Drag the folder into **Vercel** or **Netlify**, or push to **GitHub Pages**. Fully static — no build.

## Editing notes
- **Cache busting:** browsers cache `styles.css` / `script.js` hard. After editing them, bump the version in `index.html` (`styles.css?v=3` → `?v=4`) so changes show without a hard refresh. (Not needed on Vercel/Netlify — they fingerprint assets.)
- **Phone / email:** search `tel:+919919111115` and `mailto:` in `index.html`
- **Metrics:** `data-count` / `data-suffix` attributes
- **Brands / institutions:** both `.marquee__track` lists (keep identical for the seamless loop)
- **Typed phrases:** `data-typed="phrase one|phrase two|..."` on any `.typed` span
- **Colors:** CSS variables at the top of `styles.css`
