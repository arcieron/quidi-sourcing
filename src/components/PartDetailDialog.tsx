import { PartsDataRow } from "@/types/partsData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, Ruler, DollarSign, MapPin, Award, Truck, Building2, FileText } from "lucide-react";

interface PartDetailDialogProps {
  part: PartsDataRow | null;
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
              <DialogTitle className="text-2xl mb-1">{part.material_number || "N/A"}</DialogTitle>
              <p className="text-muted-foreground">{part.description || part.old_description || "No description"}</p>
            </div>
            {part.in_stock && (
              <Badge className="bg-success text-success-foreground">In Stock</Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Material Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Material Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
              {part.basic_material && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Basic Material</p>
                  <p className="font-medium">{part.basic_material}</p>
                </div>
              )}
              {part.material_group && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Material Group</p>
                  <p className="font-medium">{part.material_group}</p>
                </div>
              )}
              {part.material_type && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Material Type</p>
                  <p className="font-medium">{part.material_type}</p>
                </div>
              )}
              {part.ext_material_group && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ext Material Group</p>
                  <p className="font-medium">{part.ext_material_group}</p>
                </div>
              )}
              {part.grade && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Grade</p>
                  <p className="font-medium">{part.grade}</p>
                </div>
              )}
              {part.size_dimension && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Size/Dimension</p>
                  <p className="font-medium">{part.size_dimension}</p>
                </div>
              )}
              {part.weight != null && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Weight</p>
                  <p className="font-medium">{part.weight}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Stock */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing & Stock
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
              {part.price != null && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="font-medium">${part.price}</p>
                </div>
              )}
              {part.po_value != null && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">PO Value</p>
                  <p className="font-medium">${part.po_value}</p>
                </div>
              )}
              {part.po_quantity != null && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">PO Quantity</p>
                  <p className="font-medium">{part.po_quantity}</p>
                </div>
              )}
              {part.quantity != null && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Stock Quantity</p>
                  <p className="font-medium">{part.quantity}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Stock Status</p>
                <p className="font-medium">
                  {part.in_stock ? (
                    <Badge variant="outline" className="text-success border-success">In Stock</Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">Out of Stock</Badge>
                  )}
                </p>
              </div>
              {part.location && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {part.location}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Vendor Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Vendor Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
              {part.vendor_name && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Vendor Name</p>
                  <p className="font-medium">{part.vendor_name}</p>
                </div>
              )}
              {part.vendor_code && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Vendor Code</p>
                  <p className="font-medium">{part.vendor_code}</p>
                </div>
              )}
              {part.business_partner && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Business Partner</p>
                  <p className="font-medium">{part.business_partner}</p>
                </div>
              )}
              {part.quality_score != null && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quality Score</p>
                  <p className="font-medium flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {part.quality_score}
                  </p>
                </div>
              )}
              {part.avg_shipping_days != null && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Shipping Days</p>
                  <p className="font-medium flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    {part.avg_shipping_days} days
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Purchase Information */}
          {(part.purchasing_document || part.purchasing_org || part.division) && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Purchase Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                {part.purchasing_document && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Purchasing Document</p>
                    <p className="font-medium">{part.purchasing_document}</p>
                  </div>
                )}
                {part.purchase_doc_item && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Purchase Doc Item</p>
                    <p className="font-medium">{part.purchase_doc_item}</p>
                  </div>
                )}
                {part.purchasing_org && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Purchasing Org</p>
                    <p className="font-medium">{part.purchasing_org}</p>
                  </div>
                )}
                {part.division && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Division</p>
                    <p className="font-medium">{part.division}</p>
                  </div>
                )}
                {part.organizational_unit && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Organizational Unit</p>
                    <p className="font-medium">{part.organizational_unit}</p>
                  </div>
                )}
                {part.counter_of_po != null && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Counter of PO</p>
                    <p className="font-medium">{part.counter_of_po}</p>
                  </div>
                )}
                {part.counter_of_material != null && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Counter of Material</p>
                    <p className="font-medium">{part.counter_of_material}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Audit Information */}
          {(part.created_on || part.created_by || part.company_created) && (
            <div>
              <h3 className="font-semibold mb-3">Audit Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                {part.created_on && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Created On</p>
                    <p className="font-medium">{part.created_on}</p>
                  </div>
                )}
                {part.created_by && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Created By</p>
                    <p className="font-medium">{part.created_by}</p>
                  </div>
                )}
                {part.changed_on && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Changed On</p>
                    <p className="font-medium">{part.changed_on}</p>
                  </div>
                )}
                {part.changed_by && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Changed By</p>
                    <p className="font-medium">{part.changed_by}</p>
                  </div>
                )}
                {part.company_created && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Company Created</p>
                    <p className="font-medium">{part.company_created}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {part.certifications && part.certifications.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Certifications</h3>
              <div className="flex gap-2 flex-wrap">
                {part.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="secondary">{cert}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartDetailDialog;
