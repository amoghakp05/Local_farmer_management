import { Metadata } from "next";
import { MarketsClient } from "@/components/markets/MarketsClient";

export const metadata: Metadata = {
  title: "APMC Mandis & Agricultural Market Yards in Karnataka | KhetBazaar",
  description:
    "Locate 18+ state-regulated APMC market yards and direct Rythu Bazaars across Karnataka. Live operating hours, liaison contacts, and district produce arrivals.",
  keywords: [
    "apmc mandi bangalore",
    "yeshwanthpur apmc market",
    "mysuru bandipalya mandi",
    "hubballi amargol grain market",
    "karnataka mandi directory",
    "rythu bazaar karnataka",
  ],
  openGraph: {
    title: "APMC Mandis & Market Yards Network | KhetBazaar",
    description:
      "Interactive map of verified APMC market yards and Rythu Bazaars across Karnataka districts.",
    url: "https://khetbazaar.org/markets",
  },
};

export default function MarketsPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3]">
      <MarketsClient />
    </main>
  );
}
