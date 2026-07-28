const BASE = import.meta.env.BASE_URL || '/'

// Strips the Vite base path and leading/trailing slashes, returning
// '' for the root, 'forum' for /forum, 'installation' for /installation, etc.
export function pathToSegment(pathname) {
  let p = pathname
  if (BASE !== '/' && p.startsWith(BASE)) p = '/' + p.slice(BASE.length)
  return p.replace(/^\/+|\/+$/g, '')
}

// Turns a page/section id into a full URL path, respecting the Vite base.
export function segmentToPath(segment) {
  const clean = segment && segment !== 'docs' && segment !== 'overview' ? segment : ''
  return BASE.endsWith('/') ? BASE + clean : `${BASE}/${clean}`
}

export function pushPath(segment) {
  const path = segmentToPath(segment)
  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path)
  }
}
