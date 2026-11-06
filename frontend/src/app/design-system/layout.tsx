import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KhetBazaar Design System — Accessible Agrarian UI Language",
  description:
    "Explore the color palette, typography, micro-interactions, and accessible UI components engineered for India's rural agricultural web.",
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
