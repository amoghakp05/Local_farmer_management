"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  WifiOff,
  Download,
  X,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  Database,
} from "lucide-react";
import { SproutIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import {
  getRecentlyViewedCrops,
  CachedCropLot,
  clearRecentlyViewedCrops,
} from "@/lib/pwa/offline-store";

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [cachedCrops, setCachedCrops] = useState<CachedCropLot[]>([]);

  useEffect(() => {
    // 1. Initial network check
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
      };
      const handleOffline = () => {
        setIsOnline(false);
        setCachedCrops(getRecentlyViewedCrops());
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // 2. Service Worker Registration
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => {
              // Successfully registered service worker
            })
            .catch((err) => {
              console.warn("SW registration skipped:", err);
            });
        });
      }

      // 3. PWA beforeinstallprompt capture (Install banner popup disabled per clean UI spec)
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallBanner(false);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem("khetbazaar_pwa_dismissed", "true");
  };

  const openOfflineVault = () => {
    setCachedCrops(getRecentlyViewedCrops());
    setIsOfflineModalOpen(true);
  };

  return (
    <>
      {/* Offline Alert Bar */}
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="sticky top-0 z-50 w-full bg-stone-900 text-amber-200 px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b border-stone-800 shadow-md"
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Offline Mode Active:</strong> Browsing from device cache. You can still view
                recently loaded harvest lots and farmer details.
              </span>
            </div>

            <Button
              variant="accent"
              size="sm"
              onClick={openOfflineVault}
              className="text-[11px] py-1 px-2.5 h-auto whitespace-nowrap"
            >
              View Cached Lots ({cachedCrops.length})
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {children}



      {/* Offline Harvest Vault Modal */}
      <Modal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        title="Offline Harvest Vault"
        description="These harvest lots are stored on your device and viewable without an internet connection."
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {cachedCrops.length === 0 ? (
            <div className="text-center py-8 text-stone-500 space-y-2">
              <Database className="w-10 h-10 mx-auto text-stone-400" />
              <p className="text-sm font-semibold">No cached harvest lots found yet.</p>
              <p className="text-xs text-stone-400">
                Browse crop detail pages when connected to automatically save them for offline viewing.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-[var(--earth-muted)] pb-2 border-b border-[var(--earth-line)]">
                <span>{cachedCrops.length} Lots Available Offline</span>
                <button
                  type="button"
                  onClick={() => {
                    clearRecentlyViewedCrops();
                    setCachedCrops([]);
                  }}
                  className="text-red-700 hover:underline font-semibold cursor-pointer"
                >
                  Clear Cache
                </button>
              </div>

              <div className="space-y-3">
                {cachedCrops.map((lot) => (
                  <div
                    key={lot.id}
                    className="p-3.5 rounded-xl bg-white border border-[var(--earth-border)] shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-serif font-bold text-sm text-[var(--earth-ink)]">
                          {lot.title}
                        </h5>
                        <span className="text-[11px] text-[var(--earth-muted)]">
                          {lot.cropName} ({lot.cropNameKn}) • By {lot.farmerName}
                        </span>
                      </div>
                      <Badge variant="forest" size="sm">
                        ₹{lot.pricePerUnit}/{lot.unit}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[var(--earth-charcoal)] pt-1 border-t border-[var(--earth-line)]">
                      <span className="flex items-center gap-1 text-[11px] text-[var(--earth-muted)]">
                        <MapPin className="w-3 h-3 text-[var(--harvest-600)]" />
                        {lot.farmVillage}, {lot.district}
                      </span>
                      <Link
                        href={`/crops/${lot.id}`}
                        onClick={() => setIsOfflineModalOpen(false)}
                        className="text-[11px] font-bold text-[var(--forest-800)] hover:underline flex items-center gap-1"
                      >
                        <span>View Lot</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
