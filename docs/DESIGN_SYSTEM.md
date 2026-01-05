# Design System Documentation

## 1. Overview
This document outlines the current design system used in the 10MS AI-GG Interactive Roadmap Interface. The project uses **Tailwind CSS** as the utility-first CSS framework and **Lucide React** for icons.

## 2. Colors
The application uses a semantic color system defined in `src/index.css` using CSS variables. This supports both light and dark modes.

### Semantic Tokens
| Token | Description | Light Value | Dark Value |
|-------|-------------|-------------|------------|
| `--background` | Page background | `#ffffff` | `#0a0a0a` |
| `--foreground` | Default text color | `#171717` | `#ededed` |
| `--card` | Card background | `#ffffff` | `#171717` |
| `--card-foreground` | Card text color | `#171717` | `#ededed` |
| `--popover` | Popover/Modal background | `#ffffff` | `#171717` |
| `--popover-foreground` | Popover text color | `#171717` | `#ededed` |
| `--primary` | Primary brand color | `#2563eb` (Blue-600) | `#3b82f6` (Blue-500) |
| `--primary-foreground` | Text on primary color | `#fafafa` | `#171717` |
| `--secondary` | Secondary background | `#f5f5f5` | `#262626` |
| `--secondary-foreground` | Text on secondary color | `#171717` | `#ededed` |
| `--muted` | Muted background | `#f5f5f5` | `#262626` |
| `--muted-foreground` | Muted text color | `#737373` | `#a3a3a3` |
| `--destructive` | Error/Destructive action | `#ef4444` | `#7f1d1d` |
| `--destructive-foreground` | Text on destructive color | `#fafafa` | `#ededed` |
| `--border` | Border color | `#e5e5e5` | `#262626` |
| `--input` | Input border color | `#e5e5e5` | `#262626` |
| `--ring` | Focus ring color | `#2563eb` | `#3b82f6` |

## 3. Typography
The project uses the system font stack for maximum performance and native feel.
- **Font Family**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`

## 4. Spacing & Layout
- **Border Radius**: Default radius is `0.5rem` (`8px`).
- **Container**: Standard Tailwind container classes are used.

## 5. Effects & Animations
### Shadows
- `.shadow-professional`: Soft, professional shadow for cards.
- `.shadow-professional-lg`: Larger shadow for elevated elements.

### Animations (CSS)
- `fade-in`: Opacity 0 -> 1, TranslateY 10px -> 0.
- `slide-in-left`: Opacity 0 -> 1, TranslateX -20px -> 0.
- `slide-in-right`: Opacity 0 -> 1, TranslateX 20px -> 0.
- `spin`: Standard loading spinner rotation.

## 6. Icons
- **Library**: `lucide-react`
- **Usage**: Consistent stroke width and size (usually `w-4 h-4` or `w-5 h-5`).
