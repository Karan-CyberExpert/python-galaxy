// lib/analytics.ts
import { 
  SessionData, 
  PageView, 
  UserInfo, 
  GeolocationApiResponse, 
  IpApiResponse 
} from './analytics.type';

class AnalyticsError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AnalyticsError';
  }
}

class Analytics {
  private analyticsData: SessionData[] = [];
  private currentSession: SessionData | null = null;
  private isInitialized: boolean = false;
  private readonly STORAGE_KEYS = {
    DATA: 'analyticsData',
    CURRENT_SESSION: 'currentAnalyticsSession',
    LAST_SAVE: 'lastAnalyticsSave'
  } as const;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.initializeErrorHandling();
  }

  private initializeErrorHandling(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        console.error('Analytics: Global error caught', event.error);
      });

      window.addEventListener('unhandledrejection', (event) => {
        console.error('Analytics: Unhandled promise rejection', event.reason);
      });
    }
  }

  public init(): void {
    try {
      if (this.isInitialized) {
        return;
      }

      if (typeof window === 'undefined') {
        throw new AnalyticsError('Analytics can only be initialized in browser environment');
      }

      this.loadFromStorage();
      this.startNewSession();
      this.setupAutoSave();
      
      this.isInitialized = true;
      
      console.log('Analytics: Initialized successfully');
    } catch (error) {
      throw new AnalyticsError(
        'Failed to initialize analytics',
        'INIT_FAILED',
        error
      );
    }
  }

  private startNewSession(): void {
    try {
      this.currentSession = {
        sessionId: this.generateSessionId(),
        startTime: new Date().toISOString(),
        lastActivity: Date.now(),
        pageViews: [],
        userInfo: this.getFallbackUserInfo()
      };
    } catch (error) {
      throw new AnalyticsError(
        'Failed to start new session',
        'SESSION_START_FAILED',
        error
      );
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private getFallbackUserInfo(): UserInfo {
    const fallbackInfo: UserInfo = {
      ip: 'unknown',
      userAgent: navigator.userAgent || 'unknown',
      language: navigator.language || 'unknown',
      platform: navigator.platform || 'unknown',
      cookieEnabled: navigator.cookieEnabled || false,
      doNotTrack: navigator.doNotTrack || null,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as any).deviceMemory || 0,
      screen: {
        width: screen.width || 0,
        height: screen.height || 0,
        colorDepth: screen.colorDepth || 0,
        pixelDepth: screen.pixelDepth || 0
      },
      viewport: {
        width: window.innerWidth || 0,
        height: window.innerHeight || 0
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
      geolocation: {
        ip: 'unknown',
        city: 'unknown',
        region: 'unknown',
        country: 'unknown',
        countryCode: 'unknown',
        continent: 'unknown',
        postal: 'unknown',
        latitude: 0,
        longitude: 0,
        timezone: 'unknown',
        org: 'unknown',
        asn: 'unknown'
      }
    };

    return fallbackInfo;
  }

  public async trackPageView(route: string): Promise<void> {
    try {
      if (!this.currentSession) {
        throw new AnalyticsError('No active session', 'NO_ACTIVE_SESSION');
      }

      if (!route || typeof route !== 'string') {
        throw new AnalyticsError('Invalid route provided', 'INVALID_ROUTE');
      }

      const pageView: PageView = {
        route,
        timestamp: new Date().toISOString(),
        duration: 0,
        startTime: Date.now()
      };

      // Calculate duration for previous page view
      if (this.currentSession.pageViews.length > 0) {
        const previousPageView = this.currentSession.pageViews[this.currentSession.pageViews.length - 1];
        previousPageView.duration = Date.now() - previousPageView.startTime;
      }

      this.currentSession.pageViews.push(pageView);
      this.currentSession.lastActivity = Date.now();

      // Collect user info on first page view
      if (this.currentSession.pageViews.length === 1) {
        await this.collectUserInfo();
      }

      await this.saveToStorage();
    } catch (error) {
      console.error('Analytics: Failed to track page view', error);
      // Don't throw here to prevent breaking the application
    }
  }

  private async collectUserInfo(): Promise<void> {
    try {
      if (!this.currentSession) {
        return;
      }

      const [ipData, geoData] = await Promise.allSettled([
        this.fetchIpAddress(),
        this.fetchGeolocation()
      ]);

      const userInfo: Partial<UserInfo> = {};

      // Process IP data
      if (ipData.status === 'fulfilled') {
        userInfo.ip = ipData.value.ip;
      } else {
        userInfo.ip = 'unknown';
        console.warn('Analytics: Failed to fetch IP address', ipData.reason);
      }

      // Process geolocation data
      if (geoData.status === 'fulfilled') {
        userInfo.geolocation = this.transformGeolocationData(geoData.value);
      } else {
        console.warn('Analytics: Failed to fetch geolocation data', geoData.reason);
      }

      // Add browser and device info
      userInfo.userAgent = navigator.userAgent;
      userInfo.language = navigator.language;
      userInfo.languages = [...navigator.languages];
      userInfo.platform = navigator.platform;
      userInfo.cookieEnabled = navigator.cookieEnabled;
      userInfo.doNotTrack = navigator.doNotTrack;
      userInfo.hardwareConcurrency = navigator.hardwareConcurrency;
      userInfo.deviceMemory = (navigator as any).deviceMemory;
      
      userInfo.screen = {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      };

      userInfo.viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      userInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Connection info (if available)
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        if (conn) {
          userInfo.connection = {
            effectiveType: conn.effectiveType,
            downlink: conn.downlink,
            rtt: conn.rtt,
            saveData: conn.saveData
          };
        }
      }

      // Merge with current user info
      this.currentSession.userInfo = {
        ...this.currentSession.userInfo,
        ...userInfo
      } as UserInfo;

    } catch (error) {
      console.error('Analytics: Failed to collect user info', error);
      // Continue with fallback data - don't throw
    }
  }

  private async fetchIpAddress(): Promise<IpApiResponse> {
    try {
      const response = await fetch('https://api.ipify.org?format=json', {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        throw new AnalyticsError(`HTTP error! status: ${response.status}`, 'IP_FETCH_FAILED');
      }

      const data: IpApiResponse = await response.json();
      
      if (!data.ip) {
        throw new AnalyticsError('Invalid IP response format', 'INVALID_IP_RESPONSE');
      }

      return data;
    } catch (error) {
      if (error instanceof AnalyticsError) throw error;
      throw new AnalyticsError(
        'Failed to fetch IP address',
        'IP_FETCH_FAILED',
        error
      );
    }
  }

  private async fetchGeolocation(): Promise<GeolocationApiResponse> {
    try {
      // First get IP
      const ipResponse = await this.fetchIpAddress();
      
      const response = await fetch(`https://ipapi.co/${ipResponse.ip}/json/`, {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new AnalyticsError(`HTTP error! status: ${response.status}`, 'GEO_FETCH_FAILED');
      }

      const data: GeolocationApiResponse = await response.json();
      
      if (!data.ip) {
        throw new AnalyticsError('Invalid geolocation response format', 'INVALID_GEO_RESPONSE');
      }

      return data;
    } catch (error) {
      if (error instanceof AnalyticsError) throw error;
      throw new AnalyticsError(
        'Failed to fetch geolocation data',
        'GEO_FETCH_FAILED',
        error
      );
    }
  }

  private transformGeolocationData(geoData: GeolocationApiResponse): UserInfo['geolocation'] {
    return {
      ip: geoData.ip,
      city: geoData.city || 'unknown',
      region: geoData.region || geoData.region_code || 'unknown',
      country: geoData.country_name || geoData.country || 'unknown',
      countryCode: geoData.country_code || 'unknown',
      continent: geoData.continent_code || 'unknown',
      postal: geoData.postal || 'unknown',
      latitude: geoData.latitude || 0,
      longitude: geoData.longitude || 0,
      timezone: geoData.timezone || 'unknown',
      org: geoData.org || 'unknown',
      asn: geoData.asn || 'unknown'
    };
  }

  private setupAutoSave(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('beforeunload', () => {
      this.exportData().catch(error => {
        console.error('Analytics: Failed to export data on unload', error);
      });
    });

    // Auto-save every 30 seconds
    setInterval(() => {
      this.saveToStorage().catch(error => {
        console.error('Analytics: Failed to auto-save', error);
      });
    }, 30000);
  }

  private async saveToStorage(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Save current session
      if (this.currentSession) {
        localStorage.setItem(this.STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(this.currentSession));
      }

      // Save all analytics data periodically
      const now = Date.now();
      const lastSave = localStorage.getItem(this.STORAGE_KEYS.LAST_SAVE);
      
      if (!lastSave || (now - parseInt(lastSave)) > 30000) {
        localStorage.setItem(this.STORAGE_KEYS.DATA, JSON.stringify(this.analyticsData));
        localStorage.setItem(this.STORAGE_KEYS.LAST_SAVE, now.toString());
      }
    } catch (error) {
      throw new AnalyticsError(
        'Failed to save analytics data to storage',
        'STORAGE_SAVE_FAILED',
        error
      );
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      // Load existing analytics data
      const savedData = localStorage.getItem(this.STORAGE_KEYS.DATA);
      if (savedData) {
        this.analyticsData = JSON.parse(savedData);
      }

      // Load current session if it exists and is recent
      const savedSession = localStorage.getItem(this.STORAGE_KEYS.CURRENT_SESSION);
      if (savedSession) {
        const session: SessionData = JSON.parse(savedSession);
        const sessionAge = Date.now() - new Date(session.startTime).getTime();
        
        if (sessionAge < this.SESSION_TIMEOUT) {
          this.currentSession = session;
        }
      }
    } catch (error) {
      console.warn('Analytics: Failed to load data from storage', error);
      // Continue with empty data - don't throw
    }
  }

  public async exportData(): Promise<SessionData | null> {
    try {
      if (!this.currentSession || this.currentSession.pageViews.length === 0) {
        return null;
      }

      // Calculate total duration for the session
      const sessionData: SessionData = {
        ...this.currentSession,
        endTime: new Date().toISOString(),
        totalDuration: Date.now() - new Date(this.currentSession.startTime).getTime()
      };

      this.analyticsData.push(sessionData);
      
      await this.saveToStorage();
      
      // Reset for new session
      this.startNewSession();
      
      return sessionData;
    } catch (error) {
      throw new AnalyticsError(
        'Failed to export analytics data',
        'EXPORT_FAILED',
        error
      );
    }
  }

  public getData(): SessionData[] {
    return [...this.analyticsData]; // Return copy to prevent mutation
  }

  public getCurrentSession(): SessionData | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  public clearData(): void {
    try {
      this.analyticsData = [];
      this.currentSession = null;
      
      if (typeof window !== 'undefined') {
        Object.values(this.STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      throw new AnalyticsError(
        'Failed to clear analytics data',
        'CLEAR_FAILED',
        error
      );
    }
  }

  public isActive(): boolean {
    return this.isInitialized && this.currentSession !== null;
  }
}

// Create singleton instance
const analytics = new Analytics();

export default analytics;