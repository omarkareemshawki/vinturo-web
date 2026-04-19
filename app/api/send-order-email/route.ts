import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { form, items, total, payment } = body;

    const itemsHTML = items.map((item: any) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a2015; font-family: Georgia, serif; font-size: 14px; color: #E8DDD0; letter-spacing: 0.05em;">${item.name}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a2015; font-family: Georgia, serif; font-size: 14px; color: #E8DDD0; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a2015; font-family: Georgia, serif; font-size: 14px; color: #C9A96E; text-align: right;">${(item.price * item.quantity).toLocaleString()} EGP</td>
      </tr>
    `).join('');

    // Email to customer
    await resend.emails.send({
      from: 'Venturo <onboarding@resend.dev>',
      to: form.email,
      subject: 'Your Venturo Order — The Journey Begins',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; background-color: #0D0A07; font-family: Georgia, serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            
            <!-- Header -->
            <div style="text-align: center; padding: 40px 0; border-bottom: 1px solid #2a2015;">
              <p style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 6px; color: #C9A96E; text-transform: uppercase; margin: 0 0 12px;">MMXXVI</p>
              <h1 style="font-family: Georgia, serif; font-size: 36px; font-weight: 300; letter-spacing: 8px; color: #C9A96E; margin: 0;">VENTURO</h1>
            </div>

            <!-- Greeting -->
            <div style="padding: 40px 0; border-bottom: 1px solid #2a2015;">
              <h2 style="font-family: Georgia, serif; font-size: 24px; font-weight: 300; letter-spacing: 3px; color: #F5EFE6; margin: 0 0 20px;">Your Journey Begins, ${form.firstName}.</h2>
              <p style="font-family: Arial, sans-serif; font-size: 13px; color: #9A8F84; line-height: 1.8; margin: 0;">
                Thank you for your order. We have received it and will begin preparing your collection immediately.
                Your order will be delivered to ${form.city}, ${form.governorate} within 3–5 business days.
              </p>
            </div>

            <!-- Order Details -->
            <div style="padding: 40px 0; border-bottom: 1px solid #2a2015;">
              <p style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 4px; color: #C9A96E; text-transform: uppercase; margin: 0 0 20px;">Order Details</p>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 3px; color: #9A8F84; text-transform: uppercase; text-align: left; padding-bottom: 12px;">Item</th>
                    <th style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 3px; color: #9A8F84; text-transform: uppercase; text-align: center; padding-bottom: 12px;">Qty</th>
                    <th style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 3px; color: #9A8F84; text-transform: uppercase; text-align: right; padding-bottom: 12px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
              <div style="text-align: right; padding-top: 20px;">
                <p style="font-family: Arial, sans-serif; font-size: 11px; color: #9A8F84; margin: 0 0 8px;">Shipping: <span style="color: #C9A96E;">Free</span></p>
                <p style="font-family: Georgia, serif; font-size: 22px; color: #C9A96E; margin: 0;">${total.toLocaleString()} <span style="font-size: 12px; color: #9A8F84;">EGP</span></p>
              </div>
            </div>

            <!-- Delivery Info -->
            <div style="padding: 40px 0; border-bottom: 1px solid #2a2015;">
              <p style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 4px; color: #C9A96E; text-transform: uppercase; margin: 0 0 20px;">Delivery Information</p>
              <p style="font-family: Arial, sans-serif; font-size: 13px; color: #9A8F84; line-height: 1.8; margin: 0;">
                ${form.firstName} ${form.lastName}<br/>
                ${form.address}<br/>
                ${form.city}, ${form.governorate}<br/>
                ${form.phone}
              </p>
              <p style="font-family: Arial, sans-serif; font-size: 12px; color: #9A8F84; margin: 16px 0 0;">
                Payment: <span style="color: #E8DDD0;">${payment === 'cod' ? 'Cash on Delivery' : 'Credit / Debit Card'}</span>
              </p>
            </div>

            <!-- Footer -->
            <div style="padding: 40px 0; text-align: center;">
              <p style="font-family: Arial, sans-serif; font-size: 11px; color: #9A8F84; line-height: 1.8; margin: 0 0 20px;">
                Questions? Reach us at hello@venturo.eg<br/>
                or on Instagram <a href="https://www.instagram.com/venturo.eg" style="color: #C9A96E;">@venturo.eg</a>
              </p>
              <p style="font-family: Georgia, serif; font-size: 12px; letter-spacing: 4px; color: #2a2015; margin: 0;">© MMXXVI VENTURO</p>
            </div>

          </div>
        </body>
        </html>
      `,
    });

    // Notification email to you
    await resend.emails.send({
      from: 'Venturo Orders <onboarding@resend.dev>',
      to: 'okareem140@gmail.com',
      subject: `🖤 New Order — ${form.firstName} ${form.lastName} — ${total.toLocaleString()} EGP`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #0D0A07; color: #E8DDD0;">
          <h2 style="color: #C9A96E; letter-spacing: 3px; font-weight: 300;">NEW ORDER RECEIVED</h2>
          <hr style="border-color: #2a2015;"/>
          <p><strong style="color: #C9A96E;">Customer:</strong> ${form.firstName} ${form.lastName}</p>
          <p><strong style="color: #C9A96E;">Email:</strong> ${form.email}</p>
          <p><strong style="color: #C9A96E;">Phone:</strong> ${form.phone}</p>
          <p><strong style="color: #C9A96E;">Address:</strong> ${form.address}, ${form.city}, ${form.governorate}</p>
          <p><strong style="color: #C9A96E;">Payment:</strong> ${payment === 'cod' ? 'Cash on Delivery' : 'Card'}</p>
          <p><strong style="color: #C9A96E;">Total:</strong> ${total.toLocaleString()} EGP</p>
          <hr style="border-color: #2a2015;"/>
          <p><strong style="color: #C9A96E;">Items:</strong></p>
          ${items.map((item: any) => `<p style="margin: 4px 0;">— ${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} EGP</p>`).join('')}
          ${form.notes ? `<hr style="border-color: #2a2015;"/><p><strong style="color: #C9A96E;">Notes:</strong> ${form.notes}</p>` : ''}
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}