export type Screen = 
  | 'home' 
  | 'services' 
  | 'add-vehicle'
  | 'add-parts' 
  | 'contact-details' 
  | 'review-inquiry' 
  | 'inquiry-sent' 
  | 'inquiries' 
  | 'inquiry-details' 
  | 'profile' 
  | 'signin' 
  | 'signup' 
  | 'forgot-password' 
  | 'edit-profile';

export type InquiryStatus = 'New' | 'Reviewing' | 'Price Sent' | 'Customer Contacted' | 'Completed' | 'Cancelled';

export type PartAvailability =
  | 'Available'
  | 'Not Available'
  | 'Alternative Available'
  | 'Need Confirmation';

export interface InquiryPartBrandOption {
  brandId?: string;
  brandName: string;
  price: number;
  costPrice?: number;
  availability?: PartAvailability;
  warranty?: string;
  partNumber?: string;
  note?: string;
}

export interface PartItem {
  // Customer request fields
  id: string;
  name: string;
  subcategoryId?: string;
  categoryId?: string;
  categoryName?: string;
  spec?: string;
  quantity: number;
  customerNote?: string;
  note?: string;

  // Admin quotation fields
  availability?: PartAvailability;
  brandId?: string;
  brandName?: string;
  partNumber?: string;
  price?: number;
  costPrice?: number;
  adminNote?: string;
  productId?: string;
  brandOptions?: InquiryPartBrandOption[];
}

export interface VehicleInfo {
  vehicleCategoryId?: string;
  vehicleCategoryName?: string;
  brandId?: string;
  brandName?: string;
  make: string;
  modelId?: string;
  modelName?: string;
  model: string;
  variantId?: string;
  variantName?: string;
  fuelType?: string;
  engine?: string;
  engineCode?: string;
  transmission: string;
  year: number;
  engineTrim: string;
  vin?: string;
  image?: string;
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
  vehicle: VehicleInfo;
  parts: PartItem[];
  contact: ContactInfo;
  additionalNotes?: string;
  statusHistory: StatusHistoryItem[];
  createdAt: any; // Firestore serverTimestamp
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'inquiry' | 'contact';
  whatsappNumber?: string;
  phoneNumber?: string;
}

export interface BusinessSettings {
  businessName: string;
  businessEmail: string;
  callingNumber: string;
  whatsappNumber: string;
  defaultGreeting: string;
}

export interface SparePart {
  id: string;
  name: string;
  partNumber?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  imageUrl?: string;
  status?: string;
  compatibleVehicles?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  yearFrom?: number;
  yearTo?: number;
}
