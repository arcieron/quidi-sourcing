import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface DrillDownChatProps {
  onRefine: (query: string) => void;
}

const DrillDownChat = ({ onRefine }: DrillDownChatProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onRefine(input.trim());
      setInput("");
    }
  };

  return (
    <div className="sticky bottom-0 bg-background border-t border-border p-4 shadow-lg">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Refine your search or ask a question..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default DrillDownChat;
