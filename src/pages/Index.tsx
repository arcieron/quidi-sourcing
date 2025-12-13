import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SearchSidebar from "@/components/SearchSidebar";
import SearchInterface from "@/components/SearchInterface";
import PartDetailDialog from "@/components/PartDetailDialog";
import DrillDownChat from "@/components/DrillDownChat";
import SearchConversation, { Message } from "@/components/SearchConversation";
import { Part, SearchHistory } from "@/types/part";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchMaterials } from "@/hooks/useMaterials";

const Index = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentResults, setCurrentResults] = useState<Part[]>([]);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { search } = useSearchMaterials();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSearch = async (query: string) => {
    try {
      const results = await search(query);
      const sortedResults = results.sort((a, b) => b.matchScore - a.matchScore);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: query,
      };
      
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "system",
        content: `Found ${sortedResults.length} matching parts`,
        results: sortedResults,
      };
      
      setConversation([userMessage, systemMessage]);
      setCurrentResults(sortedResults);

      const newHistoryItem: SearchHistory = {
        id: Date.now().toString(),
        partNumber: query,
        timestamp: new Date(),
        resultsCount: sortedResults.length
      };
      setSearchHistory([newHistoryItem, ...searchHistory]);

      toast({
        title: "Search Complete",
        description: `Found ${sortedResults.length} matching parts for "${query}"`,
      });
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

  const handleSelectPart = (part: Part) => {
    setSelectedPart(part);
    setIsDialogOpen(true);
  };

  const handleRefineSearch = (query: string) => {
    let filteredResults = [...currentResults];
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("stainless steel 316") || lowerQuery.includes("316")) {
      filteredResults = filteredResults.filter(part => 
        part.material.toLowerCase().includes("stainless steel 316")
      );
    } else if (lowerQuery.includes("304")) {
      filteredResults = filteredResults.filter(part => 
        part.material.toLowerCase().includes("304")
      );
    } else if (lowerQuery.includes("in stock") || lowerQuery.includes("stock")) {
      filteredResults = filteredResults.filter(part => part.inStock);
    } else if (lowerQuery.includes("previously ordered") || lowerQuery.includes("ordered")) {
      filteredResults = filteredResults.filter(part => part.orderHistory && part.orderHistory.length > 0);
    } else if (lowerQuery.includes("chrome")) {
      filteredResults = filteredResults.filter(part => 
        part.material.toLowerCase().includes("chrome")
      );
    } else if (lowerQuery.includes("steel")) {
      filteredResults = filteredResults.filter(part => 
        part.material.toLowerCase().includes("steel")
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
            </div>
          </ScrollArea>

          {conversation.length > 0 && (
            <DrillDownChat onRefine={handleRefineSearch} />
          )}
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
