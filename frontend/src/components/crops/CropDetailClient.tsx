"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiListing, EnrichedFarmerDetail } from "@/lib/data/listings-repository";
import { saveRecentlyViewedCrop } from "@/lib/pwa/offline-store";
import { CropGallery3D } from "./CropGallery3D";
import { PriceHistoryChart } from "./PriceHistoryChart";
import { FarmerProfileCard } from "./FarmerProfileCard";
import { CropCard } from "./CropCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Calendar,
  Scale,
  Sparkles,
  MapPin,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  TrendingDown,
  Info,
} from "lucide-react";
import { OrganicLeafIcon, ShieldVerifiedIcon, WheatIcon } from "@/components/icons";

interface CropDetailClientProps {
  listing: ApiListing;
  farmerDetail: EnrichedFarmerDetail;
  similarListings: ApiListing[];
}

export function CropDetailClient({
  listing,
  farmerDetail,
  similarListings,
}: CropDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Cache lot for PWA offline viewing
  useEffect(() => {
    saveRecentlyViewedCrop(listing);
  }, [listing]);

  const [orderQuantity, setOrderQuantity] = useState(
    Math.min(25, listing.availableQuantity)
  );
  const [unitMode, setUnitMode] = useState<"kg" | "quintal">("kg");
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Price calculations
  const priceKg = listing.pricePerUnit;
  const priceQuintal = listing.pricePerUnit * 100;
  const estimatedCost = orderQuantity * priceKg;

  // Stock percentage
  const stockPct = Math.round(
    (listing.availableQuantity / listing.totalQuantity) * 100
  );

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: `${listing.title} on KhetBazaar`,
      text: `Direct farm lot: ${listing.title} at ₹${listing.pricePerUnit}/${listing.unit} by ${listing.farmerName} from ${listing.district}.`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: "Crop batch shared via device sheet.",
          type: "success",
        });
        return;
      } catch (err: any) {
        if (err.name === "AbortError") return;
      }
    }

    // Fallback: Clipboard copy
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied to Clipboard",
          description: "Anyone with this URL can view this harvest listing.",
          type: "success",
        });
      } catch {
        toast({
          title: "Share URL",
          description: window.location.href,
          type: "info",
        });
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: !isBookmarked ? "Saved to Watchlist" : "Removed from Watchlist",
      description: !isBookmarked
        ? `${listing.cropName} will notify you of daily price changes.`
        : "Removed from your monitored produce list.",
      type: "info",
    });
  };

  return (
    <div className="w-full py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs & Utility Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--earth-line)]">
        <div className="flex items-center gap-2 text-xs text-[var(--earth-muted)] flex-wrap">
          <Link
            href="/"
            className="hover:text-[var(--forest-800)] transition-colors font-medium"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/crops"
            className="hover:text-[var(--forest-800)] transition-colors font-medium"
          >
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-[var(--forest-900)] font-semibold truncate max-w-[200px] sm:max-w-xs">
            {listing.cropName}
          </span>
        </div>

        {/* Share & Bookmark Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleBookmark}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isBookmarked
                ? "bg-amber-50 text-[var(--harvest-700)] border-[var(--harvest-600)]"
                : "bg-white text-[var(--earth-muted)] border-[var(--earth-border-subtle)] hover:text-[var(--earth-ink)]"
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
            />
            <span className="hidden sm:inline">
              {isBookmarked ? "Saved" : "Save"}
            </span>
          </button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            Share Lot
          </Button>
        </div>
      </div>

      {/* Main 2-Column Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Gallery & Quality Specs & 30-Day Price Chart */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Interactive 3D / Photo Showcase */}
          <CropGallery3D
            cropName={listing.cropName}
            cropNameKn={listing.cropNameKn}
            isOrganic={listing.isOrganic}
            qualityGrade={listing.qualityGrade}
            farmVillage={listing.farmVillage}
            district={listing.district}
          />

          {/* Description & Lot Attributes */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[var(--earth-border)] p-5 sm:p-6 shadow-[var(--shadow-warm-sm)] space-y-4">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--earth-ink)]">
              Lot Description & Harvest Notes
            </h3>
            <p className="text-sm sm:text-base text-[var(--earth-charcoal)] leading-relaxed">
              {listing.description}
            </p>

            {/* Quality Specification Tags */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)]">
                <span className="text-[10px] font-bold text-[var(--earth-muted)] uppercase block">
                  Moisture Content
                </span>
                <span className="text-xs font-bold text-[var(--earth-ink)]">
                  {listing.isOrganic ? "11.2% (Optimal)" : "12.0%"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)]">
                <span className="text-[10px] font-bold text-[var(--earth-muted)] uppercase block">
                  Color Grading
                </span>
                <span className="text-xs font-bold text-[var(--earth-ink)]">
                  Uniform Natural Deep
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)]">
                <span className="text-[10px] font-bold text-[var(--earth-muted)] uppercase block">
                  Packaging Type
                </span>
                <span className="text-xs font-bold text-[var(--earth-ink)]">
                  Crates / Jute Bags
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)]">
                <span className="text-[10px] font-bold text-[var(--earth-muted)] uppercase block">
                  Mandi Weighing
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  Certified Scales
                </span>
              </div>
            </div>
          </div>

          {/* 30-Day Interactive Mandi Price History Chart */}
          <PriceHistoryChart
            cropId={listing.cropId}
            cropName={listing.cropName}
            currentPrice={listing.pricePerUnit}
            unit={listing.unit}
          />
        </div>

        {/* Right Column: Pricing, Stock, Order Calculator, & Farmer Card */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
          {/* Main Price Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[var(--earth-border)] p-5 sm:p-6 shadow-[var(--shadow-warm-md)] space-y-5">
            {/* Title Header */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-bold text-[var(--forest-800)] bg-[var(--forest-50)] px-2.5 py-1 rounded-md border border-[var(--forest-200)]">
                  {listing.cropNameKn}
                </span>
                <span className="text-xs text-[var(--earth-muted)]">
                  {listing.marketName}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-black text-[var(--earth-ink)] leading-tight">
                {listing.title}
              </h1>
            </div>

            {/* Price Box with Kg / Quintal Switcher */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--surface-warm)] to-[#F5EFE4] border border-[var(--earth-line)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--earth-muted)]">
                  Direct Farm Price
                </span>

                {/* Unit Switcher */}
                <div className="inline-flex p-0.5 bg-white border border-[var(--earth-border-subtle)] rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setUnitMode("kg")}
                    className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                      unitMode === "kg"
                        ? "bg-[var(--forest-800)] text-white shadow-xs font-bold"
                        : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
                    }`}
                  >
                    Per Kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitMode("quintal")}
                    className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                      unitMode === "quintal"
                        ? "bg-[var(--forest-800)] text-white shadow-xs font-bold"
                        : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
                    }`}
                  >
                    Per Quintal
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl font-black text-[var(--forest-900)]">
                  ₹{unitMode === "kg" ? priceKg.toFixed(2) : priceQuintal.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-[var(--earth-muted)]">
                  / {unitMode === "kg" ? "kg" : "quintal (100 kg)"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-800 font-medium">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                <span>
                  Save ~14% vs APMC commission intermediary markups
                </span>
              </div>
            </div>

            {/* Stock Availability & Harvest Date */}
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[var(--earth-charcoal)]">
                  Available Stock
                </span>
                <span className="font-bold text-[var(--forest-900)]">
                  {listing.availableQuantity} {listing.unit} remaining (of{" "}
                  {listing.totalQuantity} {listing.unit})
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[var(--surface-warm)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--forest-700)] transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, stockPct))}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--surface-warm)]">
                  <Calendar className="w-4 h-4 text-[var(--harvest-600)] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[var(--earth-muted)] block">
                      Harvested On
                    </span>
                    <span className="font-semibold text-[var(--earth-ink)]">
                      {listing.harvestDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--surface-warm)]">
                  <Scale className="w-4 h-4 text-[var(--forest-700)] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[var(--earth-muted)] block">
                      Min Order
                    </span>
                    <span className="font-semibold text-[var(--earth-ink)]">
                      10 {listing.unit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Estimator Calculator */}
            <div className="p-3.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--earth-ink)] flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-[var(--forest-700)]" />
                  <span>Cost Estimator</span>
                </span>
                <span className="text-xs font-mono font-bold text-[var(--forest-900)]">
                  {orderQuantity} kg = ₹{estimatedCost.toLocaleString()}
                </span>
              </div>

              <input
                type="range"
                min="10"
                max={Math.min(listing.availableQuantity, 200)}
                step="5"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
                className="w-full accent-[var(--forest-700)] cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-[var(--earth-muted)]">
                <span>Min: 10 kg</span>
                <span>Max: {Math.min(listing.availableQuantity, 200)} kg</span>
              </div>
            </div>
          </div>

          {/* Farmer Profile & Contact Actions */}
          <FarmerProfileCard
            farmerId={listing.farmerId}
            farmerName={listing.farmerName}
            farmVillage={listing.farmVillage}
            district={listing.district}
            farmerPhone={listing.farmerPhone}
            farmerPhoneMasked={listing.farmerPhoneMasked}
            cropTitle={listing.title}
            farmerDetail={farmerDetail}
          />
        </div>
      </div>

      {/* Similar Produce Section */}
      {similarListings.length > 0 && (
        <div className="mt-16 pt-12 border-t border-[var(--earth-line)]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <Badge variant="harvest" size="sm" className="mb-2">
                Related Harvests
              </Badge>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--earth-ink)]">
                Similar Batches in {listing.district} & Beyond
              </h2>
              <p className="text-xs sm:text-sm text-[var(--earth-muted)] mt-1">
                Explore nearby farmers with matching crop types and verified APMC rates.
              </p>
            </div>

            <Link href="/crops">
              <Button variant="secondary" size="sm">
                View All Marketplace Lots
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarListings.map((sim) => (
              <CropCard key={sim.id} listing={sim} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
