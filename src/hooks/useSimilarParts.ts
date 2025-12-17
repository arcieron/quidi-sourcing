import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PartsDataRow } from "@/types/partsData";

export interface SimilarPart extends PartsDataRow {
  similarity_score?: number;
  similarity_reason?: string;
}

export const useSimilarParts = () => {
  const [similarParts, setSimilarParts] = useState<SimilarPart[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findSimilarParts = async (targetPart: PartsDataRow) => {
    setIsLoading(true);
    setError(null);
    setSimilarParts([]);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('find-similar-parts', {
        body: { targetPart }
      });

      if (fnError) {
        throw fnError;
      }

      if (data?.error) {
        setError(data.error);
        return;
      }

      setSimilarParts(data?.similarParts || []);
    } catch (err) {
      console.error('Error finding similar parts:', err);
      setError(err instanceof Error ? err.message : 'Failed to find similar parts');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSimilarParts = () => {
    setSimilarParts([]);
    setError(null);
  };

  return {
    similarParts,
    isLoading,
    error,
    findSimilarParts,
    clearSimilarParts,
  };
};
