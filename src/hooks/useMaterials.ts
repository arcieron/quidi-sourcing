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
  // Parse dimensions from size_dimension string (e.g., "25x52x15mm")
  let dimensions = { length: 0, width: 0, height: 0, unit: "mm" };
  if (row.size_dimension) {
    const match = row.size_dimension.match(/(\d+)x(\d+)x(\d+)(\w+)?/);
    if (match) {
      dimensions = {
        length: parseInt(match[1]),
        width: parseInt(match[2]),
        height: parseInt(match[3]),
        unit: match[4] || "mm",
      };
    }
  }

  // Calculate match score based on available data
  const matchScore = calculateMatchScore(row);

  return {
    id: row.id,
    partNumber: row.material_number || "",
    description: row.description || "",
    material: row.basic_material || "Unknown",
    dimensions,
    vendor: {
      name: row.vendor_name || "Unknown Vendor",
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
    matchScore,
    matchBreakdown: {
      size: 85 + Math.random() * 15,
      material: 80 + Math.random() * 20,
      grade: 75 + Math.random() * 25,
      specifications: 80 + Math.random() * 20,
    },
    orderHistory: row.po_value ? [{
      date: row.created_on || new Date().toISOString(),
      quantity: row.po_quantity || 0,
      price: row.po_value || 0,
      vendor: row.vendor_name || "Unknown",
      division: row.division || "Unknown",
    }] : undefined,
    additionalMetadata: {
      weight: row.weight || undefined,
      grade: row.grade || undefined,
      certifications: row.certifications || undefined,
    },
  };
};

const calculateMatchScore = (row: PartsDataRow): number => {
  let score = 70;
  if (row.description) score += 10;
  if (row.in_stock) score += 10;
  if (row.grade) score += 5;
  if (row.certifications?.length) score += 5;
  return Math.min(score, 100);
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
