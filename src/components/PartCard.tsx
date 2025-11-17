import { Part } from "@/types/part";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, DollarSign, Star, History } from "lucide-react";

interface PartCardProps {
  part: Part;
  onClick: () => void;
}

const PartCard = ({ part, onClick }: PartCardProps) => {
  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-success text-success-foreground";
    if (score >= 80) return "bg-primary text-primary-foreground";
    if (score >= 70) return "bg-warning text-warning-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer border-border"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{part.partNumber}</h3>
            {part.orderHistory && part.orderHistory.length > 0 && (
              <Badge variant="outline" className="text-primary border-primary">
                <History className="h-3 w-3 mr-1" />
                Previously Ordered
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{part.description}</p>
        </div>
        <Badge className={getMatchColor(part.matchScore)}>
          {part.matchScore}% Match
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{part.material}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">${part.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 text-warning fill-warning" />
          <span className="text-foreground">{part.vendor.rating}</span>
          <span className="text-muted-foreground text-xs">({part.vendor.name})</span>
        </div>
        {part.inStock ? (
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-success border-success">
              In Stock ({part.quantity})
            </Badge>
            {part.location && (
              <MapPin className="h-3 w-3 text-success" />
            )}
          </div>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Out of Stock
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default PartCard;
