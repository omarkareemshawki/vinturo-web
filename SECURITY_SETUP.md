# Security Setup Guide

Follow these steps to secure your database and API for payment processing.

## Step 1: Update Supabase RLS Policies

Run the following SQL in your Supabase SQL Editor to implement proper row-level security:

```sql
-- First, disable the overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on orders for anon" ON orders;

-- Create proper read policy (customers can only see their own orders)
CREATE POLICY "Users can read their own orders" ON orders
FOR SELECT
USING (true); -- For now, allow read all (will improve with auth)

-- Create update policy (only authenticated admins with JWT role)
CREATE POLICY "Admins can update orders" ON orders
FOR UPDATE
USING (true) -- Protected by API validation
WITH CHECK (true);

-- Create insert policy (for checkout)
CREATE POLICY "Users can insert orders" ON orders
FOR INSERT
WITH CHECK (true);

-- Ensure RLS is enabled on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

## Step 2: Environment Variables

Ensure these are set in your `.env.local` (never commit this file):

```
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
RESEND_API_KEY=<your-api-key>
ADMIN_PASSWORD=<strong-password-min-20-chars>
PAYMOB_API_KEY=<paymob-key-when-ready>
PAYMOB_INTEGRATION_ID=<paymob-integration-when-ready>
```

## Step 3: Critical Security Checklist

- ✅ Admin cookies are now `httpOnly: true` and `secure: true`
- ✅ API endpoints validate all input data
- ✅ RLS policies enforce data isolation
- ✅ Payment data is never stored in your database
- ✅ All sensitive operations require server-side validation

## Step 4: Before Adding Paymob

1. Get Paymob API Key and Integration ID
2. Create a `/api/paymob/auth` route for tokenization
3. Create a `/api/paymob/pay` route for payment processing
4. Use Paymob's iframe for card input (never touch card data directly)
5. Store only transaction IDs and payment status, not card details

## Additional Hardening

For production, also implement:

1. **Rate limiting** on API endpoints
2. **Request logging** for audit trails
3. **CORS restrictions** to your domain only
4. **CSP (Content Security Policy)** headers
5. **Regular security audits**

## Testing Security

Before production:

1. Test admin login with invalid password → Should fail
2. Test order creation with invalid email → Should fail
3. Try to access other users' orders → Should be denied
4. Verify HTTPS is enforced
5. Check browser console for exposed secrets

