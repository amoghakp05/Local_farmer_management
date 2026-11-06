"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { getListings, getAllListings, createListing, updateListing, deleteListing, ApiListing } from "@/lib/data/listings-repository";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  PlusCircle,
  TrendingUp,
  Phone,
  Eye,
  Check,
  X,
  Edit2,
  Trash2,
  Upload,
  MessageCircle,
  Package,
  Clock,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sprout,
  Sparkles,
} from "lucide-react";
import { SproutIcon, OrganicLeafIcon, ShieldVerifiedIcon } from "@/components/icons";

interface InquiryItem {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerLocation: string;
  cropLot: string;
  message: string;
  receivedAt: string;
  status: "new" | "responded" | "deal_agreed";
}

export default function FarmerDashboardPage() {
  const { user, role, loginWithCredentials, switchRole, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Auth gate states
  const [gateUserId, setGateUserId] = useState("");
  const [gatePassword, setGatePassword] = useState("");
  const [gateError, setGateError] = useState<string | null>(null);

  // Active listings for the logged in farmer
  const [listings, setListings] = useState<ApiListing[]>(() => {
    return getAllListings();
  });

  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);

  // Inline edit state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [inlinePriceVal, setInlinePriceVal] = useState<string>("");

  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [inlineStockVal, setInlineStockVal] = useState<string>("");

  // Modal: Add Listing
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCropName, setNewCropName] = useState("Country Tomatoes");
  const [newPrice, setNewPrice] = useState("28");
  const [newUnit, setNewUnit] = useState("kg");
  const [newQuantity, setNewQuantity] = useState("500");
  const [newGrade, setNewGrade] = useState("Grade A+");
  const [newIsOrganic, setNewIsOrganic] = useState(true);
  const [newDescription, setNewDescription] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Modal: Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<"listings" | "inquiries" | "analytics">("listings");

  const handleGateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError(null);
    const res = loginWithCredentials(gateUserId, gatePassword);
    if (!res.success) {
      setGateError(res.error || "Invalid User ID or Password.");
    }
  };

  // Auth Guard: if not farmer
  if (role !== "farmer") {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[var(--earth-border)] shadow-xl space-y-5">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[var(--harvest-700)] flex items-center justify-center mx-auto shadow-xs">
              <Sprout className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[var(--forest-900)] tracking-tight">
              Farmer Producer Portal
            </h1>
            <p className="text-xs text-[var(--earth-muted)]">
              Sign in with your registered Farmer User ID &amp; Password to manage harvest inventory and mandi prices.
            </p>
          </div>

          {gateError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {gateError}
            </div>
          )}

          <form onSubmit={handleGateLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                User ID
              </label>
              <Input
                type="text"
                value={gateUserId}
                onChange={(e) => setGateUserId(e.target.value)}
                placeholder="Enter Farmer User ID"
                className="w-full text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                Password
              </label>
              <Input
                type="password"
                value={gatePassword}
                onChange={(e) => setGatePassword(e.target.value)}
                placeholder="Enter password"
                className="w-full text-sm font-medium"
                required
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              size="md"
              className="w-full justify-center text-sm font-bold shadow-md cursor-pointer mt-2"
              leftIcon={<Sprout className="w-4 h-4" />}
            >
              Sign In to Farmer Dashboard
            </Button>
          </form>

          <div className="pt-3 border-t border-[var(--earth-line)] space-y-2 text-center text-xs">
            <div>
              New grower?{" "}
              <Link
                href="/register?role=farmer"
                className="font-bold text-[var(--forest-800)] hover:underline"
              >
                + Register as New Farmer with User ID
              </Link>
            </div>
            <div>
              <button
                type="button"
                onClick={() => switchRole("farmer")}
                className="text-[var(--earth-muted)] hover:text-[var(--earth-ink)] underline cursor-pointer"
              >
                Or continue as Guest Farmer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analytics derived from active listings
  const totalViews = listings.reduce((acc, l) => acc + l.viewsCount, 0);
  const totalInquiriesCount = inquiries.length;
  const estimatedLotValue = listings.reduce((acc, l) => acc + l.pricePerUnit * l.availableQuantity, 0);

  // Handlers for Inline Quick Edit
  const handleStartEditPrice = (l: ApiListing) => {
    setEditingPriceId(l.id);
    setInlinePriceVal(l.pricePerUnit.toString());
  };

  const handleSavePrice = (id: string) => {
    const num = parseFloat(inlinePriceVal);
    if (isNaN(num) || num <= 0) {
      toast({ title: "Invalid Price", description: "Please enter a valid price.", type: "warning" });
      return;
    }

    updateListing(id, { pricePerUnit: num });
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, pricePerUnit: num } : item))
    );
    setEditingPriceId(null);
    toast({
      title: "Price Updated!",
      description: `Mandi lot updated to ₹${num.toFixed(2)}/kg.`,
      type: "success",
    });
  };

  const handleStartEditStock = (l: ApiListing) => {
    setEditingStockId(l.id);
    setInlineStockVal(l.availableQuantity.toString());
  };

  const handleSaveStock = (id: string) => {
    const num = parseInt(inlineStockVal, 10);
    if (isNaN(num) || num < 0) {
      toast({ title: "Invalid Stock", description: "Please enter a valid quantity.", type: "warning" });
      return;
    }

    updateListing(id, { availableQuantity: num });
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, availableQuantity: num } : item))
    );
    setEditingStockId(null);
    toast({
      title: "Stock Updated!",
      description: `Available inventory updated to ${num} kg.`,
      type: "success",
    });
  };

  const handleToggleSoldOut = (id: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "active" ? "sold_out" : "active";
          updateListing(id, { status: nextStatus });
          toast({
            title: nextStatus === "sold_out" ? "Marked Sold Out" : "Lot Reactivated",
            description: `Lot "${item.title}" is now ${nextStatus === "sold_out" ? "hidden from buyers" : "live in Mandi"}.`,
            type: "info",
          });
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleDeleteListing = (id: string) => {
    deleteListing(id);
    setListings((prev) => prev.filter((item) => item.id !== id));
    setDeletingId(null);
    toast({
      title: "Listing Removed",
      description: "Batch removed from your active harvest lots.",
      type: "info",
    });
  };

  // Add Listing Submit (< 30 seconds flow)
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newPrice) || 25;
    const qtyNum = parseInt(newQuantity, 10) || 100;
    const farmerContact = user?.phone || "+91 98452 14820";

    const created = createListing({
      farmerId: user?.id || `f-${Date.now()}`,
      farmerName: user?.name || "Registered Farmer",
      farmVillage: user?.village || "Farm Gate",
      district: user?.district || "Kolar",
      cropId: "c1000000-0000-0000-0000-000000000001",
      cropName: newCropName,
      cropNameKn: newCropName.includes("Tomato") ? "ನಾಟಿ ಟೊಮೆಟೊ" : "ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ",
      marketId: "m1000000-0000-0000-0000-000000000008",
      marketName: `${user?.district || "Kolar"} APMC Market Yard`,
      title: newTitle || `Fresh Farm ${newCropName} (${newGrade})`,
      description: newDescription || "Freshly harvested lot from verified farm. Graded and packed in clean crates.",
      pricePerUnit: priceNum,
      unit: newUnit,
      totalQuantity: qtyNum,
      availableQuantity: qtyNum,
      harvestDate: new Date().toISOString().split("T")[0],
      qualityGrade: newGrade,
      isOrganic: newIsOrganic,
      status: "active",
      farmerPhone: farmerContact,
    });

    setListings([created, ...listings]);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setPreviewImage(null);

    toast({
      title: "Harvest Batch Listed Live!",
      description: `Your ${newCropName} lot (₹${priceNum}/${newUnit}) is now visible to all Karnataka buyers in the marketplace.`,
      type: "success",
    });
  };

  return (
    <div className="w-full py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Profile Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[var(--earth-line)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant="forest" size="sm" icon={<ShieldVerifiedIcon size={12} />}>
              Verified Grower Account
            </Badge>
            <Badge variant="harvest" size="sm">
              Haveri APMC Member
            </Badge>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-black text-[var(--forest-900)] tracking-tight">
            Farmer Dashboard — {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--earth-muted)] mt-1">
            Manage your harvest inventory, update spot prices in seconds, and respond to direct consumer orders.
          </p>
        </div>

        {/* Action Button: Add produce in < 30 seconds */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="accent"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="w-full sm:w-auto justify-center"
          >
            + Add New Harvest Lot
          </Button>
        </div>
      </div>

      {/* KPI Stats Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--earth-muted)] mb-1">
            <span className="font-semibold">Active Lots</span>
            <Package className="w-4 h-4 text-[var(--forest-700)]" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-black text-[var(--forest-900)] block">
            {listings.filter((l) => l.status === "active").length}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">All lots APMC synced</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--earth-muted)] mb-1">
            <span className="font-semibold">Monthly Views</span>
            <Eye className="w-4 h-4 text-[var(--harvest-600)]" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-black text-[var(--forest-900)] block">
            {totalViews}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +24% vs last week
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--earth-muted)] mb-1">
            <span className="font-semibold">Buyer Inquiries</span>
            <Phone className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-black text-[var(--forest-900)] block">
            {totalInquiriesCount}
          </span>
          <span className="text-[11px] text-[var(--earth-muted)]">Direct calls &amp; WhatsApp</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[var(--earth-muted)] mb-1">
            <span className="font-semibold">Est. Lot Value</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-black text-[var(--forest-900)] block">
            ₹{estimatedLotValue.toLocaleString()}
          </span>
          <span className="text-[11px] text-[var(--earth-muted)]">Across current batches</span>
        </div>
      </div>

      {/* Tabs: Listings Management vs Inquiries Inbox */}
      <div className="flex items-center gap-2 mb-6 border-b border-[var(--earth-line)] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("listings")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            activeTab === "listings"
              ? "bg-[var(--forest-800)] text-white shadow-2xs"
              : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          My Harvest Lots ({listings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("inquiries")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "inquiries"
              ? "bg-[var(--forest-800)] text-white shadow-2xs"
              : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <span>Inquiries Inbox</span>
          <span className="bg-amber-400 text-stone-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {inquiries.filter((i) => i.status === "new").length} New
          </span>
        </button>
      </div>

      {/* TAB 1: LISTINGS MANAGEMENT WITH INLINE QUICK EDIT */}
      {activeTab === "listings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--earth-muted)] px-1">
            <span>Click any Price or Stock value for 1-second inline editing</span>
            <span>{listings.length} batches</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {listings.map((lot) => {
              const isSoldOut = lot.status === "sold_out";

              return (
                <div
                  key={lot.id}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isSoldOut
                      ? "opacity-60 border-stone-200 bg-stone-50"
                      : "border-[var(--earth-border)] hover:border-[var(--forest-700)]"
                  }`}
                >
                  {/* Left: Crop info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-line)] flex items-center justify-center text-[var(--forest-800)] shrink-0">
                      <SproutIcon size={24} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/crops/${lot.id}`}
                          className="font-serif text-lg font-bold text-[var(--earth-ink)] hover:text-[var(--forest-800)] transition-colors"
                        >
                          {lot.title}
                        </Link>
                        <Badge variant="harvest" size="sm">
                          {lot.qualityGrade}
                        </Badge>
                        {lot.isOrganic && (
                          <Badge variant="forest" size="sm" icon={<OrganicLeafIcon size={10} />}>
                            Organic
                          </Badge>
                        )}
                        {isSoldOut && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                            Sold Out
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[var(--earth-muted)] flex-wrap">
                        <span>Harvested: {lot.harvestDate}</span>
                        <span>•</span>
                        <span>Views: {lot.viewsCount}</span>
                        <span>•</span>
                        <span>Market: {lot.marketName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Inline Quick Edit for Price & Stock */}
                  <div className="flex items-center gap-4 sm:gap-6 py-2 md:py-0 border-y md:border-y-0 border-stone-100 flex-wrap">
                    {/* Inline Price Edit */}
                    <div className="space-y-1 min-w-[120px]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--earth-muted)] block">
                        Spot Price
                      </span>
                      {editingPriceId === lot.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={inlinePriceVal}
                            onChange={(e) => setInlinePriceVal(e.target.value)}
                            className="w-20 p-1 text-sm font-bold border rounded bg-amber-50 focus:outline-none focus:ring-1 focus:ring-[var(--forest-700)]"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSavePrice(lot.id)}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPriceId(null)}
                            className="p-1 rounded bg-stone-200 hover:bg-stone-300 cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEditPrice(lot)}
                          className="flex items-center gap-1 text-base font-bold text-[var(--forest-900)] hover:text-[var(--harvest-700)] cursor-pointer group"
                          title="Click to quick edit price"
                        >
                          <span>₹{lot.pricePerUnit.toFixed(2)}/{lot.unit}</span>
                          <Edit2 className="w-3 h-3 text-[var(--earth-muted)] group-hover:text-[var(--harvest-700)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </div>

                    {/* Inline Stock Edit */}
                    <div className="space-y-1 min-w-[120px]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--earth-muted)] block">
                        Available Stock
                      </span>
                      {editingStockId === lot.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={inlineStockVal}
                            onChange={(e) => setInlineStockVal(e.target.value)}
                            className="w-20 p-1 text-sm font-bold border rounded bg-amber-50 focus:outline-none focus:ring-1 focus:ring-[var(--forest-700)]"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveStock(lot.id)}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingStockId(null)}
                            className="p-1 rounded bg-stone-200 hover:bg-stone-300 cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEditStock(lot)}
                          className="flex items-center gap-1 text-base font-bold text-[var(--forest-900)] hover:text-[var(--harvest-700)] cursor-pointer group"
                          title="Click to quick edit available stock"
                        >
                          <span>{lot.availableQuantity} {lot.unit}</span>
                          <Edit2 className="w-3 h-3 text-[var(--earth-muted)] group-hover:text-[var(--harvest-700)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Mark Sold Out & Delete */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button
                      variant={isSoldOut ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => handleToggleSoldOut(lot.id)}
                      className="text-xs"
                    >
                      {isSoldOut ? "Reactivate" : "Mark Sold Out"}
                    </Button>

                    <button
                      type="button"
                      onClick={() => setDeletingId(lot.id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRIES INBOX */}
      {activeTab === "inquiries" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--earth-muted)] px-1">
            <span>Direct WhatsApp &amp; telephone inquiries initiated through your KhetBazaar listings</span>
            <span>{inquiries.length} inquiries</span>
          </div>

          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                      {inq.buyerName[0]}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[var(--earth-ink)]">
                        {inq.buyerName}
                      </h4>
                      <span className="text-[11px] text-[var(--earth-muted)]">
                        {inq.buyerPhone} • {inq.buyerLocation}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--earth-muted)]">{inq.receivedAt}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        inq.status === "new"
                          ? "bg-amber-100 text-amber-800"
                          : inq.status === "responded"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {inq.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-line)] text-xs text-[var(--earth-charcoal)] leading-relaxed">
                  <span className="font-semibold text-[var(--harvest-700)] block mb-0.5">
                    Lot: {inq.cropLot}
                  </span>
                  &ldquo;{inq.message}&rdquo;
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <a
                    href={`https://wa.me/${inq.buyerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Namaskara ${inq.buyerName}, replying regarding your inquiry on KhetBazaar.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Reply via WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW LISTING (< 30s Quick Flow) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="List New Harvest Batch"
        description="Fill in your batch details to publish immediately to the Karnataka Mandi network."
      >
        <form onSubmit={handleCreateListing} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Select Crop"
              value={newCropName}
              onChange={(e) => setNewCropName(e.target.value)}
              options={[
                { value: "Country Tomatoes", label: "Country Tomatoes (ನಾಟಿ ಟೊಮೆಟೊ)" },
                { value: "Byadgi Red Chillies", label: "Byadgi Chillies (ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ)" },
                { value: "Green Capsicum", label: "Green Capsicum / Shimla Mirch" },
                { value: "Red Onions", label: "Red Onions (ಈರುಳ್ಳಿ)" },
                { value: "Native Ragi", label: "Native Ragi (ಶುದ್ಧ ರಾಗಿ)" },
              ]}
            />

            <Select
              label="Quality Grade"
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
              options={[
                { value: "Grade A+", label: "Grade A+ (Premium / Export)" },
                { value: "Grade A", label: "Grade A (Cleaned Standard)" },
                { value: "Grade B", label: "Grade B (Commercial / Processing)" },
              ]}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Price (₹)"
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              required
            />
            <Select
              label="Unit"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              options={[
                { value: "kg", label: "Per Kg" },
                { value: "quintal", label: "Per Quintal" },
              ]}
            />
            <Input
              label="Quantity"
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              required
            />
          </div>

          {/* Photo upload placeholder / preview */}
          <div>
            <label className="text-xs font-semibold text-[var(--earth-charcoal)] block mb-1">
              Lot Photo (Optional)
            </label>
            <div className="border-2 border-dashed border-[var(--earth-border)] rounded-xl p-4 text-center bg-[var(--surface-warm)] cursor-pointer hover:border-[var(--forest-700)] transition-colors">
              <Upload className="w-5 h-5 mx-auto text-[var(--earth-muted)] mb-1" />
              <span className="text-xs font-semibold text-[var(--forest-800)] block">
                Tap to upload farm photo or take photo
              </span>
              <span className="text-[10px] text-[var(--earth-muted)]">
                PNG, JPG up to 10MB
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-warm)]">
            <span className="text-xs font-semibold text-[var(--earth-charcoal)]">
              100% Certified Organic Lot
            </span>
            <input
              type="checkbox"
              checked={newIsOrganic}
              onChange={(e) => setNewIsOrganic(e.target.checked)}
              className="w-4 h-4 text-[var(--forest-700)] accent-[var(--forest-700)] cursor-pointer"
            />
          </div>

          <Input
            label="Harvest Notes / Description"
            placeholder="Plucked this morning at 06:00 AM. Cleaned and crates ready..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="flex-1 justify-center"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              size="md"
              className="flex-1 justify-center"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Publish Batch Live
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingId && (
        <Modal
          isOpen={Boolean(deletingId)}
          onClose={() => setDeletingId(null)}
          title="Delete Harvest Batch"
          description="Are you sure you want to remove this lot from the marketplace? This cannot be undone."
        >
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-[var(--earth-charcoal)]">
              Any pending inquiries for this produce lot will remain in your inquiries inbox.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeletingId(null)}>
                Keep Lot
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-rose-700 hover:bg-rose-800"
                onClick={() => handleDeleteListing(deletingId)}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
