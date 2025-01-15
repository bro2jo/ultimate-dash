/* ------------------------------------------
   serviceWorkerRegistration.js (Refactored)
------------------------------------------- */

export function registerServiceWorker() {
  // Check if the browser supports service workers
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service workers are not supported in this browser.');
    return;
  }

  // Register the service worker after the window loads
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[SW] Registration successful:', registration);

        // Listen for updates to the service worker
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          console.log('[SW] New worker installing:', installingWorker);

          // Track the state of the new worker
          installingWorker.addEventListener('statechange', () => {
            console.log('[SW] New worker state:', installingWorker.state);

            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // There's an existing SW, so this is an update
                console.log('[SW] New update available');
                // Optionally, display a notification or UI prompt to the user
              } else {
                // First SW install: content is now cached for offline use
                console.log('[SW] Content cached for offline use');
              }
            }
          });
        });

        // Check if the SW is already controlling the page
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

  // Reload the page when the service worker updates to the new version
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      // Reload the page to allow the new service worker to control
      window.location.reload();
    }
  });

  // Listen for messages from the service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('[SW] Received message from service worker:', event.data);
    // For example, handle 'CACHE_UPDATED' messages or other custom events
  });
}
