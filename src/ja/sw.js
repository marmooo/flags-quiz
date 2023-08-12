var CACHE_NAME = "2023-08-12 20:25";
var urlsToCache = [
  "/flags-quiz/",
  "/flags-quiz/index.js",
  "/flags-quiz/ja/",
  "/flags-quiz/data/ja.csv",
  "/flags-quiz/mp3/incorrect1.mp3",
  "/flags-quiz/mp3/correct3.mp3",
  "/flags-quiz/favicon/favicon.svg",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/three@0.102.1/build/three.min.js",
  "https://cdn.jsdelivr.net/npm/giojs@2.2.2/build/gio.min.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
