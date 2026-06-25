# dev-desktop

A macOS-inspired desktop environment built in the browser as a developer portfolio. Simulates an Ubuntu GNOME desktop with draggable windows, a dock, system tray, and an interactive terminal — all rendered in React.

**[Live demo](https://t91a60.github.io/NikodemBoryczka/)**

## Features

**Desktop metaphor** — the browser becomes a full Ubuntu-like desktop with a top bar (clock, wifi, volume, battery, user menu), a dock with app launchers, and desktop-sidebar shortcuts. Windows can be dragged, resized, minimized to the dock, maximized, and closed — just like a real OS.

**Interactive terminal** — a simulated Ubuntu terminal with a boot sequence, ANSI color parsing, and real commands (`help`, `neofetch`, `ls`, `whoami`, `date`, `echo`, `clear`, `history`, `projects`, `about`, `contact`). Arrow keys navigate command history. The neofetch output shows a stylized system information panel with persistent session values.

**Project showcase** — a sidebar-driven project browser with individual color-coded entries (OSP Logbook, AlkoRater, Gather, UPM Ultras). Each project shows a description, tech stack badges, highlights, and a link to its GitHub repository.

**About section** — styled as a system information panel with user specs, a dev stack tag cloud, and staggered entrance animations.

**PWA support** — installable as a standalone app with a service worker, manifest, and offline-ready shell.

**Accessibility** — keyboard shortcuts (Cmd+1/2/3 to switch windows, Cmd+W or Escape to close), skip-navigation link, ARIA labels, focus-visible outlines, reduced-motion support, and semantic roles on interactive widgets.

**Responsive** — adapts to mobile viewports by collapsing the sidebar, adjusting the top bar, and enabling vertical scrolling. Touch-friendly on small screens.

## Tech Stack

**Framework** — React 19 with Vite 8, lazy-loaded route components via `React.lazy` and `Suspense`.

**Animation** — Motion (formerly Framer Motion) for window transitions, drag, and staggered entrance effects.

**Styling** — Tailwind CSS v4 with a custom Ubuntu-inspired design token set (dark theme, `#E95420` accent, purple/magenta undertones, Ubuntu font family).

**Icons** — Phosphor Icons (Terminal, Folder, User, GithubLogo, and system tray icons).

**Deployment** — GitHub Pages via GitHub Actions workflow.

## Project Structure

```
src/
├── App.jsx                     — Root layout, window manager, keyboard shortcuts
├── index.css                   — Design tokens, global styles, responsive breakpoints
├── main.jsx                    — Entry point
├── components/
│   ├── Window.jsx              — Draggable, resizable, minimizable/maximizable window chrome
│   ├── Terminal.jsx            — Simulated Ubuntu terminal with ANSI parsing
│   ├── ProjectWindow.jsx       — Project gallery with sidebar and detail view
│   ├── AboutWindow.jsx         — System-info styled about panel
│   ├── TopBar.jsx              — Clock, system tray, popup menus
│   ├── Dock.jsx                — Application dock with minimize indicators
│   └── ErrorBoundary.jsx       — Per-window React error boundary
├── lib/
│   └── ansi.js                 — ANSI escape code parser (colors, bold)
└── data/
    └── projects.js             — Project metadata and highlights
public/
├── 404.html                    — SPA redirect for GitHub Pages
├── manifest.json               — PWA manifest
├── favicon.svg
├── og-image.svg                — Open Graph preview image
└── icon-{192,512}.svg          — PWA app icons
```

## Getting Started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build

```bash
npm run build
```

Output goes to `dist/`. Use `npm run preview` to test the production build locally.

## Deployment

Push to `main` — the GitHub Actions workflow at `.github/workflows/deploy.yml` builds the project and deploys to GitHub Pages automatically.

The site is served from the `t91a60.github.io` domain under the `/NikodemBoryczka/` path. The `base` in `vite.config.js` and the `404.html` redirect are configured accordingly.
