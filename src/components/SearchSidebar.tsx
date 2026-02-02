import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchHistory } from "@/types/part";
import { Clock, Search, Filter, ChevronRight, PanelLeftClose, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export interface FilterOptions {
  material_group: string[];
  material_type: string[];
  company_created: string[];
  purchasing_org: string[];
  vendor_code: string[];
}

export interface SelectedFilters {
  material_group: string[];
  material_type: string[];
  company_created: string[];
  purchasing_org: string[];
  vendor_code: string[];
}

interface SearchSidebarProps {
  history: SearchHistory[];
  onSelectHistory: (partNumber: string) => void;
  filterOptions: FilterOptions;
  selectedFilters: SelectedFilters;
  onFilterChange: (category: keyof SelectedFilters, value: string) => void;
  onClearFilters: () => void;
}

const FILTER_CATEGORIES: { key: keyof FilterOptions; label: string }[] = [
  { key: "material_group", label: "Material Group" },
  { key: "material_type", label: "Material Type" },
  { key: "company_created", label: "Company" },
  { key: "purchasing_org", label: "Purchasing Org" },
  { key: "vendor_code", label: "Vendor Code" },
];

const SearchSidebar = ({ 
  history, 
  onSelectHistory, 
  filterOptions, 
  selectedFilters, 
  onFilterChange,
  onClearFilters 
}: SearchSidebarProps) => {
  const [historyPanelCollapsed, setHistoryPanelCollapsed] = useState(false);
  const [filtersPanelCollapsed, setFiltersPanelCollapsed] = useState(false);

  const totalSelectedFilters = Object.values(selectedFilters).flat().length;

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
            <div className="flex items-center gap-2 px-2">
              <h2 className="font-semibold text-card-foreground flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4" />
                Filters
              </h2>
              {totalSelectedFilters > 0 && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  {totalSelectedFilters}
                </Badge>
              )}
            </div>
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

        {!filtersPanelCollapsed && totalSelectedFilters > 0 && (
          <div className="p-2 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground hover:text-foreground"
              onClick={onClearFilters}
            >
              <X className="h-3 w-3 mr-1" />
              Clear all filters
            </Button>
          </div>
        )}
        
        {!filtersPanelCollapsed && (
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {FILTER_CATEGORIES.map((category) => {
                const options = filterOptions[category.key];
                const selected = selectedFilters[category.key];
                
                return (
                  <Collapsible key={category.key} defaultOpen={selected.length > 0}>
                    <CollapsibleTrigger className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary transition-colors flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-90" />
                      <span className="text-sm font-medium text-foreground">{category.label}</span>
                      {selected.length > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0">
                          {selected.length}
                        </Badge>
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pl-4 py-1 space-y-1 max-h-48 overflow-y-auto">
                        {options.length === 0 ? (
                          <p className="text-xs text-muted-foreground px-3 py-1">
                            No options available
                          </p>
                        ) : (
                          options.slice(0, 20).map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-secondary cursor-pointer text-sm"
                            >
                              <Checkbox
                                checked={selected.includes(option)}
                                onCheckedChange={() => onFilterChange(category.key, option)}
                                className="h-3.5 w-3.5"
                              />
                              <span className="truncate text-foreground text-xs" title={option}>
                                {option}
                              </span>
                            </label>
                          ))
                        )}
                        {options.length > 20 && (
                          <p className="text-xs text-muted-foreground px-3 py-1">
                            +{options.length - 20} more
                          </p>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default SearchSidebar;
