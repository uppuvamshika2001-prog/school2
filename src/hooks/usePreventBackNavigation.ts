// ===========================================
// 🔒 PREVENT BACK NAVIGATION HOOK
// Custom hook to prevent back navigation to login after authentication
// ===========================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook to prevent back navigation to a specific page
 * Useful for preventing users from going back to login page after authentication
 */
export function usePreventBackNavigation(shouldPrevent: boolean = true) {
  const router = useRouter();

  useEffect(() => {
    if (!shouldPrevent) return;

    // Add a history entry to prevent back navigation
    const handlePopState = (event: PopStateEvent) => {
      // Push the current state again to prevent going back
      window.history.pushState(null, '', window.location.href);
    };

    // Push initial state
    window.history.pushState(null, '', window.location.href);

    // Listen for back button
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [shouldPrevent]);
}
