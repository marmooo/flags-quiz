const cacheName = "2026-01-14 00:00";
const urlsToCache = [
  "/flags-quiz/index.js",
  "/flags-quiz/data/en.csv",
  "/flags-quiz/mp3/incorrect1.mp3",
  "/flags-quiz/mp3/correct3.mp3",
  "/flags-quiz/favicon/favicon.svg",
  "https://cdn.jsdelivr.net/npm/three@0.102.1/build/three.min.js",
  "https://cdn.jsdelivr.net/npm/giojs@2.2.2/build/gio.min.js",
];

async function preCache() {
  const cache = await caches.open(cacheName);
  await Promise.all(
    urlsToCache.map((url) =>
      cache.add(url).catch((err) => console.warn("Failed to cache", url, err))
    ),
  );
  self.skipWaiting();
}

async function handleFetch(event) {
  const cached = await caches.match(event.request);
  return cached || fetch(event.request);
}

async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((name) => name !== cacheName ? caches.delete(name) : null),
  );
  self.clients.claim();
}

self.addEventListener("install", (event) => {
  event.waitUntil(preCache());
});
self.addEventListener("fetch", (event) => {
  event.respondWith(handleFetch(event));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(cleanOldCaches());
});
