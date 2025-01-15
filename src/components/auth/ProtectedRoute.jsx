// src/components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingState } from '../LoadingState'; // adjust import path if needed

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth(); 
  // ^ Make sure your AuthContext provides both `user` and `loading` (or `authLoading`).

  // 1) If Auth is still loading, show a spinner (or any fallback).
  if (loading) {
    return <LoadingState />;
  }

  // 2) If no user, redirect to login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3) Otherwise, render the protected component(s).
  return children;
}
