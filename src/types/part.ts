export interface Part {
  id: string;
  partNumber: string;
  description: string;
  material: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  vendor: {
    name: string;
    rating: number;
    shippingTime?: string;
    qualityScore?: number;
    priceHistory?: {
      date: string;
      price: number;
    }[];
  };
  price: number;
  inStock: boolean;
  quantity: number;
  location?: string;
  matchScore: number;
  matchBreakdown?: {
    size: number;
    material: number;
    grade: number;
    specifications: number;
  };
  imageUrl?: string;
  orderHistory?: OrderHistoryItem[];
  schematics?: string;
  additionalMetadata?: {
    weight?: number;
    color?: string;
    grade?: string;
    certifications?: string[];
  };
}

export interface OrderHistoryItem {
  date: string;
  quantity: number;
  price: number;
  vendor: string;
  division: string;
}

export interface SearchHistory {
  id: string;
  partNumber: string;
  timestamp: Date;
  resultsCount: number;
}
