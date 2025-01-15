import React, { useEffect, useState } from 'react';

const PWADebug = () => {
  const [debug, setDebug] = useState({
    secureContext: false,
    protocol: '',
    hostname: '',
    browserSupport: false,
    manifestPresent: false,
    serviceWorkerSupport: false,
    serviceWorkerActive: false
  });

  useEffect(() => {
    const checkPWASupport = async () => {
      // Check secure context and protocol
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      const isSecure = window.isSecureContext;

      // Check manifest
      const manifest = document.querySelector('link[rel="manifest"]');

      // Check service worker
      const swSupport = 'serviceWorker' in navigator;
      let swActive = false;
      if (swSupport) {
        const registration = await navigator.serviceWorker.getRegistration();
        swActive = !!registration?.active;
      }

      setDebug({
        secureContext: isSecure,
        protocol,
        hostname,
        browserSupport: 'BeforeInstallPromptEvent' in window,
        manifestPresent: !!manifest,
        serviceWorkerSupport: swSupport,
        serviceWorkerActive: swActive
      });
    };

    checkPWASupport();
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-bold text-white mb-4">PWA Debug Info</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Secure Context:</span>
          <span className={debug.secureContext ? 'text-green-400' : 'text-red-400'}>
            {debug.secureContext ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Protocol:</span>
          <span className={debug.protocol === 'https:' ? 'text-green-400' : 'text-yellow-400'}>
            {debug.protocol}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Hostname:</span>
          <span className="text-white">{debug.hostname}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Browser Support:</span>
          <span className={debug.browserSupport ? 'text-green-400' : 'text-red-400'}>
            {debug.browserSupport ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Manifest Present:</span>
          <span className={debug.manifestPresent ? 'text-green-400' : 'text-red-400'}>
            {debug.manifestPresent ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Service Worker Support:</span>
          <span className={debug.serviceWorkerSupport ? 'text-green-400' : 'text-red-400'}>
            {debug.serviceWorkerSupport ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Service Worker Active:</span>
          <span className={debug.serviceWorkerActive ? 'text-green-400' : 'text-red-400'}>
            {debug.serviceWorkerActive ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PWADebug;