# Development Guide

This document is aimed at anyone (human or AI assistant) picking up development on the Ninja Blog site. Read this first.

---

## Context prompt (paste this into an AI when asking for help)

> This repo is **Ninja Blog**, a small portfolio site deployed to GitHub Pages. It's a Vite + React + React Router SPA. All project content is data-driven from a single JSON file at [public/projects.json](public/projects.json) — adding a new project means appending one object to that array, never creating new component files or routes. Each project gets its own page at `/project/<slug>`, where the slug is derived from the project's `title` (lowercased, non-alphanumerics collapsed to `-`). Clean URLs work on GitHub Pages via the [rafgraph/spa-github-pages](https://github.com/rafgraph/spa-github-pages) 404.html redirect trick (see [public/404.html](public/404.html) and the restore snippet in [index.html](index.html)). The build runs on GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) and passes `VITE_BASE=/<repo>/` so paths resolve under project-pages URLs. Only `title` is required in a project object; `summary`, `live`, `repo`, `images`, and `slug` are optional and conditionally render. Keep it that way — don't add required fields without good reason.

---

## Project goals & philosophy

1. **JSON-driven.** Adding a project should require editing only [public/projects.json](public/projects.json). Do not scatter project-specific logic into components.
2. **Zero runtime backend.** GitHub Pages is static-only. No APIs, no databases, no server-rendering.
3. **Low ceremony.** Prefer plain React over state libraries, routing libraries over custom routers, CSS over CSS-in-JS.
4. **Title drives the URL.** The last path segment is literally the project title slug.
5. **Graceful optionality.** Everything except `title` is optional on a project. Rendering code must handle `undefined` without blowing up.

---

## Architecture at a glance

```
index.html              Vite entry; contains SPA-restore snippet
public/
  404.html              SPA fallback: captures deep links and redirects to index.html
  projects.json         Project data (the only file that changes when adding projects)
src/
  main.jsx              Boots React + BrowserRouter with basename from import.meta.env.BASE_URL
  App.jsx               Route table + site chrome (header/footer)
  routes/
    Home.jsx            Project grid
    Project.jsx         Per-project detail page, reads :slug from the URL
    NotFound.jsx
  components/
    ProjectTile.jsx     Homepage tile
  lib/
    projects.js         slugify(), projectSlug(), loadProjects()
  hooks/
    useProjects.js      useProjects() → { projects, error }
  styles.css            Global dark theme
.github/workflows/
  deploy.yml            Build + deploy to GitHub Pages on push to main
vite.config.js          `base` comes from VITE_BASE env var (set by CI)
```

### Data flow
1. A route mounts → `useProjects()` runs once → fetches `${BASE_URL}projects.json`.
2. Components slug each project via `projectSlug(project)` to match against `useParams().slug`.
3. React Router renders the right view.

### URL flow (the interesting bit)
- **Direct hit on `/project/foo`:** GitHub Pages can't find that file → serves [public/404.html](public/404.html) → its script rewrites the URL to `/?/project/foo` and reloads `index.html` → the snippet in [index.html](index.html) runs `history.replaceState` to restore `/project/foo` → React Router picks it up.
- **Client-side navigation:** React Router handles it directly, no redirect round-trip.
- **`pathSegmentsToKeep`** in 404.html must be `1` for project-pages deploys (`user.github.io/<repo>/`) and `0` for user/org root sites (`user.github.io/`).

---

## Adding a project

Append to [public/projects.json](public/projects.json):

```json
{
  "title": "My Project",         // required; drives the URL slug
  "summary": "What it does.",    // optional
  "live": "https://...",         // optional
  "repo": "https://github.com/...", // optional
  "images": ["https://..."],     // optional; first image used as tile thumbnail
  "slug": "custom-slug"          // optional; overrides title-derived slug
}
```

That's it. No code changes.

### Using local images instead of hotlinks
Drop files under `public/img/foo.png` and reference them as `"/img/foo.png"` (Vite's base handling prefixes them correctly at build time — actually, **use the absolute-from-base form** `import.meta.env.BASE_URL + 'img/foo.png'` only in JS; in JSON just use `/img/foo.png` and it'll be rewritten correctly if you want portability — easier path: use full URLs or paths under `public/` and test both locally and on the deployed site).

---

## Commands

```bash
npm install            # first time
npm run dev            # local dev server on :5173
npm run build          # outputs dist/
npm run preview        # serve dist/ for a final smoke test
```

To preview the project-pages base path locally:

```bash
VITE_BASE=/Ninja-Blog/ npm run build && npm run preview
```

---

## Deployment

Push to `main`. GitHub Actions builds and publishes.

One-time repo setup: **Settings → Pages → Source: GitHub Actions**.

The workflow passes `VITE_BASE=/${{ github.event.repository.name }}/` automatically. If you rename the repo, nothing else needs to change.

---

## Gotchas & things not to break

- **Don't remove [public/404.html](public/404.html).** Deep links break without it.
- **Don't change `basename` handling in [src/main.jsx](src/main.jsx).** It reads from `import.meta.env.BASE_URL` — which is what makes the same bundle work at `/` locally and at `/<repo>/` on Pages.
- **Don't add required fields to the project schema without updating `loadProjects()`'s filter and every render site.** The current contract is "only `title` is required."
- **Don't introduce a backend.** Static host only.
- **Don't hash-route.** We chose clean paths intentionally.
- **Thumbnail URLs in placeholder data** point at `via.placeholder.com`. Replace before showing the site to anyone.

---

## Opinions on extending this

- **More metadata per project** (tech tags, date, collaborators): add as optional fields in the JSON. Render as small chips on the tile and detail page. Don't make them required.
- **Markdown summaries**: if a project needs more than a sentence, consider a `body` field containing Markdown and rendering it with `react-markdown`. Keep it optional.
- **Search/filter**: client-side filter on the tiles list is cheap; no infra needed.
- **RSS/sitemap**: a build-time script that reads `public/projects.json` and emits `public/sitemap.xml` / `rss.xml` would be a clean addition.
- **Custom domain**: add `public/CNAME` with your domain and set `base: '/'` in [vite.config.js](vite.config.js) (also set `pathSegmentsToKeep = 0` in [public/404.html](public/404.html)).

---

## When something breaks

- **Blank page on the deployed site, assets 404:** `VITE_BASE` didn't match the actual Pages path. Check the workflow run and the repo name.
- **Deep-link to `/project/foo` shows GitHub's 404 page:** [public/404.html](public/404.html) wasn't deployed, or `pathSegmentsToKeep` is wrong.
- **`projects.json` 404:** the fetch URL in [src/lib/projects.js](src/lib/projects.js) must use `import.meta.env.BASE_URL` — don't hardcode `/projects.json`.
- **Routes don't match after the SPA redirect:** the restore snippet in [index.html](index.html) must run *before* the module script that loads React.
