import { Part } from "@/types/part";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Ruler, DollarSign, Star, MapPin, Box, Award, Truck, TrendingUp } from "lucide-react";
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

interface PartDetailDialogProps {
  part: Part | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PartDetailDialog = ({ part, open, onOpenChange }: PartDetailDialogProps) => {
  if (!part) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl mb-1">{part.partNumber}</DialogTitle>
              <p className="text-muted-foreground">{part.description}</p>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              {part.matchScore}% Match
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Material</p>
                <p className="font-medium">{part.material}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="font-medium flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {part.price.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vendor</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="font-medium flex items-center gap-1 cursor-help hover:text-foreground transition-colors">
                        {part.vendor.name}
                        <Star className="h-3 w-3 text-warning fill-warning ml-1" />
                        {part.vendor.rating}
                      </p>
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
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Stock Status</p>
                <p className="font-medium">
                  {part.inStock ? (
                    <Badge variant="outline" className="text-success border-success">
                      In Stock ({part.quantity})
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Out of Stock
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Dimensions
            </h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-mono">
                {part.dimensions.length} x {part.dimensions.width} x {part.dimensions.height} {part.dimensions.unit}
              </p>
            </div>
          </div>

          {/* Location */}
          {part.location && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">{part.location}</p>
              </div>
            </div>
          )}

          {/* Schematics */}
          {part.schematics && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Box className="h-4 w-4" />
                Technical Details
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">{part.schematics}</p>
              </div>
            </div>
          )}

          {/* Additional Metadata */}
          {part.additionalMetadata && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Additional Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                {part.additionalMetadata.weight && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Weight</p>
                    <p className="font-medium">{part.additionalMetadata.weight} kg</p>
                  </div>
                )}
                {part.additionalMetadata.grade && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Grade</p>
                    <p className="font-medium">{part.additionalMetadata.grade}</p>
                  </div>
                )}
                {part.additionalMetadata.certifications && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                    <div className="flex gap-2 flex-wrap">
                      {part.additionalMetadata.certifications.map((cert) => (
                        <Badge key={cert} variant="secondary">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order History */}
          {part.orderHistory && part.orderHistory.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Order History</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Division</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {part.orderHistory.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>${order.price.toFixed(2)}</TableCell>
                        <TableCell>{order.vendor}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.division}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartDetailDialog;
