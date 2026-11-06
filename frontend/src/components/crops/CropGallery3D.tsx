"use client";

import React, { useState } from "react";
import { MiniCrop3DCanvas } from "./MiniCrop3DCanvas";
import { Badge } from "@/components/ui/Badge";
import {
  Box,
  Image as ImageIcon,
  RotateCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import { OrganicLeafIcon, ShieldVerifiedIcon } from "@/components/icons";

interface CropGallery3DProps {
  cropName: string;
  cropNameKn?: string;
  isOrganic?: boolean;
  qualityGrade?: string;
  farmVillage?: string;
  district?: string;
  className?: string;
}

export function CropGallery3D({
  cropName,
  cropNameKn,
  isOrganic = false,
  qualityGrade = "Grade A+",
  farmVillage,
  district,
  className = "",
}: CropGallery3DProps) {
  const [activeMode, setActiveMode] = useState<"3d" | "photos">("3d");
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Curated photo views for agricultural produce
  const isTomato = cropName.toLowerCase().includes("tomato");
  const isChilli = cropName.toLowerCase().includes("chilli");
  const isOnion = cropName.toLowerCase().includes("onion");
  const isGrain = cropName.toLowerCase().includes("ragi") || cropName.toLowerCase().includes("rice");

  const photos = [
    {
      title: "Harvest Lot in Bamboo Crate",
      subtitle: "Cleaned and sorted this morning at the farm",
      tag: "Fresh Batch",
      colorGradient: isTomato
        ? "from-red-600 to-rose-950"
        : isChilli
        ? "from-amber-700 to-red-900"
        : isOnion
        ? "from-fuchsia-800 to-stone-900"
        : "from-amber-600 to-yellow-900",
      svgIcon: "crate",
    },
    {
      title: "Farm Field & Living Crop",
      subtitle: `${farmVillage || "Rural"} field under natural sunshine`,
      tag: "Origin Soil",
      colorGradient: "from-emerald-800 to-stone-900",
      svgIcon: "field",
    },
    {
      title: "APMC Quality Inspection",
      subtitle: `Verified for moisture, size uniformity, and ${qualityGrade}`,
      tag: "Quality Tested",
      colorGradient: "from-stone-700 to-emerald-950",
      svgIcon: "grading",
    },
    {
      title: "Crate Packing & Dispatch Ready",
      subtitle: "Ventilated wooden crates lined with dry straw",
      tag: "Transport Ready",
      colorGradient: "from-amber-800 to-stone-900",
      svgIcon: "dispatch",
    },
  ];

  return (
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl border border-[var(--earth-border)] p-4 sm:p-6 shadow-[var(--shadow-warm-md)] flex flex-col gap-4 ${className}`}
    >
      {/* Top Header Mode Toggle */}
      <div className="flex items-center justify-between gap-3">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {isOrganic ? (
            <Badge variant="forest" size="sm" icon={<OrganicLeafIcon size={12} />}>
              100% Certified Organic
            </Badge>
          ) : (
            <Badge variant="neutral" size="sm">
              Direct Farmer Lot
            </Badge>
          )}
          <Badge variant="harvest" size="sm">
            {qualityGrade}
          </Badge>
        </div>

        {/* 3D vs Photos Segmented Switcher */}
        <div className="inline-flex p-1 bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setActiveMode("3d")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeMode === "3d"
                ? "bg-white text-[var(--forest-900)] shadow-xs font-bold"
                : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Interactive</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("photos")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeMode === "photos"
                ? "bg-white text-[var(--forest-900)] shadow-xs font-bold"
                : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photo Gallery</span>
          </button>
        </div>
      </div>

      {/* Main Visual Display Window */}
      <div className="relative w-full h-80 sm:h-96 md:h-[400px] rounded-2xl bg-gradient-to-b from-[#FAF8F3] via-[#F5EFE4] to-[#EFE7D8] border border-[var(--earth-line)] overflow-hidden flex items-center justify-center">
        {activeMode === "3d" ? (
          <div className="w-full h-full relative">
            <MiniCrop3DCanvas cropName={cropName} />

            {/* Instruction Callout Overlay */}
            <div className="absolute bottom-3 left-3 bg-white/85 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[var(--earth-border-subtle)] shadow-xs flex items-center gap-2 pointer-events-none">
              <RotateCw className="w-3.5 h-3.5 text-[var(--forest-700)] animate-spin-slow" />
              <span className="text-[11px] font-medium text-[var(--earth-ink)]">
                Drag pointer to inspect 360° geometry
              </span>
            </div>

            <div className="absolute top-3 right-3 bg-[var(--forest-900)]/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider">
              Procedural 3D Mesh • 60 FPS
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative flex flex-col justify-between p-6">
            {/* Visual Photo Card Representation */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${photos[activePhotoIndex].colorGradient} opacity-90 transition-all duration-300`}
            />

            {/* Grain Texture Overlay */}
            <div
              className="absolute inset-0 bg-repeat opacity-15 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(#ffffff 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            {/* Top Photo Tag */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-white/20 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/25">
                {photos[activePhotoIndex].tag}
              </span>
              <span className="text-white/80 text-xs font-mono">
                {activePhotoIndex + 1} / {photos.length}
              </span>
            </div>

            {/* Photo Center Editorial Art */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-white mb-4 shadow-lg backdrop-blur-xs">
                <Box className="w-8 h-8 sm:w-10 sm:h-10 text-amber-200" />
              </div>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                {photos[activePhotoIndex].title}
              </h4>
              <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-md">
                {photos[activePhotoIndex].subtitle}
              </p>
            </div>

            {/* Prev / Next Chevrons */}
            <button
              type="button"
              onClick={() =>
                setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
              }
              aria-label="Previous Photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
              }
              aria-label="Next Photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail Bar (for photos or model angles) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {photos.map((item, idx) => {
          const isSelected = activeMode === "photos" && activePhotoIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveMode("photos");
                setActivePhotoIndex(idx);
              }}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-[var(--forest-700)] ring-2 ring-[var(--forest-700)]/20 shadow-xs"
                  : "bg-[var(--surface-warm)] border-[var(--earth-line)] hover:border-[var(--earth-border)]"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--earth-muted)] line-clamp-1">
                {item.tag}
              </span>
              <span className="text-[11px] font-semibold text-[var(--earth-ink)] line-clamp-1 mt-1">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
