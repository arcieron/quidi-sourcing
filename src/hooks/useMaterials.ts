import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Part } from "@/types/part";

interface MaterialWithVendors {
  id: string;
  material_number: string;
  basic_material: string | null;
  description: string | null;
  material_group: string | null;
  material_type: string | null;
  size_dimension: string | null;
  price: number | null;
  in_stock: boolean | null;
  quantity: number | null;
  location: string | null;
  grade: string | null;
  certifications: string[] | null;
  schematics: string | null;
  weight: number | null;
}

interface PurchaseOrderData {
  id: string;
  po_value: number | null;
  po_quantity: number | null;
  division: string | null;
  created_on: string | null;
  vendors: {
    name: string;
  } | null;
}

interface VendorPriceHistoryData {
  price: number | null;
  recorded_at: string | null;
}

interface MaterialVendorData {
  current_price: number | null;
  vendors: {
    id: string;
    name: string;
    vendor_code: string;
    quality_score: number | null;
    avg_shipping_days: number | null;
  } | null;
}

// Transform database material to Part interface
const transformMaterialToPart = (
  material: MaterialWithVendors,
  purchaseOrders: PurchaseOrderData[],
  vendorData: MaterialVendorData[],
  priceHistory: VendorPriceHistoryData[]
): Part => {
  // Get the first vendor for this material
  const primaryVendor = vendorData[0]?.vendors;
  
  // Parse dimensions from size_dimension string (e.g., "25x52x15mm")
  let dimensions = { length: 0, width: 0, height: 0, unit: "mm" };
  if (material.size_dimension) {
    const match = material.size_dimension.match(/(\d+)x(\d+)x(\d+)(\w+)?/);
    if (match) {
      dimensions = {
        length: parseInt(match[1]),
        width: parseInt(match[2]),
        height: parseInt(match[3]),
        unit: match[4] || "mm",
      };
    }
  }

  // Transform order history
  const orderHistory = purchaseOrders.map((po) => ({
    date: po.created_on || new Date().toISOString(),
    quantity: po.po_quantity || 0,
    price: po.po_value || 0,
    vendor: po.vendors?.name || "Unknown",
    division: po.division || "Unknown",
  }));

  // Transform price history
  const vendorPriceHistory = priceHistory.map((ph) => ({
    date: ph.recorded_at || new Date().toISOString(),
    price: ph.price || 0,
  }));

  // Calculate match score based on available data
  const matchScore = calculateMatchScore(material);

  return {
    id: material.id,
    partNumber: material.material_number,
    description: material.description || "",
    material: material.basic_material || "Unknown",
    dimensions,
    vendor: {
      name: primaryVendor?.name || "Unknown Vendor",
      rating: primaryVendor?.quality_score || 0,
      shippingTime: primaryVendor?.avg_shipping_days 
        ? `${primaryVendor.avg_shipping_days} days` 
        : undefined,
      qualityScore: primaryVendor?.quality_score || undefined,
      priceHistory: vendorPriceHistory,
    },
    price: material.price || 0,
    inStock: material.in_stock || false,
    quantity: material.quantity || 0,
    location: material.location || undefined,
    matchScore,
    matchBreakdown: {
      size: 85 + Math.random() * 15,
      material: 80 + Math.random() * 20,
      grade: 75 + Math.random() * 25,
      specifications: 80 + Math.random() * 20,
    },
    orderHistory: orderHistory.length > 0 ? orderHistory : undefined,
    schematics: material.schematics || undefined,
    additionalMetadata: {
      weight: material.weight || undefined,
      grade: material.grade || undefined,
      certifications: material.certifications || undefined,
    },
  };
};

const calculateMatchScore = (material: MaterialWithVendors): number => {
  let score = 70;
  if (material.description) score += 10;
  if (material.in_stock) score += 10;
  if (material.grade) score += 5;
  if (material.certifications?.length) score += 5;
  return Math.min(score, 100);
};

