"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, ArrowRight, Tag } from "lucide-react";
import { RupeeIcon, SproutIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface SuggestionItem {
  id: string;
  name: string;
  regional: string;
  mandi: string;
  price: number;
  unit: string;
  available: string;
  farmer: string;
  isOrganic?: boolean;
}

import { getListings } from "@/lib/data/listings-repository";

export function SearchBar() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SuggestionItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce hook: 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setDebouncedLocation(locationQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, locationQuery]);

  // Filter suggestions on debounced values
  useEffect(() => {
    const q = debouncedQuery.toLowerCase().trim();
    const loc = debouncedLocation.toLowerCase().trim();

    if (!q && !loc) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const liveDatabase: SuggestionItem[] = getListings({}).map((l) => ({
      id: l.id,
      name: l.title,
      regional: l.cropNameKn || "",
      mandi: l.marketName || `${l.district} Mandi`,
      price: l.pricePerUnit,
      unit: l.unit,
      available: `${l.availableQuantity} ${l.unit}`,
      farmer: l.farmerName,
      isOrganic: l.isOrganic,
    }));

    const filtered = liveDatabase.filter((item) => {
      const matchCrop =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.regional.toLowerCase().includes(q);
      const matchLoc = !loc || item.mandi.toLowerCase().includes(loc);
      return matchCrop && matchLoc;
    });

    setResults(filtered);
    setIsOpen(true);
  }, [debouncedQuery, debouncedLocation]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (item: SuggestionItem) => {
    setQuery(item.name);
    setIsOpen(false);
    toast({
      title: "Crop Selected",
      description: `${item.name} (${item.regional}) at ${item.mandi} - ₹${item.price}/${item.unit}`,
      type: "success",
    });
  };

  const quickTags = [
    "Country Tomatoes",
    "Finger Millet (Ragi)",
    "Red Onions",
    "Organic Only",
    "Hubli Mandi",
    "Kolar",
  ];

  return (
    <section className="relative w-full py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-30">
      <div
        ref={containerRef}
        className="relative bg-white rounded-2xl border-2 border-[var(--earth-border)] shadow-[var(--shadow-warm-md)] p-3 sm:p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Crop Input */}
          <div className="md:col-span-6 relative flex items-center">
            <Search className="w-5 h-5 text-[var(--forest-700)] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search crop (e.g. Tomatoes, Ragi, Onions)..."
              className="w-full pl-11 pr-8 py-3 text-sm text-[var(--earth-ink)] placeholder-[var(--earth-muted)]/70 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--forest-700)]/30"
              aria-label="Search crop name"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 p-1 text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
                aria-label="Clear crop search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-[var(--earth-line)]" />

          {/* Location Input */}
          <div className="md:col-span-4 relative flex items-center">
            <MapPin className="w-5 h-5 text-[var(--harvest-600)] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Mandi or District (e.g. Kolar, Hubli)..."
              className="w-full pl-11 pr-8 py-3 text-sm text-[var(--earth-ink)] placeholder-[var(--earth-muted)]/70 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--forest-700)]/30"
              aria-label="Search location or mandi"
            />
            {locationQuery && (
              <button
                type="button"
                onClick={() => setLocationQuery("")}
                className="absolute right-2.5 p-1 text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
                aria-label="Clear location search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Trigger */}
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => {
                if (results.length > 0) {
                  handleSelectResult(results[0]);
                } else {
                  toast({
                    title: "Live Search",
                    description: `Searching available lots for "${query || locationQuery || "All Produce"}"`,
                    type: "info",
                  });
                }
              }}
              className="w-full py-3 px-4 bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-[#FAF8F3] font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--forest-700)] active:scale-98"
            >
              <span>Find Produce</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Debounced Autocomplete Suggestions Dropdown */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[var(--earth-border)] shadow-[var(--shadow-warm-lg)] overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-3 bg-[var(--surface-warm)] border-b border-[var(--earth-line)] flex items-center justify-between text-xs font-semibold text-[var(--earth-muted)]">
              <span>Matching Harvest Batches ({results.length})</span>
              <span className="text-[11px]">Real-time Mandi Feed</span>
            </div>

            {results.length > 0 ? (
              <ul className="divide-y divide-[var(--earth-line)] max-h-80 overflow-y-auto">
                {results.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    className="p-3.5 hover:bg-[var(--forest-50)]/50 cursor-pointer transition-colors flex items-center justify-between gap-3 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] flex items-center justify-center shrink-0 text-[var(--forest-700)]">
                        <SproutIcon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-sm font-bold text-[var(--earth-ink)]">
                            {item.name}
                          </h4>
                          <span className="text-xs text-[var(--forest-700)] font-medium">
                            {item.regional}
                          </span>
                          {item.isOrganic && (
                            <Badge variant="forest" size="sm">
                              Organic
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[var(--earth-muted)] mt-0.5 flex items-center gap-2">
                          <span>{item.mandi}</span>
                          <span>•</span>
                          <span>Farmer: {item.farmer}</span>
                          <span>•</span>
                          <span className="text-[var(--forest-800)] font-semibold">
                            {item.available} in stock
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-[var(--earth-muted)]">Benchmark</span>
                      <p className="font-serif text-base font-bold text-[var(--forest-900)]">
                        ₹{item.price} <span className="text-xs font-normal">/{item.unit}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-xs text-[var(--earth-muted)]">
                No active lots found matching &ldquo;{debouncedQuery || debouncedLocation}&rdquo;. Try another crop or district.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Search Filter Pills */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-[var(--earth-muted)] font-medium flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" /> Popular Searches:
        </span>
        {quickTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setQuery(tag)}
            className="px-2.5 py-1 rounded-lg bg-white border border-[var(--earth-border)] text-[var(--earth-charcoal)] hover:border-[var(--forest-700)] hover:text-[var(--forest-900)] transition-colors cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
