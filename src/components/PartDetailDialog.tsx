import { PartsDataRow } from "@/types/partsData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, Building2, FileText, Calendar, User } from "lucide-react";
interface PartDetailDialogProps {
  part: PartsDataRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const PartDetailDialog = ({
  part,
  open,
  onOpenChange
}: PartDetailDialogProps) => {
  if (!part) return null;
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl mb-1">{part.material_number || "N/A"}</DialogTitle>
              <p className="text-muted-foreground">{part.description || "No description"}</p>
            </div>
            
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Material Details */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Material Details
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg text-sm">
              <Field label="Basic Material" value={part.basic_material} />
              <Field label="Material Group" value={part.material_group} />
              <Field label="Material Type" value={part.material_type} />
              <Field label="Size/Dimension" value={part.size_dimension} />
              {part.company_created && <Field label="Company" value={part.company_created} className="col-span-2" />}
            </div>
          </div>

          {/* Vendor Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Vendor Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg text-sm">
              <Field label="Vendor Name" value={part.vendor_name} />
              <Field label="Vendor Code" value={part.vendor_code} />
              <Field label="Business Partner" value={part.business_partner} />
              <Field label="Division" value={part.division} />
            </div>
          </div>

          {/* Purchase Order Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Purchase Order
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg text-sm">
              <Field label="PO Value" value={part.po_value != null ? `$${part.po_value.toLocaleString()}` : null} />
              <Field label="PO Quantity" value={part.po_quantity?.toString()} />
              <Field label="Purchasing Document" value={part.purchasing_document} />
              <Field label="Purchase Doc Item" value={part.purchase_doc_item} />
              <Field label="Purchasing Org" value={part.purchasing_org} />
              <Field label="Organizational Unit" value={part.organizational_unit} />
            </div>
          </div>

          {/* Audit Trail */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Audit Trail
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg text-sm">
              <Field label="Created On" value={formatDate(part.created_on)} />
              <Field label="Created By" value={part.created_by} />
              <Field label="Changed On" value={formatDate(part.changed_on)} />
              <Field label="Changed By" value={part.changed_by} />
            </div>
          </div>

          {/* Counters */}
          {(part.counter_of_po != null || part.counter_of_material != null) && <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Counters
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg text-sm">
                <Field label="Counter of PO" value={part.counter_of_po?.toString()} />
                <Field label="Counter of Material" value={part.counter_of_material?.toString()} />
              </div>
            </div>}
        </div>
      </DialogContent>
    </Dialog>;
};
const Field = ({
  label,
  value,
  className = ""
}: {
  label: string;
  value: string | null | undefined;
  className?: string;
}) => {
  if (!value || value === "Not assigned") return null;
  return <div className={className}>
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>;
};
export default PartDetailDialog;