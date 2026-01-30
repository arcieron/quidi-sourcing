import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchHistory } from "@/types/part";
import { Clock, Search, Filter, ChevronRight, ChevronLeft, PanelLeftClose, PanelLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [historyPanelCollapsed, setHistoryPanelCollapsed] = useState(false);
  const [filtersPanelCollapsed, setFiltersPanelCollapsed] = useState(false);

  return (
    <div className="flex h-full">
      {/* Search History Panel */}
      <div className={cn(
        "border-r border-border bg-card h-full flex flex-col transition-all duration-300",
        historyPanelCollapsed ? "w-12" : "w-64"
      )}>
        <div className="p-2 border-b border-border flex items-center justify-between">
          {!historyPanelCollapsed && (
            <h2 className="font-semibold text-card-foreground flex items-center gap-2 text-sm px-2">
              <Clock className="h-4 w-4" />
              History
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", historyPanelCollapsed && "mx-auto")}
            onClick={() => setHistoryPanelCollapsed(!historyPanelCollapsed)}
          >
            {historyPanelCollapsed ? (
              <Clock className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {!historyPanelCollapsed && (
          <ScrollArea className="flex-1">
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
              {history.length === 0 && (
                <p className="text-xs text-muted-foreground px-3 py-2">No search history</p>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Filters Panel */}
      <div className={cn(
        "border-r border-border bg-card h-full flex flex-col transition-all duration-300",
        filtersPanelCollapsed ? "w-12" : "w-56"
      )}>
        <div className="p-2 border-b border-border flex items-center justify-between">
          {!filtersPanelCollapsed && (
            <h2 className="font-semibold text-card-foreground flex items-center gap-2 text-sm px-2">
              <Filter className="h-4 w-4" />
              Filters
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", filtersPanelCollapsed && "mx-auto")}
            onClick={() => setFiltersPanelCollapsed(!filtersPanelCollapsed)}
          >
            {filtersPanelCollapsed ? (
              <Filter className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {!filtersPanelCollapsed && (
          <ScrollArea className="flex-1">
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
        )}
      </div>
    </div>
  );
};

export default SearchSidebar;
