# Socrates

## Development
- Install dependencies: `npm install`
- Run locally: `npm run dev`
- Lint: `npm run lint`
- Test: `npm run test`
- Build: `npm run build`

## GitHub Pages routing
- The app uses `BrowserRouter` with `basename={import.meta.env.BASE_URL}` so routes work when deployed under the repository path.
- `vite build` now copies `dist/index.html` to `dist/404.html`, allowing GitHub Pages to serve the SPA for deep links instead of returning an HTTP 404.
