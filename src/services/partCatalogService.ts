/**
 * partCatalogService.ts — Read-only Firestore catalog queries for the user app.
 *
 * Uses the same collections as the admin:
 * - `part_categories`
 * - `part_subcategories`
 *
 * Capabilities:
 * 1. Direct subcategory prefix / keyword search on `searchName`.
 * 2. Category-aware search: If the user searches a category (e.g., "Air conditioner", "Braking"),
 *    finds matching categories and automatically retrieves all active subcategories under them.
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
import { PartCategory, PartSubcategory } from '../models/part';

const COLS = {
  PART_CATEGORIES:    'part_categories',
  PART_SUBCATEGORIES: 'part_subcategories',
};

function cleanSearchName(raw: string): string {
  return raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, '');
}

// In-memory cache for the ~17 top-level categories
let cachedCategories: PartCategory[] | null = null;
let lastCategoriesFetch = 0;
const CATEGORY_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch and cache all active part categories.
 */
export async function getPartCategories(): Promise<PartCategory[]> {
  const now = Date.now();
  if (cachedCategories && now - lastCategoriesFetch < CATEGORY_CACHE_TTL_MS) {
    return cachedCategories;
  }

  try {
    const q = query(
      collection(db, COLS.PART_CATEGORIES),
      orderBy('sortOrder', 'asc'),
    );
    const snap = await getDocs(q);
    const list = snap.docs
      .map(d => ({ ...d.data(), id: d.id }) as PartCategory)
      .filter(c => c.isActive !== false);

    cachedCategories = list;
    lastCategoriesFetch = now;
    return list;
  } catch (err) {
    console.warn('[partCatalogService] getPartCategories error:', err);
    return cachedCategories || [];
  }
}

/**
 * Fetch all active subcategories for a given category ID.
 */
export async function getSubcategoriesByCategoryId(
  categoryId: string,
): Promise<PartSubcategory[]> {
  if (!categoryId) return [];
  try {
    const q = query(
      collection(db, COLS.PART_SUBCATEGORIES),
      where('categoryId', '==', categoryId),
    );
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ ...d.data(), id: d.id }) as PartSubcategory)
      .filter(s => s.isActive !== false)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (err) {
    console.warn('[partCatalogService] getSubcategoriesByCategoryId error:', err);
    return [];
  }
}

export interface PartSearchResult {
  subcategories: PartSubcategory[];
  matchedCategories: { id: string; name: string }[];
}

/**
 * Search parts by subcategory name OR category name.
 *
 * Example:
 * - User types "Air conditioner" -> Matches Category "Air Conditioning & Climate"
 *   -> returns all subcategories under that category (AC Compressor, AC Condenser, etc.)
 * - User types "Brake Pad" -> Direct match on subcategory "Brake Pad"
 * - User types "Brake" -> Matches Category "Braking System" AND subcategories starting with "Brake"
 */
export async function searchPartsAndCategories(
  rawQuery: string,
  maxResults = 15,
): Promise<PartSearchResult> {
  const trimmed = rawQuery.trim();
  const clean = cleanSearchName(trimmed);
  if (!clean || clean.length < 1) {
    return { subcategories: [], matchedCategories: [] };
  }

  const queryLower = trimmed.toLowerCase();
  const tokens = queryLower.split(/\s+/).filter(Boolean);

  try {
    // 1. Fetch categories to see if any match the search query
    const categories = await getPartCategories();

    // A category matches if:
    // - its clean searchName includes the query clean searchName (or vice versa)
    // - or tokens (like "air", "condition") match words in category name
    const matchedCategories = categories.filter(cat => {
      const catNameLower = cat.name.toLowerCase();
      const catClean = cleanSearchName(cat.name);

      // Substring check
      if (catNameLower.includes(queryLower) || queryLower.includes(catNameLower)) return true;
      if (catClean.includes(clean) || clean.includes(catClean)) return true;

      // Token check (e.g. "air conditioner" matches "Air Conditioning & Climate")
      const matchesAllTokens = tokens.every(token => {
        // Simple stemming for common word endings (e.g. "conditioner" / "conditioning" -> "condition")
        const root = token.length > 5 ? token.replace(/(ing|er|ers|ed|s)$/g, '') : token;
        return catNameLower.includes(root);
      });

      return matchesAllTokens;
    });

    const categorySubcatPromises = matchedCategories.slice(0, 3).map(cat =>
      getSubcategoriesByCategoryId(cat.id),
    );

    // 2. Direct subcategory prefix query using Firestore searchName
    const directQuery = query(
      collection(db, COLS.PART_SUBCATEGORIES),
      where('searchName', '>=', clean),
      where('searchName', '<=', clean + '\uf8ff'),
      orderBy('searchName'),
      limit(maxResults),
    );

    const [categorySubcatResults, directSnap] = await Promise.all([
      Promise.all(categorySubcatPromises),
      getDocs(directQuery),
    ]);

    const directSubcats = directSnap.docs
      .map(d => ({ ...d.data(), id: d.id }) as PartSubcategory)
      .filter(s => s.isActive !== false);

    // 3. Merge & Deduplicate results (category results + direct matches)
    const seenIds = new Set<string>();
    const combined: PartSubcategory[] = [];

    // Prioritize direct hits if the user typed an exact or close subcategory name
    for (const sub of directSubcats) {
      if (!seenIds.has(sub.id)) {
        seenIds.add(sub.id);
        combined.push(sub);
      }
    }

    // Add category-expanded subcategories
    for (const catList of categorySubcatResults) {
      for (const sub of catList) {
        if (!seenIds.has(sub.id)) {
          seenIds.add(sub.id);
          combined.push(sub);
        }
      }
    }

    return {
      subcategories: combined.slice(0, maxResults),
      matchedCategories: matchedCategories.map(c => ({ id: c.id, name: c.name })),
    };
  } catch (err) {
    console.warn('[partCatalogService] searchPartsAndCategories error:', err);
    return { subcategories: [], matchedCategories: [] };
  }
}
