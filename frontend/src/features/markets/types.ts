/**
 * Feature: Markets (Mandis / Rythu Bazaars)
 */

export interface MarketLocation {
  id: string;
  name: string;
  regionalNames: {
    en: string;
    kn: string;
    hi: string;
  };
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  operationalHours: string;
  totalFarmers: number;
}
