import { NextResponse } from 'next/server';

// Use internal Docker URL for server-side requests
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Forward to backend
    const response = await fetch(`${BACKEND_URL}/api/analytics/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', response.status, errorText);
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analytics session error:', error.message);
    return NextResponse.json(
      { error: 'Failed to track session' },
      { status: 500 }
    );
  }
}