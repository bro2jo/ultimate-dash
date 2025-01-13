// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { initializeFirebase } from '../config/firebase';

const AuthContext = createContext({});

// Lazy imports for auth methods
const lazyImportAuth = () => import('firebase/auth').then(module => ({
  signInWithEmailAndPassword: module.signInWithEmailAndPassword,
  createUserWithEmailAndPassword: module.createUserWithEmailAndPassword,
  signInWithPopup: module.signInWithPopup,
  GoogleAuthProvider: module.GoogleAuthProvider,
  signOut: module.signOut,
  sendPasswordResetEmail: module.sendPasswordResetEmail
}));

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);

  // Initialize Firebase and Auth lazily
  useEffect(() => {
    const initAuth = async () => {
      const app = initializeFirebase();
      const auth = getAuth(app);
      setAuth(auth);
      
      const { onAuthStateChanged } = await import('firebase/auth');
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return unsubscribe;
    };

    initAuth();
  }, []);

  // Lazy auth methods
  const login = async (email, password) => {
    const { signInWithEmailAndPassword } = await lazyImportAuth();
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    const { createUserWithEmailAndPassword } = await lazyImportAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const { signInWithPopup, GoogleAuthProvider } = await lazyImportAuth();
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    const { signOut } = await lazyImportAuth();
    return signOut(auth);
  };

  const resetPassword = async (email) => {
    const { sendPasswordResetEmail } = await lazyImportAuth();
    return sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-gray-400 text-sm">
            Great to see you again! Please enter your details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}