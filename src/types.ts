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

export interface PartItem {
  id: string;
  name: string;
  spec?: string;
  quantity: number;
  note?: string;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  engineTrim: string;
  transmission: string;
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
  date: string;
  status: InquiryStatus;
  vehicle: VehicleInfo;
  parts: PartItem[];
  contact: ContactInfo;
  additionalNotes?: string;
  statusHistory: StatusHistoryItem[];
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
