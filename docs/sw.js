const CACHE_NAME="2023-08-18 00:10",urlsToCache=["/flags-quiz/","/flags-quiz/index.js","/flags-quiz/data/en.csv","/flags-quiz/mp3/incorrect1.mp3","/flags-quiz/mp3/correct3.mp3","/flags-quiz/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js","https://cdn.jsdelivr.net/npm/three@0.102.1/build/three.min.js","https://cdn.jsdelivr.net/npm/giojs@2.2.2/build/gio.min.js"];self.addEventListener("install",a=>{a.waitUntil(caches.open(CACHE_NAME).then(a=>a.addAll(urlsToCache)))}),self.addEventListener("fetch",a=>{a.respondWith(caches.match(a.request).then(b=>b||fetch(a.request)))}),self.addEventListener("activate",a=>{a.waitUntil(caches.keys().then(a=>Promise.all(a.filter(a=>a!==CACHE_NAME).map(a=>caches.delete(a)))))})