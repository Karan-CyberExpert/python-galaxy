// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Read the JSON file from the root directory
    const filePath = join(process.cwd(), 'user-data.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContents);
    
    return NextResponse.json(jsonData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read JSON file' },
      { status: 500 }
    );
  }
}