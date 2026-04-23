-- Add gender column to products table
-- Gender can be: 'male', 'female', 'unisex', or NULL (for existing products)

ALTER TABLE products ADD COLUMN IF NOT EXISTS gender VARCHAR(10) DEFAULT 'unisex';

-- Create index for gender-based filtering
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);

-- Add check constraint to ensure only valid values
ALTER TABLE products
ADD CONSTRAINT check_valid_gender 
CHECK (gender IN ('male', 'female', 'unisex'));

-- Add notes column to store product notes/tags as JSON array
ALTER TABLE products ADD COLUMN IF NOT EXISTS notes JSONB DEFAULT '[]'::jsonb;

-- Create index for notes queries
CREATE INDEX IF NOT EXISTS idx_products_notes ON products USING gin(notes);
