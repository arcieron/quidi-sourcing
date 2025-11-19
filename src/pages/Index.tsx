import { useState } from "react";
import Header from "@/components/Header";
import SearchSidebar from "@/components/SearchSidebar";
import SearchInterface from "@/components/SearchInterface";
import ResultsSection from "@/components/ResultsSection";
import PartDetailDialog from "@/components/PartDetailDialog";
import DrillDownChat from "@/components/DrillDownChat";
import { Part, SearchHistory } from "@/types/part";
import { mockParts, mockSearchHistory } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(mockSearchHistory);
  const [searchResults, setSearchResults] = useState<Part[]>([]);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    // Simulate search - in production, this would call SAP API
    const results = mockParts.sort((a, b) => b.matchScore - a.matchScore);
    setSearchResults(results);

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
    handleSearch(query);
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
              <ResultsSection 
                parts={searchResults}
                onSelectPart={handleSelectPart}
              />
            </div>
          </ScrollArea>

          {searchResults.length > 0 && (
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
