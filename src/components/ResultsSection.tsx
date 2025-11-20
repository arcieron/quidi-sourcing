import { Part } from "@/types/part";
import PartCard from "./PartCard";
import ExactMatchSection from "./ExactMatchSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package } from "lucide-react";

interface ResultsSectionProps {
  parts: Part[];
  onSelectPart: (part: Part) => void;
}

const ResultsSection = ({ parts, onSelectPart }: ResultsSectionProps) => {
  const exactMatch = parts.find(p => p.matchScore >= 98);
  const otherParts = parts.filter(p => p.matchScore < 98);
  const inStockParts = otherParts.filter(p => p.inStock);
  const outOfStockParts = otherParts.filter(p => !p.inStock);

  if (parts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No results yet</h3>
        <p className="text-muted-foreground">
          Enter a part number to search for matching components
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Exact Match Section */}
      {exactMatch && (
        <ExactMatchSection
          part={exactMatch}
          onClick={() => onSelectPart(exactMatch)}
        />
      )}

      {/* In Stock Section */}
      {inStockParts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              In Stock Parts ({inStockParts.length})
            </h2>
          </div>
          <Alert className="mb-4 bg-success/10 border-success">
            <AlertDescription className="text-foreground">
              {inStockParts.reduce((sum, p) => sum + p.quantity, 0)} total units available across {inStockParts.length} matching parts
            </AlertDescription>
          </Alert>
          <div className="grid gap-4">
            {inStockParts.map((part) => (
              <PartCard
                key={part.id}
                part={part}
                onClick={() => onSelectPart(part)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Out of Stock Section */}
      {outOfStockParts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Alternative Matches ({outOfStockParts.length})
          </h2>
          <div className="grid gap-4">
            {outOfStockParts.map((part) => (
              <PartCard
                key={part.id}
                part={part}
                onClick={() => onSelectPart(part)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
