import { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "KhetBazaar — Direct from the Soil to Your Table | Local Farmer Market",
  description:
    "Direct farm-to-table platform connecting Karnataka farmers with consumers. Transparent real-time APMC mandi price benchmarks, verified growers, zero middleman cuts.",
  keywords: [
    "farmer market",
    "khet bazaar",
    "karnataka mandi prices",
    "apmc mandi benchmark",
    "direct farm produce",
    "organic vegetables bangalore",
    "farmers market mysuru",
    "buy directly from farmers",
    "bengaluru fresh vegetables",
  ],
  openGraph: {
    title: "KhetBazaar — Direct Soil to Table Agricultural Network",
    description:
      "Buy fresh harvest lots directly from verified Karnataka farmers at fair farm-gate rates with live APMC benchmark prices.",
    url: "https://khetbazaar.org",
    siteName: "KhetBazaar",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KhetBazaar — Direct Soil to Table",
    description:
      "Connecting local growers directly with conscious consumers. Zero middleman margins.",
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://khetbazaar.org/#website",
        "url": "https://khetbazaar.org",
        "name": "KhetBazaar",
        "description": "Local Farmer Market Information System and Direct Produce Exchange",
        "publisher": {
          "@id": "https://khetbazaar.org/#organization",
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://khetbazaar.org/crops?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://khetbazaar.org/#organization",
        "name": "KhetBazaar Initiative",
        "url": "https://khetbazaar.org",
        "logo": "https://khetbazaar.org/icons/icon-512x512.png",
        "description":
          "Democratizing agricultural market intelligence, live APMC mandi benchmarks, and direct producer-consumer commerce.",
        "areaServed": {
          "@type": "State",
          "name": "Karnataka, India",
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9845214820",
          "contactType": "customer service",
          "availableLanguage": ["English", "Kannada", "Hindi"],
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
