const CACHE_NAME="2024-02-19 00:00",urlsToCache=["/flags-quiz/","/flags-quiz/index.js","/flags-quiz/ja/","/flags-quiz/data/ja.csv","/flags-quiz/mp3/incorrect1.mp3","/flags-quiz/mp3/correct3.mp3","/flags-quiz/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js","https://cdn.jsdelivr.net/npm/three@0.102.1/build/three.min.js","https://cdn.jsdelivr.net/npm/giojs@2.2.2/build/gio.min.js"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})