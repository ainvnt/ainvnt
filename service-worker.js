const CACHE_NAME = 'ainvnt-v3';
const CACHE_TTL = 60 * 60 * 24 * 7; // TTL in seconds (7 days)
// Helper: store timestamp for each cache entry
function setCacheTimestamp(requestUrl) {
  return caches.open(CACHE_NAME).then(cache => {
    const key = 'timestamp:' + requestUrl;
    const now = Math.floor(Date.now() / 1000);
    return cache.put(key, new Response(now.toString()));
  });
}
function getCacheTimestamp(requestUrl) {
  return caches.open(CACHE_NAME).then(cache => {
    const key = 'timestamp:' + requestUrl;
    return cache.match(key).then(res => {
      if (res) return res.text().then(Number);
      return null;
    });
  });
}
const urlsToCache = [
  '/',
  '/index.html',
  '/about-us.html',
  '/portfolio.html',
  '/contact.html',
  '/careers.html',
  '/web-applications.html',
  '/mobile-apps.html',
  '/cloud-solutions.html',
  '/ai-ml-solutions.html',
  '/bi-tools.html',
  '/quality-assurance.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/js/footer-loader.js',
  '/assets/js/security.js',
  '/assets/js/pwa-init.js',
  '/assets/img/ainvnt_logo.jpg',
  '/assets/img/favicon.png',
  '/assets/img/logo.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Cache install error:', err))
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(async cachedResponse => {
      // Check TTL if cache exists
      if (cachedResponse) {
        const ts = await getCacheTimestamp(event.request.url);
        const now = Math.floor(Date.now() / 1000);
        if (ts && now - ts < CACHE_TTL) {
          // Cache valid
          return cachedResponse;
        } else {
          // Cache expired, fetch fresh
          return fetch(event.request).then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return cachedResponse;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
              setCacheTimestamp(event.request.url);
            });
            return response;
          }).catch(() => cachedResponse);
        }
      } else {
        // No cache, fetch and cache
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
            setCacheTimestamp(event.request.url);
          });
          return response;
        }).catch(() => caches.match('/index.html'));
      }
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
