import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Harvest Lots & Mandi Price Watchlist | KhetBazaar",
  description:
    "View your bookmarked crops, monitored mandi price drop alerts, and quick contact history with Karnataka farmers.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConsumerSavedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
