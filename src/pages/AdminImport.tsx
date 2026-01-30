import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, CheckCircle2, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

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

const AdminImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [importStats, setImportStats] = useState<{
    totalRows: number;
    inserted: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const cleanValue = (val: unknown): string | null => {
    if (val === undefined || val === null || val === "" || val === "-" || val === "N/A" || val === "#") return null;
    return String(val).trim();
  };

  const parseNumber = (val: unknown): number | null => {
    if (val === undefined || val === null || val === "" || val === "-" || val === "N/A") return null;
    const cleaned = String(val).replace(/[$,]/g, "").trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  };

  const parseInt_ = (val: unknown): number | null => {
    if (val === undefined || val === null || val === "" || val === "-" || val === "N/A") return null;
    const cleaned = String(val).replace(/[^\d.-]/g, "").trim();
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? null : num;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setParsedData([]);
    setImportStats(null);

    try {
      const data = await file.arrayBuffer();
      const isCsv = file.name.toLowerCase().endsWith('.csv');
      const workbook = XLSX.read(data, { type: 'array', raw: isCsv ? false : undefined });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

      const rows: ParsedRow[] = [];
      for (const row of jsonData as Record<string, unknown>[]) {
        const materialNumber = cleanValue(row["Material"]);
        if (!materialNumber) continue;

        rows.push({
          material_number: materialNumber,
          basic_material: cleanValue(row["Basic Material"]),
          changed_by: cleanValue(row["Changed By"]),
          business_partner: cleanValue(row["Business Partner"]),
          organizational_unit: cleanValue(row["Organizational Unit"]),
          changed_on: cleanValue(row["Changed on"]),
          company_created: cleanValue(row["Company Created"]),
          created_by: cleanValue(row["Created by"]),
          created_on: cleanValue(row["Created on"]),
          description: cleanValue(row["Desc. in English"]),
          old_description: cleanValue(row["Old description"]),
          ext_material_group: cleanValue(row["Ext. Matl Group"]),
          material_group: cleanValue(row["Material group"]),
          material_type: cleanValue(row["Material type"]),
          purchasing_document: cleanValue(row["Purchasing document"]),
          purchase_doc_item: cleanValue(row["Purchase doc Item"]),
          purchasing_org: cleanValue(row["Purchasing org."]),
          division: cleanValue(row["Division"]),
          size_dimension: cleanValue(row["Size/Dimension"]),
          vendor_code: cleanValue(row["Vendor"]),
          vendor_name: cleanValue(row["Vendor Name"]),
          counter_of_po: parseInt_(row["Counter of PO"]),
          counter_of_material: parseInt_(row["Counter of Material"]),
          po_value: parseNumber(row["PO Value"]),
          po_quantity: parseInt_(row["PO Quantity"]),
        });
      }

      setParsedData(rows);
      toast({
        title: "File parsed successfully",
        description: `Found ${rows.length} valid rows. Click 'Start Import' to import.`,
      });
    } catch (error) {
      console.error("Parse error:", error);
      toast({
        title: "Failed to parse file",
        description: error instanceof Error ? error.message : "Could not parse Excel file.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast({
        title: "No data",
        description: "Please select an Excel file first.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportStats(null);

    try {
      const { data, error } = await supabase.functions.invoke("bulk-import", {
        body: { rows: parsedData },
      });

      if (error) throw error;

      if (data.success) {
        setImportStats(data.stats);
        toast({
          title: "Import complete!",
          description: `Imported ${data.stats.inserted} rows into parts_data table.`,
        });
      } else {
        throw new Error(data.error || "Import failed");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Bulk Data Import</CardTitle>
          <CardDescription>
            Upload an Excel (.xlsx, .xls) or CSV file to import parts data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {selectedFile ? (
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {parsedData.length} rows ready to import
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">Click to select a file</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports .xlsx, .xls, and .csv files
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={handleImport} disabled={isImporting || parsedData.length === 0} size="lg">
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Start Import
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {importStats && (
          <Card className="border-green-500/50 bg-green-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                Import Successful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{importStats.totalRows}</div>
                  <div className="text-sm text-muted-foreground">Total Rows Parsed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{importStats.inserted}</div>
                  <div className="text-sm text-muted-foreground">Rows Inserted</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminImport;
