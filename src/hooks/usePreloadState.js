// src/hooks/usePreloadState.js
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

export function usePreloadState() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Access user from AuthContext

  useEffect(() => {
    // Store current path for direct access
    sessionStorage.setItem('last_path', location.pathname);

    // Preload next likely route based on current path
    if (location.pathname === '/login') {
      // Preload dashboard and its dependencies
      const preloadDashboard = async () => {
        try {
          // Start preloading after a short delay to prioritize login render
          await new Promise(resolve => setTimeout(resolve, 2000));
          await import('../Dashboard');
        } catch (error) {
          console.error('Error preloading Dashboard:', error);
        }
      };
      preloadDashboard();
    }

    // Handle direct access to protected routes
    if (user && location.pathname === '/login') {
      const lastPath = sessionStorage.getItem('last_path') || '/';
      navigate(lastPath, { replace: true });
    }
  }, [location, navigate, user]);

  return {
    currentPath: location.pathname,
    isAuthenticated: !!user, // Use user presence to determine authentication
  };
}
