"use client";

import React, { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import { ApiListing } from "@/lib/data/listings-repository";
import { MARKETS_DATA } from "@/app/api/markets/route";

interface MarketplaceMapProps {
  listings: ApiListing[];
  selectedListingId?: string;
  onSelectListing: (id: string) => void;
  className?: string;
}

export function MarketplaceMap({
  listings,
  selectedListingId,
  onSelectListing,
  className = "",
}: MarketplaceMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize MapLibre GL with OpenStreetMap raster tiles
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors",
          },
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [76.5, 14.2], // Center of Karnataka
      zoom: 6.6,
      maxZoom: 16,
      minZoom: 5,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update Markers when listings change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    listings.forEach((item) => {
      // Find market coordinates or fallback to district coordinates
      const market = MARKETS_DATA.find((m) => m.id === item.marketId);
      const lng = market ? market.longitude : 76.5;
      const lat = market ? market.latitude : 14.2;

      // Create Custom HTML Pin with price pill
      const el = document.createElement("div");
      el.className = `cursor-pointer transition-transform transform hover:scale-110 select-none ${
        selectedListingId === item.id ? "scale-125 z-50" : "z-10"
      }`;

      el.innerHTML = `
        <div style="background-color: ${
          selectedListingId === item.id ? "#1B4332" : "#FFFFFF"
        }; color: ${
        selectedListingId === item.id ? "#FAF8F3" : "#1C231E"
      }; border: 2px solid #C85A17; border-radius: 9999px; padding: 4px 10px; font-weight: 700; font-size: 11px; box-shadow: 0 4px 10px rgba(27,67,50,0.18); display: flex; align-items: center; gap: 4px; font-family: sans-serif;">
          <span>₹${item.pricePerUnit}</span>
          <span style="font-size: 9px; opacity: 0.8;">/${item.unit}</span>
        </div>
      `;

      el.addEventListener("click", () => {
        onSelectListing(item.id);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current[item.id] = marker;
    });
  }, [listings, selectedListingId, onSelectListing]);

  // Pan to selected listing when changed
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedListingId) return;

    const selected = listings.find((l) => l.id === selectedListingId);
    if (selected) {
      const market = MARKETS_DATA.find((m) => m.id === selected.marketId);
      if (market) {
        map.flyTo({
          center: [market.longitude, market.latitude],
          zoom: 9.5,
          speed: 1.2,
          essential: true,
        });
      }
    }
  }, [selectedListingId, listings]);

  return (
    <div className={`relative w-full h-full min-h-[450px] rounded-2xl overflow-hidden border-2 border-[var(--earth-border)] shadow-sm ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--earth-border)] text-xs font-semibold text-[var(--forest-900)] shadow-sm pointer-events-none">
        OpenStreetMap • {listings.length} Mandi Locations
      </div>
    </div>
  );
}
