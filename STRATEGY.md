# Abhishek Gupta — Executive Brand Site
### Strategy → Design System → Build Spec

Positioning: **Head of Performance Marketing / Growth Leader.**
Not a resume. Not a freelancer portfolio. A personal-brand product surface engineered for recruiter psychology — authority, scale and business impact legible in **under 5 seconds**.

Aesthetic north star: Stripe (clarity + trust), Linear (precision + restraint), Vercel (dark cinematic motion), Apple (product reverence). Reference videos confirm the register: dark glassmorphism, 3D-tilted panels under a spotlight, aurora glow, editorial serif accents, smooth reveals.

---

## 1. Information Architecture

Single, scroll-driven narrative page (executive sites are one decisive story, not a sitemap). Sticky glass nav with scrollspy. Order is a *persuasion funnel*, not a content dump.

| # | Section | Recruiter job-to-be-done | Proof carried |
|---|---------|--------------------------|---------------|
| 0 | **Nav** | Orient + 1-tap to contact | Name, "Available", CTA |
| 1 | **Hero** | "Is this person senior + relevant?" — answered in 5s | Title, one-line thesis, headline metric, dual CTA |
| 2 | **Impact bar** | "What scale has he operated at?" | ₹15+ Cr spend, 2.26L+ leads, 5000+ apps, 1000+ admissions, 2000+ enrollments, 300+ colleges, 100+ clients (animated counters) |
| 3 | **Trusted by** | "Who has bet on him?" | Brands (Affinity, Medway, MEXT, Maglo, Babbler) + Institutions (Amity, UPES, Sharda, LPU, Chandigarh) marquee |
| 4 | **Case studies** | "Show me outcomes, not tasks" | CollegeHai · Makunai Global · Study Abroad Growth — glass tilt cards |
| 5 | **Capabilities** | "Can he lead the whole function?" | 8 leadership areas grid |
| 6 | **Industries** | "Does he know my market?" | 6 verticals |
| 7 | **Operating thesis** | "How does he think?" | One editorial statement — the growth-system POV |
| 8 | **Contact** | "How do I reach him now?" | Phone, email, CTA |

Decision: **no blog, no long bio, no services list.** Minimal copy, maximum signal.

---

## 2. Wireframe (low-fidelity)

```
┌───────────────────────────────────────────────────────────┐
│  AG ·  Abhishek Gupta        Work  Impact  Capabilities  [Let's talk] │  ← sticky glass
├───────────────────────────────────────────────────────────┤
│   ● Available for leadership roles                          │
│                                                             │
│   Performance marketing that                                │
│   compounds into  *revenue.*               (serif accent)   │
│                                                             │
│   Growth leader • ₹15+ Cr managed • 2.26L+ leads            │
│   [ View the work → ]   [ Book a call ]                     │
│                                  ╱ aurora glow + grain ╲    │
├───────────────────────────────────────────────────────────┤
│  ₹15+ Cr   2.26L+   5000+   1000+   2000+   300+   100+     │  ← counters
│  Ad spend  Leads    Apps    Admis.  Enroll  Colleges Clients│
├───────────────────────────────────────────────────────────┤
│  Trusted by teams scaling demand                            │
│  ◄ Affinity  Medway  MEXT  Maglo  Babbler  · Amity UPES ► │  ← marquee
├───────────────────────────────────────────────────────────┤
│  Selected work                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ CollegeHai   │ │ Makunai      │ │ Study Abroad │  ← 3D tilt glass
│  │ 126K+ leads  │ │ 0→100 clients│ │ UK·USA·CA·AU │     spotlight
│  └──────────────┘ └──────────────┘ └──────────────┘        │
├───────────────────────────────────────────────────────────┤
│  What I own  ▸ 8-cell capability grid (glass)               │
├───────────────────────────────────────────────────────────┤
│  Industries  ▸ 6 pills                                      │
├───────────────────────────────────────────────────────────┤
│  Operating thesis — large editorial statement              │
├───────────────────────────────────────────────────────────┤
│  Let's build the next growth curve.  [phone] [email]       │
└───────────────────────────────────────────────────────────┘
```

Mobile: single column, nav collapses to brand + CTA, counters 2-col, cards stack, marquee persists.

---

## 3. Design System

**Palette — "Midnight Aurora"**
- `--bg`: #06070B (near-black) · `--bg-2`: #0A0C12
- Aurora blobs: indigo `#6366F1`, violet `#A855F7`, cyan `#22D3EE`, faint magenta `#E0488B`
- Text: `--ink` #F4F5F7, `--ink-dim` rgba(244,245,247,.62), `--ink-faint` rgba(244,245,247,.40)
- Accent gradient: `linear-gradient(120deg,#818CF8,#C084FC,#22D3EE)`
- Glass: `rgba(255,255,255,.045)` fill, `1px` hairline `rgba(255,255,255,.10)`, `backdrop-blur(18px)`, soft top highlight + drop shadow.

**Typography**
- Display/UI: **Inter** (tight tracking, weights 400/500/600/700, `-apple-system` fallback).
- Editorial accent: **Instrument Serif** (italic) for hero highlight + thesis — the "executive editorial" voice.
- Mono detail: **Geist Mono / ui-monospace** for labels, metric eyebrows, kicker tags.
- Fluid type scale via `clamp()`. Display up to ~7rem. Generous line-height on body, tight on display.

**Spacing & grid**: 8px base. Max content width 1200px. Section vertical rhythm `clamp(6rem,12vh,10rem)`. 12-col mental model, mostly 1/2/3-col CSS grids.

**Radius & depth**: cards `24px`, pills `999px`, buttons `12px`. Layered shadows + inner highlight for the glass "lift".

**Texture**: SVG fractal-noise grain overlay at ~3% opacity for film-grade depth (kills banding on gradients).

---

## 4. Animation Strategy

Principle: **motion as choreography, not decoration.** Everything eases on `cubic-bezier(.22,1,.36,1)`. Honors `prefers-reduced-motion` (all transforms → instant, opacity only).

| Element | Motion | Trigger |
|---------|--------|---------|
| Aurora field | Slow 24–40s drift + subtle mouse parallax | ambient |
| Hero headline | Word-by-word blur-up + rise, staggered 60ms | on load |
| Grain | static overlay | — |
| Counters | Count-up with easing | IntersectionObserver |
| Marquee | Infinite seamless track, pause on hover | ambient |
| Case cards | Mouse-tracked 3D tilt + cursor spotlight (radial glow) | hover / pointermove |
| Sections | Fade + 24px rise + slight blur, staggered children | IntersectionObserver (once) |
| Buttons | Magnetic pull + sheen sweep | hover |
| Nav | Condense + stronger blur after 40px scroll; active link underline slides | scroll |
| Scroll progress | Thin gradient bar top | scroll |

Performance budget: transforms/opacity only (GPU), no layout thrash, `will-change` used sparingly, no JS framework, target Lighthouse 95+ / fast LCP.

---

## 5. Build

Zero-build static site — `index.html` + `styles.css` + `script.js`. Deploy by dragging the folder to Vercel/Netlify/GitHub Pages. Fonts via Google Fonts. No images required (all CSS/SVG), so it loads instantly and ages well.
