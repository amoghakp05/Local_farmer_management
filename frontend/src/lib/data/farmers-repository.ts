export interface FarmerReview {
  id: string;
  reviewerName: string;
  reviewerLocation: string;
  rating: number;
  date: string;
  comment: string;
  cropPurchased: string;
  verifiedTransaction: boolean;
}

export interface DetailedFarmerProfile {
  id: string;
  name: string;
  nameKn?: string;
  bio: string;
  bioKn?: string;
  village: string;
  taluk?: string;
  district: string;
  acres: number;
  experience: string;
  phone: string;
  phoneMasked: string;
  isVerified: boolean;
  isOrganic: boolean;
  certifications: string[];
  fpoName?: string;
  trustScore: number;
  totalDeals: number;
  primaryCrops: string[];
  avatarInitials: string;
  reviews: FarmerReview[];
}

// Zero seeded data: No dummy or mock farmers exist.
// Farmers enter the system strictly through the "Add Farmer" form or registration.
export const SEEDED_FARMERS: DetailedFarmerProfile[] = [];

const FARMERS_STORAGE_KEY = "khetbazaar_farmers_store";

function getStoredFarmers(): DetailedFarmerProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FARMERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredFarmers(farmers: DetailedFarmerProfile[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FARMERS_STORAGE_KEY, JSON.stringify(farmers));
  } catch {}
}

let mutableFarmers: DetailedFarmerProfile[] = [];

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export function getAllFarmers(): DetailedFarmerProfile[] {
  const stored = getStoredFarmers();
  if (stored.length > 0) {
    mutableFarmers = stored;
  }
  return mutableFarmers;
}

export function getFarmerById(id: string): DetailedFarmerProfile | undefined {
  if (!id) return undefined;
  const list = getAllFarmers();
  return (
    list.find((f) => f.id === id) ||
    list.find((f) => f.id.endsWith(id) || id.includes(f.name.toLowerCase().split(" ")[0]))
  );
}

export function findFarmerByPhone(phone: string): DetailedFarmerProfile | undefined {
  const norm = normalizePhone(phone);
  if (!norm) return undefined;
  const list = getAllFarmers();
  return list.find((f) => normalizePhone(f.phone) === norm);
}

export function createFarmer(input: {
  name: string;
  nameKn?: string;
  phone: string;
  village: string;
  taluk?: string;
  district: string;
  acres?: number;
  experience?: string;
  isOrganic?: boolean;
  certifications?: string[];
  bio?: string;
  primaryCrops?: string[];
}): { success: boolean; farmer?: DetailedFarmerProfile; error?: string } {
  const normPhone = normalizePhone(input.phone);
  if (!normPhone || normPhone.length !== 10) {
    return {
      success: false,
      error: "Please enter a valid 10-digit Indian mobile number.",
    };
  }

  // Duplicate protection: Reject if farmer with same phone already exists
  const existing = findFarmerByPhone(input.phone);
  if (existing) {
    return {
      success: false,
      error: `A farmer with mobile number ending in ${normPhone.slice(-4)} is already registered in KhetBazaar.`,
    };
  }

  const id = `f-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const initials = input.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "KB";

  const formattedPhone = `+91 ${normPhone.slice(0, 5)} ${normPhone.slice(5)}`;
  const maskedPhone = `+91 ${normPhone.slice(0, 5)} XXXXX`;

  const newFarmer: DetailedFarmerProfile = {
    id,
    name: input.name.trim(),
    nameKn: input.nameKn,
    bio: input.bio?.trim() || `Verified local farmer cultivating produce in ${input.village}, ${input.district}.`,
    village: input.village.trim(),
    taluk: input.taluk?.trim() || input.district,
    district: input.district.trim(),
    acres: input.acres || 1,
    experience: input.experience || "Active Cultivator",
    phone: formattedPhone,
    phoneMasked: maskedPhone,
    isVerified: true,
    isOrganic: Boolean(input.isOrganic),
    certifications: input.certifications || (input.isOrganic ? ["Organic Certified"] : ["APMC Registered Grower"]),
    fpoName: `${input.district} Farmers Collective`,
    trustScore: 5.0,
    totalDeals: 0,
    primaryCrops: input.primaryCrops || [],
    avatarInitials: initials,
    reviews: [],
  };

  mutableFarmers = [newFarmer, ...mutableFarmers];
  saveStoredFarmers(mutableFarmers);
  return { success: true, farmer: newFarmer };
}

export function clearAllFarmers() {
  mutableFarmers = [];
  saveStoredFarmers([]);
}

export function addFarmerReview(farmerId: string, review: Omit<FarmerReview, "id" | "date" | "verifiedTransaction">): FarmerReview {
  const farmer = getFarmerById(farmerId);
  const newRev: FarmerReview = {
    ...review,
    id: `rev-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    verifiedTransaction: true,
  };

  if (farmer) {
    farmer.reviews = [newRev, ...farmer.reviews];
    const total = farmer.reviews.reduce((acc, r) => acc + r.rating, 0);
    farmer.trustScore = Number((total / farmer.reviews.length).toFixed(2));
    farmer.totalDeals += 1;
    saveStoredFarmers(mutableFarmers);
  }

  return newRev;
}
