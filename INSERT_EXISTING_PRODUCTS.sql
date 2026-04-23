-- Insert the 2 existing products into the database
INSERT INTO products (name, description, price, stock_level, image_url) VALUES
(
  'Explorer''s Quest',
  'A bold collection of five powerful scents for the man who commands every room he enters. Housed in a hand-crafted leather box with brass fittings. 5 x 30ml',
  2200,
  100,
  '/male-box.jpg'
),
(
  'Forbidden Odyssey',
  'Five intoxicating scents for the woman who leaves a trail wherever she goes. Presented in a crimson leather box — a treasure worth opening. 5 x 30ml',
  2200,
  100,
  '/female-box.jpg'
)
ON CONFLICT DO NOTHING;
