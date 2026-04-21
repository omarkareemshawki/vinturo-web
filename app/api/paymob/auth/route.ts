import { NextResponse } from 'next/server';

// Paymob authentication route
// This gets an auth token from Paymob to use for payment processing

export async function POST(request: Request) {
  try {
    const apiKey = process.env.PAYMOB_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Call Paymob authentication endpoint
    const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
      }),
    });

    if (!response.ok) {
      console.error('Paymob auth failed:', response.status);
      return NextResponse.json(
        { error: 'Payment service error' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Return only the token, never expose raw response
    return NextResponse.json({
      token: data.token,
    });
  } catch (error) {
    console.error('Payment auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
