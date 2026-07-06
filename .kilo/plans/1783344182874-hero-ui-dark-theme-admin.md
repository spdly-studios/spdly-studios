# Plan: Fix Hero Layout + Add Dark Theme Toggle + Reflect Changes in Admin

## Context
The public site (`index.html`, `projects.html`, `tools.html`, `work.html`) was redesigned into a Swiss minimalist style with an animated hero (canvas constellation, grid overlay, vertical rail, corner index, cycling role, magnetic cursor). The user reports the hero is "still not proper" and wants: (1) the hero layout fixed, (2) a dark theme included, and (3) the same UI improvements reflected in the `admin/` dashboard. Images cannot be viewed, so fixes are based on code structure, not visual inspection.

Decisions confirmed with user:
- **Theme**: Support BOTH light (current default Swiss) and dark, with a persisted navbar toggle.
- **Hero**: Keep the animated elements but fix layout (centering, stacking, overflow, canvas z-index, no-JS fallback).

## Scope / Affected files
Public:
- `css/style.css` — add `[data-theme="dark"]` variable overrides, theme-toggle button styles, hero layout fixes.
- `index.html`, `projects.html`, `tools.html`, `work.html` — add theme toggle button in navbar; fix hero markup/CSS hooks; ensure fallback when canvas/JS disabled.
- `js/core/theme.js` (NEW) — toggle + localStorage + system preference.
- `js/core/hero-canvas.js` — make colors theme-aware (read CSS vars / accept dark palette); guard already exists.
- `js/pages/home.js` — hero cursor/cycler already present; ensure no errors if elements missing.
- `js/core/ui.js` — optional: nothing required.

Admin:
- `admin/index.html` — inline `<style>` currently dark-only with its own tokens (purple accent). Add light/dark via `[data-theme]` overrides on `:root`, a theme toggle in the admin header, and apply the same "UI polish" language (active states, hover lifts, section index bars, smoother transitions). Keep purple admin accent distinct from public red accent.
- Optionally extract admin CSS to `admin/admin.css` if it grows; otherwise keep inline but organized.

## Implementation steps

### 1. Theme system (public)
- In `css/style.css`, add after existing `:root`:
  ```css
  :root { /* existing light tokens stay */ }
  [data-theme="dark"] {
    --bg:#0a0a0f; --bg-alt:#111118; --surface:#14141c;
    --border:#1e1e2e; --border-sub:#1a1a24;
    --text:#e7e7ef; --text-2:#9a9aae; --text-3:#5e5e72;
    --accent:#e54f4d; /* keep brand red */
  }
  ```
- Add a `.theme-toggle` button (icon + label) styled in navbar, visible on all public pages. Persist choice in `localStorage` key `theme`; default to `prefers-color-scheme`.
- `js/core/theme.js`: set `document.documentElement.dataset.theme` on load; toggle handler; respect OS changes only when user hasn't chosen.

### 2. Hero layout fix (`index.html` + `css/style.css`)
- Ensure `#hero` is a flex centering container: `display:flex; align-items:center; justify-content:center;` with `padding: calc(var(--nav-h) + 24px) 24px 64px;`.
- `.hero-content` gets `position:relative; z-index:2; max-width:880px; margin:0 auto; text-align:left;` and a `pointer-events:none` on decorative overlays (canvas, grid overlay, rail, index) and `pointer-events:auto` on `.hero-content` so buttons stay clickable.
- Cap headline size on short/landscape viewports: `font-size: clamp(2.8rem, 9vw, 7rem)`.
- Guarantee canvas sits behind content: `#hero-canvas{z-index:0}` (already) and `.hero-content{z-index:2}` (ensure).
- Add static fallback behind canvas: a subtle CSS radial/linear gradient on `#hero` using `--accent` at low alpha so hero looks fine even if `hero-canvas.js` fails or `prefers-reduced-motion` hides canvas.
- Keep `hero-rail`, `hero-index`, `hero-grid-overlay`, `hero-cursor` but make them `pointer-events:none` and hide gracefully on `<=640px` (rail/index off on mobile to avoid clutter).
- Verify `role-cycler` and `hero-cursor` JS still run; they already guard for missing elements and reduced motion.

### 3. UI polish consistency (public)
- Already added: scroll-reveal fade, card hover lift, section-heading index bar, active nav state, button fill. Confirm these read correctly under dark tokens (they use `var(--text)`/`var(--border)` so they will).
- Verify contact form button success style uses `var(--text)`/`var(--bg)` so it inverts in dark mode (it does).

### 4. Admin reflection (`admin/index.html`)
- Wrap existing `:root` as light defaults; add `[data-theme="dark"]` block overriding `--bg/--surface/--surface2/--border/--text/--muted` to dark values (keep purple `--accent`).
- Add a theme toggle button in the admin top bar (reuse same `js/core/theme.js` pattern via a small inline script or shared file; admin is separate dir so add a tiny inline toggle script or a `admin/theme.js`).
- Apply "UI polish" to admin components: add `:hover{transform:translateY(-3px)}` lifts on cards/list items, active sidebar state, smoother `transition`, and a small accent index bar before section/card titles for consistency with public site.
- Ensure admin stays functional (login, CRUD) — only styling/structure, no behavior changes.

## Risks / edge cases
- Public `css/style.css` is large; dark overrides must only change color tokens, not layout, to avoid regressions.
- Canvas colors are hardcoded in `hero-canvas.js`; switch palette based on `document.documentElement.dataset.theme` (read on init + on toggle) so dots/lines are visible on both themes.
- `prefers-reduced-motion` already disables canvas; ensure fallback gradient still shows hero nicely.
- Admin uses its own tokens/purple accent — do NOT force public red into admin; keep them visually distinct but consistent in "feel".
- Theme toggle must not break admin login flow or public preloader.

## Validation
1. Open `index.html`: hero centers, text readable on light + dark, canvas animates, buttons clickable, no overlap of rail/index on mobile.
2. Toggle theme: persists across reloads; canvas recolors; no flash of wrong theme (set theme in `<head>` via inline script before paint).
3. Visit `projects.html`, `tools.html`, `work.html`: theme toggle present, colors consistent, no broken layout.
4. Open `admin/index.html`: login works; dashboard shows same theme toggle; cards/list items have hover lift and active states; light+dark both usable.
5. Run a quick check that CSS braces stay balanced (`{` count == `}` count) after edits.
6. Confirm no console errors (missing `#role-cycler`/`#hero-cursor` only on non-home pages is already guarded).
