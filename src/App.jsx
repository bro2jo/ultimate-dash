import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingState } from './components/LoadingState';

// Lazy load components
const LoginPage = lazy(() => import('./components/auth/LoginPage'));
const Dashboard = lazy(() => import('./Dashboard'));
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute'));

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route 
          path="/login" 
          element={
            <Suspense fallback={
              <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <h1 className="text-xl text-gray-200">Welcome back</h1>
              </div>
            }>
              <LoginPage />
            </Suspense>
          } 
        />
        <Route
          path="/*"
          element={
            <Suspense fallback={<LoadingState />}>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Suspense>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;