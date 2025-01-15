// src/config/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase App, Auth, Firestore, and Analytics
let app = null;
let analytics = null;
let auth = null;
let db = null;

/**
 * Initializes Firebase services.
 * Ensures that Firebase is initialized only once.
 * 
 * @returns {FirebaseApp} The initialized Firebase app instance.
 */
export const initializeFirebase = () => {
  if (!app) {
    // Initialize Firebase App
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase Authentication
    auth = getAuth(app);
    
    // Initialize Firestore
    db = getFirestore(app);
    
    // Defer Analytics initialization by 2 seconds
    setTimeout(() => {
      analytics = getAnalytics(app);
    }, 2000);
    
  }
  return app;
};

// Immediately initialize Firebase when this module is imported
initializeFirebase();

// Export Firebase services for use in other parts of your application
export { app, auth, db };
