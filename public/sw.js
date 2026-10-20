// Service worker: guarda la app y las respuestas de la API para usarlas sin internet
const CACHE = 'pokedex-v3'

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

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return

  // La página: primero internet (para ver siempre la última versión), si no hay, la guardada
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put('./index.html', copy))
          return res
        })
        .catch(() => caches.match('./index.html'))
    )
    return
  }

  // Lo demás: stale-while-revalidate (responde con lo guardado y actualiza en segundo plano)
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
