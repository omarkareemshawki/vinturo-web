import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// Paymob will call this endpoint to confirm payment status
// This updates your order status in the database

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Paymob sends the transaction data
    const {
      id,
      order,
      amount_cents,
      success,
      pending,
      is_auth,
      is_capture,
      merchant_order_id, // This is your order ID
    } = body;

    // Verify the callback is genuine (check with Paymob signature if available)
    // For now, we'll trust it's from Paymob (implement signature verification in production)

    if (!merchant_order_id) {
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      );
    }

    // Determine payment status
    let paymentStatus = 'pending';
    if (success) {
      paymentStatus = 'completed';
    } else if (pending) {
      paymentStatus = 'pending';
    } else {
      paymentStatus = 'failed';
    }

    // Update order in database
    const { error } = await supabase
      .from('orders')
      .update({
        status: paymentStatus === 'completed' ? 'processing' : 'cancelled',
        payment_transaction_id: id,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', merchant_order_id);

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json(
        { error: 'Could not update order' },
        { status: 500 }
      );
    }

    // Return success to Paymob
    return NextResponse.json({
      success: true,
      message: 'Order updated',
    });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
