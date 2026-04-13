// Project data helpers. The JSON lives in public/projects.json so it's
// served as a static asset and can be edited without touching code.

export function slugify(title) {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function projectSlug(project) {
  return slugify(project.slug || project.title);
}

export function projectImageUrl(src) {
  const value = String(src || '').trim();
  if (!value) return '';
  // Keep absolute/data/blob URLs untouched.
  if (/^(?:[a-z]+:)?\/\//i.test(value) || /^(data|blob):/i.test(value)) {
    return value;
  }

  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = value.replace(/^\/+/, '');
  return `${normalizedBase}${normalizedPath}`;
}

export function isVideo(src) {
  const value = String(src || '').trim();
  if (!value) return false;
  return /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(value);
}

export async function loadProjects() {
  // Respect Vite's base URL so this works both locally and under
  // user.github.io/<repo>/.
  const url = `${import.meta.env.BASE_URL}projects.json`;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load projects.json (${res.status})`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('projects.json must be a JSON array');
  // `title` is the only required field.
  return data.filter((p) => p && p.title);
}
