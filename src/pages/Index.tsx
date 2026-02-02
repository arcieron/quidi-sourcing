import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SearchSidebar, { FilterOptions, SelectedFilters } from "@/components/SearchSidebar";
import SearchInterface, { SearchType } from "@/components/SearchInterface";
import PartDetailDialog from "@/components/PartDetailDialog";
import SearchConversation, { Message } from "@/components/SearchConversation";
import SimilarPartsSection from "@/components/SimilarPartsSection";
import { SearchHistory } from "@/types/part";
import { PartsDataRow } from "@/types/partsData";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchMaterials } from "@/hooks/useMaterials";
import { useSimilarParts } from "@/hooks/useSimilarParts";

const emptyFilters: SelectedFilters = {
  material_group: [],
  material_type: [],
  company_created: [],
  purchasing_org: [],
  vendor_code: [],
};

const Index = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentResults, setCurrentResults] = useState<PartsDataRow[]>([]);
  const [selectedPart, setSelectedPart] = useState<PartsDataRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(emptyFilters);
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

  // Extract unique filter options from current results
  const filterOptions = useMemo<FilterOptions>(() => {
    const getUnique = (key: keyof PartsDataRow): string[] => {
      const values = currentResults
        .map(item => item[key])
        .filter((v): v is string => typeof v === "string" && v.trim() !== "");
      return [...new Set(values)].sort();
    };

    return {
      material_group: getUnique("material_group"),
      material_type: getUnique("material_type"),
      company_created: getUnique("company_created"),
      purchasing_org: getUnique("purchasing_org"),
      vendor_code: getUnique("vendor_code"),
    };
  }, [currentResults]);

  // Apply filters to results
  const filteredResults = useMemo(() => {
    return currentResults.filter(part => {
      for (const [key, values] of Object.entries(selectedFilters)) {
        if (values.length > 0) {
          const partValue = part[key as keyof PartsDataRow];
          if (typeof partValue !== "string" || !values.includes(partValue)) {
            return false;
          }
        }
      }
      return true;
    });
  }, [currentResults, selectedFilters]);

  // Update conversation with filtered results
  useEffect(() => {
    if (conversation.length > 0) {
      const lastSystemMessageIndex = conversation.length - 1;
      const lastMessage = conversation[lastSystemMessageIndex];
      
      if (lastMessage.type === "system" && lastMessage.results) {
        const activeFilterCount = Object.values(selectedFilters).flat().length;
        
        if (activeFilterCount > 0) {
          const updatedMessage: Message = {
            ...lastMessage,
            content: `Showing ${filteredResults.length} of ${currentResults.length} parts (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied)`,
            results: filteredResults,
          };
          setConversation(prev => [...prev.slice(0, -1), updatedMessage]);
        } else {
          const updatedMessage: Message = {
            ...lastMessage,
            content: `Found ${currentResults.length} matching parts`,
            results: currentResults,
          };
          setConversation(prev => [...prev.slice(0, -1), updatedMessage]);
        }
      }
    }
  }, [filteredResults, selectedFilters]);

  const handleFilterChange = (category: keyof SelectedFilters, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters(emptyFilters);
  };

  const handleSearch = async (query: string, searchType: SearchType = "keyword") => {
    try {
      clearSimilarParts();
      setSelectedFilters(emptyFilters);
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
          filterOptions={filterOptions}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
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
