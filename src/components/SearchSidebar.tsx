import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchHistory } from "@/types/part";
import { Clock, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SearchSidebarProps {
  history: SearchHistory[];
  onSelectHistory: (partNumber: string) => void;
}

const SearchSidebar = ({ history, onSelectHistory }: SearchSidebarProps) => {
  return (
    <div className="w-64 border-r border-border bg-card h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-card-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Search History
        </h2>
      </div>
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
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchSidebar;
