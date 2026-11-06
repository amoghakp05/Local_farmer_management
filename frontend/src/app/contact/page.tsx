import { Metadata } from "next";
import { ContactClient } from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact APMC Agricultural Desk & Farmer Support | KhetBazaar",
  description:
    "Get in touch with KhetBazaar's APMC liaison desks in Bengaluru, Mysuru, and Hubballi. Instant WhatsApp agronomy help, dispute mediation, and farmer onboarding assistance.",
  openGraph: {
    title: "Contact KhetBazaar — Agricultural Support & Mandi Desks",
    description:
      "Connect directly with regional APMC desks or our live WhatsApp agronomy team for listing guidance, bulk procurement, or price inquiries.",
    url: "https://khetbazaar.org/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3]">
      <ContactClient />
    </main>
  );
}
