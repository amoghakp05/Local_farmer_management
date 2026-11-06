"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  Phone,
  MessageCircle,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Lock,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { ShieldVerifiedIcon, SproutIcon } from "@/components/icons";
import { EnrichedFarmerDetail } from "@/lib/data/listings-repository";

interface FarmerProfileCardProps {
  farmerId: string;
  farmerName: string;
  farmVillage: string;
  district: string;
  farmerPhone: string;
  farmerPhoneMasked: string;
  cropTitle: string;
  farmerDetail?: EnrichedFarmerDetail;
  className?: string;
}

const MAX_REVEALS = 5;
const RATE_LIMIT_STORAGE_KEY = "khetbazaar_contact_reveals_count";
const RATE_LIMIT_EXPIRY_KEY = "khetbazaar_contact_reveals_expiry";

export function FarmerProfileCard({
  farmerId,
  farmerName,
  farmVillage,
  district,
  farmerPhone,
  farmerPhoneMasked,
  cropTitle,
  farmerDetail,
  className = "",
}: FarmerProfileCardProps) {
  const { toast } = useToast();
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealsRemaining, setRevealsRemaining] = useState(MAX_REVEALS);
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Initialize and check client rate limiter
  useEffect(() => {
    try {
      const storedCount = sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY);
      const storedExpiry = sessionStorage.getItem(RATE_LIMIT_EXPIRY_KEY);
      const now = Date.now();

      if (storedExpiry && now > parseInt(storedExpiry, 10)) {
        // Expired window, reset
        sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, "0");
        sessionStorage.setItem(RATE_LIMIT_EXPIRY_KEY, (now + 10 * 60 * 1000).toString());
        setRevealsRemaining(MAX_REVEALS);
        setIsRateLimited(false);
      } else if (storedCount) {
        const count = parseInt(storedCount, 10);
        const remaining = Math.max(0, MAX_REVEALS - count);
        setRevealsRemaining(remaining);
        if (remaining <= 0) {
          setIsRateLimited(true);
        }
      } else {
        sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, "0");
        sessionStorage.setItem(RATE_LIMIT_EXPIRY_KEY, (now + 10 * 60 * 1000).toString());
      }
    } catch {
      // Storage fallback
    }
  }, []);

  const handleRevealClick = () => {
    if (isRevealed) return;

    if (revealsRemaining <= 0 || isRateLimited) {
      toast({
        title: "Rate Limit Exceeded",
        description: "You have reached the maximum 5 contact reveals for this session to protect farmers from automated bots. Please try again in 10 minutes.",
        type: "warning",
      });
      return;
    }

    try {
      const currentCount = parseInt(
        sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY) || "0",
        10
      );
      const nextCount = currentCount + 1;
      sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, nextCount.toString());
      const remaining = Math.max(0, MAX_REVEALS - nextCount);
      setRevealsRemaining(remaining);
      if (remaining <= 0) {
        setIsRateLimited(true);
      }
    } catch {
      // Fallback
    }

    setIsRevealed(true);
    toast({
      title: "Direct Grower Verified",
      description: `Contact revealed: ${farmerPhone}. You may now Call, WhatsApp, or SMS directly.`,
      type: "success",
    });
  };

  // Clean unformatted phone number for links
  const rawNumber = farmerPhone.replace(/\D/g, "");
  // Pre-filled WhatsApp message
  const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(
    `Namaskara ${farmerName}, I saw your listing for "${cropTitle}" on KhetBazaar and would like to inquire about ordering.`
  )}`;
  const smsUrl = `sms:${farmerPhone}?body=${encodeURIComponent(
    `Inquiry regarding ${cropTitle} on KhetBazaar.`
  )}`;

  // Initials for avatar
  const initials = farmerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl border border-[var(--earth-border)] p-5 sm:p-6 shadow-[var(--shadow-warm-sm)] flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top Trust Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-[var(--earth-line)]">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[var(--forest-800)] text-amber-200 font-serif font-black text-lg flex items-center justify-center shadow-xs">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--earth-ink)]">
                  {farmerName}
                </h3>
                <Badge variant="forest" size="sm" icon={<ShieldVerifiedIcon size={12} />}>
                  Verified Grower
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-[var(--earth-muted)] mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--harvest-600)]" />
                <span>
                  {farmVillage}, {district}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-[var(--forest-900)] block">
              ★ {farmerDetail?.trustScore || "4.9"}/5.0
            </span>
            <span className="text-[10px] text-[var(--earth-muted)]">
              {farmerDetail?.completedDeals || 32} Direct Mandi Deals
            </span>
          </div>
        </div>

        {/* Farm Credentials & FPO Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4">
          <div className="p-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)]">
            <span className="text-[10px] font-medium text-[var(--earth-muted)] block">
              Land Holding
            </span>
            <span className="text-xs font-bold text-[var(--earth-ink)]">
              {farmerDetail?.acres || 5.0} Acres Farmland
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)]">
            <span className="text-[10px] font-medium text-[var(--earth-muted)] block">
              Experience
            </span>
            <span className="text-xs font-bold text-[var(--earth-ink)]">
              {farmerDetail?.experience || "12 Years Farming"}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] col-span-2 sm:col-span-1">
            <span className="text-[10px] font-medium text-[var(--earth-muted)] block">
              Response Speed
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" />
              {farmerDetail?.responseTime || "< 15 mins"}
            </span>
          </div>
        </div>

        {/* FPO & Organic Certifications Tags */}
        <div className="mb-5 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--earth-muted)] block">
            Certifications & FPO Affiliation
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(farmerDetail?.certifications || ["KSOCA Certified Organic", "Soil Health Card"]).map(
              (cert, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-[var(--forest-900)] border border-stone-200"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {cert}
                </span>
              )
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[var(--surface-warm)] text-[var(--earth-muted)] border border-[var(--earth-border-subtle)]">
              {farmerDetail?.fpoName || "Karnataka Farmers Collective"}
            </span>
          </div>
        </div>
      </div>

      {/* Direct Contact Action Box with Anti-Bot Reveal */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[var(--surface-warm)] to-[#F2EDE4] border border-[var(--earth-line)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[var(--forest-700)]" />
            <span className="text-xs font-bold text-[var(--earth-ink)]">
              Bot-Protected Contact
            </span>
          </div>
          <span className="text-[10px] text-[var(--earth-muted)] font-mono">
            {revealsRemaining} reveals left
          </span>
        </div>

        {/* Masked / Revealed Phone Display */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[var(--earth-border-subtle)] shadow-2xs">
          <div>
            <span className="text-[10px] font-medium text-[var(--earth-muted)] block">
              Farmer Direct Phone
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-[var(--forest-900)] tracking-wide">
              {isRevealed ? farmerPhone : farmerPhoneMasked}
            </span>
          </div>

          {!isRevealed ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleRevealClick}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
              disabled={isRateLimited}
            >
              Reveal Contact
            </Button>
          ) : (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Active
            </span>
          )}
        </div>

        {/* Call, WhatsApp, SMS Actions */}
        {isRevealed ? (
          <div className="grid grid-cols-3 gap-2 pt-1 animate-fade-in">
            <a
              href={`tel:${farmerPhone}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--forest-800)] hover:bg-[var(--forest-900)] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={smsUrl}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 border border-[var(--earth-border)] text-[var(--earth-ink)] text-xs font-bold shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SMS</span>
            </a>
          </div>
        ) : (
          <p className="text-[11px] text-[var(--earth-muted)] flex items-center gap-1">
            <Lock className="w-3 h-3 text-[var(--earth-muted)] shrink-0" />
            <span>Click &apos;Reveal Contact&apos; to unlock direct telephone, WhatsApp, and SMS links.</span>
          </p>
        )}
      </div>
    </div>
  );
}
