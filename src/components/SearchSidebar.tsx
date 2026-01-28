import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchHistory } from "@/types/part";
import { Clock, Search, Filter, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface SearchSidebarProps {
  history: SearchHistory[];
  onSelectHistory: (partNumber: string) => void;
}

const FILTER_CATEGORIES = [
  "Material Group",
  "Material Type",
  "Vendor",
  "Country",
  "Company",
  "Purchasing Org",
  "Basic Material",
];

const SearchSidebar = ({ history, onSelectHistory }: SearchSidebarProps) => {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <div className="flex h-full">
      {/* Search History Panel */}
      <div className="w-64 border-r border-border bg-card h-full flex flex-col">
        <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
          <CollapsibleTrigger className="w-full p-4 border-b border-border flex items-center justify-between hover:bg-muted/50 transition-colors">
            <h2 className="font-semibold text-card-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Search History
            </h2>
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${historyOpen ? 'rotate-90' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ScrollArea className="flex-1 max-h-[calc(100vh-200px)]">
              <div className="p-2 space-y-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectHistory(item.partNumber)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary transition-colors group"
                  >
                    <div className="flex items-start gap-2">
                      <Search className="h-4 w-4 text-muted-foreground mt-0.5 group-hover:text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-foreground group-hover:text-primary">
                          {item.partNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.resultsCount} results
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Filters Panel */}
      <div className="w-56 border-r border-border bg-card h-full flex flex-col">
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger className="w-full p-4 border-b border-border flex items-center justify-between hover:bg-muted/50 transition-colors">
            <h2 className="font-semibold text-card-foreground flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </h2>
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${filtersOpen ? 'rotate-90' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ScrollArea className="flex-1 max-h-[calc(100vh-200px)]">
              <div className="p-2 space-y-1">
                {FILTER_CATEGORIES.map((category) => (
                  <Collapsible key={category}>
                    <CollapsibleTrigger className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary transition-colors flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{category}</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pl-8 py-1 text-xs text-muted-foreground">
                        No filters available
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default SearchSidebar;
