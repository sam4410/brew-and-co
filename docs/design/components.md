# Component specs

Reference implementations live in `components/`. They are React 19 Server Components unless
marked **client**, styled only with Tailwind utilities generated from `tokens.css`, and pass
`tsc` and `eslint` with the project config. To use one, move it into the app (for example
`app/_components/`) or import it directly with `@/docs/design/components`.

Shared conventions:

- Props are typed inline. No `className` merging library: components accept `className` and
  append it.
- Prices are integers in cents and formatted with `Intl.NumberFormat`.
- Interactive elements are native (`<button>`, `<a>`, `<input>`), so keyboard support is built in.

---

## Button / ButtonLink

`components/Button.tsx`

Use `Button` for actions that change something. Use `ButtonLink` (a `next/link`) for navigation
that should look like a button.

| Prop | Values | Default |
|------|--------|---------|
| `variant` | `primary` · `secondary` · `on-roast` | `primary` |
| `size` | `md` (44px) · `lg` (52px) | `md` |
| `type` (Button) | `button` · `submit` · `reset` | `button` |

| Variant | Rest | Hover | Where |
|---------|------|-------|-------|
| `primary` | `counter` bg, white text | `counter-hover` | Main action. At most one per section |
| `secondary` | 1px `roast` border, roast text | fills roast, chalk text | Repeated actions (card "Add to order") |
| `on-roast` | `chalk` bg, roast text | white bg | Actions on roast surfaces |

States: focus shows the global ring; `disabled` gives 50% opacity and a not-allowed cursor.
Radius `rounded-control`. Text weight 600, sentence case, no trailing arrow.
`buttonClass()` is exported for the rare element that needs the look without the component.

---

## SignWordmark

`components/SignWordmark.tsx`

The shop sign: `sign-type` lettering (Archivo 125% width, 600, caps, +0.32em tracking) in
chalk on a roast panel with a 4px roast border.

| Prop | Values | Default |
|------|--------|---------|
| `children` | text | `"Brew & Co"` |
| `as` | `h1` · `p` · `span` | `p` |

Rules: **once per page**. On the home page render `as="h1"`. Never for section headings.
The negative end margin cancels the trailing tracking so the panel padding looks even.

---

## SiteHeader

`components/SiteHeader.tsx`

**client.** Roast bar with a small sign-type wordmark, three nav links (Home, Menu, About us)
and an `on-roast` **Reserve a table** button (`ReserveDialog`), followed by a full-width `stripe-band`.

| Prop | Type | Notes |
|------|------|-------|
| `reserveAction` | Server Action | Passed through to `ReserveDialog` |
| `reserveNote?` | string | Opening hours shown in the dialog |

States: links are `chalk-dim` and turn `chalk` on hover. The current page (from `usePathname`)
is `chalk` with a `lamp` underline (8px offset). Below `sm` the links drop to a second row
under the wordmark and button. Add a disclosure menu (`aria-expanded`) if the nav grows past
three links.

---

## FilterChips (client)

`components/FilterChips.tsx`

Single-select filter above the drinks grid (ref 1: "All · Black · Espresso · Doppio").

| Prop | Type |
|------|------|
| `options` | `string[]` |
| `value` | selected option |
| `onChange` | `(next: string) => void` |
| `label` | accessible group name, e.g. "Filter drinks" |

Anatomy: `role="group"` containing `<button aria-pressed>` pills, 36px tall, `rounded-pill`.
Rest: `roast-soft` border and text. Hover: `roast`. Selected: roast fill, chalk text.
Controlled, so the parent owns the state (or syncs it to `?type=` in the URL).

---

## ProductCard

`components/ProductCard.tsx`

| Prop | Type |
|------|------|
| `drink` | `{ name, note, price (cents), image: { src, alt } }` |
| `onAddLabel?` | button text, e.g. `"Add to order"`. No button renders without it (the site has no ordering yet) |
| `tag?` | short label under the note, e.g. "House favourite", in `oak-deep` caption |

