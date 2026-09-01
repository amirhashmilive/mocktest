const CACHE_NAME = 'mockhard-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './categories.html',
  './test.html',
  './results.html',
  './random.html',
  './dashboard.html',
  './custom-test.html',
  './privacy.html',
  './terms.html',
  './about.html',
  './contact.html',
  './css/style.css',
  './js/categories.js',
  './js/storage.js',
  './js/questionLoader.js',
  './js/rotationEngine.js',
  './js/timer.js',
  './js/charts.js',
  './js/app.js',
  './data/metrics.json',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
