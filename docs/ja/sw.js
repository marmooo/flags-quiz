var CACHE_NAME="2023-08-12 20:25",urlsToCache=["/flags-quiz/","/flags-quiz/index.js","/flags-quiz/ja/","/flags-quiz/data/ja.csv","/flags-quiz/mp3/incorrect1.mp3","/flags-quiz/mp3/correct3.mp3","/flags-quiz/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js","https://cdn.jsdelivr.net/npm/three@0.102.1/build/three.min.js","https://cdn.jsdelivr.net/npm/giojs@2.2.2/build/gio.min.js"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})