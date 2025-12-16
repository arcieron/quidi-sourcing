import { PartsDataRow } from "@/types/partsData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, DollarSign, History, Truck, Award } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PartCardProps {
  part: PartsDataRow;
  onClick: () => void;
}

const PartCard = ({ part, onClick }: PartCardProps) => {
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
                <h3 className="font-semibold text-foreground">{part.material_number || "N/A"}</h3>
                {part.po_value && (
                  <Badge variant="outline" className="text-primary border-primary">
                    <History className="h-3 w-3 mr-1" />
                    Previously Ordered
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {part.description || part.old_description || "No description"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{part.basic_material || part.material_group || "N/A"}</span>
            </div>
            {part.price != null && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">${part.price}</span>
              </div>
            )}
            {part.po_value != null && !part.price && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">PO: ${part.po_value}</span>
              </div>
            )}
          </div>

          {part.size_dimension && (
            <div className="text-sm text-muted-foreground mb-3">
              Size: {part.size_dimension}
            </div>
          )}

          <div className="flex items-center justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sm text-muted-foreground cursor-help hover:text-foreground transition-colors">
                    {part.vendor_name || part.vendor_code || "Unknown Vendor"}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-2">
                    <div className="font-semibold text-sm border-b border-border pb-1">
                      {part.vendor_name || part.vendor_code || "Unknown Vendor"}
                    </div>
                    {part.quality_score != null && (
                      <div className="flex items-center gap-2 text-xs">
                        <Award className="h-3 w-3" />
                        <span>Quality Score: {part.quality_score}</span>
                      </div>
                    )}
                    {part.avg_shipping_days != null && (
                      <div className="flex items-center gap-2 text-xs">
                        <Truck className="h-3 w-3" />
                        <span>Avg Shipping: {part.avg_shipping_days} days</span>
                      </div>
                    )}
                    {part.division && (
                      <div className="text-xs">Division: {part.division}</div>
                    )}
                    {part.organizational_unit && (
                      <div className="text-xs">Org Unit: {part.organizational_unit}</div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {part.in_stock ? (
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-success border-success">
                  In Stock: {part.quantity}
                </Badge>
                {part.location && (
                  <MapPin className="h-3 w-3 text-success" />
                )}
              </div>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Not in Stock
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PartCard;
