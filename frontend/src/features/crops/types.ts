/**
 * Feature: Crops
 * Types and contract definitions for agricultural produce.
 */

export interface CropItem {
  id: string;
  name: string;
  regionalNames: {
    en: string;
    kn: string;
    hi: string;
  };
  category: "vegetables" | "fruits" | "grains" | "pulses" | "spices";
  currentPrice: number;
  unit: "kg" | "quintal" | "dozen";
  harvestDate: string;
  isOrganic: boolean;
  stockQuantity: number;
  farmerId: string;
  marketId: string;
  imageUrl?: string;
}
