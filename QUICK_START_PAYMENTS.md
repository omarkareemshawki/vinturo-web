# Quick Start: Add Payments to Your Venturo Website

Your website is now secure for payments! Follow this quick guide to add Paymob.

## 1️⃣ Database Setup (5 minutes)

1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and run all SQL from `DATABASE_MIGRATION.sql`
4. Verify success message

## 2️⃣ Get Paymob Credentials (5 minutes)

1. Sign up at https://dashboard.paymob.com
2. Go to Settings → API Keys → Copy **API Key**
3. Go to Settings → Integration IDs → Copy your **Integration ID**
4. Save them (you'll need them next)

## 3️⃣ Configure Environment (2 minutes)

Add to your `.env.local`:
```
PAYMOB_API_KEY=your_api_key_from_paymob
PAYMOB_INTEGRATION_ID=your_integration_id_from_paymob
```

## 4️⃣ Update Checkout (10 minutes)

In your `app/checkout/page.tsx`, when user clicks "Place Order" with card payment:

```typescript
// Before: handleConfirm function

// BEFORE PAYMENT - Create order in DB first
const { data: order, error: insertError } = await supabase
  .from('orders')
  .insert({
    first_name: form.firstName,
    last_name: form.lastName,
    email: form.email,
    phone: form.phone,
    address: form.address,
    city: form.city,
    governorate: form.governorate,
    notes: form.notes,
    items: items,
    total: finalTotal,
    status: 'pending',
    payment_method: payment,
  })
  .select()
  .single();

if (insertError || !order) {
  setMessage('Error creating order');
  return;
}

// FOR CARD PAYMENT - Get payment key
if (payment === 'card') {
  const paymentResponse = await fetch('/api/paymob/payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: finalTotal,
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      orderId: order.id,
    }),
  });

  const { paymentKey } = await paymentResponse.json();

  // Load Paymob script
  const script = document.createElement('script');
  script.src = 'https://accept.paymob.com/lib/js/v4/accept.min.js';
  document.head.appendChild(script);

  script.onload = () => {
    // Show Paymob payment form
    window.PaymobCheckout({
      paymentToken: paymentKey,
      onSuccess: () => {
        // Payment successful - wait for webhook to confirm
        clearCart();
        setStep('confirmed');
      },
      onError: (error) => {
        setMessage('Payment failed: ' + error.message);
      },
    });
  };
} else {
  // COD - Order placed, payment to be collected
  clearCart();
  setStep('confirmed');
}
```

## 5️⃣ Test with Test Card (5 minutes)

1. Start your dev server: `npm run dev`
2. Go to http://localhost:3000
3. Add items and checkout
4. Select "Card" payment
5. Use test card: `4532015112830366`
6. Any future date and any CVV (e.g., 123)
7. Check admin dashboard - order status should update

## 6️⃣ Deploy & Go Live

When ready:

1. Deploy to production (Vercel, Netlify, etc.)
2. Add environment variables to your hosting
3. In Paymob Dashboard → Set webhook to: `https://yourdomain.com/api/paymob/callback`
4. Switch Paymob to "Live" mode
5. Test with real card (use small amount)
6. Monitor first transactions

## 🔒 Security Checklist

Before going live:
- [ ] `.env.local` is in `.gitignore`
- [ ] Database migration SQL was run
- [ ] HTTPS is enabled on production domain
- [ ] Admin password is strong (20+ characters)
- [ ] Paymob webhook is configured
- [ ] Test payment works and updates order

## 📚 Complete Guides

- `PAYMOB_INTEGRATION.md` - Detailed integration guide
- `SECURITY_SETUP.md` - Database and security setup
- `SECURITY_IMPLEMENTATION.md` - What was fixed
- `PAYMENT_LAUNCH_CHECKLIST.md` - Full pre-launch checklist

## ⚡ Troubleshooting

### "Payment key invalid"
Check your `PAYMOB_INTEGRATION_ID` is correct in Paymob dashboard

### "Order not updating after payment"
1. Verify webhook URL in Paymob dashboard
2. Check your `.env.local` has correct API key
3. Verify database migration was run

### "Card declined in test"
Use the correct test card: `4532015112830366`
Other cards will be declined (that's intentional for testing)

---

**That's it!** Your website now accepts payments securely. 🎉

For questions, check the guides above or contact Paymob support.

