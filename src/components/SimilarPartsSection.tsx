import { Sparkles, Loader2 } from "lucide-react";
import { SimilarPart } from "@/hooks/useSimilarParts";
import PartCard from "./PartCard";
import { PartsDataRow } from "@/types/partsData";

interface SimilarPartsSectionProps {
  similarParts: SimilarPart[];
  isLoading: boolean;
  error: string | null;
  onSelectPart: (part: PartsDataRow) => void;
}

const SimilarPartsSection = ({
  similarParts,
  isLoading,
  error,
  onSelectPart,
}: SimilarPartsSectionProps) => {
  if (!isLoading && similarParts.length === 0 && !error) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">AI-Suggested Alternatives</h3>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          AI
        </span>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Analyzing parts to find similar alternatives...</span>
        </div>
      )}

      {error && (
        <div className="text-destructive text-sm py-2">
          {error}
        </div>
      )}

      {!isLoading && similarParts.length > 0 && (
        <div className="space-y-3">
          {similarParts.map((part) => (
            <div key={part.id} className="relative">
              <PartCard part={part} onClick={() => onSelectPart(part)} />
              {part.similarity_reason && (
                <div className="mt-1 px-3 py-1.5 bg-background/80 rounded text-xs text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>{part.similarity_reason}</span>
                  {part.similarity_score && (
                    <span className="ml-auto text-primary font-medium">
                      {part.similarity_score}% match
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilarPartsSection;
