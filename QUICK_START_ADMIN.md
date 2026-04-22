# Quick Start Testing Guide

## Getting Started

### 1. Apply Database Migrations
```bash
# In Supabase SQL Editor, copy and execute:
# ADMIN_FEATURES_MIGRATION.sql
```

### 2. Set Environment Variables
Create/update `.env.local`:
```bash
ADMIN_PASSWORD=your-secure-password
ADMIN_PHONE_NUMBER=+201271085877
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 3. Start Development Server
```bash
npm run dev
```

## Testing Flows

### Test 2FA Login
1. Go to `http://localhost:3000/admin/login`
2. Enter your `ADMIN_PASSWORD`
3. Press "Continue"
4. **Check console output** for OTP code (format: 6 digits)
   ```
   🔐 2FA OTP for +201271085877: 123456
   ```
5. Enter that code in the OTP input
6. Press "Verify"
7. ✅ Should redirect to `/admin` dashboard

### Test Product Management
1. Navigate to **Products** tab
2. Click **"+ Add Product"** button
3. Fill in form:
   - Name: "Test Product"
   - Price: "99.99"
   - Description: "Test description"
   - Stock: "10"
   - Image URL: (optional)
4. Click **"Create Product"**
5. ✅ Product appears in grid
6. Click **"Edit"** to modify
7. Click **"Delete"** to remove (with confirmation)

### Test Sales Reports
1. Navigate to **Sales Reports** tab
2. Click **"By Date"** tab
3. ✅ See daily sales data (requires orders in DB)
4. Click **"By Product"** tab
5. ✅ See product performance metrics
6. Click **"Overview"** tab
7. ✅ See KPI summary cards

### Test Customer Insights
1. Navigate to **Customers** tab
2. ✅ View key metrics:
   - Total customers
   - Repeat rate
   - Churn rate
3. ✅ See top customers by spend
4. ✅ See at-risk customers (no purchase in 30 days)

### Test Analytics
1. Navigate to **Analytics** tab
2. Click **"Popular Products"**
   - ✅ See top 12 products ranked by sales
3. Click **"Revenue Forecast"**
   - ✅ See historical 30-day data
   - ✅ See 7-day forecast
   - ✅ See trend (upward/downward/stable)

## Troubleshooting

### OTP Not Showing in Console?
- Check browser console (F12 → Console tab)
- Look for message starting with "🔐"
- OTP is valid for 10 minutes

### Products Not Saving?
- Check Supabase connection
- Verify `twofa_verifications` and `products` tables exist
- Check browser console for errors

### Analytics Showing No Data?
- Need existing orders in database
- Go to Shop and create a test order
- Wait a moment for analytics to update
- Try refreshing the page

### "Invalid password" on login?
- Check `ADMIN_PASSWORD` in `.env.local`
- Ensure it matches what you entered
- Restart dev server after changing env vars

## Demo Data

### Create Test Products
```bash
# Use the Products tab UI to create:
- "Explorer's Quest" - 150 EGP, Stock: 50
- "Forbidden Odyssey" - 200 EGP, Stock: 30
- "Adventure Pack" - 99 EGP, Stock: 100
```

### Generate Test Sales Data
1. Go to Shop page
2. Add products to cart
3. Complete checkout
4. Order appears in Orders tab
5. Revenue data updates in Sales Reports & Analytics

## Performance Tips

- **First load** may take a moment as it fetches all data
- Analytics calculated in real-time from orders table
- Reports are not cached (always fresh)
- For large databases, consider adding pagination

## Security Checklist

Before production deployment:

- [ ] Change `ADMIN_PASSWORD` to strong value
- [ ] Set `ADMIN_PHONE_NUMBER` to your actual number
- [ ] Configure Twilio for real SMS (or use console OTP in dev)
- [ ] Test 2FA login flow
- [ ] Verify all database tables created
- [ ] Check RLS policies enabled
- [ ] Enable HTTPS in production
- [ ] Test all admin operations

## API Testing with cURL

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "price": 99.99,
    "description": "Test desc",
    "stock_level": 10
  }'
```

### Get Sales Report
```bash
curl "http://localhost:3000/api/admin/sales-report?type=overview"
curl "http://localhost:3000/api/admin/sales-report?type=by-date"
curl "http://localhost:3000/api/admin/sales-report?type=by-product"
```

### Get Analytics
```bash
curl "http://localhost:3000/api/admin/analytics?type=popular-products"
curl "http://localhost:3000/api/admin/analytics?type=revenue-forecast"
```

### Get Customer Insights
```bash
curl "http://localhost:3000/api/admin/customer-behavior"
```

## Support

For detailed setup instructions, see: `ADMIN_FEATURES_SETUP.md`
For implementation details, see: `IMPLEMENTATION_COMPLETE.md`
