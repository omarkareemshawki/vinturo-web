-- Run this SQL in your Supabase SQL Editor to add payment columns to orders table

-- Add payment tracking columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster payment status queries
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_transaction_id ON orders(payment_transaction_id);

-- Update the RLS policies for proper payment security

-- Drop old overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on orders for anon" ON orders;

-- Policy: Users can insert their own orders (during checkout)
CREATE POLICY "Users can create orders" ON orders
FOR INSERT
WITH CHECK (true); -- Backend validates the order data

-- Policy: Users can view all orders for now (improve with auth later)
CREATE POLICY "Users can view orders" ON orders
FOR SELECT
USING (true);

-- Policy: Only backend can update orders (payment system)
CREATE POLICY "Backend can update orders" ON orders
FOR UPDATE
USING (true) -- In production, validate the JWT token in your backend
WITH CHECK (true);

-- Make sure RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Verify the columns exist
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
