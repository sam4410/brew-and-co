# Brew & Co style guide

The visual language for the Brew & Co website. It is built from the three references in
`docs/designs/references/`:

| Ref | What we took |
|-----|--------------|
| `1.png` (coffee landing page) | Dark roast + steamed-milk tan alternating sections, a warm display serif, square-cornered photo cards with an order button |
| `3.png` (café interior) | Fluted **navy** counter as the action colour, white plaster walls, herringbone **oak**, black-and-white **awning stripes**, warm pendant light |
| `images.png` (coffee kiosk) | The **shop sign**: wide, widely spaced capitals on a dark panel, and the **chalk menu board** with prices |

**What makes it ours:** the generic coffee site is brown + cream + gold. Brew & Co is a
neighbourhood counter: white walls, a navy counter you order at, a black sign over the door.
Spend boldness in two places only: the **sign lettering** and the **awning stripe**.
Everything else stays quiet.

Files:

- `tokens.css`: all design tokens as a Tailwind v4 `@theme` (single source of truth)
- `components/`: React 19 / Next 16 reference components that use only these tokens
- `components.md`: component specs (anatomy, variants, states, a11y)

---

## 1. Setup in the app

```css
/* app/globals.css: replace the existing :root, @theme and body blocks */
@import "tailwindcss";
@import "../docs/design/tokens.css";
```

```tsx
// app/layout.tsx: replace Geist with the brand fonts
import { Archivo, Young_Serif } from "next/font/google";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" });
const youngSerif = Young_Serif({ subsets: ["latin"], weight: "400", variable: "--font-young-serif" });

// <html lang="en" className={`${archivo.variable} ${youngSerif.variable} h-full antialiased`}>
```

`axes: ["wdth"]` is required: the sign lettering uses Archivo at `font-stretch: 125%`.

`tokens.css` resets Tailwind's default colour palette (`--color-*: initial`), so `bg-zinc-50`
and similar stop working. That is intentional: only brand colours exist. Update `app/page.tsx`
when you adopt the tokens.

---

## 2. Colour

| Token | Hex | Role |
|-------|-----|------|
| `plaster` | `#FBFAF8` | Page background (the white walls) |
| `latte` | `#E6D3B8` | Secondary surface: alternating sections, image placeholders |
| `latte-deep` | `#D6BD9B` | Decorative borders and dividers only (1.7:1, not for controls) |
| `roast` | `#2A1B14` | Body text on light; the dark "signboard" surface |
| `roast-soft` | `#5B4A40` | Secondary text and control borders on light |
| `chalk` | `#EFEBE4` | Text on roast |
| `chalk-dim` | `#B9ADA2` | Secondary text on roast |
| `counter` | `#1E2B4A` | **Primary action** (buttons, focus ring, links) |
| `counter-hover` | `#2C3D66` | Hover for `counter` |
| `oak` | `#A8713F` | Decoration, large text ≥ 24px only |
| `oak-deep` | `#8A5A2E` | Oak when it must be body-size text |
| `lamp` | `#E8B65A` | Accent **on roast only**: menu section titles, ratings, focus ring on dark |
| `success` / `error` | `#2F6B47` / `#A33A2A` | Feedback on light |
| `error-on-roast` | `#F08A76` | Error text on dark surfaces |

### Rules

- **One action colour.** Navy `counter` means "you can do something here." Don't use it for
  decoration or headings.
- **Lamp never sits on light surfaces.** It is light on a dark sign; on plaster it fails contrast.
- Page rhythm alternates: `plaster` → `surface-latte` → `surface-roast`. Never put two roast
  sections next to each other; put the stripe band between a roast section and a light one.
- Use the surface utilities, not raw backgrounds, for whole sections:
  `surface-roast` (sets bg + chalk text + lamp focus ring), `surface-latte`.

### Verified contrast (WCAG 2.2)

| Pair | Ratio | |
|------|-------|--|
| roast on plaster | 15.9 | AAA |
| roast on latte | 11.4 | AAA |
| roast-soft on plaster / latte | 8.1 / 5.8 | AA |
| chalk on roast | 14.0 | AAA |
| chalk-dim on roast | 7.6 | AAA |
| lamp on roast | 8.9 | AAA |
| white on counter | 14.0 | AAA |
| oak-deep on plaster | 5.6 | AA |
| oak on plaster | 3.95 | large text only |
| error on plaster / error-on-roast on roast | 6.3 / 6.8 | AA |

---

## 3. Typography

Two families, clearly different jobs:

| Family | Role | Why |
|--------|------|-----|
| **Young Serif** (400 only) | Headings h1–h3, quotes | Heavy, warm, a little hand-painted. Closer to a café's painted window than to a fashion serif. Reads as ref 1's display serif without the high-contrast Didone look |
| **Archivo** (variable, wght + wdth) | Body, UI, prices, *and* the sign | One workhorse sans. At `wdth 125` + tracking + caps it becomes the shop sign from the kiosk reference |

### Scale: major third (1.25), 16px base

| Token | Size | Line height | Font | Use |
|-------|------|-------------|------|-----|
| `text-sign` | 35–96px fluid | 1 | Archivo 125% caps, +0.32em | The wordmark. **Once per page** |
| `text-h1` | 42–76px fluid | 1.02 | Young Serif | Page title |
| `text-h2` | 32–49px fluid | 1.1 | Young Serif | Section title |
| `text-h3` | 31px | 1.2 | Young Serif | Sub-section |
| `text-h4` | 25px | 1.3 | Young Serif | Card titles, quotes |
| `text-lead` | 20px | 1.55 | Archivo | Intro paragraph |
| `text-body` | 16px | 1.6 | Archivo | Default |
| `text-caption` | 12.8px | 1.4 | Archivo | Notes, form help |

