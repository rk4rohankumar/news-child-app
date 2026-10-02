# News · Micro Frontend remote

A webpack Module Federation remote (CRA 5 + CRACO 7, React 19, Tailwind 3, axios, framer-motion) that renders searchable, paginated headlines. It runs standalone and is consumed at runtime by the [Micro Frontend host](https://github.com/rk4rohankumar/micro-frontend-host).

## Data sources

No API key or `.env` is required — both APIs are public and CORS-friendly:

- Hacker News via Algolia — `https://hn.algolia.com/api/v1/search` (Top Stories, Tech, Ask HN, Show HN)
- Spaceflight News — `https://api.spaceflightnewsapi.net/v4/articles/` (Space & Science)

## Run / build

```bash
npm install
npm start          # dev server at http://localhost:3000
npm run build      # production bundle in build/
npx serve -s build -l 5106   # serve the production bundle locally
```

Deployed at <https://news-child-app.vercel.app/>.

## How the host consumes it

| Setting      | Value                                              |
| ------------ | -------------------------------------------------- |
| Scope name   | `NewsApp`                                          |
| Remote entry | `https://news-child-app.vercel.app/remoteEntry.js` |
| Exposed      | `./NewsApp` → `src/App`                            |

The host injects `remoteEntry.js`, calls `container.init(shareScope)` with its own share scope, then `container.get('./NewsApp')`. `src/index.js` is an async boundary (`import('./bootstrap')`) so shared modules are negotiated before anything renders.

`react`, `react-dom`, `framer-motion` and `axios` are declared as **singletons** (`requiredVersion` read from `package.json`), so the remote reuses the host's copies instead of bundling its own. In production `output.publicPath` is `'auto'`, so chunks resolve relative to wherever `remoteEntry.js` is served from.

The exposed component renders a `<section>` (not `<main>`); the standalone shell in `src/bootstrap.js` supplies the `<main>` landmark.
