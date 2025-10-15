// app/api/analytics/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SessionData, ApiResponse } from '../../../../lib/analytics.type';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const analyticsData: SessionData = await request.json();

    // Validate the data
    if (!analyticsData || typeof analyticsData !== 'object') {
      return NextResponse.json({
        success: false,
        error: 'Invalid analytics data'
      }, { status: 400 });
    }

    if (!analyticsData.sessionId || !analyticsData.startTime) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields in analytics data'
      }, { status: 400 });
    }

    // Create analytics directory if it doesn't exist
    const analyticsDir = path.join(process.cwd(), 'analytics-data');
    
    try {
      if (!fs.existsSync(analyticsDir)) {
        fs.mkdirSync(analyticsDir, { recursive: true });
      }
    } catch (error) {
      console.error('Analytics: Failed to create directory', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to create analytics directory'
      }, { status: 500 });
    }

    // Save with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `analytics-${timestamp}-${analyticsData.sessionId.substring(0, 8)}.json`;
    const filepath = path.join(analyticsDir, filename);

    try {
      fs.writeFileSync(filepath, JSON.stringify(analyticsData, null, 2));
      
      return NextResponse.json({ 
        success: true, 
        message: 'Analytics data saved successfully' 
      });
    } catch (writeError) {
      console.error('Analytics: Failed to write file', writeError);
      return NextResponse.json({
        success: false,
        error: 'Failed to write analytics data to file'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Analytics: Error saving analytics data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error while saving analytics data' 
    }, { status: 500 });
  }
}