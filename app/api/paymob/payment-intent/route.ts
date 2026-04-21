import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// Validate payment request data
function validatePaymentRequest(data: any) {
  const errors: string[] = [];
  
  if (!Number.isFinite(data.amount) || data.amount < 100) {
    errors.push('Invalid amount (minimum 1 EGP)');
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email');
  }
  
  if (!data.firstName || typeof data.firstName !== 'string' || data.firstName.length < 2) {
    errors.push('Invalid first name');
  }
  
  if (!data.phone || typeof data.phone !== 'string' || data.phone.length < 8) {
    errors.push('Invalid phone');
  }
  
  return { valid: errors.length === 0, errors };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, email, firstName, lastName, phone, orderId } = body;

    // Validate input
    const validation = validatePaymentRequest({ amount, email, firstName, phone });
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid payment request', details: validation.errors },
        { status: 400 }
      );
    }

    // Get Paymob auth token
    const tokenResponse = await fetch(
      new URL('/api/paymob/auth', request.url),
      { method: 'POST' }
    );

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: 'Could not initialize payment' },
        { status: 500 }
      );
    }

    const { token } = await tokenResponse.json();

    // Create order in Paymob
    const paymobResponse = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: false,
        items: [],
        amount_cents: Math.round(amount * 100), // Convert to cents
        currency: 'EGP',
        merchant_order_id: orderId, // Your order ID
      }),
    });

    if (!paymobResponse.ok) {
      console.error('Paymob order creation failed:', paymobResponse.status);
      return NextResponse.json(
        { error: 'Payment initialization failed' },
        { status: 500 }
      );
    }

    const paymobOrder = await paymobResponse.json();

    // Get payment key for iframe
    const paymentKeyResponse = await fetch(
      'https://accept.paymob.com/api/acceptance/payment_keys',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: token,
          amount_cents: Math.round(amount * 100),
          expiration: 3600,
          order_id: paymobOrder.id,
          billing_data: {
            apartment: 'NA',
            email: email,
            floor: 'NA',
            first_name: firstName,
            last_name: lastName,
            phone_number: phone,
            postal_code: 'NA',
            city: 'NA',
            country: 'EG',
            state: 'NA',
            street: 'NA',
          },
          currency: 'EGP',
          integration_id: process.env.PAYMOB_INTEGRATION_ID,
        }),
      }
    );

    if (!paymentKeyResponse.ok) {
      console.error('Payment key generation failed:', paymentKeyResponse.status);
      return NextResponse.json(
        { error: 'Could not generate payment key' },
        { status: 500 }
      );
    }

    const paymentKey = await paymentKeyResponse.json();

    return NextResponse.json({
      paymentKey: paymentKey.token,
      paymobOrderId: paymobOrder.id,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
