// components/AnalyticsProvider.tsx
'use client';

import { useAnalytics } from '../../hooks/useAnalytics';

export default function AnalyticsProvider() {
  useAnalytics();
  return null;
}