"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { WheatIcon, SproutIcon } from "@/components/icons";
import { getListings, ApiListing } from "@/lib/data/listings-repository";
import { PlusCircle } from "lucide-react";

export function FreshTodayStrip() {
  const [listings, setListings] = useState<ApiListing[]>([]);

  useEffect(() => {
    setListings(getListings({}));
  }, []);

  return (
    <div className="w-full bg-[#F5EFE4] border-y border-[var(--earth-border)] py-3 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        {/* Live Indicator Pill */}
        <div className="shrink-0 flex items-center gap-2 pr-4 border-r border-[var(--earth-border)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--harvest-600)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--harvest-600)]" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--forest-900)]">
            Fresh Today
          </span>
        </div>

        {/* Scrolling Ticker Line */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-0.5">
          {listings.length === 0 ? (
            <div className="inline-flex items-center gap-3 text-xs text-[var(--earth-charcoal)]">
              <span className="text-[var(--forest-800)] font-medium">
                Live mandi arrivals ticker is active. No farm lots listed yet today.
              </span>
              <span className="text-[var(--earth-border)]">•</span>
              <Link
                href="/crops"
                className="inline-flex items-center gap-1.5 font-semibold text-[var(--forest-700)] hover:text-[var(--forest-900)] underline underline-offset-2"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add a farmer to list fresh produce
              </Link>
            </div>
          ) : (
            listings.map((item) => (
              <div
                key={item.id}
                className="inline-flex items-center gap-2.5 text-xs text-[var(--earth-ink)] bg-white px-3 py-1.5 rounded-lg border border-[var(--earth-border-subtle)] shadow-[0_1px_2px_rgba(27,67,50,0.03)] shrink-0"
              >
                <WheatIcon size={14} className="text-[var(--harvest-600)] shrink-0" />
                <span className="font-serif font-bold text-[var(--forest-900)]">
                  {item.title}
                </span>
                <span className="text-[var(--earth-border)]">•</span>
                <span className="text-[var(--earth-charcoal)]">{item.farmVillage || item.district}</span>
                <span className="font-mono font-bold text-[var(--forest-800)] px-1.5 py-0.5 rounded bg-[var(--forest-100)]">
                  ₹{item.pricePerUnit}/{item.unit}
                </span>
                <span className="text-[10px] text-[var(--earth-muted)] font-medium">
                  {item.farmerName}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
