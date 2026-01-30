import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SearchType = "keyword" | "semantic";

interface SearchInterfaceProps {
  onSearch: (query: string, searchType: SearchType) => void;
}

const SearchInterface = ({ onSearch }: SearchInterfaceProps) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("keyword");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType);
    }
  };

  return (
    <div className="border-b border-border bg-card p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-2">Quidi Sourcing Tool</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Search for parts, compare costs, and find the best vendors across divisions
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter part number or material description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="gap-2">
            <Search className="h-4 w-4" />
            Find Parts
          </Button>
        </form>
        
        {/* Search Options */}
        <div className="flex items-center gap-4 mt-4">
          <Select value={searchType} onValueChange={(value: SearchType) => setSearchType(value)}>
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="semantic">Semantic</SelectItem>
              <SelectItem value="keyword">Keyword</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">
            {searchType === "semantic" 
              ? "AI-powered search understands natural language queries" 
              : "Exact keyword matching across all fields"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;