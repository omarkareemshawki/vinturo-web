-- Migrations for new admin features
-- Products table for inventory management

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock_level INTEGER DEFAULT 0,
  image_url TEXT,
  image_key TEXT, -- Store the object key for deletion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT, -- admin identifier
  created_at_unix BIGINT -- For analytics
);

-- Create index for faster product lookups
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- 2FA Verification table
CREATE TABLE IF NOT EXISTS twofa_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE
);

-- Create index for OTP verification
CREATE INDEX IF NOT EXISTS idx_twofa_admin_id ON twofa_verifications(admin_id);
CREATE INDEX IF NOT EXISTS idx_twofa_expires_at ON twofa_verifications(expires_at);

-- Product Sales Analytics table
CREATE TABLE IF NOT EXISTS product_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  units_sold INTEGER DEFAULT 0,
  total_revenue NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_product_analytics_date ON product_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_product_analytics_product_id ON product_analytics(product_id);

-- Customer Behavior table
CREATE TABLE IF NOT EXISTS customer_behavior (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  total_purchases INTEGER DEFAULT 0,
  total_spent NUMERIC(10, 2) DEFAULT 0,
  last_purchase_at TIMESTAMP WITH TIME ZONE,
  favorite_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  purchase_frequency TEXT, -- 'one-time', 'repeat', 'frequent'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for customer analytics
CREATE INDEX IF NOT EXISTS idx_customer_behavior_email ON customer_behavior(customer_email);
CREATE INDEX IF NOT EXISTS idx_customer_behavior_total_spent ON customer_behavior(total_spent DESC);

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS policies for products (admin only - via app logic)
CREATE POLICY "Products are viewable by all" ON products
FOR SELECT
USING (true);

CREATE POLICY "Products can be created by backend" ON products
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Products can be updated by backend" ON products
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Products can be deleted by backend" ON products
FOR DELETE
USING (true);

-- Enable RLS on 2FA verifications
ALTER TABLE twofa_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "2FA records are backend only" ON twofa_verifications
FOR ALL
USING (true)
WITH CHECK (true);

-- Enable RLS on analytics tables
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_behavior ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Analytics are viewable" ON product_analytics
FOR SELECT
USING (true);

CREATE POLICY "Analytics are backend only" ON customer_behavior
FOR SELECT
USING (true);

-- Create a function to auto-update updated_at for products
CREATE OR REPLACE FUNCTION update_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_updated_at();

-- Create a function to auto-update customer_behavior updated_at
CREATE OR REPLACE FUNCTION update_customer_behavior_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for customer_behavior
DROP TRIGGER IF EXISTS update_customer_behavior_updated_at ON customer_behavior;
CREATE TRIGGER update_customer_behavior_updated_at
  BEFORE UPDATE ON customer_behavior
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_behavior_updated_at();
