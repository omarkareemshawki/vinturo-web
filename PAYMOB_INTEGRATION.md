# Paymob Integration Guide

Your Venturo website is now secure for payment processing. Follow this guide to integrate Paymob.

## 1. Get Paymob Credentials

1. Sign up at https://dashboard.paymob.com
2. Go to Settings → API Keys → Copy your **API Key**
3. Go to Settings → Integration IDs → Find your **Integration ID** for Card payments
4. Add these to `.env.local`:

```
PAYMOB_API_KEY=your_api_key_here
PAYMOB_INTEGRATION_ID=your_integration_id_here
```

## 2. API Endpoints Created

Your server now has three secure payment endpoints:

### `/api/paymob/auth` (POST)
- Gets a session token from Paymob
- **Called automatically** by payment-intent route
- No input required

### `/api/paymob/payment-intent` (POST)
- Creates a payment intent for an order
- **Request:**
  ```json
  {
    "amount": 1500,
    "email": "customer@example.com",
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "phone": "201001234567",
    "orderId": "order-uuid-from-database"
  }
  ```
- **Response:**
  ```json
  {
    "paymentKey": "token_for_iframe",
    "paymobOrderId": 123456
  }
  ```

### `/api/paymob/callback` (POST)
- Paymob calls this when payment completes
- Automatically updates order status in database
- **Do NOT call this from client-side**

## 3. Update Checkout Page

In your checkout flow, when user selects "Card" payment:

```typescript
// Step 1: Create payment intent on server
const response = await fetch('/api/paymob/payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: finalTotal,
    email: form.email,
    firstName: form.firstName,
    lastName: form.lastName,
    phone: form.phone,
    orderId: orderIdFromDatabase, // Save order first!
  }),
});

const { paymentKey } = await response.json();

// Step 2: Load Paymob iframe
const script = document.createElement('script');
script.src = 'https://accept.paymob.com/lib/js/v4/accept.min.js';
document.head.appendChild(script);

// Step 3: When user clicks Pay, call:
window.PaymobCheckout({
  paymentToken: paymentKey,
  onSuccess: (response) => {
    // Payment successful - Paymob will call /api/paymob/callback
    // Your order status will be updated automatically
    router.push('/checkout?step=confirmed');
  },
  onError: (response) => {
    // Payment failed
    setError('Payment failed. Please try again.');
  },
});
```

## 4. Database Columns Needed

Add these fields to your `orders` table:

```sql
ALTER TABLE orders ADD COLUMN payment_transaction_id TEXT;
ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
```

## 5. Security Checklist Before Going Live

- ✅ `.env.local` is in `.gitignore` (NEVER commit credentials)
- ✅ Paymob credentials are set in environment
- ✅ RLS policies are applied to orders table
- ✅ Admin authentication uses httpOnly cookies
- ✅ API validates all input data
- ✅ HTTPS is enforced in production
- ✅ Paymob callback endpoint is secure (only accepts from Paymob)
- ✅ Customer card data never touches your server
- ✅ Only transaction IDs stored in database

## 6. Testing

### Test Mode
Paymob provides test card numbers:
- **Success:** `4532015112830366` / Any future date / Any CVV
- **Decline:** `5526840000000174` / Any future date / Any CVV

### Test Flow
1. Place test order with card payment
2. Use test card in Paymob iframe
3. Verify order status changes to "completed" in database
4. Check admin dashboard shows updated order

## 7. Webhook Setup (Paymob Dashboard)

1. Go to Paymob Dashboard → API → Webhooks
2. Set webhook URL: `https://yourdomain.com/api/paymob/callback`
3. Select events: `payment.success`, `payment.failed`
4. Paymob will POST payment results to this endpoint

## 8. Customer Flow

1. Customer adds items to cart
2. Clicks checkout
3. Fills delivery information
4. Selects "Card" payment
5. System creates order in database with `status: 'pending'`
6. Paymob iframe loads for card input
7. Customer enters card (never sent to your server)
8. Paymob processes payment
9. On success, webhook updates order to `status: 'completed'`
10. Customer sees confirmation page

## 9. Common Issues

### "Payment key invalid"
- Check `PAYMOB_INTEGRATION_ID` is correct
- Verify API key is valid

### "Order not found"
- Ensure order is created in database before creating payment intent
- Check order UUID format matches

### "Webhook not updating order"
- Verify webhook URL is publicly accessible
- Check Paymob dashboard webhook logs
- Ensure database has `payment_transaction_id` column

## 10. Support

- Paymob Docs: https://docs.paymob.com
- For issues: https://dashboard.paymob.com/support

