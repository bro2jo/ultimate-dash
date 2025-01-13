const CACHE_NAME = 'ultify-cache-v2'; // Increment version for updates
const IMAGE_CACHE_NAME = 'ultify-images-v1';
const DATA_CACHE_NAME = 'ultify-data-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/css/main.css',
  '/static/js/main.js',
  '/favicon.svg',
];

// Image assets to cache on first use
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

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static assets immediately
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      // Pre-cache the tiny placeholder image
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.add('/images/background-placeholder.webp');
      })
    ])
  );
  self.skipWaiting();
});

// Activate and Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Remove any cache that doesn't match our current versions
            return (
              cacheName !== CACHE_NAME &&
              cacheName !== DATA_CACHE_NAME &&
              cacheName !== IMAGE_CACHE_NAME
            );
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      // Notify clients about the update
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'CACHE_UPDATED' }));
      });
    })
  );
  self.clients.claim();
});

// Helper function to check if request is for an image
function isImageRequest(request) {
  return request.destination === 'image' || 
         IMAGE_ASSETS.some(asset => request.url.includes(asset));
}

// Helper function for network request with timeout
async function timeoutFetch(request, timeout = 3000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    throw error;
  }
}

// Fetch handler with optimized strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      timeoutFetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DATA_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(response => {
            return response || new Response(JSON.stringify({ error: 'offline' }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Handle image requests
  if (isImageRequest(event.request)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          // Fetch and cache update in background
          event.waitUntil(
            timeoutFetch(event.request).then(response => {
              if (response.ok) {
                caches.open(IMAGE_CACHE_NAME).then(cache => {
                  cache.put(event.request, response);
                });
              }
            })
          );
          return cachedResponse;
        }

        // If not cached, fetch and cache
        return timeoutFetch(event.request).then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            event.waitUntil(
              caches.open(IMAGE_CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              })
            );
          }
          return response;
        });
      })
    );
    return;
  }

  // Handle other static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return timeoutFetch(event.request).then(response => {
        if (response.ok && (response.type === 'basic' || response.type === 'cors')) {
          const responseClone = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            })
          );
        }
        return response;
      });
    })
  );
});

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Implement your sync logic here
      Promise.resolve()
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.message,
        icon: '/icons/icon-192x192.png'
      })
    );
  }
});