export const useMaterials = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["materials", searchQuery],
    queryFn: async (): Promise<Part[]> => {
      // Fetch materials
      let query = supabase.from("materials").select("*");
      
      if (searchQuery) {
        query = query.or(
          `material_number.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,material_group.ilike.%${searchQuery}%`
        );
      }
      
      const { data: materials, error: materialsError } = await query;
      
      if (materialsError) throw materialsError;
      if (!materials || materials.length === 0) return [];

      const materialIds = materials.map((m) => m.id);

      // Fetch related data for all materials
      const [purchaseOrdersResult, materialVendorsResult, priceHistoryResult] = await Promise.all([
        supabase
          .from("purchase_orders")
          .select("id, po_value, po_quantity, division, created_on, material_id, vendors(name)")
          .in("material_id", materialIds),
        supabase
          .from("material_vendors")
          .select("material_id, current_price, vendors(id, name, vendor_code, quality_score, avg_shipping_days)")
          .in("material_id", materialIds),
        supabase
          .from("vendor_price_history")
          .select("material_id, price, recorded_at")
          .in("material_id", materialIds)
          .order("recorded_at", { ascending: false }),
      ]);

      // Transform each material to Part
      return materials.map((material) => {
        const materialPOs = (purchaseOrdersResult.data || [])
          .filter((po) => po.material_id === material.id)
          .map(po => ({
            ...po,
            vendors: po.vendors as { name: string } | null
          }));
        
        const materialVendors = (materialVendorsResult.data || [])
          .filter((mv) => mv.material_id === material.id)
          .map(mv => ({
            ...mv,
            vendors: mv.vendors as {
              id: string;
              name: string;
              vendor_code: string;
              quality_score: number | null;
              avg_shipping_days: number | null;
            } | null
          }));
        
        const materialPriceHistory = (priceHistoryResult.data || [])
          .filter((ph) => ph.material_id === material.id);

        return transformMaterialToPart(
          material as MaterialWithVendors,
          materialPOs,
          materialVendors,
          materialPriceHistory
        );
      });
    },
    enabled: true,
  });
};

export const useSearchMaterials = () => {
  const search = async (query: string): Promise<Part[]> => {
    const { data: materials, error } = await supabase
      .from("materials")
      .select("*")
      .or(
        `material_number.ilike.%${query}%,description.ilike.%${query}%,material_group.ilike.%${query}%,basic_material.ilike.%${query}%`
      );

    if (error) throw error;
    if (!materials || materials.length === 0) return [];

    const materialIds = materials.map((m) => m.id);

    const [purchaseOrdersResult, materialVendorsResult, priceHistoryResult] = await Promise.all([
      supabase
        .from("purchase_orders")
        .select("id, po_value, po_quantity, division, created_on, material_id, vendors(name)")
        .in("material_id", materialIds),
      supabase
        .from("material_vendors")
        .select("material_id, current_price, vendors(id, name, vendor_code, quality_score, avg_shipping_days)")
        .in("material_id", materialIds),
      supabase
        .from("vendor_price_history")
        .select("material_id, price, recorded_at")
        .in("material_id", materialIds)
        .order("recorded_at", { ascending: false }),
    ]);

    return materials.map((material) => {
      const materialPOs = (purchaseOrdersResult.data || [])
        .filter((po) => po.material_id === material.id)
        .map(po => ({
          ...po,
          vendors: po.vendors as { name: string } | null
        }));
      
      const materialVendors = (materialVendorsResult.data || [])
        .filter((mv) => mv.material_id === material.id)
        .map(mv => ({
          ...mv,
          vendors: mv.vendors as {
            id: string;
            name: string;
            vendor_code: string;
            quality_score: number | null;
            avg_shipping_days: number | null;
          } | null
        }));
      
      const materialPriceHistory = (priceHistoryResult.data || [])
        .filter((ph) => ph.material_id === material.id);

      return transformMaterialToPart(
        material as MaterialWithVendors,
        materialPOs,
        materialVendors,
        materialPriceHistory
      );
    });
  };

  return { search };
};
