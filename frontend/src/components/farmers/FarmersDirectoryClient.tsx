"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getAllFarmers, DetailedFarmerProfile } from "@/lib/data/farmers-repository";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ShieldVerifiedIcon, OrganicLeafIcon, SproutIcon, WheatIcon } from "@/components/icons";
import { Search, MapPin, Award, Phone, ArrowRight, Star } from "lucide-react";

export function FarmersDirectoryClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [isOrganicOnly, setIsOrganicOnly] = useState(false);

  const farmers = getAllFarmers();

  const filteredFarmers = useMemo(() => {
    return farmers.filter((f) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = f.name.toLowerCase().includes(q) || Boolean(f.nameKn && f.nameKn.includes(q));
        const matchCrops = f.primaryCrops.some((c) => c.toLowerCase().includes(q));
        const matchVillage = f.village.toLowerCase().includes(q);
        if (!matchName && !matchCrops && !matchVillage) return false;
      }
      if (selectedDistrict !== "all" && f.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
        return false;
      }
      if (isOrganicOnly && !f.isOrganic) {
        return false;
      }
      return true;
    });
  }, [farmers, searchQuery, selectedDistrict, isOrganicOnly]);

  return (
    <div className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-8 mb-8 border-b border-[var(--earth-line)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="forest" size="sm">
                Karnataka State Directory
              </Badge>
              <Badge variant="neutral" size="sm">
                {farmers.length} Verified Growers
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-[var(--forest-900)] tracking-tight">
              Karnataka Farmers Directory
            </h1>
            <p className="text-sm sm:text-base text-[var(--earth-muted)] mt-2 max-w-2xl">
              Connect directly with certified agricultural growers across Karnataka districts. Zero intermediaries, fair farmgate compensation, and 100% origin transparency.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/register?role=farmer">
              <Button variant="accent" size="md" leftIcon={<SproutIcon size={16} />}>
                + Add / Register Farmer
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
          <div className="relative sm:col-span-1">
            <Input
              placeholder="Search farmer name or crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <Select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            options={[
              { value: "all", label: "All Districts" },
              { value: "haveri", label: "Haveri (ಹಾವೇರಿ)" },
              { value: "dharwad", label: "Dharwad (ಧಾರವಾಡ)" },
              { value: "kolar", label: "Kolar (ಕೋಲಾರ)" },
              { value: "mandya", label: "Mandya (ಮಂಡ್ಯ)" },
              { value: "belagavi", label: "Belagavi (ಬೆಳಗಾವಿ)" },
            ]}
          />

          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[var(--earth-border-subtle)]">
            <span className="text-xs font-semibold text-[var(--earth-charcoal)]">
              Organic Certified Only
            </span>
            <input
              type="checkbox"
              checked={isOrganicOnly}
              onChange={(e) => setIsOrganicOnly(e.target.checked)}
              className="w-4 h-4 text-[var(--forest-700)] accent-[var(--forest-700)] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Farmers Grid / Empty State */}
      {filteredFarmers.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[var(--earth-border)] max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[var(--surface-warm)] text-[var(--forest-700)] flex items-center justify-center mx-auto mb-3">
            <SproutIcon size={28} />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--earth-ink)]">
            No Farmers Registered Yet
          </h3>
          <p className="text-xs sm:text-sm text-[var(--earth-muted)] mt-1.5 max-w-sm mx-auto leading-relaxed">
            Be the first verified grower from Karnataka to register your farmland, showcase your crops, and receive direct buyer inquiries.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Link href="/register?role=farmer">
              <Button variant="accent" size="md" leftIcon={<SproutIcon size={16} />}>
                + Add / Register Farmer Now
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map((farmer) => (
            <div
              key={farmer.id}
              className="bg-white rounded-2xl border border-[var(--earth-border)] p-6 shadow-[var(--shadow-warm-sm)] hover:shadow-[var(--shadow-warm-md)] hover:border-[var(--forest-700)] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Avatar & Badges */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--forest-800)] text-amber-200 font-serif font-black text-xl flex items-center justify-center shadow-xs">
                    {farmer.avatarInitials}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="forest" size="sm" icon={<ShieldVerifiedIcon size={12} />}>
                      Verified
                    </Badge>
                    {farmer.isOrganic && (
                      <Badge variant="neutral" size="sm" icon={<OrganicLeafIcon size={11} />}>
                        Organic
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Names */}
                <div>
                  <h3 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
                    {farmer.name}
                  </h3>
                  <span className="text-xs font-semibold text-[var(--harvest-700)] block">
                    {farmer.nameKn}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--earth-muted)] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--harvest-600)]" />
                    <span>
                      {farmer.village}, {farmer.district}
                    </span>
                  </div>
                </div>

                {/* Bio summary */}
                <p className="text-xs text-[var(--earth-charcoal)] mt-3 line-clamp-2 leading-relaxed">
                  {farmer.bio}
                </p>

                {/* Primary Crops Pills */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--earth-muted)] block">
                    Primary Crops
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {farmer.primaryCrops.map((crop, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[var(--surface-warm)] text-[var(--forest-900)] border border-[var(--earth-line)]"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-2 py-3 my-4 border-y border-[var(--earth-line)] text-center">
                  <div>
                    <span className="text-[10px] text-[var(--earth-muted)] block">Farmland</span>
                    <span className="text-xs font-bold text-[var(--forest-900)]">{farmer.acres} Acres</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--earth-muted)] block">Experience</span>
                    <span className="text-xs font-bold text-[var(--forest-900)]">{farmer.experience.split(" ")[0]} Yrs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--earth-muted)] block">Rating</span>
                    <span className="text-xs font-bold text-amber-700 flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {farmer.trustScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Full Profile CTA */}
              <Link href={`/farmers/${farmer.id}`} className="mt-2">
                <Button variant="secondary" size="sm" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Profile &amp; Batches
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
