# Nikodem Boryczka / Dev Desktop

My portfolio as an Ubuntu-style desktop in the browser. Open a window to browse projects, read about me, or use the simulated terminal.

[Open the portfolio](https://t91a60.github.io/NikodemBoryczka/) · [Report a bug](https://github.com/t91a60/NikodemBoryczka/issues)

## Using the desktop

Launch Terminal, Projects, or About from the dock. On desktop, drag windows by their title bars, resize them from the edges, or use Activities to find an app. On smaller screens, windows fill the workspace above the dock.

In the terminal, start with `help`. Try `projects`, `about`, `contact`, or `neofetch`. Arrow keys recall previous commands; Tab completes a suggestion when one is available.

This is a simulation, not a remote machine. Terminal commands run in the browser, and the Wi-Fi and battery displays show simulated status.

| Shortcut | Action |
| --- | --- |
| Ctrl/Cmd + 1, 2, or 3 | Select Terminal, Projects, or About |
| Ctrl/Cmd + W | Close the active window |
| Escape | Dismiss an open menu or dialog, or close the active window |
| Alt + arrow keys | Move a window while its title bar is focused |
| Shift + F10 | Open the context menu while the desktop is focused |

Reduced motion, reduced transparency, and increased contrast follow browser preferences. Window controls have larger touch targets, and modal dialogs contain keyboard focus until dismissed.

## Run locally

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The app uses the `/NikodemBoryczka/` base path.

```sh
npm run build
npm run preview
```

The production build is written to `dist/`.

## Development

Built with React 19, Vite 8, Tailwind CSS 4, Motion, and Phosphor Icons.

- [`src/App.jsx`](src/App.jsx) manages windows and desktop shortcuts.
- [`src/components/`](src/components/) contains the apps, window controls, dock, and system menus.
- [`src/data/projects.js`](src/data/projects.js) holds project descriptions and repository links.
- [`src/data/commands.js`](src/data/commands.js) defines terminal commands and boot output.
- [`src/index.css`](src/index.css) contains the theme and responsive layouts.

Run the checks before submitting changes:

```sh
npm run lint
npm test
```

## Deployment

The [GitHub Actions workflow](.github/workflows/deploy.yml) builds and deploys to GitHub Pages on pushes to `main`. It can also be triggered manually.

The base path is configured in [`vite.config.js`](vite.config.js).

## License

No license is included. Contact the repository owner for permission to reuse the code or assets.
