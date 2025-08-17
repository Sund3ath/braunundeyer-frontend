import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Forward to backend
    const response = await fetch(`${BACKEND_URL}/api/analytics/pageview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analytics pageview error:', error);
    return NextResponse.json(
      { error: 'Failed to track pageview' },
      { status: 500 }
    );
  }
}