import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_PASSWORD) {
    const otp = generateOTP();
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minute expiry

    // Store OTP in Supabase
    const { error } = await supabase
      .from('twofa_verifications')
      .insert([
        {
          admin_id: 'admin',
          phone_number: process.env.ADMIN_PHONE_NUMBER || '+201271085877',
          otp_code: otp,
          is_verified: false,
          expires_at: expiresAt.toISOString(),
          attempts: 0,
        },
      ]);

    if (error) {
      console.error('Failed to store OTP:', error);
      return NextResponse.json({ error: 'Failed to process login' }, { status: 500 });
    }

    // Log OTP for development (remove in production)
    const adminPhone = process.env.ADMIN_PHONE_NUMBER || '+201271085877';
    console.log(`\n🔐 2FA OTP for ${adminPhone}: ${otp}\n`);

    // Attempt to send SMS via Twilio if credentials exist
    // Note: Install twilio SDK if you want SMS: npm install twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        // Only attempt if twilio is installed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const sendTwilioSMS = async () => {
          const https = require('https');
          const auth = Buffer.from(
            `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
          ).toString('base64');

          const data = new URLSearchParams({
            From: process.env.TWILIO_PHONE_NUMBER!,
            To: adminPhone,
            Body: `Your VENTURO Admin login code is: ${otp}. Valid for 10 minutes.`,
          }).toString();

          return new Promise((resolve, reject) => {
            const options = {
              hostname: 'api.twilio.com',
              path: `/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
              method: 'POST',
              auth: `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length,
              },
            };

            const req = https.request(options, (res: any) => {
              let body = '';
              res.on('data', (chunk: string) => body += chunk);
              res.on('end', () => {
                if (res.statusCode === 201) {
                  resolve(true);
                } else {
                  reject(new Error(`Twilio returned ${res.statusCode}`));
                }
              });
            });

            req.on('error', reject);
            req.write(data);
            req.end();
          });
        };

        await sendTwilioSMS();
        console.log(`✓ SMS sent to ${adminPhone}`);
      } catch (err) {
        console.error('Failed to send SMS:', err);
        // Continue anyway - user can use the console-logged OTP in dev
      }
    }

    return NextResponse.json({ 
      success: true, 
      sessionToken,
      message: 'OTP sent to your phone'
    });
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}