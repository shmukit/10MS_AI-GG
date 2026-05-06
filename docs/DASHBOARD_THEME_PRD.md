# PRD: Dashboard Color Theme & Gradient Standardization

## 1. Overview
This document defines the requirements for standardizing the color themes and gradient applications across the Student Dashboard. The goal is to ensure a consistent, premium, and theme-aware visual experience for users.

## 2. Objectives
- Establish a consistent set of color themes (Cherryblossoms, Shroom Haze, Flare).
- Define specific gradient values for each theme.
- Specify how and where these gradients should be applied within the dashboard UI (specifically on containers).
- Ensure "Glassmorphism" or "Soft Gradient" aesthetics are strictly followed, avoiding solid, flat colors for primary containers.

## 3. Theme Specifications

### 3.1. Themes & Color Palettes

The system supports the following themes. Each theme must define a primary accent color and a primary gradient.

| Theme Name | Primary Accent | Gradient Start | Gradient End | CSS Variable Output (`--primary-gradient`) |
| :--- | :--- | :--- | :--- | :--- |
| **Cherryblossoms** | `#BB377D` | `#FBD3E9` | `#BB377D` | `linear-gradient(135deg, #FBD3E9 0%, #BB377D 100%)` |
| **Shroom Haze** | `#5C258D` | `#5C258D` | `#4389A2` | `linear-gradient(135deg, #5C258D 0%, #4389A2 100%)` |
| **Flare** | `#f12711` | `#f12711` | `#f5af19` | `linear-gradient(135deg, #f12711 0%, #f5af19 100%)` |

*(Note: Default Blue theme follows the existing `#3b82f6` to `#2563eb` gradient)*

### 3.2. Technical Implementation
- **CSS Variables**: Themes must be controlled via CSS variables defined in a global stylesheet (e.g., `themes.css`).
- **Variable Names**:
    - `--primary-accent`: The main solid color for text/borders/icons.
    - `--primary-gradient`: The linear gradient used for backgrounds.
    - `--accent-soft`: A low-opacity version of the accent color (used for secondary backgrounds, *to be distinguished from the main container gradient*).

## 4. UI Application Guidelines

### 4.1. Dashboard Containers
The following high-level containers on the dashboard **MUST** use the Gradient Background (`--primary-gradient`) to distinguish them as primary sections:

1.  **Practice & Micro-learning**: The card containing the practice deck list.
2.  **Week Streaks**: The section displaying weekly activity streaks.
3.  **Your Progress**: The gamification stats card showing Rank and XP.
4.  **Leaderboard**: The card displaying student rankings.
5.  **Upcoming Sessions**: The live sessions list card.
6.  **Mentors**: The profile card for assigned mentors.
7.  **Tasks**: Both "Current Level Tasks" and "Upcoming Tasks" containers.

### 4.2. Component Isolation
- **Containers ONLY**: The gradient background should apply *only* to the container card itself.
- **Inner Components**: Buttons, icons, text, and other interactive elements inside these containers should *not* change their intrinsic color logic unless specifically designed to contrast with the gradient. They should generally comfortably sit on top of the gradient background.

## 5. User Story
> As a student, I want my dashboard to reflect my chosen color theme (e.g., Cherryblossoms) with rich gradient backgrounds on the main content blocks, so that the interface feels personalized, modern, and engaging.

## 6. Acceptance Criteria
- [ ] Switching between themes updates the CSS variables immediately.
- [ ] The defined containers (Section 4.1) display the correct gradient background.
- [ ] Inner content remains legible and accessible against the gradient background.
- [ ] No regression in layout or spacing when gradients are applied.
