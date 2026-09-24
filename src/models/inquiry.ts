/**
 * INQUIRY & CUSTOMER MODELS
 * Core inquiry workflow: Customers inquire for spare parts matching their vehicle
 */

import { CustomerVehicle } from "./fitment";
import { FuelType, TransmissionType } from "./vehicle";

export type InquiryStatus =
  | "New"
  | "Reviewing"
  | "Price Sent"
  | "Customer Contacted"
  | "Completed"
  | "Cancelled"
  | "Closed";

export type PartAvailability =
  | "Available"
  | "Not Available"
  | "Alternative Available"
  | "Need Confirmation";

/**
 * Brand option quoted by admin for this requested part
 */
export interface InquiryPartBrandOption {
  brandId?: string; // Linked to PartBrand.id
  brandName: string; // e.g. "Bosch", "Brembo", "Uno Minda"
  price: number; // Quoted selling price
  costPrice?: number; // Admin cost price
  availability?: PartAvailability;
  warranty?: string; // e.g. "6 Months"
  partNumber?: string; // e.g. "0986AB1234"
  note?: string;
}

export interface InquiryPartItem {
  // ── Customer Request Fields ──
  id: string;
  name: string; // Subcategory / Part Name (e.g. "Front Brake Pad")
  subcategoryId?: string; // ID from part_subcategories
  categoryId?: string; // ID from part_categories
  categoryName?: string; // e.g. "Braking System"
  quantity: number; // Requested quantity
  spec?: string; // Specification / Category hint
  customerNote?: string; // Customer note
  note?: string; // Backward compatibility alias

  // ── Admin Primary Quotation Fields ──
  availability?: PartAvailability; // 'Available' | 'Not Available' | 'Alternative Available'
  brandId?: string; // Selected PartBrand.id
  brandName?: string; // Selected PartBrand.name (e.g. "Bosch")
  partNumber?: string; // OEM / Aftermarket part number
  price?: number; // Quoted selling price (₹)
  costPrice?: number; // Admin cost price (₹)
  adminNote?: string; // Admin note sent to customer
  productId?: string; // Optional link to specific product if matched

  // ── Multi-Brand Options (Optional) ──
  brandOptions?: InquiryPartBrandOption[];
}

export interface InquiryVehicleInfo {
  // Category references
  vehicleCategoryId?: string;
  vehicleCategoryName?: string;

  // Brand / Make
  brandId?: string; // Empty/undefined if custom brand
  brandName?: string;
  make: string; // e.g. "Maruti Suzuki", "Honda"

  // Model
  modelId?: string; // Empty/undefined if custom model
  modelName?: string;
  model: string; // e.g. "Swift", "City"

  // Variant & Specifications (mirrored from VehicleVariant)
  variantId?: string; // Empty/undefined if custom/none selected
  variantName?: string; // e.g. "VXI", "ZXI+"
  fuelType?: FuelType | string;
  engine?: string; // e.g. "1.2L DualJet"
  engineCode?: string;
  transmission?: TransmissionType | string;

  // Manufacturing year & identification
  year: number; // e.g. 2021
  vin?: string; // Optional Chassis/VIN
  image?: string; // Optional vehicle image

  // Composite display helper (e.g. "VXI · 1.2L Petrol")
  engineTrim?: string;
}

export interface ContactInfo {
  fullName: string;
  mobileNumber: string;
  whatsappAvailable: boolean;
  email: string;
}

export interface StatusHistoryItem {
  status: InquiryStatus;
  label: string;
  description: string;
  date?: string;
  completed: boolean;
  active: boolean;
}

export interface Inquiry {
  id: string;
  userId?: string;
  status: InquiryStatus;
  vehicle: InquiryVehicleInfo;
  parts: InquiryPartItem[];
  contact: ContactInfo;
  additionalNotes?: string;
  statusHistory: StatusHistoryItem[];
  createdAt: any; // Firestore serverTimestamp
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  savedVehicles?: CustomerVehicle[];
  createdAt?: string;
  updatedAt?: string;
}
