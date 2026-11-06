import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal & APMC Moderation Desk | KhetBazaar",
  description:
    "Official APMC mandi moderation desk. Verify farmer RTC land documents, approve Grade A+ harvest lots, and resolve mandi disputes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
