import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Part } from "@/types/part";

interface PartsDataRow {
  id: string;
  material_number: string | null;
  basic_material: string | null;
  description: string | null;
  old_description: string | null;
  material_group: string | null;
  material_type: string | null;
  ext_material_group: string | null;
  size_dimension: string | null;
  vendor_code: string | null;
  vendor_name: string | null;
  business_partner: string | null;
  purchasing_document: string | null;
  purchase_doc_item: string | null;
  purchasing_org: string | null;
  division: string | null;
  organizational_unit: string | null;
  po_value: number | null;
  po_quantity: number | null;
  counter_of_po: number | null;
  counter_of_material: number | null;
  created_by: string | null;
  changed_by: string | null;
  created_on: string | null;
  changed_on: string | null;
  company_created: string | null;
  in_stock: boolean | null;
  quantity: number | null;
  price: number | null;
  location: string | null;
  weight: number | null;
  grade: string | null;
  certifications: string[] | null;
  quality_score: number | null;
  avg_shipping_days: number | null;
  inserted_at: string | null;
}

// Transform database row to Part interface
const transformRowToPart = (row: PartsDataRow): Part => {
  // Parse size/dimension - keep as-is for display
  const sizeDimension = row.size_dimension || "";

  return {
    id: row.id,
    partNumber: row.material_number || "",
    description: row.description || row.old_description || "",
    material: row.basic_material || row.material_group || "Unknown",
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: sizeDimension,
    },
    vendor: {
      name: row.vendor_name || row.vendor_code || "Unknown Vendor",
      rating: row.quality_score || 0,
      shippingTime: row.avg_shipping_days 
        ? `${row.avg_shipping_days} days` 
        : undefined,
      qualityScore: row.quality_score || undefined,
      priceHistory: [],
    },
    price: row.price || row.po_value || 0,
    inStock: row.in_stock || false,
    quantity: row.quantity || row.po_quantity || 0,
    location: row.location || undefined,
    matchScore: 85, // Base match score for search results
    matchBreakdown: undefined,
    orderHistory: row.po_value ? [{
      date: row.created_on || new Date().toISOString(),
      quantity: row.po_quantity || 0,
      price: row.po_value || 0,
      vendor: row.vendor_name || row.vendor_code || "Unknown",
      division: row.division || row.organizational_unit || "Unknown",
    }] : undefined,
    additionalMetadata: {
      weight: row.weight || undefined,
      grade: row.grade || row.material_type || undefined,
      certifications: row.certifications || undefined,
    },
  };
};

export const useMaterials = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["materials", searchQuery],
    queryFn: async (): Promise<Part[]> => {
      let query = supabase.from("parts_data").select("*");
      
      if (searchQuery) {
        query = query.or(
          `material_number.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,material_group.ilike.%${searchQuery}%,vendor_name.ilike.%${searchQuery}%`
        );
      }
      
      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      if (!data || data.length === 0) return [];

      return data.map((row) => transformRowToPart(row as PartsDataRow));
    },
    enabled: true,
  });
};

export const useSearchMaterials = () => {
  const search = async (query: string): Promise<Part[]> => {
    const { data, error } = await supabase
      .from("parts_data")
      .select("*")
      .or(
        `material_number.ilike.%${query}%,description.ilike.%${query}%,material_group.ilike.%${query}%,basic_material.ilike.%${query}%,vendor_name.ilike.%${query}%`
      )
      .limit(100);

    if (error) throw error;
    if (!data || data.length === 0) return [];

    return data.map((row) => transformRowToPart(row as PartsDataRow));
  };

  return { search };
};
