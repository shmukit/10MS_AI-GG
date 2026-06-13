# Design System Documentation

> **Canonical source:** For the full 10MS design spec, see `docs/10ms-design-skill/DESIGN.md` (maintainer-local). This document describes what the app actually loads at runtime.

## 1. Overview

The 10MS SheSTEM AI-GG platform uses **Tailwind CSS v3** with **CSS custom properties** defined in [`src/index.css`](../src/index.css). Icons use **Lucide React**. Motion uses **Framer Motion** for feedback, not decoration.

**Preview the live system:** visit [`/style-lab`](./STYLE_LAB.md) (hidden route, not linked in nav). See [`docs/STYLE_LAB.md`](./STYLE_LAB.md) for maintainer documentation.

## 2. Design direction

- **Single accent:** 10MS green (`#1CAB55`) — primary CTAs, active states, focus rings only
- **Surfaces:** warm stone (light) / zinc noir (dark) — **production default palette**
- **Themes:** light/dark only (multi-color theme picker removed)
- **Palettes:** four neutral options switchable on Style Lab; persisted in `localStorage` key `palette`
- **Logos:** SheSTEM + 10 Minute School co-brand — never recolored

## 3. Semantic tokens

Defined in `src/index.css` (shared tokens), `src/styles/palettes.css` (neutral palette variants), and `.dark`:

| Token | Light (warm stone) | Dark (zinc noir) | Use |
|-------|--------------------|------------------|-----|
| `--background` | `#F5F5F4` | `#09090B` | Page canvas |
| `--foreground` | `#111827` | `#FAFAFA` | Primary text |
| `--card` | `#FFFFFF` | `#18181B` | Elevated cards on canvas |
| `--muted` | `#E7E5E4` | `#27272A` | Nested surfaces / chips |
| `--muted-foreground` | `#78716C` | `#A1A1AA` | Captions, metadata |
| `--border` | `#D6D3D1` | `#3F3F46` | Hairline borders |
| `--progress-track` | `#C4C0BA` | `#52525B` | Unfilled portion of progress bars |
| `--primary` | `#1CAB55` | `#1CAB55` | CTAs, active, focus |
| `--accent` | `#EAFEF2` | `#142019` | Active tint (sparingly) |
| `--destructive` | `#DC2626` | `#DC2626` | Errors only |
| `--ring` | `#1CAB55` | `#1CAB55` | Focus ring color |

Tailwind bridge: `bg-background`, `text-foreground`, `border-border`, `bg-primary`, etc.

## 4. Typography

- **English:** Inter (400–700), loaded in `index.css`
- **Bengali:** Anek Bangla via `.lang-bn`
- **Scale:** 15px card titles, 13px body, 11–12px labels

## 5. Components

Shared primitives in `src/components/ui/`:

- **Button** — pill radius, variants: default, secondary, outline, ghost, destructive
- **Card** — flat at rest, border only; hover lift + shadow
- **Skeleton** — `bg-muted` pulse
- **Toast** — semantic success/error; sits above mobile bottom nav (`bottom-20`)

## 6. Elevation

| Name | Use |
|------|-----|
| `shadow-nav` | Top navigation |
| `shadow-hover` | Card hover |
| `shadow-modal` | Modals, dropdowns |
| `shadow-tab-bar` | Mobile bottom nav |

Cards have **no shadow at rest** — border provides depth.

## 7. Dark mode

- Strategy: Tailwind `class` on `<html>` via `ThemeProvider`
- Toggle: headers, mobile menu, marketing nav
- Palette: calm neutral near-blacks, not blue-tinted zinc

## 8. Do's and don'ts

**Do:** neutral surfaces, one green accent, hairline borders, generous spacing  
**Don't:** neon borders, rainbow card colors, glassmorphism, gradient text, multi-accent theme pickers

## 9. Migration notes

- Legacy `docs/DASHBOARD_THEME_PRD.md` gradient themes are **retired**
- `docs/BEAUTIFICATION_PLAN.md` glassmorphism items are **superseded** by this system
- Prefer semantic Tailwind classes over inline hex or `isDarkMode ? ... : ...`
