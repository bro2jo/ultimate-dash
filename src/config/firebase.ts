// src/config/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { getEnvConfig } from './env';

// Firebase instance type definitions
interface FirebaseInstances {
  app: FirebaseApp | null;
  analytics: Analytics | null;
  auth: Auth | null;
  db: Firestore | null;
}

// Create a singleton instances object
const instances: FirebaseInstances = {
  app: null,
  analytics: null,
  auth: null,
  db: null
};

// Get environment variables
const env = getEnvConfig();

// Firebase configuration with environment variables
const firebaseConfig = {
  apiKey: env.REACT_APP_FIREBASE_API_KEY,
  authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.REACT_APP_FIREBASE_APP_ID,
  measurementId: env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

/**
 * Initializes Firebase services.
 * Ensures that Firebase is initialized only once.
 * 
 * @returns {FirebaseApp} The initialized Firebase app instance.
 * @throws {Error} If initialization fails
 */
export const initializeFirebase = (): FirebaseApp => {
  try {
    if (!instances.app) {
      // Initialize Firebase App
      instances.app = initializeApp(firebaseConfig);
      
      // Initialize Firebase Authentication
      instances.auth = getAuth(instances.app);
      
      // Initialize Firestore
      instances.db = getFirestore(instances.app);
      
      // Defer Analytics initialization
      if (typeof window !== 'undefined' && env.NODE_ENV === 'production') {
        setTimeout(() => {
          try {
            instances.analytics = getAnalytics(instances.app!);
          } catch (error) {
            console.warn('Analytics initialization failed:', error);
          }
        }, 2000);
      }
    }

    return instances.app;
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    throw error;
  }
};

// Initialize Firebase immediately
initializeFirebase();

// Export Firebase services with type safety
export const getFirebaseInstances = () => {
  if (!instances.app) {
    throw new Error('Firebase has not been initialized. Call initializeFirebase first.');
  }
  
  return {
    app: instances.app,
    auth: instances.auth!,
    db: instances.db!,
    analytics: instances.analytics
  };
};

// Export individual services for backward compatibility
export const { app, auth, db } = getFirebaseInstances();