import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PartsDataRow } from "@/types/partsData";

export const useMaterials = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["materials", searchQuery],
    queryFn: async (): Promise<PartsDataRow[]> => {
      let query = supabase.from("parts_data").select("*");
      
      if (searchQuery) {
        query = query.or(
          `material_number.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,material_group.ilike.%${searchQuery}%,vendor_name.ilike.%${searchQuery}%,basic_material.ilike.%${searchQuery}%,size_dimension.ilike.%${searchQuery}%,grade.ilike.%${searchQuery}%,division.ilike.%${searchQuery}%,ext_material_group.ilike.%${searchQuery}%,material_type.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,vendor_code.ilike.%${searchQuery}%,business_partner.ilike.%${searchQuery}%,purchasing_org.ilike.%${searchQuery}%,organizational_unit.ilike.%${searchQuery}%`
        );
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
    const { data, error } = await supabase
      .from("parts_data")
      .select("*")
      .or(
        `material_number.ilike.%${query}%,description.ilike.%${query}%,material_group.ilike.%${query}%,basic_material.ilike.%${query}%,vendor_name.ilike.%${query}%,size_dimension.ilike.%${query}%,grade.ilike.%${query}%,division.ilike.%${query}%,ext_material_group.ilike.%${query}%,material_type.ilike.%${query}%,location.ilike.%${query}%,vendor_code.ilike.%${query}%,business_partner.ilike.%${query}%,purchasing_org.ilike.%${query}%,organizational_unit.ilike.%${query}%`
      )
      .limit(100);

    if (error) throw error;
    return (data || []) as PartsDataRow[];
  };

  return { search };
};
