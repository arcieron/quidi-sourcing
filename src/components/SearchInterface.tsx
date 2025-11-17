import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import quidiLogo from "@/assets/quidi-logo.png";

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
}

const SearchInterface = ({ onSearch }: SearchInterfaceProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="border-b border-border bg-card p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <img src={quidiLogo} alt="Quidi - Quick Document Intelligence" className="h-12" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">AI Sourcing Buddy</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Powered by Quidi - Search for parts, compare costs, and find the best vendors across divisions
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
      </div>
    </div>
  );
};

export default SearchInterface;
