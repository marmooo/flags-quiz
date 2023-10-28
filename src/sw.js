const CACHE_NAME = "2023-10-28 16:20";
const urlsToCache = [
  "/flags-quiz/",
  "/flags-quiz/index.js",
  "/flags-quiz/data/en.csv",
  "/flags-quiz/mp3/incorrect1.mp3",
  "/flags-quiz/mp3/correct3.mp3",
  "/flags-quiz/favicon/favicon.svg",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/three@0.102.1/build/three.min.js",
  "https://cdn.jsdelivr.net/npm/giojs@2.2.2/build/gio.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
