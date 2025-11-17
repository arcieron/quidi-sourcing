import { Part, SearchHistory } from "@/types/part";
import bearing1 from "@/assets/bearing-1.jpg";
import bearing2 from "@/assets/bearing-2.jpg";
import bearing3 from "@/assets/bearing-3.jpg";
import bearing4 from "@/assets/bearing-4.jpg";

export const mockParts: Part[] = [
  {
    id: "1",
    partNumber: "BRG-4521-A",
    description: "High-precision ball bearing, stainless steel",
    material: "Stainless Steel 316",
    imageUrl: bearing1,
    dimensions: {
      length: 50,
      width: 50,
      height: 20,
      unit: "mm"
    },
    vendor: {
      name: "Precision Parts Co.",
      rating: 4.8
    },
    price: 145.50,
    inStock: true,
    quantity: 250,
    location: "Warehouse A - Bay 3",
    matchScore: 98,
    schematics: "Ball bearing with sealed design for high-load applications",
    orderHistory: [
      { date: "2024-01-15", quantity: 100, price: 150.00, vendor: "Precision Parts Co.", division: "Manufacturing" },
      { date: "2023-12-10", quantity: 150, price: 148.00, vendor: "Precision Parts Co.", division: "Assembly" },
      { date: "2023-11-05", quantity: 200, price: 152.00, vendor: "Precision Parts Co.", division: "Manufacturing" }
    ],
    additionalMetadata: {
      weight: 0.35,
      grade: "ABEC-7",
      certifications: ["ISO 9001", "RoHS"]
    }
  },
  {
    id: "2",
    partNumber: "BRG-4521-B",
    description: "Ball bearing, stainless steel, alternate supplier",
    material: "Stainless Steel 316",
    imageUrl: bearing2,
    dimensions: {
      length: 50,
      width: 50,
      height: 20,
      unit: "mm"
    },
    vendor: {
      name: "Global Bearings Inc.",
      rating: 4.5
    },
    price: 138.75,
    inStock: true,
    quantity: 180,
    location: "Warehouse B - Bay 7",
    matchScore: 95,
    schematics: "Standard ball bearing with corrosion-resistant coating",
    orderHistory: [
      { date: "2024-02-01", quantity: 80, price: 140.00, vendor: "Global Bearings Inc.", division: "Assembly" },
      { date: "2024-01-20", quantity: 120, price: 139.50, vendor: "Global Bearings Inc.", division: "Manufacturing" }
    ],
    additionalMetadata: {
      weight: 0.34,
      grade: "ABEC-5",
      certifications: ["ISO 9001"]
    }
  },
  {
    id: "3",
    partNumber: "BRG-4520-C",
    description: "Ball bearing, chrome steel, similar dimensions",
    material: "Chrome Steel",
    imageUrl: bearing3,
    dimensions: {
      length: 52,
      width: 52,
      height: 20,
      unit: "mm"
    },
    vendor: {
      name: "Industrial Supply Ltd.",
      rating: 4.2
    },
    price: 125.00,
    inStock: true,
    quantity: 95,
    location: "Warehouse C - Bay 2",
    matchScore: 88,
    schematics: "Chrome steel bearing for standard industrial use",
    orderHistory: [
      { date: "2023-12-15", quantity: 50, price: 128.00, vendor: "Industrial Supply Ltd.", division: "Maintenance" }
    ],
    additionalMetadata: {
      weight: 0.38,
      grade: "ABEC-3",
      certifications: ["ISO 9001"]
    }
  },
  {
    id: "4",
    partNumber: "BRG-4519-D",
    description: "Sealed ball bearing, stainless steel",
    material: "Stainless Steel 304",
    imageUrl: bearing2,
    dimensions: {
      length: 48,
      width: 48,
      height: 18,
      unit: "mm"
    },
    vendor: {
      name: "Quality Components Corp.",
      rating: 4.6
    },
    price: 132.90,
    inStock: false,
    quantity: 0,
    matchScore: 82,
    schematics: "Sealed design for wet environments",
    orderHistory: [
      { date: "2023-10-30", quantity: 60, price: 135.00, vendor: "Quality Components Corp.", division: "Assembly" }
    ],
    additionalMetadata: {
      weight: 0.30,
      grade: "ABEC-5",
      certifications: ["ISO 9001", "NSF"]
    }
  },
  {
    id: "5",
    partNumber: "BRG-4522-E",
    description: "Heavy-duty ball bearing, stainless steel",
    material: "Stainless Steel 316L",
    imageUrl: bearing4,
    dimensions: {
      length: 50,
      width: 50,
      height: 22,
      unit: "mm"
    },
    vendor: {
      name: "Precision Parts Co.",
      rating: 4.8
    },
    price: 168.00,
    inStock: true,
    quantity: 45,
    location: "Warehouse A - Bay 5",
    matchScore: 79,
    schematics: "Heavy load capacity bearing for industrial machinery",
    orderHistory: [
      { date: "2024-01-25", quantity: 30, price: 170.00, vendor: "Precision Parts Co.", division: "Manufacturing" }
    ],
    additionalMetadata: {
      weight: 0.42,
      grade: "ABEC-9",
      certifications: ["ISO 9001", "RoHS", "REACH"]
    }
  }
];

export const mockSearchHistory: SearchHistory[] = [
  { id: "1", partNumber: "BRG-4521-A", timestamp: new Date(Date.now() - 1000 * 60 * 5), resultsCount: 5 },
  { id: "2", partNumber: "SFT-8801-X", timestamp: new Date(Date.now() - 1000 * 60 * 30), resultsCount: 3 },
  { id: "3", partNumber: "PLT-2234-C", timestamp: new Date(Date.now() - 1000 * 60 * 60), resultsCount: 7 },
  { id: "4", partNumber: "GSK-9912-B", timestamp: new Date(Date.now() - 1000 * 60 * 120), resultsCount: 2 },
];
