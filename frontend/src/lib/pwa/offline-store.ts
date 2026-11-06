import { ApiListing } from "@/lib/data/listings-repository";

const OFFLINE_CROPS_KEY = "khetbazaar_offline_recently_browsed";
const MAX_OFFLINE_ITEMS = 25;

export interface CachedCropLot {
  id: string;
  title: string;
  cropName: string;
  cropNameKn: string;
  farmerName: string;
  district: string;
  farmVillage: string;
  pricePerUnit: number;
  unit: string;
  qualityGrade: string;
  isOrganic: boolean;
  availableQuantity: number;
  farmerPhone: string;
  farmerPhoneMasked: string;
  harvestDate: string;
  cachedAt: number;
}

export function saveRecentlyViewedCrop(listing: ApiListing): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getRecentlyViewedCrops();
    const filtered = existing.filter((item) => item.id !== listing.id);

    const newEntry: CachedCropLot = {
      id: listing.id,
      title: listing.title,
      cropName: listing.cropName,
      cropNameKn: listing.cropNameKn,
      farmerName: listing.farmerName,
      district: listing.district,
      farmVillage: listing.farmVillage,
      pricePerUnit: listing.pricePerUnit,
      unit: listing.unit,
      qualityGrade: listing.qualityGrade,
      isOrganic: listing.isOrganic,
      availableQuantity: listing.availableQuantity,
      farmerPhone: listing.farmerPhone,
      farmerPhoneMasked: listing.farmerPhoneMasked,
      harvestDate: listing.harvestDate,
      cachedAt: Date.now(),
    };

    const updated = [newEntry, ...filtered].slice(0, MAX_OFFLINE_ITEMS);
    localStorage.setItem(OFFLINE_CROPS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not save crop to offline cache:", err);
  }
}

export function getRecentlyViewedCrops(): CachedCropLot[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(OFFLINE_CROPS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function clearRecentlyViewedCrops(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(OFFLINE_CROPS_KEY);
  } catch {}
}

export function isBrowserOnline(): boolean {
  if (typeof window === "undefined") return true;
  return navigator.onLine;
}
