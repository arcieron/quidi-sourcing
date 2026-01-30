import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SearchSidebar from "@/components/SearchSidebar";
import SearchInterface, { SearchType } from "@/components/SearchInterface";
import PartDetailDialog from "@/components/PartDetailDialog";
import DrillDownChat from "@/components/DrillDownChat";
import SearchConversation, { Message } from "@/components/SearchConversation";
import SimilarPartsSection from "@/components/SimilarPartsSection";
import { SearchHistory } from "@/types/part";
import { PartsDataRow } from "@/types/partsData";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchMaterials } from "@/hooks/useMaterials";
import { useSimilarParts } from "@/hooks/useSimilarParts";

const Index = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentResults, setCurrentResults] = useState<PartsDataRow[]>([]);
  const [selectedPart, setSelectedPart] = useState<PartsDataRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { search } = useSearchMaterials();
  const { similarParts, isLoading: isSimilarLoading, error: similarError, findSimilarParts, clearSimilarParts } = useSimilarParts();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSearch = async (query: string, searchType: SearchType = "keyword") => {
    try {
      clearSimilarParts();
      const results = await search(query, searchType);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: query,
      };
      
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "system",
        content: `Found ${results.length} matching parts${searchType === "semantic" ? " (AI-powered)" : ""}`,
        results: results,
      };
      
      setConversation([userMessage, systemMessage]);
      setCurrentResults(results);

      const newHistoryItem: SearchHistory = {
        id: Date.now().toString(),
        partNumber: query,
        timestamp: new Date(),
        resultsCount: results.length
      };
      setSearchHistory([newHistoryItem, ...searchHistory]);

      toast({
        title: "Search Complete",
        description: `Found ${results.length} matching parts for "${query}"`,
      });

      // Trigger AI similar parts analysis for exact/narrow searches (1-5 results)
      if (results.length >= 1 && results.length <= 5) {
        findSimilarParts(results[0]);
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search parts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectHistory = (partNumber: string) => {
    handleSearch(partNumber);
  };

  const handleSelectPart = (part: PartsDataRow) => {
    setSelectedPart(part);
    setIsDialogOpen(true);
  };

  const handleRefineSearch = (query: string) => {
    let filteredResults = [...currentResults];
    const lowerQuery = query.toLowerCase();
    
    // Filter by basic_material or material_group
    if (lowerQuery.includes("stainless steel 316") || lowerQuery.includes("316")) {
      filteredResults = filteredResults.filter(part => 
        (part.basic_material?.toLowerCase().includes("316")) ||
        (part.material_group?.toLowerCase().includes("316"))
      );
    } else if (lowerQuery.includes("304")) {
      filteredResults = filteredResults.filter(part => 
        (part.basic_material?.toLowerCase().includes("304")) ||
        (part.material_group?.toLowerCase().includes("304"))
      );
    } else if (lowerQuery.includes("in stock") || lowerQuery.includes("stock")) {
      filteredResults = filteredResults.filter(part => part.in_stock);
    } else if (lowerQuery.includes("previously ordered") || lowerQuery.includes("ordered")) {
      filteredResults = filteredResults.filter(part => part.po_value != null);
    } else if (lowerQuery.includes("chrome")) {
      filteredResults = filteredResults.filter(part => 
        part.basic_material?.toLowerCase().includes("chrome") ||
        part.material_group?.toLowerCase().includes("chrome")
      );
    } else if (lowerQuery.includes("steel")) {
      filteredResults = filteredResults.filter(part => 
        part.basic_material?.toLowerCase().includes("steel") ||
        part.material_group?.toLowerCase().includes("steel")
      );
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: query,
    };
    
    const systemMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "system",
      content: filteredResults.length > 0 
        ? `Filtered to ${filteredResults.length} matching parts`
        : "No parts match these criteria",
      results: filteredResults,
    };
    
    setConversation([...conversation, userMessage, systemMessage]);
    
    toast({
      title: "Search Refined",
      description: `Found ${filteredResults.length} matching parts`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <SearchSidebar 
          history={searchHistory}
          onSelectHistory={handleSelectHistory}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <SearchInterface onSearch={handleSearch} />
        
          <ScrollArea className="flex-1">
            <div className="max-w-6xl mx-auto p-6 pb-24">
              <SearchConversation 
                messages={conversation}
                onSelectPart={handleSelectPart}
              />
              
              {conversation.length > 0 && (
                <SimilarPartsSection
                  similarParts={similarParts}
                  isLoading={isSimilarLoading}
                  error={similarError}
                  onSelectPart={handleSelectPart}
                />
              )}
            </div>
          </ScrollArea>

          {/* DrillDownChat hidden for now
          {conversation.length > 0 && (
            <DrillDownChat onRefine={handleRefineSearch} />
          )}
          */}
        </div>
      </div>

      <PartDetailDialog
        part={selectedPart}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default Index;
