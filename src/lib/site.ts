/// <reference types="vite/client" />

/**
 * Base-path-aware links. The app is deployed as a GitHub Pages *project*
 * site under `/password-generator/`, so root-relative hrefs like `/about`
 * would 404 in production. Always build internal links with this helper.
 *
 * In dev `import.meta.env.BASE_URL` is `/`; in the production build it is
 * `/password-generator/`.
 */
const RAW_BASE: string = import.meta.env.BASE_URL ?? '/';
const BASE = RAW_BASE.endsWith('/') ? RAW_BASE : `${RAW_BASE}/`;

/** Join the deploy base path with a page path, e.g. link('about'). */
export function link(path: string): string {
  const clean = path.replace(/^\/+/, '');
  return clean === '' ? BASE : `${BASE}${clean}`;
}

/** The deploy base path itself (ends with `/`). */
export function basePath(): string {
  return BASE;
}
