const CACHE_NAME = "blightsend-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./compendium.html",
  "./character.html",
  "./offline.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./Icons/icon-192.png",
  "./Icons/icon-512.png",
  "./assets/BlightsEnd-Logo.png"
];

self.addEventListener("install", (event) => {
  // Activate new service worker as soon as it's finished installing
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  // Claim any clients immediately so the SW starts controlling pages
  self.clients.claim();
});

// A resilient fetch handler: try cache first, then network, then offline fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((networkResponse) => {
          // Optionally cache new GET requests
          if (event.request.method === 'GET' && networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match('./offline.html'));
    })
  );
});
