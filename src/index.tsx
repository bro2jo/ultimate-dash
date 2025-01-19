// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { registerServiceWorker } from './serviceWorkerRegistration';
import RootErrorBoundary from './components/RootErrorBoundary';
import ErrorFallback from './components/ErrorFallback';
import { getEnvConfig } from './config/env';

const initializeApp = () => {
  try {
    // Validate environment variables
    getEnvConfig();
    
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('Failed to find the root element');
    
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <RootErrorBoundary>
          <BrowserRouter>
            <div className="dark">
              <App />
            </div>
          </BrowserRouter>
        </RootErrorBoundary>
      </React.StrictMode>
    );

    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    }
  } catch (error) {
    // Handle initialization errors
    console.error('Failed to initialize app:', error);
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <ErrorFallback 
          error={error as Error}
          resetErrorBoundary={() => window.location.reload()} 
        />
      );
    }
  }
};

initializeApp();