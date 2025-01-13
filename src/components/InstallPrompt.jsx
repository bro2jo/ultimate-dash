// src/components/InstallPrompt.jsx
import React, { useState, useEffect } from 'react';

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [debugInfo, setDebugInfo] = useState({ 
    isStandalone: false, 
    hasShownPrompt: false,
    promptEventReceived: false 
  });

  useEffect(() => {
    console.log('[InstallPrompt] Component mounted');

    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');
      
    console.log('[InstallPrompt] Is standalone:', isStandalone);

    const hasShownPrompt = localStorage.getItem('installPromptShown');
    console.log('[InstallPrompt] Previously shown:', hasShownPrompt);

    setDebugInfo(prev => ({
      ...prev,
      isStandalone,
      hasShownPrompt: !!hasShownPrompt
    }));

    // Handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('[InstallPrompt] beforeinstallprompt event fired', e);
      e.preventDefault();
      setInstallPrompt(e);
      setDebugInfo(prev => ({ ...prev, promptEventReceived: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = (e) => {
      console.log('[InstallPrompt] App was installed', e);
      localStorage.setItem('installPromptShown', 'true');
      setInstallPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('[InstallPrompt] State updated:', {
      hasPrompt: !!installPrompt,
      debugInfo
    });
  }, [installPrompt, debugInfo]);

  const handleInstall = async () => {
    if (!installPrompt) {
      console.log('[InstallPrompt] No install prompt available');
      return;
    }

    try {
      console.log('[InstallPrompt] Triggering install prompt');
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      console.log('[InstallPrompt] Install prompt result:', result);
      if (result.outcome === 'accepted') {
        console.log('[InstallPrompt] User accepted the install prompt');
      } else {
        console.log('[InstallPrompt] User dismissed the install prompt');
      }
      setInstallPrompt(null);
      localStorage.setItem('installPromptShown', 'true');
    } catch (error) {
      console.error('[InstallPrompt] Error installing app:', error);
    }
  };

  const handleDismiss = () => {
    console.log('[InstallPrompt] Prompt dismissed');
    setInstallPrompt(null);
    localStorage.setItem('installPromptShown', 'true');
  };

  // Early return conditions
  if (debugInfo.isStandalone) {
    console.log('[InstallPrompt] App is installed, not showing prompt');
    return null;
  }

  if (debugInfo.hasShownPrompt) {
    console.log('[InstallPrompt] Install prompt has already been shown');
    return null;
  }

  if (!installPrompt) {
    console.log('[InstallPrompt] No prompt available, not showing UI');
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-800 p-4 rounded-lg shadow-lg z-50 border border-gray-700">
      <div className="flex flex-col space-y-3">
        <div>
          <h3 className="text-gray-100 font-medium">Install Performance Tracker</h3>
          <p className="text-gray-400 text-sm mt-1">
            Install our app for the best experience and offline access
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
