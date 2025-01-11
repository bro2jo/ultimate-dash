// src/components/InstallPrompt.jsx
import React, { useState, useEffect } from 'react';

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!installPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg">
      <p className="text-gray-100 mb-2">Install Ultify Performance Tracker?</p>
      <div className="flex space-x-2">
        <button
          onClick={() => installPrompt.prompt()}
          className="bg-emerald-500 text-white px-4 py-2 rounded"
        >
          Install
        </button>
        <button
          onClick={() => setInstallPrompt(null)}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Not now
        </button>
      </div>
    </div>
  );
}