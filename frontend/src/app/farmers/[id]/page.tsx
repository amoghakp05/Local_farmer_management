import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAllFarmers, getFarmerById, DetailedFarmerProfile } from "@/lib/data/farmers-repository";
import { getListings } from "@/lib/data/listings-repository";
import { FarmerProfileClient } from "@/components/farmers/FarmerProfileClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const farmers: DetailedFarmerProfile[] = getAllFarmers();
  if (farmers.length === 0) {
    return [{ id: "none" }];
  }
  return farmers.map((f: DetailedFarmerProfile) => ({ id: f.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const farmer = getFarmerById(id);

  if (!farmer) {
    return {
      title: "Farmer Profile | KhetBazaar",
      description: "Verified grower profile on KhetBazaar.",
    };
  }

  return {
    title: `${farmer.name} (${farmer.nameKn}) — Verified Grower Profile | KhetBazaar`,
    description: `${farmer.bio} Located in ${farmer.village}, ${farmer.district}. View current harvest batches and verified mandi ratings.`,
    openGraph: {
      title: `${farmer.name} — Verified Farmer | KhetBazaar`,
      description: `Cultivating ${farmer.primaryCrops.join(", ")} in ${farmer.village}, ${farmer.district}. Rating: ${farmer.trustScore}/5.0.`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${farmer.name} — ${farmer.acres} Acres in ${farmer.district}`,
      description: farmer.bio,
    },
  };
}

export default async function FarmerProfilePage({ params }: PageProps) {
  const { id } = await params;
  const farmer = getFarmerById(id);

  if (!farmer) {
    notFound();
  }

  // Get active listings for this farmer
  const farmerListings = getListings({}).filter(
    (l) =>
      l.farmerName.toLowerCase().includes(farmer.name.toLowerCase().split(" ")[0]) ||
      l.farmerId === farmer.id
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": farmer.name,
    "description": farmer.bio,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": farmer.village,
      "addressRegion": farmer.district,
      "addressCountry": "IN",
    },
    "areaServed": "Karnataka, India",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": farmer.trustScore,
      "reviewCount": Math.max(1, farmer.reviews?.length || 1),
      "bestRating": "5",
      "worstRating": "1",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[var(--surface-linen)]">
        <FarmerProfileClient farmer={farmer} listings={farmerListings} />
      </main>
    </>
  );
}
