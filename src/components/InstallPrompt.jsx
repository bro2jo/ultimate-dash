// src/components/InstallPrompt.jsx

import React, { useState, useEffect } from 'react';

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [debugInfo, setDebugInfo] = useState({
    isStandalone: false,
    hasShownPrompt: false,
    promptEventReceived: false,
    isSecureContext: false,
    isSupportedBrowser: false,
    debugMessages: []
  });

  useEffect(() => {
    const newDebugMessages = [];
    
    // Check if served over HTTPS or localhost
    const isSecure = window.isSecureContext || window.location.hostname === 'localhost';
    newDebugMessages.push(`isSecureContext: ${isSecure}`);

    // Basic check for browser support (Chrome, Edge, etc. - iOS Safari won't fire BIP)
    const isSupported = 'BeforeInstallPromptEvent' in window || 'onbeforeinstallprompt' in window;
    newDebugMessages.push(`isSupportedBrowser: ${isSupported}`);

    // Check if running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://');
    newDebugMessages.push(`isStandalone: ${isStandalone}`);

    let hasShownPrompt = false;
    try {
      hasShownPrompt = !!localStorage.getItem('installPromptShown');
      newDebugMessages.push(`localStorage installPromptShown: ${hasShownPrompt}`);
    } catch (err) {
      newDebugMessages.push(`Error accessing localStorage: ${err.message}`);
    }

    setDebugInfo((prev) => ({
      ...prev,
      isSecureContext: isSecure,
      isSupportedBrowser: isSupported,
      isStandalone: isStandalone,
      hasShownPrompt: hasShownPrompt,
      debugMessages: [...prev.debugMessages, ...newDebugMessages]
    }));

    const handleBeforeInstallPrompt = (e) => {
      console.log('[InstallPrompt] beforeinstallprompt fired');
      e.preventDefault();
      setInstallPrompt(e);

      setDebugInfo((prev) => ({
        ...prev,
        promptEventReceived: true,
        debugMessages: [...prev.debugMessages, 'BIP event captured']
      }));
    };

    const handleAppInstalled = () => {
      console.log('[InstallPrompt] App installed');
      // Mark as shown so we don’t pester the user again
      try {
        localStorage.setItem('installPromptShown', 'true');
      } catch (err) {
        console.warn('[InstallPrompt] Could not save install state:', err);
      }
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Additional debug logging whenever debugInfo changes
  useEffect(() => {
    console.log('[InstallPrompt] debugInfo updated:', debugInfo);
  }, [debugInfo]);

  const handleInstall = async () => {
    if (!installPrompt) {
      console.log('[InstallPrompt] No install prompt available');
      return;
    }
    try {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      console.log('[InstallPrompt] userChoice outcome:', choiceResult.outcome);

      if (choiceResult.outcome === 'accepted') {
        console.log('[InstallPrompt] User accepted the install prompt');
      } else {
        console.log('[InstallPrompt] User dismissed the install prompt');
      }
      setInstallPrompt(null);
      localStorage.setItem('installPromptShown', 'true');
    } catch (error) {
      console.error('[InstallPrompt] Error during install prompt:', error);
    }
  };

  const handleDismiss = () => {
    console.log('[InstallPrompt] Prompt dismissed by user');
    setInstallPrompt(null);
    try {
      localStorage.setItem('installPromptShown', 'true');
    } catch (err) {
      console.warn('[InstallPrompt] Could not save dismiss state:', err);
    }
  };

  // If app is already installed, do not show
  if (debugInfo.isStandalone) {
    return null;
  }

  // If user has previously dismissed or accepted
  if (debugInfo.hasShownPrompt) {
    return null;
  }

  // If no prompt event captured
  if (!installPrompt) {
    return null;
  }

  // Render your custom prompt UI
  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-4 md:w-96 bg-gray-800 p-4 rounded-lg shadow-lg z-50 border border-gray-700">
      <div className="flex flex-col space-y-3">
        <div>
          <h3 className="text-gray-100 font-medium">Install Ultify</h3>
          <p className="text-gray-400 text-sm mt-1">
            Get the best experience and offline functionality by installing the app.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
