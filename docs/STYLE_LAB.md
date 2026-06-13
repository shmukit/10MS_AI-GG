# Style Lab

Internal design preview route for maintainers and contributors. **Not linked in app navigation** — end users will not discover it accidentally, but anyone with repo access can find it here and at `/style-lab`.

## Route

| URL | Auth | Nav link |
|-----|------|----------|
| `/style-lab` | None (public) | None |

Registered in [`src/App.tsx`](../src/App.tsx) as a top-level public route, alongside marketing and login.

## Purpose

- Preview **semantic tokens** (background, card, muted, borders, primary) in light and dark mode side-by-side
- Compare **neutral palette** options before locking one in for production
- Review shared UI primitives (Button, Card, inputs, sample dashboard layout)
- Validate **SheSTEM + 10 Minute School** logos on light/dark surfaces

## Files

| File | Role |
|------|------|
| [`src/components/StyleLab/StyleLabPage.tsx`](../src/components/StyleLab/StyleLabPage.tsx) | Preview UI + palette switcher |
| [`src/styles/palettes.css`](../src/styles/palettes.css) | Four neutral palette definitions (`data-palette` on `<html>`) |
| [`src/lib/ThemeContext.tsx`](../src/lib/ThemeContext.tsx) | Persists `palette` + `theme` in `localStorage` |
| [`docs/DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | Canonical token reference |

## Neutral palettes

Selected via pills on Style Lab; applies **app-wide instantly** (dashboard, admin, roadmap, etc.).

| ID | Label | Light canvas | Dark canvas |
|----|-------|--------------|-------------|
| `warm-stone` | Warm Stone | `#F5F5F4` | `#09090B` |
| `charcoal-ivory` | Charcoal + Ivory | `#EEEDE8` | `#111111` |
| `cool-slate` | Cool Slate | `#E2E8F0` | `#0F172A` |
| `paper-white` | Paper White | `#F5F0E8` | `#111111` |

**Production default:** `warm-stone` (when no `localStorage` value is set).

To reset locally:

```js
localStorage.removeItem('palette');
localStorage.removeItem('theme');
location.reload();
```

## Should this ship?

**Yes — include in the repo.** Rationale:

- No product surface links to it; users won't stumble on it
- Contributors and designers need a stable preview surface
- Documents tokens better than screenshots alone
- Route cost is one lazy-free page + CSS; no backend

Do **not** add Style Lab to marketing nav, student bottom nav, or admin sidebar.

## For contributors

1. Run the app locally (`npm run dev`)
2. Open `http://localhost:5173/style-lab` (port may vary)
3. Toggle light/dark and switch palettes
4. Navigate to real pages (e.g. `/student/dashboard`) to confirm tokens in context
5. When approving a palette, set the default in `ThemeContext.tsx` (`readStoredPalette` fallback) and update [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) token table

## Related

- Design tokens: [`src/index.css`](../src/index.css)
- Progress bar track: `--progress-track` + `.progress-track` utility
- Toast preview: use Student Community copy-email flow or import `Toast` in Style Lab if needed later
