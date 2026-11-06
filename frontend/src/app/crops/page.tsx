import { Metadata } from "next";
import { CropsMarketplaceClient } from "@/components/crops/CropsMarketplaceClient";

export const metadata: Metadata = {
  title: "Browse Fresh Crops & Mandi Harvest Lots | KhetBazaar",
  description:
    "Explore 450+ verified farm harvest lots across Karnataka. Real-time APMC mandi price benchmarks, Grade A+ quality, organic certifications, and direct farmer contact.",
  keywords: [
    "fresh crops bangalore",
    "karnataka farm produce",
    "mandi rates today",
    "direct farm purchase",
    "organic tomatoes kolar",
    "byadgi chillies",
    "hassan ragi direct farmer",
  ],
  openGraph: {
    title: "Browse Fresh Harvest Produce | KhetBazaar",
    description:
      "Direct farm lots across 14 Karnataka districts with transparent APMC mandi benchmarks.",
    url: "https://khetbazaar.org/crops",
  },
};

export default function CropsPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3]">
      <CropsMarketplaceClient />
    </main>
  );
}
