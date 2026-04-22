/*import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const { sessionToken, otp } = await request.json();

  if (!sessionToken || !otp) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Fetch the most recent OTP for admin
  const { data: otpRecords, error: fetchError } = await supabase
    .from('twofa_verifications')
    .select('*')
    .eq('admin_id', 'admin')
    .eq('is_verified', false)
    .order('created_at', { ascending: false })
    .limit(1);

  if (fetchError || !otpRecords || otpRecords.length === 0) {
    return NextResponse.json({ error: '2FA session not found' }, { status: 401 });
  }

  const otpRecord = otpRecords[0];

  // Check expiration
  if (new Date() > new Date(otpRecord.expires_at)) {
    // Mark as expired
    await supabase
      .from('twofa_verifications')
      .update({ is_verified: false })
      .eq('id', otpRecord.id);

    return NextResponse.json({ error: 'OTP expired' }, { status: 401 });
  }

  // Check attempts (rate limiting)
  if (otpRecord.attempts >= 3) {
    return NextResponse.json({ error: 'Too many attempts. Please try again.' }, { status: 401 });
  }

  // Verify OTP
  if (otp !== otpRecord.otp_code) {
    // Increment attempts
    await supabase
      .from('twofa_verifications')
      .update({ attempts: otpRecord.attempts + 1 })
      .eq('id', otpRecord.id);

    return NextResponse.json({ error: 'Invalid OTP code' }, { status: 401 });
  }

  // OTP verified - mark as verified
  const { error: updateError } = await supabase
    .from('twofa_verifications')
    .update({ is_verified: true })
    .eq('id', otpRecord.id);

  if (updateError) {
    console.error('Failed to verify OTP:', updateError);
    return NextResponse.json({ error: 'Failed to process verification' }, { status: 500 });
  }

  // Set auth cookie
  const response = NextResponse.json({ success: true, message: '2FA verified' });
  response.cookies.set('admin_auth', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  console.log('✓ Admin 2FA successful');

  return response;
}
*/
import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ message: "2FA is disabled" });
}
