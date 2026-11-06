import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getListingById,
  getSimilarListings,
  getFarmerDetails,
  getListings,
  ApiListing,
} from "@/lib/data/listings-repository";
import { CropDetailClient } from "@/components/crops/CropDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const listings: ApiListing[] = getListings({});
  if (listings.length === 0) {
    return [{ id: "none" }];
  }
  return listings.map((l: ApiListing) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    return {
      title: "Produce Not Found | KhetBazaar",
      description: "The requested agricultural harvest lot was not found or has been sold.",
    };
  }

  return {
    title: `${listing.title} — Direct from ${listing.farmerName} (${listing.district}) | KhetBazaar`,
    description: `Buy ${listing.cropName} (${listing.cropNameKn}) direct from farmer ${listing.farmerName} at ₹${listing.pricePerUnit}/${listing.unit}. Harvested on ${listing.harvestDate} with ${listing.qualityGrade} quality.`,
    openGraph: {
      title: `${listing.title} | KhetBazaar`,
      description: `Direct farm lot: ₹${listing.pricePerUnit}/${listing.unit} • ${listing.availableQuantity} ${listing.unit} available in ${listing.district}.`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${listing.title} — ₹${listing.pricePerUnit}/${listing.unit}`,
      description: `Harvested on ${listing.harvestDate} by ${listing.farmerName}. Zero middleman markups.`,
    },
  };
}

export default async function CropDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    notFound();
  }

  const farmerDetail = getFarmerDetails(listing.farmerId, listing.farmerName);
  const similarListings = getSimilarListings(listing.id, 3);

  // Schema.org Product / Offer Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": listing.title,
    "description":
      listing.description ||
      `Direct farm harvest of ${listing.cropName} (${listing.cropNameKn}) grown by ${listing.farmerName} in ${listing.district}, Karnataka.`,
    "category": listing.cropName,
    "offers": {
      "@type": "Offer",
      "price": listing.pricePerUnit,
      "priceCurrency": "INR",
      "priceValidUntil": "2026-12-31",
      "availability":
        listing.availableQuantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Person",
        "name": listing.farmerName,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": listing.farmVillage,
          "addressRegion": listing.district,
          "addressCountry": "IN",
        },
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[var(--surface-linen)]">
        <CropDetailClient
          listing={listing}
          farmerDetail={farmerDetail}
          similarListings={similarListings}
        />
      </main>
    </>
  );
}
