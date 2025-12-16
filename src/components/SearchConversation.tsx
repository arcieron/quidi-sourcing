import { PartsDataRow } from "@/types/partsData";
import ResultsSection from "./ResultsSection";

interface Message {
  id: string;
  type: "user" | "system";
  content: string;
  results?: PartsDataRow[];
}

interface SearchConversationProps {
  messages: Message[];
  onSelectPart: (part: PartsDataRow) => void;
}

const SearchConversation = ({ messages, onSelectPart }: SearchConversationProps) => {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="space-y-4">
          <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-2xl px-4 py-2 rounded-lg ${
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {message.content}
            </div>
          </div>
          
          {message.results && message.results.length > 0 && (
            <div className="ml-4 border-l-2 border-border pl-4">
              <ResultsSection parts={message.results} onSelectPart={onSelectPart} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchConversation;
export type { Message };
