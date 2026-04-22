import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === process.env.ADMIN_PASSWORD) {
      // 1. Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // 2. Store OTP in Supabase (expires in 5 mins)
      const { error } = await supabase.from('twofa_verifications').insert({
        admin_id: 'admin',
        otp_code: otp,
        expires_at: new Date(Date.now() + 5 * 60000).toISOString(),
        is_verified: false,
        attempts: 0
      });

      if (error) throw error;

      // 3. Log OTP to console (since we aren't using email/SMS yet)
      console.log(`[AUTH] Your 2FA Code is: ${otp}`);

      // 4. Tell frontend to proceed to 2FA step
      return NextResponse.json({ 
        success: true, 
        requires2FA: true 
      });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (err) {
    console.error('admin-login error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
