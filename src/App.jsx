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
      {/* Single Suspense boundary at the root */}
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
