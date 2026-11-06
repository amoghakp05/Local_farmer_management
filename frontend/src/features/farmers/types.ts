/**
 * Feature: Farmers
 */

export interface FarmerProfile {
  id: string;
  fullName: string;
  village: string;
  taluk: string;
  district: string;
  contactNumberEncrypted: string;
  isVerified: boolean;
  farmSizeAcres: number;
  primaryCrops: string[];
  joinedDate: string;
}
