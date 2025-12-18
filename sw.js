const CACHE_NAME = "blightsend-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./compendium.html",
  "./character.html",
  "./style.css",
  "./script.js",
  "./data/echoes.json",
  "./data/weapons.json",
  "./data/skills.json",
  "./data/armor.json",
  "./data/conditions.json",
  "./manifest.json",
  "./Icons/icon-192.png",
  "./Icons/icon-512.png",
  "./assets/BlightsEnd-Logo.png"
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
