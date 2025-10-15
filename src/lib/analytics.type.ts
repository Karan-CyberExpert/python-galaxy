// types/analytics.ts
export interface ScreenInfo {
  width: number;
  height: number;
  colorDepth: number;
  pixelDepth: number;
}

export interface ViewportInfo {
  width: number;
  height: number;
}

export interface ConnectionInfo {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export interface GeolocationInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  continent?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  org?: string;
  asn?: string;
}

export interface UserInfo {
  ip: string;
  userAgent: string;
  language: string;
  languages?: string[];
  platform: string;
  cookieEnabled: boolean;
  doNotTrack?: string | null;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  screen: ScreenInfo;
  viewport: ViewportInfo;
  timezone: string;
  geolocation: GeolocationInfo;
  connection?: ConnectionInfo;
}

export interface PageView {
  route: string;
  timestamp: string;
  duration: number;
  startTime: number;
}

export interface SessionData {
  sessionId: string;
  startTime: string;
  lastActivity: number;
  pageViews: PageView[];
  userInfo: UserInfo;
  endTime?: string;
  totalDuration?: number;
}

export interface AnalyticsData {
  sessions: SessionData[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GeolocationApiResponse {
  ip: string;
  city?: string;
  region?: string;
  region_code?: string;
  country?: string;
  country_name?: string;
  country_code?: string;
  continent_code?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  org?: string;
  asn?: string;
}

export interface IpApiResponse {
  ip: string;
}