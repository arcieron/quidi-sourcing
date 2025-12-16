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

function parseMarkdownRow(row: string): ParsedRow | null {
  const cells = row.split("|").map((cell) => cell.trim()).filter((cell) => cell !== "");
  
  if (cells.length < 10) return null;
  
  const clean = (val: string | undefined): string | null => {
    if (!val || val === "" || val === "-" || val === "N/A") return null;
    return val.trim();
  };

  const parseNumber = (val: string | undefined): number | null => {
    if (!val || val === "" || val === "-" || val === "N/A") return null;
    const num = parseFloat(val.replace(/,/g, ""));
    return isNaN(num) ? null : num;
  };

  const parseInt_ = (val: string | undefined): number | null => {
    if (!val || val === "" || val === "-" || val === "N/A") return null;
    const num = parseInt(val.replace(/,/g, ""), 10);
    return isNaN(num) ? null : num;
  };

  return {
    material_number: cells[0] || "",
    basic_material: clean(cells[1]),
    description: clean(cells[2]),
    old_description: clean(cells[3]),
    material_group: clean(cells[4]),
    material_type: clean(cells[5]),
    ext_material_group: clean(cells[6]),
    size_dimension: clean(cells[7]),
    vendor_code: clean(cells[8]),
    vendor_name: clean(cells[9]),
    business_partner: clean(cells[10]),
    purchasing_document: clean(cells[11]),
    purchase_doc_item: clean(cells[12]),
    purchasing_org: clean(cells[13]),
    division: clean(cells[14]),
    organizational_unit: clean(cells[15]),
    po_value: parseNumber(cells[16]),
    po_quantity: parseInt_(cells[17]),
    counter_of_po: parseInt_(cells[18]),
    counter_of_material: parseInt_(cells[19]),
    created_by: clean(cells[20]),
    changed_by: clean(cells[21]),
    created_on: clean(cells[22]),
    changed_on: clean(cells[23]),
    company_created: clean(cells[24]),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { markdownData } = await req.json();
    
    if (!markdownData) {
      return new Response(
        JSON.stringify({ error: "No markdown data provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log("Starting bulk import...");
    
    const lines = markdownData.split("\n").filter((line: string) => {
      const trimmed = line.trim();
      return trimmed.startsWith("|") && !trimmed.includes("---") && !trimmed.includes("Material number");
    });

    console.log(`Found ${lines.length} data rows to process`);

    const parsedRows: ParsedRow[] = [];
    for (const line of lines) {
      const parsed = parseMarkdownRow(line);
      if (parsed && parsed.material_number) {
        parsedRows.push(parsed);
      }
    }

    console.log(`Parsed ${parsedRows.length} valid rows`);

    // Clear existing data
    console.log("Clearing existing data...");
    await supabase.from("parts_data").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // Insert in batches of 100
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < parsedRows.length; i += batchSize) {
      const batch = parsedRows.slice(i, i + batchSize);
      
      const { error } = await supabase.from("parts_data").insert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }
      
      insertedCount += batch.length;
      console.log(`Inserted ${insertedCount} / ${parsedRows.length} rows`);
    }

    console.log("Bulk import completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalRows: parsedRows.length,
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
