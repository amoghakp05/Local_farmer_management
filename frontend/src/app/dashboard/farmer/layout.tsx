import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Farmer Dashboard — List Harvest Produce in 30 Seconds | KhetBazaar",
  description:
    "Add new crop harvest batches, track buyer phone reveals, monitor live mandi benchmark prices, and manage active farm inventory.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FarmerDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