Anatomy, top to bottom: square photo (`next/image`, `fill`, `bg-latte` placeholder), then a row
with the name (`text-h4` serif) and price (600, tabular, right), then a one-line note in
`roast-soft`, then a full-width `secondary` button.
Container: `border-latte-deep`, square corners, no shadow, no hover lift.
The button's accessible name includes the drink ("Add to order: Flat white"), so a page of
cards doesn't read as eight identical buttons.
Grid: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`.

---

## MenuBoard

`components/MenuBoard.tsx`

The chalk menu board (kiosk reference). It is the full menu at a glance and complements the
photo cards.

| Prop | Type |
|------|------|
| `sections` | `{ title, items: { name, price (cents), note? }[] }[]` |
| `heading` | default `"Menu"` |

Anatomy: `surface-roast` section with an `h2`, then CSS columns (1 → 2 at `sm` → 3 at `lg`).
Each section title is Archivo 600 in `lamp` over a chalk-dim hairline. Items are a `<dl>`:
the name, a dotted leader, and the price. An optional note appears in `chalk-dim` caption.
Sections use `break-inside-avoid`. The section is labelled by its heading via `useId`.

---

## Testimonial

`components/Testimonial.tsx`

| Prop | Type |
|------|------|
| `quote` | string |
| `name` | string |
| `detail?` | e.g. "Regular since 2023" |
| `avatar?` | image src (decorative, `alt=""`) |
| `rating?` | 1–5 |

Anatomy: a `<figure>` on `surface-roast`, max prose width. Optional `lamp` stars (hidden from
screen readers, with "Rated 4 out of 5" as `sr-only` text), the quote in `text-h4` serif, then a
`<figcaption>` with a 44px round avatar, the name (600) and the detail in `chalk-dim`.
Show one at a time. Don't build a carousel unless there are more than three real quotes.

---

## NewsletterForm

`components/NewsletterForm.tsx`

| Prop | Type |
|------|------|
| `action` | Server Action `(formData) => void \| Promise<void>`; reads `formData.get("email")` |
| `error?` | message to show under the field |

Anatomy: a visible "Email address" label, a 44px input (`rounded-control`, roast border,
white fill) and a `primary` "Subscribe" button in one row. The error text appears below in
`error` caption.
Validation: `type="email" required` in the browser, and the Server Action **must validate
again** (it is a trust boundary). On error the input gets `aria-invalid` and
`aria-describedby`, and its border turns `error`.
Success: replace the form with "Subscribed. Check your inbox to confirm." (same verb as the button).

---

## ReserveDialog (client)

`components/ReserveDialog.tsx`

| Prop | Type |
|------|------|
| `action` | Server Action `(prev, formData) => Promise<{ ok?, summary?, errors?, values? }>` |
| `note?` | text under the fields (opening hours) |
| `variant`, `size`, `className` | passed to the trigger `Button` |

Anatomy: a `Button` "Reserve a table" that opens a native `<dialog>` with `showModal()`, so focus
is trapped, Esc closes it and focus returns to the trigger. Inside: an `h2`, a 44px square close
button, and a form with visible labels for Name, Party size (1–12), Date (`min` = today),
Time (15-minute steps), Phone and Email (optional), then a `primary` "Book table" button. The dialog uses `shadow-float`
(it floats) and a `roast/60` backdrop.
Validation: the Server Action **must validate again** (trust boundary). Errors show under each
field with `aria-invalid` and `aria-describedby`, the same pattern as `NewsletterForm`; an
`errors.form` message (e.g. the booking service is down) shows above the button as `role="alert"`. Entered
values come back in `values` so the form isn't wiped. Success replaces the form with a
`role="status"` line: "Table booked for 4 on Friday, October 23 at 7:30pm. See you soon."
Each open remounts the form, so it starts fresh.

---

## SiteFooter

`components/SiteFooter.tsx`

| Prop | Type |
|------|------|
| `address` | `string[]` lines |
| `hours` | `{ days, time }[]` |

Anatomy: a `stripe-band`, then a roast panel with "Visit us" and "Hours" in `lamp` (Archivo 600,
not serif: they are labels), and a "Photos from Pexels" credit. Pages should end on a light
section so the stripe sits between light and roast.

---

## Utilities (from `tokens.css`)

| Class | Use |
|-------|-----|
| `surface-roast` | Dark section: roast bg, chalk text, lamp focus ring inside |
| `surface-latte` | Tan section |
| `stripe-band` | 12px awning stripe (24px roast/plaster bars). Between roast and light sections, under the header. Max two per page |
| `sign-type` | Sign lettering. Wordmark only |

## Adding a component

1. Use only token classes. If you need a raw hex or px value, add a token first.
2. Pick the surface it lives on and check the colour pairs against the contrast table in
   `style-guide.md`.
3. Use a native element for interaction, add a visible focus state, and keep targets ≥ 44px.
4. Document it here: purpose, props, anatomy, states, a11y notes.
