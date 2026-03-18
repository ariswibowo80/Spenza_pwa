// Spenza Service Worker v2.1
const CACHE_NAME = 'spenza-v2.1';
const BASE = self.registration.scope;

// Only cache the main page — use relative URLs to work on any subdirectory
const STATIC_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icons/icon-192.svg',
  BASE + 'icons/icon-512.svg',
];

// Install — cache what we can, don't fail if something is missing
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Add each file individually so one failure doesn't break everything
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first for HTML, cache-first for assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin requests (Google APIs, fonts, CDN)
  if (event.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached || new Response('Offline', {status: 503}));

      // For HTML pages: network first, fall back to cache
      if (event.request.destination === 'document') return networkFetch;
      // For everything else: cache first, fall back to network
      return cached || networkFetch;
    })
  );
});
