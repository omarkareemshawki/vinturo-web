# Admin Features Setup Guide

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Admin Authentication
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_PHONE_NUMBER=+201271085877

# Twilio SMS Configuration (Optional - for real 2FA)
# If not configured, OTP will be logged to console during development
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

Run the SQL migration in your Supabase SQL Editor:

```bash
# Copy the contents of: ADMIN_FEATURES_MIGRATION.sql
# Paste into Supabase SQL Editor and execute
```

This creates:
- `products` table - for product management
- `twofa_verifications` table - for 2FA OTP storage
- `product_analytics` table - for sales analytics
- `customer_behavior` table - for customer insights

## Features Added

### 1. Two-Factor Authentication (2FA)
- **Login Flow**: Password → 2FA Code
- **Phone Number**: +201271085877 (configurable via env)
- **OTP Method**: SMS via Twilio (or console logging for dev)
- **OTP Validity**: 10 minutes
- **Rate Limiting**: 3 attempts max
- **Database Storage**: `twofa_verifications` table in Supabase

**How it works:**
1. Admin enters password on `/admin/login`
2. System generates 6-digit OTP and sends SMS
3. Admin enters OTP on same page
4. If valid, authentication cookie is set
5. Admin redirected to `/admin` dashboard

### 2. Product Management
- **Create**: Add new products with name, description, price, stock, image
- **Edit**: Modify existing product details
- **Delete**: Remove products with confirmation
- **Stock Management**: Track inventory levels
- **Image Upload**: Support for product images

**API Endpoints:**
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create new product
- `PUT /api/products` - Update product
- `DELETE /api/products?id={id}` - Delete product
- `POST /api/products/upload-image` - Upload product image

### 3. Sales Reports
- **Overview**: Total revenue, orders, cancel rate, avg order value
- **By Product**: Units sold, revenue, and metrics per product
- **By Date**: Daily sales, revenue, and order counts
- **Date Filtering**: Filter reports by date range

**API Endpoint:**
- `GET /api/admin/sales-report?type={overview|by-product|by-date}`

### 4. Customer Behavior Insights
- **Metrics**: Total customers, repeat rate, churn rate
- **Top Customers**: Most valuable customers by spend
- **At-Risk Customers**: Customers not seen in 30 days
- **Purchase Frequency**: Categorization of customers
- **Insights**: Repeat customer analysis and churn prediction

**API Endpoint:**
- `GET /api/admin/customer-behavior`

### 5. Revenue Forecasting
- **Historical Analysis**: Last 30 days of sales data
- **Trend Detection**: Upward, downward, or stable trends
- **7-Day Forecast**: Predicted revenue for next week
- **Confidence Levels**: High/medium confidence on predictions
- **Metrics**: Daily average revenue, sales consistency

**API Endpoint:**
- `GET /api/admin/analytics?type=revenue-forecast`

### 6. Popular Products Analysis
- **Ranking**: Products sorted by units sold
- **Metrics**: Units, revenue, order count, average price
- **Top 12**: Visual display of top performing products
- **Real-Time**: Updated based on actual order data

**API Endpoint:**
- `GET /api/admin/analytics?type=popular-products`

## Admin Dashboard Tabs

Access the admin dashboard at `/admin` with these tabs:

1. **Overview** - KPI cards, revenue chart (last 7 days), product sales, payment methods
2. **Orders** - Order management with status updates
3. **Products** - Product CRUD operations and inventory
4. **Sales Reports** - Multiple report views and metrics
5. **Customers** - Customer insights and behavior analysis
6. **Analytics** - Popular products and revenue forecasting

## Development Notes

### 2FA in Development
During development, OTPs are logged to console:
```
🔐 2FA OTP for +201271085877: 123456
```

Use this code to verify login. In production, configure Twilio for SMS delivery.

### Database Indexes
Indexes are created for optimal query performance on:
- Product lookups
- Sales analytics queries
- Customer behavior analysis
- 2FA verification lookups

### Security Considerations
- ✅ HTTPOnly cookies for auth
- ✅ Rate limiting on 2FA (3 attempts)
- ✅ OTP expiration (10 minutes)
- ✅ Secure password validation
- ✅ RLS policies on database tables
- ⚠️ Use strong `ADMIN_PASSWORD` in production
- ⚠️ Never commit `.env.local` to git

## Testing the Features

### Test 2FA
1. Go to `/admin/login`
2. Enter password
3. Check console for OTP
4. Enter OTP on next screen
5. Should redirect to `/admin`

### Test Products
1. Go to Products tab
2. Click "+ Add Product"
3. Fill in details and submit
4. Product appears in grid
5. Can edit or delete

### Test Analytics
1. Go to Sales Reports/Analytics tabs
2. Select different report types
3. View real data from your orders

## Troubleshooting

**Products not showing up?**
- Verify database migration was run
- Check Supabase table exists
- Check RLS policies are correct

**2FA not sending SMS?**
- Twilio credentials must be set in env
- Check Twilio account has credits
- OTP will still log to console as fallback

**Analytics showing no data?**
- Need existing orders in database
- Check date range if filtering
- Verify orders table has correct structure

## Production Deployment

Before deploying to production:

1. ✅ Update `ADMIN_PASSWORD` to strong secure value
2. ✅ Configure Twilio SMS service
3. ✅ Set `TWILIO_*` environment variables
4. ✅ Verify all database migrations applied
5. ✅ Test 2FA login flow
6. ✅ Test all product operations
7. ✅ Verify analytics data accuracy
8. ✅ Enable RLS on all tables (already done in migration)
9. ✅ Set secure cookie flags (already done)
10. ✅ Monitor admin login attempts in database

## Future Enhancements

- [ ] Multiple admin users with different roles
- [ ] Admin activity logging
- [ ] Export reports to CSV/PDF
- [ ] Automated email alerts for low stock
- [ ] Advanced forecasting (ML-based)
- [ ] Discount and promotion management
- [ ] Bulk product import/export
- [ ] Customer segmentation
- [ ] A/B testing dashboard
