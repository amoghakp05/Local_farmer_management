"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldVerifiedIcon, SproutIcon, WheatIcon } from "@/components/icons";
import { Phone, CheckCircle, MapPin, PlusCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { getAllFarmers, DetailedFarmerProfile } from "@/lib/data/farmers-repository";

export function FeaturedFarmersSection() {
  const { toast } = useToast();
  const [farmers, setFarmers] = useState<DetailedFarmerProfile[]>([]);
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFarmers(getAllFarmers());
  }, []);

  const handleRevealPhone = (farmer: DetailedFarmerProfile) => {
    setRevealedPhones((prev) => ({ ...prev, [farmer.id]: true }));
    toast({
      title: "Contact Revealed",
      description: `Direct contact for ${farmer.name}: ${farmer.phone}`,
      type: "success",
    });
  };

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <Badge variant="harvest" size="md" icon={<WheatIcon size={14} />}>
            Grower Directory Spotlight
          </Badge>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-[var(--forest-900)] mt-2">
            Meet Your Local Farmers
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--earth-muted)] max-w-xl">
            Verified agricultural producers cultivating genuine crops across Karnataka. Direct contact with bot protection.
          </p>
        </div>
        <Link href="/farmers">
          <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All Farmers ({farmers.length})
          </Button>
        </Link>
      </div>

      {farmers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--earth-border)] bg-white p-12 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[var(--forest-50)] text-[var(--forest-700)] flex items-center justify-center mx-auto mb-4 border border-[var(--forest-200)]">
            <SproutIcon size={28} />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[var(--forest-900)]">
            No Farmers Registered Yet
          </h3>
          <p className="mt-2 text-sm text-[var(--earth-muted)] max-w-md mx-auto">
            All dummy and mock farmers have been completely removed. KhetBazaar is clean and awaiting authentic growers to register.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/farmers">
              <Button variant="accent" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Register Inaugural Farmer (ರೈತರ ನೋಂದಣಿ)
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {farmers.slice(0, 3).map((farmer) => {
            const isPhoneRevealed = revealedPhones[farmer.id];

            return (
              <div
                key={farmer.id}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-[var(--earth-border)] shadow-[var(--shadow-warm-sm)] hover:shadow-[var(--shadow-warm-md)] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header Profile */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[var(--forest-700)] text-[#FAF8F3] font-serif text-lg font-bold flex items-center justify-center shadow-sm">
                        {farmer.avatarInitials}
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[var(--earth-ink)]">
                          {farmer.name}
                        </h3>
                        <p className="text-xs text-[var(--earth-muted)] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[var(--harvest-600)]" />
                          {farmer.village}, {farmer.district}
                        </p>
                      </div>
                    </div>
                    {farmer.isVerified && (
                      <span
                        title="Verified Grower Identity"
                        className="p-1.5 rounded-lg bg-[var(--forest-100)] text-[var(--forest-800)] border border-[var(--forest-200)]"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {/* Highlights Bar */}
                  <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] text-xs text-[var(--earth-charcoal)] mb-4">
                    <span className="font-semibold text-[var(--forest-900)]">
                      {farmer.acres} Acres Land
                    </span>
                    <span className="text-[var(--earth-border)]">•</span>
                    <span>{farmer.experience}</span>
                    {farmer.isOrganic && (
                      <>
                        <span className="text-[var(--earth-border)]">•</span>
                        <span className="text-[var(--forest-700)] font-bold">100% Organic</span>
                      </>
                    )}
                  </div>

                  {/* Crops Tags */}
                  <div className="mb-6">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--earth-muted)] block mb-2">
                      Primary Cultivated Crops:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {farmer.primaryCrops.length > 0 ? (
                        farmer.primaryCrops.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded-md bg-[var(--forest-50)] text-[var(--forest-800)] border border-[var(--forest-100)] text-xs font-medium"
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[var(--earth-muted)]">Seasonal Field Crops</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer: Phone Shield with Click to Reveal */}
                <div className="pt-4 border-t border-[var(--earth-line)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="w-3.5 h-3.5 text-[var(--harvest-600)]" />
                    <span className="font-mono font-medium text-[var(--earth-ink)]">
                      {isPhoneRevealed ? farmer.phone : farmer.phoneMasked}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant={isPhoneRevealed ? "secondary" : "accent"}
                    onClick={() => handleRevealPhone(farmer)}
                  >
                    {isPhoneRevealed ? "Call Farmer" : "Reveal Number"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
