# Ninja Blog

Portfolio / blog site for the Ninja Blog crew. Built with Vite + React + React Router, deployed to GitHub Pages.

> **Working on this repo?** Start with [DEVELOPMENT.md](DEVELOPMENT.md) — it covers the architecture, conventions, and gotchas, and includes a paste-ready context prompt for AI assistants.

## Adding a project

Edit [public/projects.json](public/projects.json) and append an object to the array. Only `title` is required.

```json
{
  "title": "My Project",
  "tileSummary": "Short description for the tile.",
  "text": [
    {
      "title": "Summary",
      "paragraphs": [
        "A short opening paragraph.",
        "A supporting paragraph with more context."
      ]
    },
    {
      "title": "Challenges",
      "paragraphs": ["One or more challenge paragraphs."]
    }
  ],
  "tileImage": "images/my-thumb.png",
  "supportingImages": ["images/shot1.png", "images/shot2.png"],
  "live": "https://example.com",
  "repo": "https://github.com/you/repo",
  "slug": "optional-override"
}
```

- `title` — required. Also drives the URL slug (lowercased, non-alphanumerics become `-`).
- `tileSummary` — optional short text shown on the home tile.
- `text` — recommended. An array of section objects each with `title` and `paragraphs` (an array of strings) used to render headers and paragraph breaks on the project page.
- `longSummary` — legacy: optional detailed text shown on the project page (the app still falls back to this if `text` is absent).
- `tileImage` — optional image shown on the home tile.
- `supportingImages` — optional gallery images shown on the project page.
- `summary` — optional legacy fallback used when `tileSummary`/`longSummary` are not provided.
- `images` — optional legacy fallback for `supportingImages` (and tile thumbnail when `tileImage` is absent).
- `slug` — optional explicit override.
- Everything else is optional and is hidden when absent.

## Project data schema (note)

The site now supports a structured `text` field for richer project pages. `text` is an array of section objects with a `title` and a `paragraphs` array. Example:

```json
"text": [
  {
    "title": "Summary",
    "paragraphs": [
      "First paragraph.",
      "Second paragraph."
    ]
  },
  {
    "title": "Challenges",
    "paragraphs": ["Challenge 1", "Challenge 2"]
  }
]
```

This format gives per-paragraph control (rendering, truncation, animations) and keeps sections (headers) alongside their paragraphs. The project page component (`src/routes/Project.jsx`) is updated to render `text` when present and will fall back to legacy `longSummary`/`challenges` fields for compatibility.

If you want home tiles to pull a short description from the new schema, update `src/components/ProjectTile.jsx` to use the first paragraph of `project.text[0].paragraphs[0]` or keep using `tileSummary`.

The project page lives at `/project/<slug>` — the slug (derived from the title) is literally the end of the URL.

## Running locally

```bash
npm install
npm run dev
```

Vite serves the app at http://localhost:5173.

## Building

```bash
npm run build     # outputs to dist/
npm run preview   # serves dist/ for a final check
```

## Deploying

Push to `main`. The [deploy workflow](.github/workflows/deploy.yml) builds the site and publishes it to GitHub Pages.

One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.

### URL base

The workflow passes `VITE_BASE=/<repo-name>/` at build time so assets resolve under `user.github.io/<repo>/`. If you deploy to a user/org root site (`user.github.io/`), edit [vite.config.js](vite.config.js) to use `base: '/'` and change `pathSegmentsToKeep` in [public/404.html](public/404.html) from `1` to `0`.

## How the clean URLs work

GitHub Pages is a static host, so client-side routes like `/project/my-project-title` need a fallback. [public/404.html](public/404.html) captures unknown paths, encodes them as a query string, and redirects to `index.html`, which restores the real path before React Router boots (the [rafgraph/spa-github-pages](https://github.com/rafgraph/spa-github-pages) trick).

## Structure

- [public/projects.json](public/projects.json) — project data (the only file you edit to add projects)
- [public/404.html](public/404.html) — SPA fallback for direct hits on project URLs
- [index.html](index.html) — Vite entry, includes the SPA restore snippet
- [src/main.jsx](src/main.jsx) — boots React + Router
- [src/App.jsx](src/App.jsx) — route table + chrome
- [src/routes/Home.jsx](src/routes/Home.jsx) — project grid
- [src/routes/Project.jsx](src/routes/Project.jsx) — per-project page
- [src/components/ProjectTile.jsx](src/components/ProjectTile.jsx)
- [src/lib/projects.js](src/lib/projects.js) — slug helpers + JSON loader
- [src/hooks/useProjects.js](src/hooks/useProjects.js)
- [src/styles.css](src/styles.css)
