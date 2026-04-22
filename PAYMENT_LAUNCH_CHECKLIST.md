# Payment Security Pre-Launch Checklist

Complete all items before accepting real payments.

## Database Security ✓

- [✓] Run `DATABASE_MIGRATION.sql` in Supabase SQL Editor
- [ ] Verify payment columns added: `payment_transaction_id`, `payment_status`, `updated_at`
- [ ] Run RLS policies from `SECURITY_SETUP.md`
- [ ] Enable Row Level Security on orders table
- [ ] Test: Try to query orders directly - should respect RLS

## API Security ✓

- [ ] Admin login route uses `httpOnly: true` cookies
- [ ] Admin logout properly clears cookies
- [ ] `/api/send-order-email` validates all inputs
- [ ] `/api/paymob/auth` is server-side only
- [ ] `/api/paymob/payment-intent` validates amount and email
- [ ] `/api/paymob/callback` handles webhooks securely
- [ ] All API errors log to console, not to client
- [ ] No credentials exposed in error messages

## Environment Variables ✓

- [ ] `.env.local` is in `.gitignore`
- [ ] `PAYMOB_API_KEY` is set
- [ ] `PAYMOB_INTEGRATION_ID` is set
- [ ] `ADMIN_PASSWORD` is at least 20 characters
- [ ] `NODE_ENV=production` when deployed
- [ ] Never commit `.env.local`

## Security Headers ✓

- [ ] Middleware sets `X-Content-Type-Options: nosniff`
- [ ] Middleware sets `X-Frame-Options: DENY`
- [ ] Middleware sets `X-XSS-Protection`
- [ ] HSTS header enabled in production
- [ ] Content Security Policy configured (optional but recommended)

## Paymob Integration ✓

- [ ] Get API Key from Paymob Dashboard
- [ ] Get Integration ID for Card payments
- [ ] Set webhook URL in Paymob: `https://yourdomain.com/api/paymob/callback`
- [ ] Test payment flow with test cards
- [ ] Verify order status updates after payment
- [ ] Check webhook logs in Paymob dashboard

## Checkout Flow ✓

- [ ] Order is created in database BEFORE payment attempt
- [ ] Order ID is passed to payment-intent
- [ ] Paymob iframe loads for card input
- [ ] Card data never sent to your server
- [ ] Payment status updates after webhook
- [ ] Customer sees confirmation page
- [ ] Confirmation email is sent

## Testing ✓

- [ ] Test with Paymob test card: `4532015112830366`
- [ ] Verify successful payment updates order status
- [ ] Test with decline card: `5526840000000174`
- [ ] Verify failed payment shows error
- [ ] Test admin dashboard shows payment status
- [ ] Verify email contains order details
- [ ] Test on mobile/tablet/desktop

## Admin Panel ✓

- [ ] Admin login requires correct password
- [ ] Admin can view all orders
- [ ] Admin can update order status
- [ ] Status changes are saved to database
- [ ] Payment transaction IDs are visible
- [ ] Payment status shows completed/pending/failed
- [ ] Mobile view is aligned properly

## Compliance & Legal ✓

- [ ] Privacy Policy mentions Paymob payment processing
- [ ] Terms of Service include refund policy
- [ ] GDPR notice if serving EU customers
- [ ] Data retention policy for payment data
- [ ] SSL certificate is valid (HTTPS)
- [ ] Payment disclosure in checkout

## Production Deployment ✓

- [ ] Domain has valid SSL certificate (HTTPS only)
- [ ] Database backup is configured
- [ ] Logs are monitored for errors
- [ ] Admin credentials are strong
- [ ] Rate limiting is configured (optional)
- [ ] Monitoring/alerting is set up
- [ ] Payment webhook logs are checked regularly

## Post-Launch ✓

- [ ] Monitor first real transactions
- [ ] Check admin dashboard updates correctly
- [ ] Verify customer receives confirmation emails
- [ ] Monitor Paymob webhook logs
- [ ] Set up alerts for payment failures
- [ ] Regular backup of database
- [ ] Monthly security review

## Critical - NEVER DO THIS ✓

- ✅ Never store full credit card numbers
- ✅ Never log payment data
- ✅ Never expose API keys in client-side code
- ✅ Never commit `.env.local`
- ✅ Never disable HTTPS in production
- ✅ Never use weak admin passwords
- ✅ Never ignore security warnings
- ✅ Never skip SSL certificate validation

## Emergency Contacts

- **Paymob Support:** support@paymob.com
- **Your Domain Host:** [Your hosting provider]
- **Database Backups:** Check Supabase dashboard

## Next Steps

1. ✅ Run `DATABASE_MIGRATION.sql`
2. ✅ Get Paymob credentials
3. ✅ Set `.env.local` variables
4. ✅ Update checkout page with Paymob iframe code
5. ✅ Test with test cards
6. ✅ Deploy to production
7. ✅ Enable in Paymob live mode (when ready)

---

**Status:** Not ready for payments yet
- [ ] Mark this box when ALL items above are complete
- [ ] Then and ONLY THEN enable payment in production

