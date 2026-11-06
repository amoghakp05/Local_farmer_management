import { Metadata } from "next";
import { FarmersDirectoryClient } from "@/components/farmers/FarmersDirectoryClient";

export const metadata: Metadata = {
  title: "Verified Farmers Directory in Karnataka | KhetBazaar",
  description:
    "Discover verified agricultural growers and organic cultivators across Karnataka. Connect directly with farmers in Kolar, Haveri, Dharwad, and Mandya.",
  keywords: [
    "karnataka farmers list",
    "organic farmers bangalore",
    "verified growers karnataka",
    "farmer contact directory",
    "byadgi chilli growers",
    "kolar tomato farmers",
  ],
  openGraph: {
    title: "Verified Karnataka Farmers Directory | KhetBazaar",
    description:
      "Direct directory of verified independent farmers with soil certificates, acreage, and active harvest batches.",
    url: "https://khetbazaar.org/farmers",
  },
};

export default function FarmersPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3]">
      <FarmersDirectoryClient />
    </main>
  );
}
