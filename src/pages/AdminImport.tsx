import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, CheckCircle2, Download } from "lucide-react";

const AdminImport = () => {
  const [markdownData, setMarkdownData] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [importStats, setImportStats] = useState<{
    totalRows: number;
    inserted: number;
  } | null>(null);
  const { toast } = useToast();

  const loadPresetData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/import-data.txt");
      const data = await response.text();
      setMarkdownData(data);
      toast({
        title: "Data loaded",
        description: "Excel data has been loaded. Click 'Start Import' to import.",
      });
    } catch (error) {
      toast({
        title: "Failed to load data",
        description: "Could not load preset data file.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!markdownData.trim()) {
      toast({
        title: "No data",
        description: "Please load or paste the markdown table data first.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportStats(null);

    try {
      const { data, error } = await supabase.functions.invoke("bulk-import", {
        body: { markdownData },
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
              Import all parts data from the Atlas Copco Excel file into a single table.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={loadPresetData} disabled={isLoading} variant="outline">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Load Excel Data (3000+ rows)
                  </>
                )}
              </Button>
            </div>

            <Textarea
              placeholder="Data will appear here after loading..."
              value={markdownData}
              onChange={(e) => setMarkdownData(e.target.value)}
              className="min-h-[200px] font-mono text-xs"
            />
            
            <div className="flex items-center gap-4">
              <Button onClick={handleImport} disabled={isImporting || !markdownData} size="lg">
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
              
              {markdownData && (
                <span className="text-sm text-muted-foreground">
                  {markdownData.split('\n').filter(l => l.startsWith('|')).length} lines detected
                </span>
              )}
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
