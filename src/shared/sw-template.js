/* Service worker template; vite.config.js fills in the placeholders at build time. */
const VERSION = __VERSION__
const BASE = __BASE__
const PRECACHE = __PRECACHE__
const CACHE = `rns-${VERSION}`
const PDF_CACHE = 'rns-pdf'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE.map((p) => BASE + p)))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('rns-') && k !== CACHE && k !== PDF_CACHE).map((k) => caches.delete(k)),
      ))
      .then(() => self.clients.claim()),
  )
})

function pageKey(url) {
  // /rns/zapocet, /rns/zapocet/index.html -> /rns/zapocet/
  let path = url.pathname.replace(/index\.html$/, '')
  if (!path.endsWith('/')) path += '/'
  return path
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  const key = pageKey(new URL(request.url))
  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000))
    const response = await Promise.race([fetch(request), timeout])
    if (response.ok) cache.put(key, response.clone())
    return response
  } catch {
    return (await cache.match(key)) || (await cache.match(BASE)) || Response.error()
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)
  if (hit) return hit
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
  } else if (url.pathname.endsWith('.pdf')) {
    event.respondWith(cacheFirst(request, PDF_CACHE))
  } else {
    event.respondWith(cacheFirst(request, CACHE))
  }
})
