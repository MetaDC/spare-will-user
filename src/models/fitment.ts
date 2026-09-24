/**
 * 9. PRODUCT FITMENT & 18. VEHICLE SELECTION ("My Vehicle")
 * Connects products with compatible vehicles.
 * A single product can link to multiple fitments.
 */

import { FuelType, TransmissionType } from './vehicle';

/**
 * 9. PRODUCT FITMENT RECORD
 * Example: Bosch Brake Pad compatible with Maruti Suzuki Swift 2018–2023, Baleno 2019–2022, etc.
 */
export interface ProductFitment {
  fitmentId: string;
  productId: string;
  vehicleTypeId: string;
  brandId: string; // Vehicle Brand ID (e.g. "maruti-suzuki")
  modelId: string; // Vehicle Model ID (e.g. "swift")
  generationId?: string; // Vehicle Generation ID (e.g. "swift-gen-3")
  variantIds?: string[]; // Specific variants if applicable
  yearFrom: number; // e.g. 2018
  yearTo?: number; // e.g. 2023 (undefined implies current/no upper limit)
  fuelTypes?: FuelType[]; // e.g. ["Petrol"]
  engineTypes?: string[]; // e.g. ["1.2L K-Series"]
  transmissionTypes?: TransmissionType[]; // e.g. ["Manual", "Automatic"]
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 18. CUSTOMER VEHICLE SELECTION ("My Vehicle")
 * Stored per user or in local storage to personalize catalog and compatibility checks
 */
export interface CustomerVehicle {
  id?: string;
  userId?: string;
  vehicleTypeId: string;
  brandId: string;
  modelId: string;
  generationId?: string;
  variantId?: string;
  year: number;
  fuelType?: FuelType;
  engine?: string;
  transmission?: TransmissionType;
  // Denormalized human-readable labels for instant display
  brandName?: string;
  modelName?: string;
  generationName?: string;
  variantName?: string;
  isPrimary?: boolean;
}

/**
 * COMPATIBILITY CHECK RESULT
 * Returned when checking "Check Compatibility" or filtering products
 */
export interface FitmentCheckResult {
  isCompatible: boolean;
  message: string;
  matchedFitments: ProductFitment[];
}
