"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  SproutIcon,
  WheatIcon,
  ScaleIcon,
  ShieldVerifiedIcon,
  OrganicLeafIcon,
} from "@/components/icons";
import { MapPin, Calendar, Sparkles, Box, ArrowRight } from "lucide-react";
import { MiniCrop3DCanvas } from "./MiniCrop3DCanvas";
import { ApiListing } from "@/lib/data/listings-repository";

interface CropCardProps {
  listing: ApiListing;
  onQuickContact?: (listing: ApiListing) => void;
  className?: string;
}

export function CropCard({ listing, onQuickContact, className = "" }: CropCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number }>({ rotateX: 0, rotateY: 0 });
  const [show3D, setShow3D] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Calculate 3D tilt (max 7 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = -((y - centerY) / centerY) * 6;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: mousePos ? "transform 100ms ease-out" : "transform 250ms ease-out",
      }}
      className={`relative group bg-white rounded-2xl border border-[var(--earth-border)] shadow-[var(--shadow-warm-sm)] hover:shadow-[var(--shadow-warm-md)] hover:border-[var(--forest-600)] transition-shadow duration-200 flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Spotlight Radial Overlay */}
      {mousePos && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(200, 90, 23, 0.09), transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Card Header & Preview Area */}
      <div className="p-5 relative z-10 flex flex-col gap-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {listing.isOrganic ? (
              <Badge variant="forest" size="sm" icon={<OrganicLeafIcon size={12} />}>
                Organic
              </Badge>
            ) : (
              <Badge variant="neutral" size="sm">
                Direct Farm
              </Badge>
            )}
            <Badge variant="harvest" size="sm">
              {listing.qualityGrade}
            </Badge>
          </div>

          {/* 3D Model Switcher Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShow3D(!show3D);
            }}
            title={show3D ? "Switch to 2D image" : "Inspect in 3D (rotatable)"}
            className="p-1 rounded-md text-xs font-semibold flex items-center gap-1 bg-[var(--surface-warm)] text-[var(--forest-800)] border border-[var(--earth-border-subtle)] hover:bg-[var(--forest-100)] transition-colors cursor-pointer"
          >
            <Box className="w-3.5 h-3.5" />
            <span className="text-[10px]">{show3D ? "2D" : "3D"}</span>
          </button>
        </div>

        {/* Visual Showcase: 3D Canvas OR 2D Fallback */}
        <div className="relative w-full h-36 rounded-xl bg-gradient-to-b from-[#FAF8F3] to-[#F3EFE6] border border-[var(--earth-line)] overflow-hidden flex items-center justify-center">
          {show3D ? (
            <div className="w-full h-full relative">
              <MiniCrop3DCanvas cropName={listing.cropName} />
              <span className="absolute bottom-1.5 right-2 text-[9px] text-[var(--earth-muted)] font-mono pointer-events-none bg-white/70 px-1 rounded">
                Drag to rotate
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[var(--earth-border-subtle)] flex items-center justify-center text-[var(--forest-700)] shadow-sm mb-2 group-hover:scale-105 transition-transform">
                {listing.cropName.toLowerCase().includes("chilli") ? (
                  <WheatIcon size={26} className="text-[var(--harvest-600)]" />
                ) : (
                  <SproutIcon size={26} className="text-[var(--forest-700)]" />
                )}
              </div>
              <span className="text-xs font-medium text-[var(--earth-muted)]">
                {listing.farmVillage}
              </span>
            </div>
          )}
        </div>

        {/* Title & Regional Name */}
        <div>
          <Link
            href={`/crops/${listing.id}`}
            className="hover:text-[var(--forest-700)] transition-colors"
          >
            <h3 className="font-serif text-lg font-bold text-[var(--earth-ink)] leading-snug line-clamp-1">
              {listing.title}
            </h3>
          </Link>
          <p className="text-xs text-[var(--forest-800)] font-semibold mt-0.5">
            {listing.cropNameKn}
          </p>
        </div>

        {/* Market & Farmer Details */}
        <div className="space-y-1 text-xs text-[var(--earth-muted)]">
          <p className="flex items-center gap-1.5 text-[var(--earth-charcoal)]">
            <MapPin className="w-3.5 h-3.5 text-[var(--harvest-600)] shrink-0" />
            <span className="truncate">{listing.marketName}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <ShieldVerifiedIcon size={14} className="text-[var(--forest-700)] shrink-0" />
            <span>Grower: <strong>{listing.farmerName}</strong></span>
          </p>
        </div>

        {/* Price & Stock Highlight */}
        <div className="pt-2 border-t border-[var(--earth-line)] flex items-baseline justify-between">
          <div>
            <span className="text-[10px] text-[var(--earth-muted)] uppercase tracking-wider block">
              Direct Price
            </span>
            <p className="font-serif text-2xl font-black text-[var(--forest-900)] leading-none">
              ₹{listing.pricePerUnit}{" "}
              <span className="text-xs font-sans font-normal text-[var(--earth-muted)]">
                /{listing.unit}
              </span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[var(--earth-muted)] uppercase tracking-wider block">
              In Stock
            </span>
            <p className="text-xs font-bold text-[var(--earth-charcoal)]">
              {listing.availableQuantity} {listing.unit}
            </p>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 pt-0 relative z-10 grid grid-cols-2 gap-2">
        <Link href={`/crops/${listing.id}`} className="w-full">
          <Button variant="secondary" size="sm" className="w-full justify-center">
            Details
          </Button>
        </Link>
        <Button
          variant="primary"
          size="sm"
          className="w-full justify-center"
          onClick={() => onQuickContact?.(listing)}
        >
          Contact
        </Button>
      </div>
    </div>
  );
}
