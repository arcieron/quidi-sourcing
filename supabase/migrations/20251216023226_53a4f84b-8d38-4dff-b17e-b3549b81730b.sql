-- Drop existing tables
DROP TABLE IF EXISTS public.vendor_price_history CASCADE;
DROP TABLE IF EXISTS public.material_vendors CASCADE;
DROP TABLE IF EXISTS public.purchase_orders CASCADE;
DROP TABLE IF EXISTS public.materials CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;

-- Create single denormalized table matching Excel upload structure
CREATE TABLE public.parts_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Material fields
  material_number TEXT,
  basic_material TEXT,
  description TEXT,
  old_description TEXT,
  material_group TEXT,
  material_type TEXT,
  ext_material_group TEXT,
  size_dimension TEXT,
  
  -- Vendor fields
  vendor_code TEXT,
  vendor_name TEXT,
  business_partner TEXT,
  
  -- Purchase order fields
  purchasing_document TEXT,
  purchase_doc_item TEXT,
  purchasing_org TEXT,
  division TEXT,
  organizational_unit TEXT,
  po_value NUMERIC,
  po_quantity INTEGER,
  counter_of_po INTEGER,
  counter_of_material INTEGER,
  
  -- Metadata
  created_by TEXT,
  changed_by TEXT,
  created_on TIMESTAMP WITH TIME ZONE,
  changed_on TIMESTAMP WITH TIME ZONE,
  company_created TEXT,
  
  -- Additional fields
  in_stock BOOLEAN DEFAULT false,
  quantity INTEGER DEFAULT 0,
  price NUMERIC,
  location TEXT,
  weight NUMERIC,
  grade TEXT,
  certifications TEXT[],
  quality_score NUMERIC,
  avg_shipping_days NUMERIC,
  
  inserted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.parts_data ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Authenticated users can view parts data"
ON public.parts_data
FOR SELECT
USING (true);

-- Create indexes for common queries
CREATE INDEX idx_parts_material_number ON public.parts_data(material_number);
CREATE INDEX idx_parts_vendor_code ON public.parts_data(vendor_code);
CREATE INDEX idx_parts_description ON public.parts_data(description);