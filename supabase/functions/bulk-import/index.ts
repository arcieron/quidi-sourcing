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
  
  if (cells.length < 20) return null;
  
  const clean = (val: string | undefined): string | null => {
    if (!val || val === "" || val === "-" || val === "N/A" || val === "#") return null;
    return val.trim();
  };

  const parseNumber = (val: string | undefined): number | null => {
    if (!val || val === "" || val === "-" || val === "N/A") return null;
    // Remove $ and commas
    const cleaned = val.replace(/[$,]/g, "").trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  };

  const parseInt_ = (val: string | undefined): number | null => {
    if (!val || val === "" || val === "-" || val === "N/A") return null;
    // Remove any non-numeric characters except digits
    const cleaned = val.replace(/[^\d.-]/g, "").trim();
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? null : num;
  };

  // Mapping based on actual Excel header order:
  // |Basic Material|Changed By|Business Partner|Organizational Unit|Changed on|Company Created|Created by|Created on|Desc. in English|Old description|Ext. Matl Group|Material group|Material type||Purchasing document|Purchase doc Item|Purchasing org.||Size/Dimension|Vendor||Material|Counter of PO|Counter of Material|PO Value|PO Quantity|
  // Index: 0          1          2                3                   4          5               6          7          8                9               10             11              12            13 14                  15               16              17 18             19     20 21        22            23                  24        25

  const materialNumber = clean(cells[21]); // "Material" column
  if (!materialNumber) return null;

  return {
    material_number: materialNumber,
    basic_material: clean(cells[0]),
    changed_by: clean(cells[1]),
    business_partner: clean(cells[2]),
    organizational_unit: clean(cells[3]),
    changed_on: clean(cells[4]),
    company_created: clean(cells[5]),
    created_by: clean(cells[6]),
    created_on: clean(cells[7]),
    description: clean(cells[8]),
    old_description: clean(cells[9]),
    ext_material_group: clean(cells[10]),
    material_group: clean(cells[11]),
    material_type: clean(cells[12]),
    // cells[13] is empty
    purchasing_document: clean(cells[14]),
    purchase_doc_item: clean(cells[15]),
    purchasing_org: clean(cells[16]),
    // cells[17] is empty - was "division" placeholder
    division: clean(cells[17]),
    size_dimension: clean(cells[18]),
    vendor_code: clean(cells[19]),
    // cells[20] is empty
    vendor_name: clean(cells[20]),
    counter_of_po: parseInt_(cells[22]),
    counter_of_material: parseInt_(cells[23]),
    po_value: parseNumber(cells[24]),
    po_quantity: parseInt_(cells[25]),
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
      // Skip empty lines, separator rows (---), and header row
      if (!trimmed.startsWith("|")) return false;
      if (trimmed.includes("---")) return false;
      if (trimmed.includes("Basic Material") && trimmed.includes("Material group")) return false;
      return true;
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

    if (parsedRows.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid rows found to import" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Log first row for debugging
    console.log("First parsed row:", JSON.stringify(parsedRows[0]));

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
