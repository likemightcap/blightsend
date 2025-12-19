const CACHE_NAME = "blightsend-v3";

function getSiteRoot() {
  const path = self.location.pathname || '/';
  const match = path.match(/^\/(.+?)\//);
  return match ? `/${match[1]}/` : '/';
}

const ASSETS = (function () {
  const root = getSiteRoot();
  return [
    root,
    root + 'index.html',
    root + 'style.css',
    root + 'script.js',
    root + 'dist/bundle.js',
    root + 'data/echoes.json',
    root + 'data/weapons.json',
    root + 'data/skills.json',
    root + 'data/armor.json',
    root + 'data/conditions.json',
    root + 'manifest.json',
    root + 'Icons/icon-192.png',
    root + 'Icons/icon-512.png',
    root + 'assets/BlightsEnd-Logo.png'
  ];
})();

self.addEventListener("install", (event) => {
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
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
