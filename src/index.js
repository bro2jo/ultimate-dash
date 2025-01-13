// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { registerServiceWorker } from './serviceWorkerRegistration';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap App with BrowserRouter */}
      <div className="dark">  {/* <-- Force dark mode */}
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
registerServiceWorker();
if (navigator.serviceWorker.controller) {
  console.log('[SW] Service worker is controlling the page');
} else {
  console.warn('[SW] Service worker is NOT controlling the page');
}
