import { Part } from "@/types/part";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, DollarSign, Building2, History, Clock, Truck, Award, TrendingUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExactMatchSectionProps {
  part: Part;
  onClick: () => void;
}

const getMatchColorClass = (percentage: number): string => {
  if (percentage >= 90) return "bg-success text-success-foreground border-success";
  if (percentage >= 70) return "bg-primary text-primary-foreground border-primary";
  if (percentage >= 50) return "bg-warning text-warning-foreground border-warning";
  return "bg-destructive text-destructive-foreground border-destructive";
};

const ExactMatchSection = ({ part, onClick }: ExactMatchSectionProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold text-foreground">Exact Match</h2>
        {part.matchBreakdown && (
          <div className="flex gap-2">
            <Badge className={getMatchColorClass(part.matchBreakdown.size)}>
              Size: {part.matchBreakdown.size}%
            </Badge>
            <Badge className={getMatchColorClass(part.matchBreakdown.material)}>
              Material: {part.matchBreakdown.material}%
            </Badge>
            <Badge className={getMatchColorClass(part.matchBreakdown.grade)}>
              Grade: {part.matchBreakdown.grade}%
            </Badge>
            <Badge className={getMatchColorClass(part.matchBreakdown.specifications)}>
              Specs: {part.matchBreakdown.specifications}%
            </Badge>
          </div>
        )}
      </div>
      
      <Card className="p-6 border-success/50 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" onClick={onClick}>
        <div className="flex gap-6 mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-2">{part.partNumber}</h3>
            <p className="text-base text-muted-foreground mb-4">{part.description}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Material</div>
                  <div className="text-sm font-medium text-foreground">{part.material}</div>
                </div>
              </div>
              
              {part.inStock && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-success" />
                  <div>
                    <div className="text-xs text-muted-foreground">Company Stock</div>
                    <div className="text-sm font-medium text-foreground">{part.quantity} units</div>
                    {part.location && (
                      <div className="text-xs text-muted-foreground">{part.location}</div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Starting Price</div>
                  <div className="text-sm font-medium text-foreground">${part.price.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor and Order History Section */}
        {part.orderHistory && part.orderHistory.length > 0 && (
          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-foreground">Order History by Vendor</h4>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {part.orderHistory.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium hover:text-foreground transition-colors">{order.vendor}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-2">
                              <div className="font-semibold text-sm border-b border-border pb-1">{order.vendor}</div>
                              {part.vendor.name === order.vendor && (
                                <>
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
                                </>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.division}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.quantity} units</TableCell>
                    <TableCell className="text-right font-medium">${order.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExactMatchSection;
