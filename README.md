# David N. Allen

Personal site for [David N. Allen](https://www.davidnallen.com), a senior front-end engineer in Lakewood, CO. The app is Next.js 14 and React 18. `next.config.js` sets `output: 'export'`, so a production build is a static site in `out/`.

Requires Node.js 18.17 or later.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Upload the `out/` folder to static hosting. `npm run lint` runs the Next.js linter.

`node_modules`, `.next`, and `out` are gitignored. Generate `out/` locally. Do not commit it.

## Where things live

| Path | What it is |
| --- | --- |
| `src/app` | Pages and UI. Routes include `/`, `/projects`, `/history`, `/contact`, `/system`, and `/onepage`. |
| `src/data` | Site copy, menu, projects, and posts. Name and navigation are in `src/data/app.json`. |
| `src/design/tokens.js` | Design tokens used by the system page. |
| `public` | Images, resumes, campaign iframes, and `public/js/sheet-post.js`. |

Contact forms post through `public/js/sheet-post.js`. That file holds the Google Apps Script URL and a shared secret in plain text, the same values the live site already sends to the browser.
