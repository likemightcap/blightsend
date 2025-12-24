const CACHE_NAME = "blightsend-v4";

function getSiteRoot() {
  const path = self.location.pathname || '/';
  const match = path.match(/^\/(.+?)\//);
  return match ? `/${match[1]}/` : '/';
}

// Precache commonly used assets so the app can run fully offline when installed
const ASSETS = (function () {
  const root = getSiteRoot();
  return [
    root,
    root + 'index.html',
    root + 'compendium.html',
    root + 'character.html',
    root + 'offline.html',
    root + 'style.css',
    root + 'script.js',
    root + 'dist/bundle.js',
    // data files used by the app
    root + 'data/echoes.json',
    root + 'data/weapons.json',
    root + 'data/skills.json',
    root + 'data/armor.json',
    root + 'data/conditions.json',
    root + 'manifest.json',

    // icons
    root + 'Icons/icon-192.png',
    root + 'Icons/icon-512.png',
    root + 'Icons/coin-icon.png',
    root + 'Icons/compendium-icon.png',
    root + 'Icons/edit-icon.png',
    root + 'Icons/fight-icon.png',
    root + 'Icons/focus-icon.png',
    root + 'Icons/grit-icon.png',
    root + 'Icons/guts-icon.png',
    root + 'Icons/load-icon.png',
    root + 'Icons/save-icon.png',
    root + 'Icons/volley-icon.png',

    // key images & avatars
    root + 'assets/BlightsEnd-Logo.png',
    root + 'assets/armor-avatar.png',
    root + 'assets/weapon-battle-axe.png',
    root + 'assets/weapon-heavy-crossbow.png',
    root + 'assets/weapon-long-sword.png',
    root + 'assets/avatars/armor-avatar2.png',

    // local fonts used by the site
    root + 'assets/fonts/cinzel-v26-latin-regular.woff2',
    root + 'assets/fonts/cinzel-v26-latin-600.woff2',
    root + 'assets/fonts/cinzel-v26-latin-900.woff2'
  ];
})();

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))).then(() => self.clients.claim())
    )
  );
});

// Simple runtime cache for resources not precached + navigation fallback to offline page
self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Only handle GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const root = getSiteRoot();

  // Navigation requests -> serve index.html when available, otherwise offline.html
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      caches.match(root + 'index.html').then((cached) => cached || fetch(req).then((res) => res).catch(() => caches.match(root + 'offline.html')))
    );
    return;
  }

  // For other requests, try cache first, then network with runtime caching, then a sensible fallback
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((networkResponse) => {
        // Cache a copy for future offline use (best-effort)
        caches.open(CACHE_NAME).then((cache) => {
          try { cache.put(req, networkResponse.clone()); } catch (e) { /* ignore opaque put failures */ }
        });
        return networkResponse;
      }).catch(() => {
        // If request is for an image, return a small app logo as a fallback if available
        if (req.destination === 'image') return caches.match(root + 'assets/BlightsEnd-Logo.png');
        // otherwise let the browser show its own error
        return undefined;
      });
    })
  );
});
