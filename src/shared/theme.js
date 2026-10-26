// Light/dark theme. The choice lives in localStorage ('rns-theme'); without it the
// OS preference applies. index.html sets data-theme before first paint to avoid a flash.
const KEY = 'rns-theme'
const COLORS = { light: '#f3f4f1', dark: '#141615' }

export function getTheme() {
  const forced = document.documentElement.dataset.theme
  if (forced === 'light' || forced === 'dark') return forced
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme
  try { localStorage.setItem(KEY, theme) } catch { /* private mode: theme lasts for this page only */ }
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.content = COLORS[theme]
}
