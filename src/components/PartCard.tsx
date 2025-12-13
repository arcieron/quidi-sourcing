import { Part } from "@/types/part";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, DollarSign, History, TrendingUp, Truck, Award } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
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
        {part.matchBreakdown && (
          <div className="flex flex-col gap-1 items-end">
            <div className="flex gap-1.5">
              <Badge variant="outline" className="text-xs">
                Size: {part.matchBreakdown.size}%
              </Badge>
              <Badge variant="outline" className="text-xs">
                Material: {part.matchBreakdown.material}%
              </Badge>
            </div>
            <div className="flex gap-1.5">
              <Badge variant="outline" className="text-xs">
                Grade: {part.matchBreakdown.grade}%
              </Badge>
              <Badge variant="outline" className="text-xs">
                Specs: {part.matchBreakdown.specifications}%
              </Badge>
            </div>
          </div>
        )}
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm text-muted-foreground cursor-help hover:text-foreground transition-colors">
                {part.vendor.name}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-2">
                <div className="font-semibold text-sm border-b border-border pb-1">{part.vendor.name}</div>
                {part.vendor.qualityScore && (
                  <div className="flex items-center gap-2 text-xs">
                    <Award className="h-3 w-3" />
                    <span>Quality Score: {part.vendor.qualityScore}%</span>
                  </div>
                )}
                {part.vendor.shippingTime && (
                  <div className="flex items-center gap-2 text-xs">
                    <Truck className="h-3 w-3" />
                    <span>Average Shipping Time: {part.vendor.shippingTime}</span>
                  </div>
                )}
                {part.vendor.priceHistory && part.vendor.priceHistory.length > 0 && (
                  <div className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-medium">Price History:</span>
                    </div>
                    <div className="pl-5 space-y-0.5">
                      {part.vendor.priceHistory.slice(0, 3).map((history, idx) => (
                        <div key={idx} className="text-muted-foreground">
                          {history.date}: ${history.price.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {part.inStock ? (
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-success border-success">
              Company Stock: {part.quantity}
            </Badge>
            {part.location && (
              <MapPin className="h-3 w-3 text-success" />
            )}
          </div>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Not in Company Stock
          </Badge>
        )}
      </div>
        </div>
      </div>
    </Card>
  );
};

export default PartCard;
