import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PartsDataRow } from "@/types/partsData";

const SEARCHABLE_FIELDS = [
  "material_number", "description", "material_group", "basic_material", 
  "vendor_name", "size_dimension", "grade", "division", "ext_material_group", 
  "material_type", "location", "vendor_code", "business_partner", 
  "purchasing_org", "organizational_unit"
];

const buildSearchFilter = (term: string): string => {
  return SEARCHABLE_FIELDS.map(field => `${field}.ilike.%${term}%`).join(",");
};

export const useMaterials = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["materials", searchQuery],
    queryFn: async (): Promise<PartsDataRow[]> => {
      let query = supabase.from("parts_data").select("*");
      
      if (searchQuery) {
        const terms = searchQuery.trim().split(/\s+/).filter(t => t.length > 0);
        
        for (const term of terms) {
          query = query.or(buildSearchFilter(term));
        }
      }
      
      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      return (data || []) as PartsDataRow[];
    },
    enabled: true,
  });
};

export const useSearchMaterials = () => {
  const search = async (query: string): Promise<PartsDataRow[]> => {
    const terms = query.trim().split(/\s+/).filter(t => t.length > 0);
    
    if (terms.length === 0) return [];
    
    let dbQuery = supabase.from("parts_data").select("*");
    
    for (const term of terms) {
      dbQuery = dbQuery.or(buildSearchFilter(term));
    }
    
    const { data, error } = await dbQuery.limit(100);

    if (error) throw error;
    return (data || []) as PartsDataRow[];
  };

  return { search };
};
