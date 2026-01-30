import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ParsedRow {
  material_number: string;
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
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { rows } = await req.json();
    
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "No rows provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log("Starting bulk import...");
    console.log(`Received ${rows.length} rows to import`);

    // Validate rows have material_number
    const validRows: ParsedRow[] = rows.filter((row: ParsedRow) => row.material_number);
    console.log(`${validRows.length} valid rows with material_number`);

    if (validRows.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid rows found to import" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Log first row for debugging
    console.log("First row:", JSON.stringify(validRows[0]));

    // Clear existing data
    console.log("Clearing existing data...");
    await supabase.from("parts_data").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // Insert in batches of 100
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < validRows.length; i += batchSize) {
      const batch = validRows.slice(i, i + batchSize);
      
      const { error } = await supabase.from("parts_data").insert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }
      
      insertedCount += batch.length;
      console.log(`Inserted ${insertedCount} / ${validRows.length} rows`);
    }

    console.log("Bulk import completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalRows: validRows.length,
          inserted: insertedCount,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Import error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
