import { MetadataRoute } from "next";
import { getListings } from "@/lib/data/listings-repository";
import { getAllFarmers } from "@/lib/data/farmers-repository";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://khetbazaar.org";
  const currentDate = new Date().toISOString();

  // Static marketing & operational routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/crops`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/markets`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/farmers`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/design-system`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Dynamic Crop Listings
  const cropRoutes: MetadataRoute.Sitemap = getListings({}).map((listing) => ({
    url: `${baseUrl}/crops/${listing.id}`,
    lastModified: listing.harvestDate ? new Date(listing.harvestDate).toISOString() : currentDate,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Dynamic Farmer Profiles
  const farmers = getAllFarmers();
  const farmerRoutes: MetadataRoute.Sitemap = farmers.map((farmer) => ({
    url: `${baseUrl}/farmers/${farmer.id}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...cropRoutes, ...farmerRoutes];
}
