// app/api/analytics/data/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SessionData, ApiResponse } from '../../../../lib/analytics.type';

interface AnalyticsFile {
  filename: string;
  data: SessionData;
}

export async function GET(): Promise<NextResponse<ApiResponse<AnalyticsFile[]>>> {
  try {
    const analyticsDir = path.join(process.cwd(), 'analytics-data');
    
    if (!fs.existsSync(analyticsDir)) {
      return NextResponse.json({ 
        success: true, 
        data: [] 
      });
    }

    const files = fs.readdirSync(analyticsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        try {
          const filepath = path.join(analyticsDir, file);
          const fileContent = fs.readFileSync(filepath, 'utf8');
          const data: SessionData = JSON.parse(fileContent);
          
          return {
            filename: file,
            data
          };
        } catch (parseError) {
          console.warn(`Analytics: Failed to parse file ${file}`, parseError);
          return null;
        }
      })
      .filter((file): file is AnalyticsFile => file !== null);

    return NextResponse.json({ 
      success: true, 
      data: files 
    });

  } catch (error) {
    console.error('Analytics: Error reading analytics data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to read analytics data' 
    }, { status: 500 });
  }
}