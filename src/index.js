/* ------------------------------------------
   index.js (Refactored)
------------------------------------------- */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { registerServiceWorker } from './serviceWorkerRegistration';

// Create the root container for our React app
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Force dark mode for the entire application */}
      <div className="dark">
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);

// Register the service worker for offline capabilities
registerServiceWorker();

// Log service worker control status
if (navigator.serviceWorker && navigator.serviceWorker.controller) {
} else {
  console.warn('[SW] Service worker is NOT controlling the page');
}
