import { useState } from "react";
import Header from "@/components/Header";
import SearchSidebar from "@/components/SearchSidebar";
import SearchInterface from "@/components/SearchInterface";
import PartDetailDialog from "@/components/PartDetailDialog";
import DrillDownChat from "@/components/DrillDownChat";
import SearchConversation, { Message } from "@/components/SearchConversation";
import { Part, SearchHistory } from "@/types/part";
import { mockParts, mockSearchHistory } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(mockSearchHistory);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentResults, setCurrentResults] = useState<Part[]>([]);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    // Simulate search - in production, this would call SAP API
    const results = mockParts.sort((a, b) => b.matchScore - a.matchScore);
    
    // Reset conversation and show initial results
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: query,
    };
    
    const systemMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "system",
      content: `Found ${results.length} matching parts`,
      results: results,
    };
    
    setConversation([userMessage, systemMessage]);
    setCurrentResults(results);

    // Add to history
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
  };

  const handleSelectHistory = (partNumber: string) => {
    handleSearch(partNumber);
  };

  const handleSelectPart = (part: Part) => {
    setSelectedPart(part);
    setIsDialogOpen(true);
  };

  const handleRefineSearch = (query: string) => {
    // Filter based on the query
    let filteredResults = [...currentResults];
    const lowerQuery = query.toLowerCase();
    
    // Simple filtering logic - can be expanded
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
