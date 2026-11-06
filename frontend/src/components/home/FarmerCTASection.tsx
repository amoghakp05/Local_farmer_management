"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SproutIcon, WheatIcon, ShieldVerifiedIcon } from "@/components/icons";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { PlusCircle, Check } from "lucide-react";

import { createFarmer } from "@/lib/data/farmers-repository";

export function FarmerCTASection() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [farmerName, setFarmerName] = useState("");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [farmerDistrict, setFarmerDistrict] = useState("kolar");
  const [produceType, setProduceType] = useState("tomatoes");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName || !farmerPhone) {
      toast({
        title: "Required Information",
        description: "Please provide your name and contact phone number.",
        type: "error",
      });
      return;
    }

    const result = createFarmer({
      name: farmerName,
      phone: farmerPhone,
      village: `${farmerDistrict.toUpperCase()} Village`,
      district: farmerDistrict,
      primaryCrops: [produceType],
    });

    if (!result.success) {
      toast({
        title: "Registration Failed",
        description: result.error || "Unable to register farmer.",
        type: "error",
      });
      return;
    }

    setIsModalOpen(false);
    toast({
      title: "Farmer Registered Successfully!",
      description: `Welcome, ${farmerName}! Your verified grower profile has been created.`,
      type: "success",
    });
    setFarmerName("");
    setFarmerPhone("");
  };

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-[var(--forest-700)] text-[#FAF8F3] p-8 sm:p-14 border border-[var(--forest-800)] shadow-[var(--shadow-warm-xl)]">
        {/* Subtle background grain & warm organic curves */}
        <div
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[var(--harvest-600)]/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--forest-800)] border border-[var(--forest-600)] text-xs font-semibold text-[#FAF8F3] mb-4">
            <SproutIcon size={14} />
            Are You a Farmer? / ನೀವು ರೈತರೇ?
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]">
            Sell Directly to Consumers. Keep 100% of What You Earn.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[var(--forest-100)] leading-relaxed">
            No registration fees, no commission agents, and no arbitrary deductions at the weighbridge. List your harvest in 2 minutes and connect with authentic buyers directly on phone &amp; WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              variant="accent"
              leftIcon={<PlusCircle className="w-5 h-5" />}
              onClick={() => setIsModalOpen(true)}
            >
              List Produce Now (ಬೆಳೆ ನೋಂದಣಿ)
            </Button>

            <span className="text-xs text-[var(--forest-100)] font-medium flex items-center gap-1.5">
              <ShieldVerifiedIcon size={16} />
              Free Registration • Verified Producer Card
            </span>
          </div>
        </div>
      </div>

      {/* Farmer Onboarding Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Quick Produce Registration"
        description="List your current harvest batch in 2 minutes without commission."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Farmer Full Name (ರೈತರ ಹೆಸರು)"
            placeholder="Enter farmer full name"
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
            required
          />

          <Input
            label="Phone Number (ಮೊಬೈಲ್ ಸಂಖ್ಯೆ)"
            placeholder="10-digit mobile number"
            type="tel"
            value={farmerPhone}
            onChange={(e) => setFarmerPhone(e.target.value)}
            required
            helperText="Protected by bot shield. Only verified buyers can reveal."
          />

          <Select
            label="Primary Mandi / District"
            value={farmerDistrict}
            onChange={(e) => setFarmerDistrict(e.target.value)}
            options={[
              { value: "kolar", label: "Kolar District (ಕೋಲಾರ)" },
              { value: "haveri", label: "Haveri District (ಹಾವೇರಿ)" },
              { value: "dharwad", label: "Dharwad District (ಧಾರವಾಡ)" },
              { value: "mandya", label: "Mandya District (ಮಂಡ್ಯ)" },
              { value: "bangalore_rural", label: "Bangalore Rural (ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ)" },
              { value: "belagavi", label: "Belagavi District (ಬೆಳಗಾವಿ)" },
            ]}
          />

          <Select
            label="Crop Harvest Type"
            value={produceType}
            onChange={(e) => setProduceType(e.target.value)}
            options={[
              { value: "tomatoes", label: "Country Tomatoes (ನಾಟಿ ಟೊಮೆಟೊ)" },
              { value: "onions", label: "Red Onions (ಈರುಳ್ಳಿ)" },
              { value: "ragi", label: "Finger Millet / Ragi (ರಾಗಿ)" },
              { value: "chillies", label: "Green Chillies (ಮೆಣಸಿನಕಾಯಿ)" },
              { value: "paddy", label: "Sona Masoori Paddy (ಭತ್ತ)" },
            ]}
          />

          <div className="pt-3 flex justify-end gap-3 border-t border-[var(--earth-line)]">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm &amp; List Produce
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
