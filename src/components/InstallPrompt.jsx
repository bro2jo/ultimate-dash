import React, { useState, useEffect } from 'react';

export const InstallPrompt = () => {
  const [prompt, setPrompt] = useState(null);
  const [criteria, setCriteria] = useState({
    protocolCheck: false,
    serviceWorkerCheck: false,
    isAppInstalled: false,
    hasPromptBeenShown: false
  });

  useEffect(() => {
    // Check if we're on HTTPS or localhost
    const isSecureContext = window.isSecureContext || 
                          window.location.hostname === 'localhost' ||
                          window.location.protocol === 'https:';
    
    // Check for service worker support
    const hasServiceWorker = 'serviceWorker' in navigator;

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const promptShownBefore = localStorage.getItem('installPromptShown') === 'true';

    console.log('Installation Criteria Checks:', {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      isSecureContext: isSecureContext,
      serviceWorkerAvailable: hasServiceWorker,
      serviceWorkerController: !!navigator.serviceWorker?.controller,
      isStandalone: isStandalone,
      hasPromptBeenShown: promptShownBefore
    });

    setCriteria({
      protocolCheck: isSecureContext,
      serviceWorkerCheck: hasServiceWorker,
      isAppInstalled: isStandalone,
      hasPromptBeenShown: promptShownBefore
    });

    const handleInstallPrompt = (e) => {
      e.preventDefault();
      console.log('Real install prompt captured');
      setPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', () => {
      console.log('App has been installed');
      localStorage.setItem('installPromptShown', 'true');
    });

    return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
  }, []);

  // Check if all criteria are met
  const allCriteriaMet = Object.values(criteria).every(check => check);

  if (criteria.isAppInstalled || criteria.hasPromptBeenShown || !allCriteriaMet) {
    console.log('Installation criteria not met or app already installed:', criteria);
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-4 md:w-96 bg-gray-800 p-4 rounded-lg shadow-lg z-50 border border-gray-700">
      <div className="flex flex-col space-y-3">
        <div>
          <h3 className="text-gray-100 font-medium">Install Ultify</h3>
          <p className="text-gray-400 text-sm mt-1">
            Get the best experience and offline functionality by installing the app.
          </p>
          <div className="mt-2 space-y-1">
            <span className={`block text-xs ${criteria.protocolCheck ? 'text-emerald-400' : 'text-red-500'}`}>
              Protocol Check: {criteria.protocolCheck ? '✓ Passed' : '✗ Failed'}
            </span>
            <span className={`block text-xs ${criteria.serviceWorkerCheck ? 'text-emerald-400' : 'text-red-500'}`}>
              Service Worker Check: {criteria.serviceWorkerCheck ? '✓ Passed' : '✗ Failed'}
            </span>
            <span className={`block text-xs ${prompt ? 'text-emerald-400' : 'text-red-500'}`}>
              Install Prompt Captured: {prompt ? '✓ Yes' : '✗ No'}
            </span>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setPrompt(null);
              localStorage.setItem('installPromptShown', 'true');
            }}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            Not now
          </button>
          <button
            onClick={() => {
              if (prompt) {
                prompt.prompt();
                prompt.userChoice.then((result) => {
                  console.log('Install choice:', result.outcome);
                  if (result.outcome === 'accepted') {
                    alert('🎉 Installation started!');
                  } else {
                    alert('❌ Installation dismissed.');
                  }
                  localStorage.setItem('installPromptShown', 'true');
                  setPrompt(null);
                });
              }
            }}
            className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};
