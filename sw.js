// Minimal service worker - no fetch interception (fixes iOS Safari FetchEvent TypeError bug)
// iOS 16.4+ and 17+ have a known WebKit bug that causes "FetchEvent.respondWith TypeError: Internal error"
// The safest fix for a self-contained single-file PWA is to skip fetch handling entirely.

const CACHE_NAME = 'ac-board-v3';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(['./index.html']);
    }).catch(() => {})
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// NO fetch handler - this is intentional.
// Safari has a critical bug with FetchEvent.respondWith that causes PWAs to show
// a blank screen or "Internal error" on launch from home screen.
// Since this app is self-contained in index.html, it works perfectly without SW caching.
