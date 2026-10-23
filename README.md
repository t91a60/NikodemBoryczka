# NikodemBoryczka: Dev Desktop

An interactive developer portfolio built as an Ubuntu desktop-inspired experience in the browser. It combines draggable windows, a dock, system tray, project browser, and simulated terminal in a React application.

[Live demo](https://t91a60.github.io/NikodemBoryczka/) · [Report an issue](https://github.com/t91a60/NikodemBoryczka/issues)

## Status

Alpha, assessed on 2026-10-23. Local lint and build passed. There is no automated test script; deployment CI only builds the site. The audit did not test browser interactions, mobile behavior or accessibility.

## Limitations

- This is a browser portfolio, not an operating system or shell. Terminal output, hardware statistics and system controls are simulated; they do not manage the host machine.
- Some public copy still uses the title "AI Developer & Software Engineer" (`src/data/commands.js`); the author is a technical-school pupil at TEB Edukacja Tychy, training as a programmer with an AI specialization. Source/UI copy was not modified in this documentation audit.
- The simulated terminal contains an outdated AlkoRater repository URL. Use the links on the GitHub profile until that source-data issue is corrected separately.

## Implemented interface

The desktop has a top bar, dock and shortcuts. Windows can be dragged, resized, minimized, maximized and closed within the page.

The simulated terminal handles `help`, `neofetch`, `ls`, `whoami`, `date`, `echo`, `clear`, `history`, `projects`, `about` and `contact`. It parses ANSI colors and supports command history with the arrow keys. Its boot sequence and hardware information are simulated.

The project browser lists OSP Logbook, AlkoRater, Gather and UPM Ultras with descriptions, technologies and repository links. The About window shows author information.

The repository includes a manifest, icons, Open Graph metadata, a canonical URL, `robots.txt`, a sitemap and a GitHub Pages fallback page.

The code includes keyboard shortcuts (`Ctrl`/`Cmd` + `1` to `3` to focus windows, `Ctrl`/`Cmd` + `W` or `Escape` to close), a skip link, ARIA labels, focus indicators and reduced-motion styles. These controls were not exercised in the audit.

Mobile layouts collapse the sidebar, adjust the top bar and allow vertical scrolling. Touch behavior still needs device testing.

## Tech Stack

- React 19 and Vite 8; window components load through `React.lazy` and `Suspense`.
- Motion for drag and window transitions.
- Tailwind CSS v4 and Ubuntu-inspired styles.
- Phosphor Icons.
- GitHub Pages deployment through GitHub Actions.

## Project Structure

```
src/
├── App.jsx                       Root layout, window manager, keyboard shortcuts
├── index.css                     Design tokens, global styles, responsive breakpoints
├── main.jsx                      Entry point
├── components/
│   ├── Window.jsx                Drag, resize, minimize and maximize
│   ├── Terminal.jsx              Simulated terminal with ANSI parsing
│   ├── ProjectWindow.jsx         Project gallery with sidebar and detail view
│   ├── AboutWindow.jsx           Author information
│   ├── TopBar.jsx                Clock, system tray, popup menus
│   ├── Dock.jsx                  Application dock with minimize indicators
│   └── ErrorBoundary.jsx         Per-window React error boundary
├── lib/
│   └── ansi.js                   ANSI escape code parser (colors, bold)
└── data/
    └── projects.js               Project metadata and highlights
public/
├── 404.html                      SPA redirect for GitHub Pages
├── manifest.json                 PWA manifest
├── favicon.svg
├── og-image.svg                  Open Graph preview image
└── icon-{192,512}.svg             PWA app icons
```

## Getting Started

```bash
npm ci
npm run dev
```

Opens at `http://localhost:5173`.

## Build

```bash
npm run build
npm run lint
```

Output goes to `dist/`. Use `npm run preview` to test the production build locally.

## Deployment

On a push to `main`, `.github/workflows/deploy.yml` builds the project and deploys it to GitHub Pages.

The site is served from the `t91a60.github.io` domain under the `/NikodemBoryczka/` path. The `base` in `vite.config.js` and the `404.html` redirect are configured accordingly.

## License

This repository does not currently include a license file. Contact the repository owner before reusing the code or visual assets outside the project.
