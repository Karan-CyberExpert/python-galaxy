// hooks/useAnalytics.ts
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import analytics from '../lib/analytics';

export const useAnalytics = (): void => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialized = useRef<boolean>(false);

  const trackPageView = useCallback(async (url: string): Promise<void> => {
    try {
      await analytics.trackPageView(url);
    } catch (error) {
      console.error('Analytics: Failed to track page view in hook', error);
    }
  }, []);

  const updateActivity = useCallback((): void => {
    try {
      // Activity tracking is handled internally in analytics class
    } catch (error) {
      console.error('Analytics: Failed to update activity', error);
    }
  }, []);

  const handleVisibilityChange = useCallback(async (): Promise<void> => {
    try {
      if (document.visibilityState === 'hidden') {
        await analytics.exportData();
      }
    } catch (error) {
      console.error('Analytics: Failed to handle visibility change', error);
    }
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;

    try {
      // Initialize analytics
      analytics.init();
      isInitialized.current = true;

      // Track initial page view
      const currentUrl = `${pathname}${searchParams ? `?${searchParams}` : ''}`;
      trackPageView(currentUrl);

      // Track user activity
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'] as const;
      
      activityEvents.forEach(event => {
        document.addEventListener(event, updateActivity, { passive: true });
      });

      // Handle visibility changes
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Cleanup
      return () => {
        activityEvents.forEach(event => {
          document.removeEventListener(event, updateActivity);
        });
        
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        // Export data on unmount
        analytics.exportData().catch(error => {
          console.error('Analytics: Failed to export data on unmount', error);
        });
      };
    } catch (error) {
      console.error('Analytics: Failed to initialize in hook', error);
    }
  }, [trackPageView, updateActivity, handleVisibilityChange, pathname, searchParams]);

  // Track page changes
  useEffect(() => {
    if (!isInitialized.current) return;
    
    const currentUrl = `${pathname}${searchParams ? `?${searchParams}` : ''}`;
    trackPageView(currentUrl);
  }, [pathname, searchParams, trackPageView]);
};