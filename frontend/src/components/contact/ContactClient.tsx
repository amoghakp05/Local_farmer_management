"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { SproutIcon, WheatIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

export function ContactClient() {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    contactInfo: "",
    role: "consumer",
    subject: "Produce Inquiry",
    message: "",
    honeypot: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.contactInfo.trim() || !formData.message.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please complete your name, contact information, and message.",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit message");
      }

      setSubmittedTicket(result.ticketId);
      toast({
        title: "Message Delivered",
        description: result.message,
        type: "success",
      });

      // Clear message
      setFormData({
        fullName: "",
        contactInfo: "",
        role: "consumer",
        subject: "Produce Inquiry",
        message: "",
        honeypot: "",
      });
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Could not deliver your inquiry. Please try again or WhatsApp us.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const apmcOffices = [
    {
      city: "Bengaluru (Yeshwanthpur)",
      title: "Yeshwanthpur APMC Yard Sub-Desk",
      address: "Gate 4, Wholesale Grain & Vegetable Complex, Yeshwanthpur, Bengaluru, Karnataka 560022",
      phone: "+91 80 2337 4910",
      hours: "05:00 AM – 06:00 PM (Mon–Sat)",
    },
    {
      city: "Mysuru (Bandipalya)",
      title: "Bandipalya APMC Farmers Center",
      address: "APMC Yard Main Gate, Nanjangud Road, Bandipalya, Mysuru, Karnataka 570025",
      phone: "+91 821 248 1022",
      hours: "06:00 AM – 05:00 PM (Mon–Sat)",
    },
    {
      city: "Hubballi (Amargol)",
      title: "Amargol Agricultural Produce Center",
      address: "APMC Market Yard, Pune-Bengaluru Road, Amargol, Hubballi, Karnataka 580025",
      phone: "+91 836 222 7183",
      hours: "05:30 AM – 06:30 PM (Mon–Sat)",
    },
  ];

  return (
    <div className="w-full py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <Badge variant="forest" size="md" icon={<SproutIcon size={16} />}>
          Farmer &amp; Consumer Helpdesk
        </Badge>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-[var(--forest-900)] tracking-tight mt-4 mb-4">
          We&apos;re Here to Serve India&apos;s Growers &amp; Buyers
        </h1>
        <p className="text-sm sm:text-base text-[var(--earth-muted)] leading-relaxed">
          Need help registering as a farmer, clarifying an APMC mandi benchmark price, or reporting
          an inaccurate harvest listing? Connect with our dedicated agronomy support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[var(--earth-border)] p-6 sm:p-10 shadow-[var(--shadow-warm-sm)]">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[var(--earth-line)]">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[var(--earth-ink)]">
                Send an Inquiry
              </h2>
              <p className="text-xs text-[var(--earth-muted)] mt-1">
                Typical response time: under 4 hours during agricultural mandi hours.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--forest-50)] text-[var(--forest-800)] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          {submittedTicket ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 my-6 animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-emerald-900">
                Inquiry Logged #{submittedTicket}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                Thank you! Our regional mandi desk has received your note. A coordinator will reach
                out to you via call or WhatsApp.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSubmittedTicket(null)}
                className="mt-2"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Invisible Bot Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website-hp">Leave this empty</label>
                <input
                  id="website-hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-bold text-[var(--earth-ink)] mb-1"
                  >
                    Your Full Name *
                  </label>
                  <Input
                    id="contact-name"
                    required
                    placeholder="e.g., Basavaraj Gowda"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs font-bold text-[var(--earth-ink)] mb-1"
                  >
                    Phone / Email *
                  </label>
                  <Input
                    id="contact-phone"
                    required
                    placeholder="e.g., 98452 14820 or name@email.com"
                    value={formData.contactInfo}
                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-role"
                    className="block text-xs font-bold text-[var(--earth-ink)] mb-1"
                  >
                    I am a...
                  </label>
                  <Select
                    id="contact-role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    options={[
                      { value: "farmer", label: "Farmer / Grower" },
                      { value: "consumer", label: "Consumer / Retail Buyer" },
                      { value: "trader", label: "Bulk Mandi Trader" },
                      { value: "fpo_officer", label: "FPO / Cooperative Representative" },
                      { value: "other", label: "Agricultural Researcher / Press" },
                    ]}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-bold text-[var(--earth-ink)] mb-1"
                  >
                    Subject
                  </label>
                  <Select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    options={[
                      { value: "Produce Inquiry", label: "Inquiring about a Crop Listing" },
                      { value: "Farmer Onboarding", label: "Help Listing My Produce" },
                      { value: "Mandi Price Dispute", label: "APMC Rate Benchmark Feedback" },
                      { value: "Bulk Order", label: "Institutional / Bulk Procurement" },
                      { value: "Bug / Technical", label: "Technical Bug / PWA Offline Query" },
                      { value: "Other", label: "General Feedback" },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-bold text-[var(--earth-ink)] mb-1"
                >
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  placeholder="Describe your inquiry, crop lot ID, or requirement in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--earth-border)] bg-white text-sm text-[var(--earth-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--forest-700)] focus:border-transparent transition-all resize-y"
                />
              </div>

              <div className="pt-2">
                <Button
                  id="contact-submit-btn"
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  disabled={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  {isSubmitting ? "Sending..." : "Submit Inquiry to APMC Desk"}
                </Button>
              </div>

              <p className="text-[11px] text-[var(--earth-muted)] text-center pt-1">
                Your data is protected under the Digital Personal Data Protection (DPDP) Act 2023. We
                never share your number with telemarketers.
              </p>
            </form>
          )}
        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct WhatsApp Quick Card */}
          <div className="p-6 rounded-3xl bg-[var(--forest-900)] text-[#FAF8F3] shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-amber-200 text-xs font-bold">
                <MessageCircle className="w-3.5 h-3.5" />
                Live WhatsApp Desk
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                Instant Agronomist Chat
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                Send voice notes or photos of your crops directly to our Karnataka agricultural
                liaison desk via WhatsApp.
              </p>

              <div className="pt-2">
                <a
                  href={`https://wa.me/919845214820?text=${encodeURIComponent(
                    "Namaskara KhetBazaar Support, I have a question regarding direct farm produce."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp (+91 98452 14820)
                </a>
              </div>
            </div>
          </div>

          {/* Regional APMC Desks */}
          <div className="bg-white rounded-3xl border border-[var(--earth-border)] p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[var(--earth-ink)] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[var(--forest-800)]" />
              Regional APMC Liaison Desks
            </h3>

            <div className="space-y-3.5">
              {apmcOffices.map((office, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] text-xs space-y-1.5"
                >
                  <div className="font-bold text-[var(--forest-900)] text-sm flex items-center justify-between">
                    <span>{office.city}</span>
                    <span className="text-[10px] font-normal text-[var(--earth-muted)] font-mono">
                      {office.phone}
                    </span>
                  </div>
                  <p className="text-[var(--earth-muted)] leading-relaxed">
                    {office.address}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--earth-charcoal)] font-medium pt-0.5">
                    <Clock className="w-3 h-3 text-[var(--harvest-700)]" />
                    <span>{office.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
