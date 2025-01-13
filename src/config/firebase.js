// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC7rcVKPWvdvKVOUKPiX4j9av0rTByBVoE",
  authDomain: "ultify-dash.firebaseapp.com",
  projectId: "ultify-dash",
  storageBucket: "ultify-dash.firebasestorage.app",
  messagingSenderId: "408112418111",
  appId: "1:408112418111:web:f766cebe2e2115125a978a",
  measurementId: "G-NK04C3E3Q0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };