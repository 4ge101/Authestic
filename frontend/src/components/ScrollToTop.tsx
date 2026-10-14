import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures page views always scroll back to the top on route transitions
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll on navigation
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};
