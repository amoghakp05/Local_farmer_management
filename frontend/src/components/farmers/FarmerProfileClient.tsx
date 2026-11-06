"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DetailedFarmerProfile, FarmerReview, addFarmerReview } from "@/lib/data/farmers-repository";
import { ApiListing } from "@/lib/data/listings-repository";
import { CropCard } from "@/components/crops/CropCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import {
  MapPin,
  Calendar,
  Award,
  Phone,
  MessageCircle,
  MessageSquare,
  ShieldCheck,
  Star,
  CheckCircle2,
  Lock,
  Eye,
  PlusCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { ShieldVerifiedIcon, OrganicLeafIcon, SproutIcon } from "@/components/icons";

interface FarmerProfileClientProps {
  farmer: DetailedFarmerProfile;
  listings: ApiListing[];
}

export function FarmerProfileClient({ farmer, listings }: FarmerProfileClientProps) {
  const { toast } = useToast();
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [reviews, setReviews] = useState<FarmerReview[]>(farmer.reviews);

  // Review Form State
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerLocation, setReviewerLocation] = useState("");
  const [cropPurchased, setCropPurchased] = useState("");
  const [comment, setComment] = useState("");

  const handleRevealPhone = () => {
    setIsPhoneRevealed(true);
    toast({
      title: "Farmer Phone Revealed",
      description: `Direct contact for ${farmer.name}: ${farmer.phone}`,
      type: "success",
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and a brief review comment.",
        type: "warning",
      });
      return;
    }

    const created = addFarmerReview(farmer.id, {
      reviewerName: reviewerName.trim(),
      reviewerLocation: reviewerLocation.trim() || "Karnataka",
      rating: newRating,
      cropPurchased: cropPurchased.trim() || "Fresh Farm Produce",
      comment: comment.trim(),
    });

    // Optimistic UI update
    setReviews([created, ...reviews]);
    setIsAddingReview(false);
    setReviewerName("");
    setReviewerLocation("");
    setCropPurchased("");
    setComment("");

    toast({
      title: "Review Published!",
      description: `Thank you for supporting ${farmer.name}. Your verified review is now live.`,
      type: "success",
    });
  };

  const rawNumber = farmer.phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(
    `Namaskara ${farmer.name}, I am contacting you through your KhetBazaar profile.`
  )}`;

  return (
    <div className="w-full py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/farmers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--forest-800)] hover:text-[var(--forest-900)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Farmers</span>
        </Link>
      </div>

      {/* Hero Farmer Profile Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[var(--earth-border)] p-6 sm:p-8 shadow-[var(--shadow-warm-sm)] mb-10">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[var(--forest-800)] text-amber-200 font-serif font-black text-3xl flex items-center justify-center shadow-sm shrink-0">
              {farmer.avatarInitials}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-2xl sm:text-4xl font-black text-[var(--earth-ink)]">
                  {farmer.name}
                </h1>
                <Badge variant="forest" size="sm" icon={<ShieldVerifiedIcon size={12} />}>
                  Verified Grower
                </Badge>
                {farmer.isOrganic && (
                  <Badge variant="neutral" size="sm" icon={<OrganicLeafIcon size={12} />}>
                    100% Organic
                  </Badge>
                )}
              </div>

              <span className="text-sm sm:text-base font-semibold text-[var(--harvest-700)] block">
                {farmer.nameKn}
              </span>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[var(--earth-muted)]">
                <MapPin className="w-4 h-4 text-[var(--harvest-600)] shrink-0" />
                <span>
                  {farmer.village}, {farmer.taluk}, {farmer.district} District, Karnataka
                </span>
              </div>

              {/* Bio in English & Kannada */}
              <div className="pt-2 max-w-3xl space-y-2">
                <p className="text-xs sm:text-sm text-[var(--earth-charcoal)] leading-relaxed">
                  {farmer.bio}
                </p>
                <p className="text-xs text-[var(--forest-800)] font-medium leading-relaxed bg-[var(--forest-50)] p-2.5 rounded-xl border border-[var(--forest-200)]">
                  {farmer.bioKn}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Box on Right */}
          <div className="lg:w-80 shrink-0 p-5 rounded-2xl bg-gradient-to-b from-[var(--surface-warm)] to-[#F3EEE5] border border-[var(--earth-line)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--earth-ink)] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--forest-700)]" />
                <span>Direct Contact</span>
              </span>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                Zero Commission
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[var(--earth-border-subtle)] text-center">
              <span className="text-[10px] text-[var(--earth-muted)] uppercase tracking-wider block font-medium">
                Verified Phone
              </span>
              <span className="font-mono text-base font-bold text-[var(--forest-900)] mt-0.5 block">
                {isPhoneRevealed ? farmer.phone : farmer.phoneMasked}
              </span>

              {!isPhoneRevealed ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRevealPhone}
                  className="w-full mt-2.5 justify-center"
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  Reveal Contact Number
                </Button>
              ) : (
                <div className="grid grid-cols-3 gap-1.5 mt-2.5">
                  <a
                    href={`tel:${farmer.phone}`}
                    className="py-2 rounded-lg bg-[var(--forest-800)] hover:bg-[var(--forest-900)] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`sms:${farmer.phone}`}
                    className="py-2 rounded-lg bg-white border border-[var(--earth-border)] text-[var(--earth-ink)] text-xs font-bold flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>SMS</span>
                  </a>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[var(--earth-muted)] text-center">
              Protected against automated marketing bots.
            </p>
          </div>
        </div>

        {/* Credentials and Certifications Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[var(--earth-line)]">
          <div className="p-3 rounded-xl bg-[var(--surface-warm)]">
            <span className="text-[10px] font-bold text-[var(--earth-muted)] uppercase block">
              Land Holding
            </span>
            <span className="text-sm font-bold text-[var(--forest-900)]">
              {farmer.acres} Acres Farmland
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-warm)]">
            <span className="text-[10px] font-bold text-[var(--earth-muted)] uppercase block">
              Farming Experience
            </span>
            <span className="text-sm font-bold text-[var(--forest-900)]">
              {farmer.experience}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-warm)]">
            <span className="text-[10px] font-bold text-[var(--earth-muted)] uppercase block">
              Mandi Track Record
            </span>
            <span className="text-sm font-bold text-[var(--forest-900)]">
              {farmer.totalDeals} Verified Batches
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-warm)]">
            <span className="text-[10px] font-bold text-[var(--earth-muted)] uppercase block">
              Trust Score
            </span>
            <span className="text-sm font-bold text-amber-700 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              {farmer.trustScore} / 5.0
            </span>
          </div>
        </div>

        {/* Certifications & FPO */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[var(--earth-muted)] mr-1">
            Certifications:
          </span>
          {farmer.certifications.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {c}
            </span>
          ))}
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--surface-warm)] text-[var(--earth-muted)] border border-[var(--earth-border-subtle)]">
            {farmer.fpoName}
          </span>
        </div>
      </div>

      {/* Active Harvest Batches */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Badge variant="harvest" size="sm" className="mb-1.5">
              Available produce
            </Badge>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--earth-ink)]">
              Active Harvest Batches by {farmer.name}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[var(--earth-muted)]">
            {listings.length} Lots Live
          </span>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <CropCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-white border border-[var(--earth-border)]">
            <SproutIcon size={32} className="mx-auto text-[var(--earth-muted)] mb-2" />
            <h4 className="font-serif font-bold text-base text-[var(--earth-ink)]">
              No Current Active Lots
            </h4>
            <p className="text-xs text-[var(--earth-muted)] mt-1">
              Check back soon as {farmer.name}&apos;s next seasonal harvest approaches.
            </p>
          </div>
        )}
      </div>

      {/* Ratings & Reviews Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[var(--earth-border)] p-6 sm:p-8 shadow-[var(--shadow-warm-sm)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--earth-line)]">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--earth-ink)]">
              Ratings &amp; Consumer Reviews
            </h3>
            <p className="text-xs sm:text-sm text-[var(--earth-muted)] mt-0.5">
              Feedback from verified buyers, restaurants, and wholesale cooperatives.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddingReview(!isAddingReview)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Write a Review
          </Button>
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-[var(--earth-line)]">
          <div className="p-4 rounded-xl bg-[var(--surface-warm)] text-center flex flex-col items-center justify-center">
            <span className="font-serif text-4xl font-black text-[var(--forest-900)]">
              {farmer.trustScore}
            </span>
            <div className="flex items-center gap-1 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="text-xs text-[var(--earth-muted)]">
              Based on {reviews.length} verified transactions
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-warm)] space-y-2 col-span-2 flex flex-col justify-center">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[var(--earth-charcoal)]">Produce Freshness &amp; Quality</span>
              <span className="font-bold text-[var(--forest-900)]">5.0 / 5.0</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <div className="w-full h-full bg-emerald-600 rounded-full" />
            </div>

            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[var(--earth-charcoal)]">Accurate Weight &amp; Grading</span>
              <span className="font-bold text-[var(--forest-900)]">4.9 / 5.0</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <div className="w-[98%] h-full bg-emerald-600 rounded-full" />
            </div>

            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[var(--earth-charcoal)]">Communication &amp; Mandi Dispatch</span>
              <span className="font-bold text-[var(--forest-900)]">4.8 / 5.0</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <div className="w-[96%] h-full bg-emerald-600 rounded-full" />
            </div>
          </div>
        </div>

        {/* Add Review Form Drawer */}
        {isAddingReview && (
          <form
            onSubmit={handleReviewSubmit}
            className="my-6 p-5 rounded-2xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] space-y-4 animate-in fade-in duration-200"
          >
            <h4 className="font-serif font-bold text-lg text-[var(--earth-ink)]">
              Share Your Feedback on {farmer.name}&apos;s Produce
            </h4>

            {/* Star Rating Picker */}
            <div>
              <label className="text-xs font-semibold text-[var(--earth-charcoal)] block mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newRating
                          ? "fill-amber-500 text-amber-500"
                          : "text-stone-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[var(--forest-900)] ml-2">
                  {newRating} of 5 Stars
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Your Name / Business"
                placeholder="Ramesh Kumar (Bengaluru)"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                required
              />
              <Input
                label="Location"
                placeholder="Indiranagar, Bengaluru"
                value={reviewerLocation}
                onChange={(e) => setReviewerLocation(e.target.value)}
              />
              <Input
                label="Produce Lot Purchased"
                placeholder="Byadgi Chilli (25 kg)"
                value={cropPurchased}
                onChange={(e) => setCropPurchased(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--earth-charcoal)] block mb-1.5">
                Review Comments
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe freshness, communication, weight accuracy, and mandi delivery experience..."
                className="w-full p-3 rounded-xl border border-[var(--earth-border)] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--forest-700)] text-[var(--earth-ink)]"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsAddingReview(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Submit Verified Review
              </Button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4 pt-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl border border-[var(--earth-line)] hover:border-[var(--earth-border-subtle)] transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[var(--earth-ink)]">
                      {rev.reviewerName}
                    </span>
                    <span className="text-xs text-[var(--earth-muted)]">
                      • {rev.reviewerLocation}
                    </span>
                    {rev.verifiedTransaction && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[var(--harvest-700)] font-medium">
                    Batch: {rev.cropPurchased}
                  </span>
                </div>

                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(rev.rating)
                          ? "fill-amber-500 text-amber-500"
                          : "text-stone-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-[var(--forest-900)] ml-1">
                    {rev.rating}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--earth-charcoal)] leading-relaxed">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <span className="text-[10px] text-[var(--earth-muted)] block">
                Posted on {rev.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
