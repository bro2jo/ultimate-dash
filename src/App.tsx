// src/App.tsx
import { lazy, ReactElement, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingState } from './components/LoadingState';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorFallback from './components/ErrorFallback';
import { lazyLoad } from './utils/lazyLoad';

// Define route configuration type
interface RouteConfig {
  readonly path: string;
  readonly element: ReactElement;
  readonly componentName: string;
}

// Define routes object with type safety
const ROUTES = {
  LOGIN: '/login',
  HOME: '/*'
} as const;

// Lazy load components with error handling
const LoginPage = lazyLoad(
  () => import('./components/auth/LoginPage'),
  { retry: 2, retryDelay: 1000 }
);

const Dashboard = lazyLoad(
  () => import('./Dashboard'),
  { retry: 2 }
);

const ProtectedRoute = lazyLoad(
  () => import('./components/auth/ProtectedRoute'),
  { retry: 2 }
);

// Define route configurations with component names
const routeConfig: RouteConfig[] = [
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
    componentName: 'LoginPage'
  },
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    componentName: 'Dashboard'
  }
];

// Create a wrapper for suspense with error handling
const SuspenseWithErrorBoundary: React.FC<{
  children: React.ReactNode;
  name: string;
}> = ({ children, name }) => (
  <ErrorBoundary
    fallback={
      <ErrorFallback 
        error={new Error(`Failed to load ${name}. Please try refreshing the page.`)}
        resetErrorBoundary={() => window.location.reload()}
      />
    }
  >
    <Suspense fallback={<LoadingState />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

function App(): ReactElement {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback 
          resetErrorBoundary={() => window.location.reload()}
        />
      }
    >
      <AuthProvider>
        <Routes>
          {routeConfig.map(({ path, element, componentName }) => (
            <Route
              key={path}
              path={path}
              element={
                <SuspenseWithErrorBoundary name={componentName}>
                  {element}
                </SuspenseWithErrorBoundary>
              }
            />
          ))}
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
