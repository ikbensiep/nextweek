self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open('nextweek').then(function(cache) {
        return cache.addAll([
          './',
          './index.html',
          './index.html?homescreen=1',
          './?homescreen=1',
          './style.css',
          './main.js',
          './icon.png',
          './icon-512.png'
        ]);
      })
    );
   });

self.addEventListener('fetch', function(event) {

    console.log(event.request.url);    

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    
    );
    
});