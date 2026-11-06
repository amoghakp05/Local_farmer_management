"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CropCard } from "@/components/crops/CropCard";
import { MarketplaceMap } from "@/components/crops/MarketplaceMap";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { getListings, ApiListing } from "@/lib/data/listings-repository";
import {
  Search,
  Filter,
  Map as MapIcon,
  List as ListIcon,
  SlidersHorizontal,
  X,
  Phone,
  MessageCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

function MarketplaceInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // 1. Initialize State from URL Search Params for persistence
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get("district") || "all");
  const [isOrganicOnly, setIsOrganicOnly] = useState(searchParams.get("organic") === "true");
  const [selectedGrade, setSelectedGrade] = useState(searchParams.get("grade") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "freshness");
  const [viewMode, setViewMode] = useState<"list" | "map" | "split">(
    (searchParams.get("view") as any) || "split"
  );
  const [selectedListingId, setSelectedListingId] = useState<string | undefined>(undefined);
  const [visibleCount, setVisibleCount] = useState(9);

  // Mobile Filter Drawer State
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Quick Contact Modal State
  const [contactListing, setContactListing] = useState<ApiListing | null>(null);
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);

  // Debounce search input (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Sync State with URL Params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedDistrict !== "all") params.set("district", selectedDistrict);
    if (isOrganicOnly) params.set("organic", "true");
    if (selectedGrade !== "all") params.set("grade", selectedGrade);
    if (sortBy !== "freshness") params.set("sort", sortBy);
    if (viewMode !== "split") params.set("view", viewMode);

    const queryString = params.toString();
    const url = queryString ? `/crops?${queryString}` : "/crops";
    router.replace(url, { scroll: false });
  }, [debouncedQuery, selectedCategory, selectedDistrict, isOrganicOnly, selectedGrade, sortBy, viewMode, router]);

  // 3. Filter & Sort Listings
  const filteredListings = useMemo(() => {
    let result = getListings({});

    // Search query
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.cropName.toLowerCase().includes(q) ||
          item.cropNameKn.includes(q) ||
          item.farmerName.toLowerCase().includes(q) ||
          item.marketName.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter((item) => {
        const titleLower = item.title.toLowerCase();
        if (selectedCategory === "vegetables") {
          return (
            titleLower.includes("tomato") ||
            titleLower.includes("onion") ||
            titleLower.includes("chilli") ||
            titleLower.includes("capsicum") ||
            titleLower.includes("coriander")
          );
        }
        if (selectedCategory === "grains") {
          return titleLower.includes("ragi") || titleLower.includes("rice") || titleLower.includes("paddy");
        }
        if (selectedCategory === "pulses") {
          return titleLower.includes("dal") || titleLower.includes("gram") || titleLower.includes("chana");
        }
        if (selectedCategory === "spices") {
          return titleLower.includes("byadgi") || titleLower.includes("chilli");
        }
        return true;
      });
    }

    // District
    if (selectedDistrict !== "all") {
      result = result.filter((item) =>
        item.district.toLowerCase().includes(selectedDistrict.toLowerCase())
      );
    }

    // Organic
    if (isOrganicOnly) {
      result = result.filter((item) => item.isOrganic);
    }

    // Quality Grade
    if (selectedGrade !== "all") {
      result = result.filter((item) => item.qualityGrade === selectedGrade);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "price_asc") return a.pricePerUnit - b.pricePerUnit;
      if (sortBy === "price_desc") return b.pricePerUnit - a.pricePerUnit;
      if (sortBy === "quantity") return b.availableQuantity - a.availableQuantity;
      // Default: freshness / harvest date desc
      return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
    });

    return result;
  }, [debouncedQuery, selectedCategory, selectedDistrict, isOrganicOnly, selectedGrade, sortBy]);

  const displayedListings = filteredListings.slice(0, visibleCount);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDistrict("all");
    setIsOrganicOnly(false);
    setSelectedGrade("all");
    setSortBy("freshness");
    toast({
      title: "Filters Cleared",
      description: "Showing all active agricultural lots across Karnataka.",
      type: "info",
    });
  };

  const handleQuickContact = (listing: ApiListing) => {
    setContactListing(listing);
    setIsPhoneRevealed(false);
  };

  const handleRevealPhone = () => {
    setIsPhoneRevealed(true);
    toast({
      title: "Phone Number Revealed",
      description: `Direct contact for ${contactListing?.farmerName}: ${contactListing?.farmerPhone}`,
      type: "success",
    });
  };

  return (
    <div className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[var(--earth-line)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="forest" size="sm">
              Live Mandi Feed
            </Badge>
            <Badge variant="neutral" size="sm">
              {filteredListings.length} Lots Available
            </Badge>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-[var(--forest-900)] tracking-tight">
            Browse Harvest Batches
          </h1>
          <p className="text-xs sm:text-sm text-[var(--earth-muted)] mt-1">
            Direct farmer listings across Karnataka APMC mandis. 100% price transparency.
          </p>
        </div>

        {/* View Mode Switcher & Mobile Filter Button */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden"
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            Filters
          </Button>

          <div className="inline-flex p-1 bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-[var(--forest-900)] shadow-sm font-bold"
                  : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`hidden md:flex px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors items-center gap-1.5 cursor-pointer ${
                viewMode === "split"
                  ? "bg-white text-[var(--forest-900)] shadow-sm font-bold"
                  : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
              }`}
            >
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === "map"
                  ? "bg-white text-[var(--forest-900)] shadow-sm font-bold"
                  : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar (3 cols) */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6 p-6 rounded-2xl bg-white border border-[var(--earth-border)] shadow-sm sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--earth-line)]">
            <span className="font-serif text-lg font-bold text-[var(--forest-900)] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--harvest-600)]" /> Filters
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[var(--harvest-700)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <Input
            label="Search Produce"
            placeholder="Tomatoes, Ragi, Farmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <Select
            label="Crop Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: "all", label: "All Categories" },
              { value: "vegetables", label: "Vegetables (ತರಕಾರಿಗಳು)" },
              { value: "grains", label: "Grains & Millets (ಧಾನ್ಯಗಳು)" },
              { value: "pulses", label: "Pulses & Dals (ಕಾಳುಗಳು)" },
              { value: "spices", label: "Spices (ಮಸಾಲೆ ಬೆಳೆಗಳು)" },
            ]}
          />

          <Select
            label="District / Mandi Zone"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            options={[
              { value: "all", label: "All Karnataka Districts" },
              { value: "kolar", label: "Kolar (ಕೋಲಾರ)" },
              { value: "haveri", label: "Haveri (ಹಾವೇರಿ)" },
              { value: "dharwad", label: "Dharwad (ಧಾರವಾಡ)" },
              { value: "mandya", label: "Mandya (ಮಂಡ್ಯ)" },
              { value: "belagavi", label: "Belagavi (ಬೆಳಗಾವಿ)" },
              { value: "chitradurga", label: "Chitradurga (ಚಿತ್ರದುರ್ಗ)" },
              { value: "kalaburagi", label: "Kalaburagi (ಕಲಬುರಗಿ)" },
            ]}
          />

          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)]">
            <label htmlFor="organic-checkbox" className="text-xs font-semibold text-[var(--earth-charcoal)] cursor-pointer select-none">
              100% Organic Certified
            </label>
            <input
              id="organic-checkbox"
              type="checkbox"
              checked={isOrganicOnly}
              onChange={(e) => setIsOrganicOnly(e.target.checked)}
              className="w-4 h-4 text-[var(--forest-700)] rounded accent-[var(--forest-700)] cursor-pointer"
            />
          </div>

          <Select
            label="Quality Grade"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            options={[
              { value: "all", label: "All Quality Grades" },
              { value: "Grade A+", label: "Grade A+ (Premium Export)" },
              { value: "Grade A", label: "Grade A (Standard Market)" },
              { value: "Grade B", label: "Grade B (Processing Grade)" },
            ]}
          />

          <Select
            label="Sort Order"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: "freshness", label: "Harvest Date: Newest First" },
              { value: "price_asc", label: "Price: Low to High" },
              { value: "price_desc", label: "Price: High to Low" },
              { value: "quantity", label: "Available Stock: Highest" },
            ]}
          />
        </aside>

        {/* Listings & Map Area */}
        <div className="col-span-1 lg:col-span-9 flex flex-col gap-6">
          {(viewMode === "map" || viewMode === "split") && (
            <div className="w-full h-80 sm:h-96">
              <MarketplaceMap
                listings={filteredListings}
                selectedListingId={selectedListingId}
                onSelectListing={(id) => setSelectedListingId(id)}
              />
            </div>
          )}

          {viewMode !== "map" && (
            <div>
              {displayedListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedListings.map((item) => (
                    <CropCard
                      key={item.id}
                      listing={item}
                      onQuickContact={handleQuickContact}
                      className={selectedListingId === item.id ? "ring-2 ring-[var(--forest-700)]" : ""}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={getListings({}).length === 0 ? "No Farm Lots Listed Yet" : "No Produce Found with These Filters"}
                  description={
                    getListings({}).length === 0
                      ? "Real Karnataka farmers are currently registering. Be the first grower to list your harvest batch!"
                      : "Try clearing your search query or broadening your district selection to view more harvest batches."
                  }
                  action={
                    getListings({}).length === 0 ? (
                      <Link href="/register?role=farmer">
                        <Button variant="accent" size="md">
                          + Add Farmer / List Harvest Batch
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="primary" size="md" onClick={resetFilters}>
                        Reset All Filters
                      </Button>
                    )
                  }
                />
              )}

              {displayedListings.length < filteredListings.length && (
                <div className="mt-10 flex justify-center">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                  >
                    Load More Harvest Lots ({filteredListings.length - displayedListings.length} Remaining)
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <Modal
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        title="Filter Harvest Lots"
        description="Refine crops by category, district, and certification."
      >
        <div className="space-y-4">
          <Input
            label="Search Produce"
            placeholder="Tomatoes, Ragi, Farmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            label="Crop Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: "all", label: "All Categories" },
              { value: "vegetables", label: "Vegetables (ತರಕಾರಿಗಳು)" },
              { value: "grains", label: "Grains & Millets (ಧಾನ್ಯಗಳು)" },
              { value: "pulses", label: "Pulses & Dals (ಕಾಳುಗಳು)" },
              { value: "spices", label: "Spices (ಮಸಾಲೆ ಬೆಳೆಗಳು)" },
            ]}
          />

          <Select
            label="District"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            options={[
              { value: "all", label: "All Karnataka Districts" },
              { value: "kolar", label: "Kolar (ಕೋಲಾರ)" },
              { value: "haveri", label: "Haveri (ಹಾವೇರಿ)" },
              { value: "dharwad", label: "Dharwad (ಧಾರವಾಡ)" },
              { value: "mandya", label: "Mandya (ಮಂಡ್ಯ)" },
              { value: "belagavi", label: "Belagavi (ಬೆಳಗಾವಿ)" },
              { value: "chitradurga", label: "Chitradurga (ಚಿತ್ರದುರ್ಗ)" },
              { value: "kalaburagi", label: "Kalaburagi (ಕಲಬುರಗಿ)" },
            ]}
          />

          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-warm)]">
            <span className="text-xs font-semibold text-[var(--earth-charcoal)]">
              100% Organic Certified
            </span>
            <input
              type="checkbox"
              checked={isOrganicOnly}
              onChange={(e) => setIsOrganicOnly(e.target.checked)}
              className="w-4 h-4 text-[var(--forest-700)] accent-[var(--forest-700)]"
            />
          </div>

          <Select
            label="Sort Order"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: "freshness", label: "Harvest Date: Newest First" },
              { value: "price_asc", label: "Price: Low to High" },
              { value: "price_desc", label: "Price: High to Low" },
              { value: "quantity", label: "Available Stock: Highest" },
            ]}
          />

          <div className="pt-3 flex gap-3">
            <Button
              variant="secondary"
              size="md"
              className="flex-1 justify-center"
              onClick={() => {
                resetFilters();
                setIsMobileFiltersOpen(false);
              }}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 justify-center"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>

      {/* Quick Contact Modal */}
      {contactListing && (
        <Modal
          isOpen={Boolean(contactListing)}
          onClose={() => setContactListing(null)}
          title="Direct Grower Contact"
          description={`Connect directly with ${contactListing.farmerName} for ${contactListing.cropName}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-serif font-bold text-base text-[var(--earth-ink)]">
                    {contactListing.farmerName}
                  </h4>
                  <p className="text-xs text-[var(--earth-muted)]">
                    {contactListing.farmVillage} • {contactListing.district}
                  </p>
                </div>
                <Badge variant="harvest" size="sm">
                  {contactListing.qualityGrade}
                </Badge>
              </div>

              <div className="pt-2 border-t border-[var(--earth-line)] flex justify-between text-xs">
                <span className="text-[var(--earth-muted)]">Batch: {contactListing.title}</span>
                <span className="font-bold text-[var(--forest-900)]">
                  ₹{contactListing.pricePerUnit}/{contactListing.unit}
                </span>
              </div>
            </div>

            {isPhoneRevealed ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[var(--forest-50)] border border-[var(--forest-200)] text-center">
                  <span className="text-xs text-[var(--forest-800)] font-semibold block mb-1">
                    Verified Phone Number:
                  </span>
                  <span className="font-mono text-2xl font-black text-[var(--forest-900)]">
                    {contactListing.farmerPhone}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${contactListing.farmerPhone.replace(/\s+/g, "")}`}
                    className="w-full"
                  >
                    <Button variant="primary" size="md" className="w-full justify-center" leftIcon={<Phone className="w-4 h-4" />}>
                      Direct Call
                    </Button>
                  </a>

                  <a
                    href={`https://wa.me/${contactListing.farmerPhone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(contactListing.farmerName)},%20I%20am%20interested%20in%20your%20${encodeURIComponent(contactListing.cropName)}%20listed%20on%20KhetBazaar.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="accent" size="md" className="w-full justify-center" leftIcon={<MessageCircle className="w-4 h-4" />}>
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[var(--harvest-50)] border border-[var(--harvest-200)] text-xs text-[var(--harvest-900)] leading-relaxed">
                  <strong>Anti-Scraper Bot Protection:</strong> Click below to verify you are a genuine buyer. Farmer numbers are protected from automated call-centers.
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  onClick={handleRevealPhone}
                >
                  Reveal Phone Number &amp; WhatsApp
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export function CropsMarketplaceClient() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-8 space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      }
    >
      <MarketplaceInner />
    </Suspense>
  );
}