### Rules

- Sentence case everywhere. **The only all-caps text is the sign** (`sign-type`). No caps
  eyebrows above headings, and no small-caps labels.
- Don't recolour or italicise one word inside a headline. If a headline needs emphasis, rewrite it.
- Body copy maxes out at `max-w-(--container-prose)` (38rem, about 70 characters).
- Prices always use `tabular-nums` so columns line up on the menu board.
- Headings use `text-wrap: balance` and paragraphs use `text-wrap: pretty` (set in `tokens.css` base).
- Weights: Archivo 400 body, 600 for buttons, prices and names. Young Serif has a single weight.
  Don't fake bold on it.

---

## 4. Layout and spacing

- Spacing uses Tailwind's 4px scale (`p-4` = 16px). Prefer 4, 6, 8, 10, 16 steps.
- **Page container:** `mx-auto max-w-(--container-page) px-(--spacing-gutter) md:px-(--spacing-gutter-lg)`
  (72rem wide, 16px gutter on mobile, 32px from `md`).
- **Section rhythm:** `py-(--spacing-section)` (64–128px fluid) between top-level sections.
- **Home hero exception:** the live home page puts the sign on a full-bleed café photo (Pexels,
  `opacity-45` over `surface-roast`, `alt=""` because it's decorative). The sign is still the `h1`
  and the only all-caps text. The photo was a client request; keep it dark enough that chalk text
  stays AA.
- **Alignment:** left-aligned. Center only the sign wordmark and a single testimonial.
- **Grid:** drinks grid is 1 → 2 (`sm`) → 3 (`lg`) columns, `gap-6`. Menu board uses CSS
  columns so sections flow naturally.

```
┌──────────────────────────────────────────────┐
│ BREW & CO          Menu  Beans  Visit  [Order]│  roast header
│▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄│  stripe band
│                                              │
│  ┌────────────────────┐                      │  plaster hero:
│  │  B R E W  &  C O   │   Coffee on the      │  the sign is the
│  └────────────────────┘   corner since 2019  │  hero, not a photo
│  Opening line in lead size        [photo]    │
│  [View the menu]                             │
├──────────────────────────────────────────────┤
│ latte: All  Black  Espresso  Milk            │  filter chips
│ ┌──────┐ ┌──────┐ ┌──────┐                   │  product cards
│ │photo │ │photo │ │photo │                   │
│ │Name $│ │Name $│ │Name $│                   │
│ └──────┘ └──────┘ └──────┘                   │
├──────────────────────────────────────────────┤
│ roast menu board: Coffee ····· $3.50         │
├──────────────────────────────────────────────┤
│ plaster: testimonial, newsletter, footer     │
└──────────────────────────────────────────────┘
```

---

## 5. Shape, borders, elevation

- **Two radii only.** `rounded-control` (2px) for buttons and inputs, like a cut sign panel.
  `rounded-pill` for filter chips and avatars. Cards, photos and sections are square.
- **Borders before shadows.** Cards use `border-latte-deep`. Controls use `roast` or `roast-soft`
  borders (they need 3:1).
- `shadow-float` is reserved for things that actually float above the page: a sticky
  order bar, a popover. Not for cards.

---

## 6. Imagery

- Real photos of drinks and the shop, warm and slightly desaturated (ref 3's film tone).
  No floating coffee-bean splash renders.
- Product photos are square (`aspect-square`), shot top-down or at 45° on a plain surface.
- Placeholder background while loading: `bg-latte`.
- Every image has `alt` text describing the drink ("Flat white in a white ceramic cup"),
  or `alt=""` when it is decorative (avatars next to a name).
- Use `next/image` with `sizes` set. Don't use `<img>`.

---

## 7. Motion

| Token | Value | Use |
|-------|-------|-----|
| `--duration-quick` | 120ms | Colour changes on hover and press |
| `--duration-base` | 200ms | Open/close of menus and popovers |
| `--duration-slow` | 360ms | The one page-load moment |
| `ease-pour` | `cubic-bezier(.2,.7,.2,1)` | Everything: fast start, slow settle, like a pour |

- One orchestrated moment only: on the home page, the sign lettering may fade in letter by
  letter on load. No scroll-triggered entrances on sections.
- Motion answers actions: "Added to order" confirmations, menu open.
- `prefers-reduced-motion` is honoured globally in `tokens.css`.

---

## 8. Voice and copy

- Plain, warm, specific. Talk like the person behind the counter.
- Buttons name the action: **Add to order**, **Subscribe**, **View the menu**. The toast uses the
  same verb: "Added to order."
- No arrows appended to button text. No "Discover the art of…" headlines.
- Errors say what happened and what to do: "Enter an email address like name@example.com."
- Empty states invite action: "Your order is empty. Pick a drink from the menu."

---

## 9. Accessibility floor

- Text contrast ≥ 4.5:1, controls ≥ 3:1 (see table in §2).
- Focus ring: 2px `counter` outline, 2px offset; switches to `lamp` inside `surface-roast`.
  Never remove it.
- Touch targets ≥ 44px tall (`h-11`). Chips are 36px but sit in a wrapping row with gaps.
- Form fields always have a visible `<label>`. Placeholder is an example, not the label.
- Ratings, prices and decorative glyphs have a text alternative (see `Testimonial`).
- Landmarks: one `<header>`, one `<main>`, `<nav aria-label>`; one `h1` per page.

---

## Out of scope (not done yet)

- **Dark mode.** The brand already alternates dark and light sections. A full dark theme would
  need its own surface mapping.
- Icon set, footer and cart/checkout components. Add them to `components/` following
  `components.md` when the pages need them.
