// src/types/components.d.ts

export interface LoadingStateProps {
    size?: string;
    color?: string;
    text?: string;
  }
  
  export interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback: React.ReactElement;
  }
  
  export interface AuthProviderProps {
    children: React.ReactNode;
  }
  
  export interface ProtectedRouteProps {
    children: React.ReactNode;
  }