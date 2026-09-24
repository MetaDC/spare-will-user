/**
 * 17. SEARCH & 19. COMPATIBILITY ENGINE
 * Core vehicle fitment verification and customer search matching logic
 * As specified in Section 19 ("Check Compatibility") & Section 24 ("Swift 2021 brake pad")
 */

import { ProductFitment, CustomerVehicle, FitmentCheckResult } from "./fitment";
import { Product } from "./product";
// import { Product } from './product';

/**
 * Checks if a specific ProductFitment matches a CustomerVehicle
 */
export function isFitmentMatch(
  fitment: ProductFitment,
  vehicle: CustomerVehicle,
): boolean {
  if (!fitment.isActive) return false;

  // 1. Vehicle Type check
  if (fitment.vehicleTypeId && vehicle.vehicleTypeId) {
    if (
      fitment.vehicleTypeId.toLowerCase() !==
      vehicle.vehicleTypeId.toLowerCase()
    ) {
      return false;
    }
  }

  // 2. Brand check (Required)
  if (fitment.brandId.toLowerCase() !== vehicle.brandId.toLowerCase()) {
    return false;
  }

  // 3. Model check (Required)
  if (fitment.modelId.toLowerCase() !== vehicle.modelId.toLowerCase()) {
    return false;
  }

  // 4. Generation check (If both specify generation)
  if (fitment.generationId && vehicle.generationId) {
    if (
      fitment.generationId.toLowerCase() !== vehicle.generationId.toLowerCase()
    ) {
      return false;
    }
  }

  // 5. Year Range check
  if (vehicle.year < fitment.yearFrom) {
    return false;
  }
  if (fitment.yearTo && vehicle.year > fitment.yearTo) {
    return false;
  }

  // 6. Fuel Type check (if fitment specifies fuel restrictions)
  if (fitment.fuelTypes && fitment.fuelTypes.length > 0 && vehicle.fuelType) {
    const hasFuelMatch = fitment.fuelTypes.some(
      (f) => f.toLowerCase() === vehicle.fuelType?.toLowerCase(),
    );
    if (!hasFuelMatch) return false;
  }

  // 7. Engine check (if fitment specifies engine restrictions)
  if (fitment.engineTypes && fitment.engineTypes.length > 0 && vehicle.engine) {
    const normEngine = vehicle.engine.toLowerCase();
    const hasEngineMatch = fitment.engineTypes.some((e) => {
      const normE = e.toLowerCase();
      return normEngine.includes(normE) || normE.includes(normEngine);
    });
    if (!hasEngineMatch) return false;
  }

  // 8. Transmission check (if fitment specifies transmission restrictions)
  if (
    fitment.transmissionTypes &&
    fitment.transmissionTypes.length > 0 &&
    vehicle.transmission
  ) {
    const hasTransMatch = fitment.transmissionTypes.some(
      (t) => t.toLowerCase() === vehicle.transmission?.toLowerCase(),
    );
    if (!hasTransMatch) return false;
  }

  // 9. Variant check (if fitment specifies variant restrictions)
  if (
    fitment.variantIds &&
    fitment.variantIds.length > 0 &&
    vehicle.variantId
  ) {
    if (!fitment.variantIds.includes(vehicle.variantId)) {
      return false;
    }
  }

  return true;
}

/**
 * Evaluates whether a product with its list of fitments fits a customer vehicle
 */
export function checkVehicleCompatibility(
  fitments: ProductFitment[],
  vehicle: CustomerVehicle,
): FitmentCheckResult {
  if (!fitments || fitments.length === 0) {
    return {
      isCompatible: false,
      message: "No vehicle fitment data available for this part.",
      matchedFitments: [],
    };
  }

  const matches = fitments.filter((fitment) =>
    isFitmentMatch(fitment, vehicle),
  );

  if (matches.length > 0) {
    const vehicleLabel = vehicle.modelName || vehicle.modelId;
    return {
      isCompatible: true,
      message: `✓ This part fits your ${vehicleLabel} (${vehicle.year}).`,
      matchedFitments: matches,
    };
  }

  return {
    isCompatible: false,
    message: "✕ This part does not fit your selected vehicle.",
    matchedFitments: [],
  };
}

/**
 * Filters a product list to only return items compatible with the selected vehicle
 */
export function filterProductsByVehicle(
  products: Product[],
  fitmentsByProductId: Map<string, ProductFitment[]>,
  vehicle: CustomerVehicle,
): Product[] {
  return products.filter((product) => {
    const fitments = fitmentsByProductId.get(product.productId) || [];
    return fitments.some((f) => isFitmentMatch(f, vehicle));
  });
}
