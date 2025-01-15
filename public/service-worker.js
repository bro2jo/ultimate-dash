/* -----------------------------------------
   service-worker.js (Refactored & Enhanced)
-------------------------------------------- */

const CACHE_NAME = 'ultify-cache-v2';      // Increment for static assets
const IMAGE_CACHE_NAME = 'ultify-images-v1';
const DATA_CACHE_NAME = 'ultify-data-v1';

// Static assets to be cached immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/css/main.css',
  '/static/js/main.js',
  '/favicon.svg',
];

// Images that can be cached on first use
const IMAGE_ASSETS = [
  '/images/background-sm.webp',
  '/images/background-md.webp',
  '/images/background-lg.webp',
  '/images/background-mobileSm.webp',
  '/images/background-mobileMd.webp',
  '/images/background-mobileLg.webp',
  '/images/background-placeholder.webp',
  '/icons/icon-72x72.png',
  '/icons/icon-144x144.png',
  '/icons/icon-192x192.png',
  '/icons/icon-256x256.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
];

/* 
  1) INSTALL
     - Cache essential assets
     - Preload small placeholder image
*/
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const staticCache = await caches.open(CACHE_NAME);
      await staticCache.addAll(STATIC_ASSETS);

      // Pre-cache placeholder image
      const imgCache = await caches.open(IMAGE_CACHE_NAME);
      await imgCache.add('/images/background-placeholder.webp');
    })()
  );

  // Take control immediately
  self.skipWaiting();
});

/* 
  2) ACTIVATE
     - Clean up old caches
     - Notify clients of updates
*/
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const deletionPromises = cacheNames
        .filter((cacheName) => {
          return (
            cacheName !== CACHE_NAME &&
            cacheName !== DATA_CACHE_NAME &&
            cacheName !== IMAGE_CACHE_NAME
          );
        })
        .map((cacheName) => caches.delete(cacheName));

      await Promise.all(deletionPromises);

      // Notify all clients
      const clientsList = await self.clients.matchAll();
      for (const client of clientsList) {
        client.postMessage({ type: 'CACHE_UPDATED' });
      }
    })()
  );

  self.clients.claim();
});

/* 
  Helper: isImageRequest
     Checks if the request is for an image
*/
function isImageRequest(request) {
  return (
    request.destination === 'image' ||
    IMAGE_ASSETS.some((asset) => request.url.includes(asset))
  );
}

/*
  Helper: timeoutFetch
     Aborts a fetch if it exceeds 'timeout' ms
*/
async function timeoutFetch(request, timeout = 3000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/* 
  3) FETCH EVENT
     - Different caching strategies for API, Images, and Static Assets
*/
self.addEventListener('fetch', (event) => {
  // If request is not GET, skip caching to prevent errors
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // A) API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await timeoutFetch(event.request);
          if (networkResponse.status === 200) {
            const clonedResponse = networkResponse.clone();
            const cache = await caches.open(DATA_CACHE_NAME);
            cache.put(event.request, clonedResponse);
          }
          return networkResponse;
        } catch (error) {
          const cachedResponse = await caches.match(event.request);
          return (
            cachedResponse ||
            new Response(JSON.stringify({ error: 'offline' }), {
              headers: { 'Content-Type': 'application/json' },
            })
          );
        }
      })()
    );
    return;
  }

  // B) Image requests
  if (isImageRequest(event.request)) {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          // Update in background
          event.waitUntil(
            (async () => {
              try {
                const response = await timeoutFetch(event.request);
                if (response && response.ok) {
                  const imgCache = await caches.open(IMAGE_CACHE_NAME);
                  imgCache.put(event.request, response);
                }
              } catch (err) {
                // silent fail
              }
            })()
          );
          return cachedResponse;
        }

        // If not cached, fetch & store
        try {
          const networkResponse = await timeoutFetch(event.request);
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            event.waitUntil(
              (async () => {
                const imgCache = await caches.open(IMAGE_CACHE_NAME);
                await imgCache.put(event.request, responseClone);
              })()
            );
          }
          return networkResponse;
        } catch (error) {
          return caches.match('/images/background-placeholder.webp');
        }
      })()
    );
    return;
  }

  // C) Static assets (HTML, CSS, JS, etc.)
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await timeoutFetch(event.request);
        if (
          networkResponse &&
          networkResponse.ok &&
          (networkResponse.type === 'basic' || networkResponse.type === 'cors')
        ) {
          const clonedResponse = networkResponse.clone();
          event.waitUntil(
            (async () => {
              const staticCache = await caches.open(CACHE_NAME);
              await staticCache.put(event.request, clonedResponse);
            })()
          );
        }
        return networkResponse;
      } catch (error) {
        return caches.match('/');
      }
    })()
  );
});

/*
  4) BACKGROUND SYNC
*/
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Your logic for queued data sync
      Promise.resolve()
    );
  }
});

/*
  5) PUSH NOTIFICATIONS
*/
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.message,
        icon: '/icons/icon-192x192.png',
      })
    );
  }
});
