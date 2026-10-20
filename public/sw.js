// Service worker: guarda la app y las respuestas de la API para usarlas sin internet
const CACHE = 'pokedex-v2'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html', './manifest.webmanifest'])))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  )
  self.clients.claim()
})

// Stale-while-revalidate: responde con lo guardado y actualiza en segundo plano
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request)
      const network = fetch(e.request)
        .then((res) => {
          if (res.ok || res.type === 'opaque') cache.put(e.request, res.clone())
          return res
        })
        .catch(() => cached || (e.request.mode === 'navigate' ? cache.match('./index.html') : undefined))
      return cached || network
    })
  )
})
