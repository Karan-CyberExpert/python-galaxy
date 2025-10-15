// components/AnalyticsSync.tsx
"use client"
import { useEffect } from 'react';
import analytics from '../../lib/analytics';

const AnalyticsSync: React.FC = () => {
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      try {
        const sessionData = await analytics.exportData();
        
        if (sessionData) {
          const response = await fetch('/api/analytics/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (!result.success) {
            throw new Error(result.error || 'Failed to save analytics data');
          }
        }
      } catch (error) {
        console.error('Analytics: Failed to sync with server', error);
        // Don't throw - this is a background process
      }
    }, 60000); // Sync every minute

    return () => clearInterval(syncInterval);
  }, []);

  return null;
};

export default AnalyticsSync;