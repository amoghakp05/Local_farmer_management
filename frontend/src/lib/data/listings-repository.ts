export interface ApiListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmVillage: string;
  district: string;
  cropId: string;
  cropName: string;
  cropNameKn: string;
  marketId: string;
  marketName: string;
  title: string;
  description: string;
  pricePerUnit: number;
  unit: string;
  totalQuantity: number;
  availableQuantity: number;
  harvestDate: string;
  qualityGrade: string;
  isOrganic: boolean;
  status: string;
  viewsCount: number;
  farmerPhoneMasked: string;
  farmerPhone: string;
}

// Zero seeded data: No dummy or mock listings exist.
// Listings are populated solely when real farmers add them.
export const SEEDED_LISTINGS: ApiListing[] = [];

const LISTINGS_STORAGE_KEY = "khetbazaar_listings_store";

function getStoredListings(): ApiListing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LISTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredListings(listings: ApiListing[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
  } catch {}
}

let mutableListings: ApiListing[] = [];

export function getAllListings(): ApiListing[] {
  const stored = getStoredListings();
  if (stored.length > 0) {
    mutableListings = stored;
  }
  return mutableListings;
}

export function getListings(filters: {
  crop?: string;
  district?: string;
  isOrganic?: boolean;
  qualityGrade?: string;
  minPrice?: number;
  maxPrice?: number;
}): ApiListing[] {
  const all = getAllListings();
  return all.filter((l) => {
    if (filters.crop && !l.cropName.toLowerCase().includes(filters.crop.toLowerCase()) && !l.cropNameKn.includes(filters.crop)) {
      return false;
    }
    if (filters.district && !l.district.toLowerCase().includes(filters.district.toLowerCase())) {
      return false;
    }
    if (filters.isOrganic !== undefined && l.isOrganic !== filters.isOrganic) {
      return false;
    }
    if (filters.qualityGrade && l.qualityGrade !== filters.qualityGrade) {
      return false;
    }
    if (filters.minPrice !== undefined && l.pricePerUnit < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && l.pricePerUnit > filters.maxPrice) {
      return false;
    }
    return true;
  });
}

export function createListing(newListing: Omit<ApiListing, "id" | "viewsCount" | "farmerPhoneMasked">): ApiListing {
  const id = `L1000000-0000-0000-0000-${Math.random().toString(36).substring(2, 14)}`;
  const item: ApiListing = {
    ...newListing,
    id,
    viewsCount: 1,
    farmerPhoneMasked: `${newListing.farmerPhone.slice(0, 8)} XXXXX`,
  };
  const current = getAllListings();
  mutableListings = [item, ...current];
  saveStoredListings(mutableListings);
  return item;
}

export function updateListing(id: string, updates: Partial<ApiListing>): ApiListing | undefined {
  const current = getAllListings();
  const idx = current.findIndex((l) => l.id === id);
  if (idx === -1) return undefined;
  current[idx] = { ...current[idx], ...updates };
  mutableListings = [...current];
  saveStoredListings(mutableListings);
  return current[idx];
}

export function deleteListing(id: string): boolean {
  const current = getAllListings();
  const next = current.filter((l) => l.id !== id);
  mutableListings = next;
  saveStoredListings(mutableListings);
  return true;
}

export function getListingById(id: string): ApiListing | undefined {
  const all = getAllListings();
  return all.find((l) => l.id === id);
}

export function getSimilarListings(currentId: string, limit = 3): ApiListing[] {
  const all = getAllListings();
  const current = all.find((l) => l.id === currentId);
  if (!current) return all.slice(0, limit);

  const filtered = all.filter((l) => l.id !== currentId);
  const byCrop = filtered.filter((l) => l.cropName.toLowerCase() === current.cropName.toLowerCase());
  const byDistrict = filtered.filter((l) => l.district.toLowerCase() === current.district.toLowerCase() && !byCrop.includes(l));
  const remaining = filtered.filter((l) => !byCrop.includes(l) && !byDistrict.includes(l));

  return [...byCrop, ...byDistrict, ...remaining].slice(0, limit);
}

export function clearAllListings() {
  mutableListings = [];
  saveStoredListings([]);
}

export interface EnrichedFarmerDetail {
  farmerId: string;
  name: string;
  acres: number;
  experience: string;
  certifications: string[];
  primaryCrops: string[];
  trustScore: number;
  completedDeals: number;
  responseTime: string;
  fpoName: string;
}

export function getFarmerDetails(farmerId: string, farmerName: string): EnrichedFarmerDetail {
  return {
    farmerId,
    name: farmerName,
    acres: 0,
    experience: "Verified Grower",
    certifications: ["Direct Farm Producer", "APMC Registered"],
    primaryCrops: [],
    trustScore: 5.0,
    completedDeals: 0,
    responseTime: "< 30 mins",
    fpoName: "Karnataka Farmers Collective",
  };
}
