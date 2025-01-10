// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="dark">  {/* <-- Force dark mode */}
      <App />
    </div>
  </React.StrictMode>
);
