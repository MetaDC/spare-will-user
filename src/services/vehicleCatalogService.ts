/**
 * vehicleCatalogService.ts — Read-only Firestore queries for the user app.
 *
 * Uses the same collection names as the admin (vehicle_brands, vehicle_models,
 * vehicle_variants). All writes happen exclusively in the admin panel.
 *
 * Search pattern: Firestore prefix-range on the `searchName` field
 * (stripped lowercase, e.g. "toyota" → searchName >= "toyota" && <= "toyota\uf8ff").
 * This avoids fetching the full collection and works offline-free with
 * standard Firestore indexes (no composite index needed for prefix-only queries).
 */

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { VehicleBrand, VehicleModel, VehicleVariant } from '../models/vehicle';

const COLS = {
  VEHICLE_BRANDS:   'vehicle_brands',
  VEHICLE_MODELS:   'vehicle_models',
  VEHICLE_VARIANTS: 'vehicle_variants',
};

/** Normalise a search string the same way the admin does when building searchName */
function toSearchName(raw: string): string {
  return raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, '');
}

// ─── BRANDS ─────────────────────────────────────────────────────────────────

/**
 * Prefix-search vehicle brands by name.
 * Returns up to `maxResults` active brands matching the query.
 */
export async function searchBrands(
  rawQuery: string,
  maxResults = 8,
): Promise<VehicleBrand[]> {
  const clean = toSearchName(rawQuery);
  if (!clean) return [];

  try {
    const q = query(
      collection(db, COLS.VEHICLE_BRANDS),
      where('searchName', '>=', clean),
      where('searchName', '<=', clean + '\uf8ff'),
      orderBy('searchName'),
      limit(maxResults),
    );
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ ...d.data(), id: d.id }) as VehicleBrand)
      .filter(b => b.isActive !== false);
  } catch (err) {
    console.warn('[vehicleCatalogService] searchBrands error:', err);
    return [];
  }
}

// ─── MODELS ──────────────────────────────────────────────────────────────────

/**
 * Search vehicle models by name.
 * - If `brandId` is provided (DB brand was selected) → filters by that brand.
 * - If `brandId` is empty (custom brand typed) → global model search.
 * Returns up to `maxResults` active models.
 */
export async function searchModels(
  rawQuery: string,
  brandId?: string,
  maxResults = 8,
): Promise<VehicleModel[]> {
  const clean = toSearchName(rawQuery);
  if (!clean) return [];

  try {
    const constraints: any[] = [
      where('searchName', '>=', clean),
      where('searchName', '<=', clean + '\uf8ff'),
      orderBy('searchName'),
      limit(maxResults),
    ];

    // If a real DB brand was selected, scope models to that brand
    if (brandId) {
      constraints.unshift(where('vehicleBrandId', '==', brandId));
    }

    const q = query(collection(db, COLS.VEHICLE_MODELS), ...constraints);
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ ...d.data(), id: d.id }) as VehicleModel)
      .filter(m => m.isActive !== false);
  } catch (err) {
    console.warn('[vehicleCatalogService] searchModels error:', err);
    return [];
  }
}

// ─── VARIANTS ────────────────────────────────────────────────────────────────

/**
 * Fetch all active variants for a given DB model ID.
 * Returns an empty array if the model was custom (no ID) or none exist.
 */
export async function getVariantsByModel(
  modelId: string,
): Promise<VehicleVariant[]> {
  if (!modelId) return [];

  try {
    const q = query(
      collection(db, COLS.VEHICLE_VARIANTS),
      where('vehicleModelId', '==', modelId),
      orderBy('name'),
    );
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ ...d.data(), id: d.id }) as VehicleVariant)
      .filter(v => v.isActive !== false);
  } catch (err) {
    console.warn('[vehicleCatalogService] getVariantsByModel error:', err);
    return [];
  }
}
