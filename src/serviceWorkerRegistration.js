// src/serviceWorkerRegistration.js

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('[SW] Registration successful:', registration);

          // Listen for updates to the service worker.
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('[SW] New worker being installed:', newWorker);

            newWorker.addEventListener('statechange', () => {
              console.log('[SW] New worker state:', newWorker.state);
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update available
                  console.log('[SW] New update available');
                  // Optionally, notify the user about the update
                } else {
                  // Content cached for offline use
                  console.log('[SW] Content cached for offline use');
                }
              }
            });
          });

          // Check for controlling service worker
          if (navigator.serviceWorker.controller) {
            console.log('[SW] Service worker is controlling the page');
          } else {
            console.log('[SW] Service worker is NOT controlling the page');
          }

        })
        .catch((error) => {
          console.error('[SW] Service worker registration failed:', error);
        });
    });

    // Reload the page when the service worker updates
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    // Handle messages from the service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('[SW] Received message:', event.data);
    });
  } else {
    console.log('[SW] Service workers are not supported');
  }
}
