const CACHE_NAME = "blightsend-v3";
const ASSETS = [
  "/blightsend/",
  "/blightsend/index.html",
  "/blightsend/style.css",
  "/blightsend/script.js",
  "/blightsend/dist/bundle.js",
  "/blightsend/data/echoes.json",
  "/blightsend/data/weapons.json",
  "/blightsend/data/skills.json",
  "/blightsend/data/armor.json",
  "/blightsend/data/conditions.json",
  "/blightsend/manifest.json",
  "/blightsend/Icons/icon-192.png",
  "/blightsend/Icons/icon-512.png",
  "/blightsend/assets/BlightsEnd-Logo.png"
];

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
