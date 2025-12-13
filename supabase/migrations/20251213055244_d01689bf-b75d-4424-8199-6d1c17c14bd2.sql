-- Create materials table (main parts table)
CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_number TEXT UNIQUE NOT NULL,
  basic_material TEXT,
  description TEXT,
  old_description TEXT,
  material_group TEXT,
  material_type TEXT,
  ext_material_group TEXT,
  size_dimension TEXT,
  created_by TEXT,
  created_on TIMESTAMPTZ,
  changed_by TEXT,
  changed_on TIMESTAMPTZ,
  company_created TEXT,
  price NUMERIC(12,2),
  in_stock BOOLEAN DEFAULT false,
  quantity INTEGER DEFAULT 0,
  location TEXT,
  schematics TEXT,
  weight NUMERIC(8,4),
  grade TEXT,
  certifications TEXT[]
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  business_partner TEXT,
  quality_score NUMERIC(5,2),
  avg_shipping_days NUMERIC(4,1)
);

-- Create purchase_orders table (for order history)
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  purchasing_document TEXT,
  purchase_doc_item TEXT,
  purchasing_org TEXT,
  organizational_unit TEXT,
  po_value NUMERIC(12,2),
  po_quantity INTEGER,
  counter_of_po INTEGER,
  counter_of_material INTEGER,
  division TEXT,
  created_on TIMESTAMPTZ DEFAULT NOW()
);

-- Create vendor_price_history table
CREATE TABLE public.vendor_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  price NUMERIC(12,2),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create material_vendors junction table
CREATE TABLE public.material_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  current_price NUMERIC(12,2),
  UNIQUE(material_id, vendor_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_vendors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users to read all data
CREATE POLICY "Authenticated users can view materials"
ON public.materials FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view vendors"
ON public.vendors FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view purchase orders"
ON public.purchase_orders FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view vendor price history"
ON public.vendor_price_history FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view material vendors"
ON public.material_vendors FOR SELECT TO authenticated
USING (true);

-- Insert sample vendors
INSERT INTO public.vendors (vendor_code, name, business_partner, quality_score, avg_shipping_days) VALUES
('SKF-001', 'SKF Industrial', 'SKF Group', 95.5, 3.5),
('FAG-001', 'FAG Bearings', 'Schaeffler Group', 92.0, 4.0),
('NSK-001', 'NSK Americas', 'NSK Ltd', 88.5, 5.0),
('TIMKEN-001', 'Timken Company', 'Timken Inc', 91.0, 3.0);

-- Insert sample materials
INSERT INTO public.materials (material_number, basic_material, description, material_group, material_type, size_dimension, price, in_stock, quantity, location, grade, certifications) VALUES
('6205-2RS', 'Steel', 'Deep Groove Ball Bearing 25x52x15mm', 'Bearings', 'Rolling Element', '25x52x15mm', 12.50, true, 150, 'Warehouse A', 'ABEC-3', ARRAY['ISO 9001', 'ISO 14001']),
('6206-ZZ', 'Steel', 'Deep Groove Ball Bearing 30x62x16mm', 'Bearings', 'Rolling Element', '30x62x16mm', 15.75, true, 85, 'Warehouse A', 'ABEC-5', ARRAY['ISO 9001']),
('6207-2RS', 'Steel', 'Deep Groove Ball Bearing 35x72x17mm', 'Bearings', 'Rolling Element', '35x72x17mm', 18.90, false, 0, 'Warehouse B', 'ABEC-3', ARRAY['ISO 9001', 'ISO 14001']),
('NU205-E', 'Steel', 'Cylindrical Roller Bearing 25x52x15mm', 'Bearings', 'Cylindrical Roller', '25x52x15mm', 45.00, true, 42, 'Warehouse C', 'ABEC-5', ARRAY['ISO 9001', 'API']),
('32205-J2', 'Steel', 'Tapered Roller Bearing 25x52x19.25mm', 'Bearings', 'Tapered Roller', '25x52x19.25mm', 28.50, true, 67, 'Warehouse A', 'ABEC-3', ARRAY['ISO 9001']);

-- Link materials to vendors
INSERT INTO public.material_vendors (material_id, vendor_id, current_price)
SELECT m.id, v.id, m.price * (0.9 + random() * 0.2)
FROM public.materials m
CROSS JOIN public.vendors v;

-- Insert sample purchase orders
INSERT INTO public.purchase_orders (material_id, vendor_id, purchasing_document, purchasing_org, organizational_unit, po_value, po_quantity, counter_of_po, division, created_on)
SELECT 
  m.id,
  v.id,
  'PO-' || LPAD((random() * 99999)::int::text, 6, '0'),
  'ORG-' || (1 + (random() * 3)::int)::text,
  'Manufacturing',
  (random() * 5000 + 500)::numeric(12,2),
  (random() * 100 + 10)::int,
  (random() * 10 + 1)::int,
  'Industrial Division',
  NOW() - (random() * 365 || ' days')::interval
FROM public.materials m
CROSS JOIN public.vendors v
WHERE random() > 0.5;

-- Insert vendor price history
INSERT INTO public.vendor_price_history (material_id, vendor_id, price, recorded_at)
SELECT 
  mv.material_id,
  mv.vendor_id,
  mv.current_price * (0.95 + random() * 0.1),
  NOW() - (i || ' months')::interval
FROM public.material_vendors mv
CROSS JOIN generate_series(1, 6) AS i;