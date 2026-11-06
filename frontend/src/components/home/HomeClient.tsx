"use client";

import React, { useRef } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { HarvestJourneySection } from "@/components/home/HarvestJourneySection";
import { FreshTodayStrip } from "@/components/home/FreshTodayStrip";
import { SearchBar } from "@/components/home/SearchBar";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FeaturedFarmersSection } from "@/components/home/FeaturedFarmersSection";
import { SeasonalCropCalendar } from "@/components/home/SeasonalCropCalendar";
import { AnimatedStatsCounter } from "@/components/home/AnimatedStatsCounter";
import { FarmerCTASection } from "@/components/home/FarmerCTASection";

export function HomeClient() {
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSearch = () => {
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#FAF8F3]">
      {/* 1. Hero Welcoming Section */}
      <HeroSection onExploreClick={scrollToSearch} />

      {/* 2. Signature 3D Scroll Journey: The Harvest Journey */}
      <HarvestJourneySection />

      {/* 3. Fresh Today Live Ticker Strip */}
      <FreshTodayStrip />

      {/* 4. Debounced Search Bar (Crop + Location) */}
      <div ref={searchSectionRef}>
        <SearchBar />
      </div>

      {/* 5. How It Works (Direct 3-Stage Architecture) */}
      <HowItWorksSection />

      {/* 6. Featured Farmers Directory Spotlight */}
      <FeaturedFarmersSection />

      {/* 7. Seasonal Crop Calendar (Kharif, Rabi, Summer) */}
      <SeasonalCropCalendar />

      {/* 8. Animated Stats Counter */}
      <AnimatedStatsCounter />

      {/* 9. High Impact Call to Action for Farmers */}
      <FarmerCTASection />
    </div>
  );
}
