"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabTrigger,
  TabContent,
  Badge,
  Modal,
  Skeleton,
  useToast,
  Tooltip,
  EmptyState,
} from "@/components/ui";
import {
  SproutIcon,
  WheatIcon,
  CrateIcon,
  MarketStallIcon,
  ScaleIcon,
  RupeeIcon,
  ShieldVerifiedIcon,
  OrganicLeafIcon,
} from "@/components/icons";
import {
  Search,
  CheckCircle,
  Copy,
  ExternalLink,
  Sliders,
  Check,
  Eye,
  Bell,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function DesignSystemPage() {
  const { t } = useI18n();
  const { toast } = useToast();

  // State hooks for interactive playground
  const [activeTab, setActiveTab] = useState("vegetables");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkeletonMode, setIsSkeletonMode] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("tomatoes");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(label);
    toast({
      title: "Token Copied",
      description: `${label} (${text}) copied to clipboard.`,
      type: "success",
    });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setInputError("Please enter a valid crop name or mandi location.");
    } else {
      setInputError("");
      toast({
        title: "Search Registered",
        description: `Looking for active lots of "${inputValue}"...`,
        type: "info",
      });
    }
  };

  const colorTokens = [
    {
      name: "Forest Green (Primary)",
      token: "--forest-700",
      hex: "#1B4332",
      contrast: "11.2:1 (AAA)",
      desc: "Earth-rooted agricultural authority for primary actions & headings",
      bgClass: "bg-[#1B4332]",
      textLight: true,
    },
    {
      name: "Forest 800 (Hover)",
      token: "--forest-800",
      hex: "#143326",
      contrast: "13.4:1 (AAA)",
      desc: "Deepened canopy green for hover & pressed states",
      bgClass: "bg-[#143326]",
      textLight: true,
    },
    {
      name: "Forest 100 (Tint)",
      token: "--forest-100",
      hex: "#E6EFEA",
      contrast: "12.8:1 (AAA on ink)",
      desc: "Subtle forest mist for organic tags and badges",
      bgClass: "bg-[#E6EFEA]",
      textLight: false,
    },
    {
      name: "Harvest Orange (Accent)",
      token: "--harvest-600",
      hex: "#C85A17",
      contrast: "4.8:1 (AA)",
      desc: "Sun-ripened crop accent for calls-to-action & alerts",
      bgClass: "bg-[#C85A17]",
      textLight: true,
    },
    {
      name: "Harvest 100 (Wash)",
      token: "--harvest-100",
      hex: "#FCECE0",
      contrast: "12.1:1 (AAA on ink)",
      desc: "Warm wheat glow for urgent alerts and seasonal highlights",
      bgClass: "bg-[#FCECE0]",
      textLight: false,
    },
    {
      name: "Linen Canvas",
      token: "--canvas",
      hex: "#FAF8F3",
      contrast: "Canvas Base",
      desc: "Warm tactile parchment canvas background (Light theme only)",
      bgClass: "bg-[#FAF8F3]",
      textLight: false,
      border: true,
    },
    {
      name: "Earth Ink (Text)",
      token: "--earth-ink",
      hex: "#1C231E",
      contrast: "14.5:1 (AAA)",
      desc: "High-contrast charcoal green for primary body & titles",
      bgClass: "bg-[#1C231E]",
      textLight: true,
    },
    {
      name: "Earth Muted",
      token: "--earth-muted",
      hex: "#5A625C",
      contrast: "5.4:1 (AA)",
      desc: "Stone charcoal for secondary metadata and helper text",
      bgClass: "bg-[#5A625C]",
      textLight: true,
    },
    {
      name: "Earth Border",
      token: "--earth-border",
      hex: "#DCD5C5",
      contrast: "Structural",
      desc: "Tactile warm boundary for cards, inputs, and dividers",
      bgClass: "bg-[#DCD5C5]",
      textLight: false,
    },
  ];

  return (
    <div className="w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <section className="mb-14 sm:mb-20 pb-10 border-b border-[var(--earth-border)]">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="forest" size="sm" icon={<SproutIcon size={14} />}>
            Phase 1 Foundation
          </Badge>
          <Badge variant="harvest" size="sm" icon={<WheatIcon size={14} />}>
            Light Theme Only
          </Badge>
          <Badge variant="neutral" size="sm">
            WCAG AA Compliant
          </Badge>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--forest-900)] leading-[1.08] max-w-4xl">
          Soil, Grain &amp; Harvest: The KhetBazaar Design Language
        </h1>

        <p className="mt-4 text-base sm:text-xl text-[var(--earth-muted)] max-w-3xl leading-relaxed">
          {t("designSystem.subtitle")} Engineered with an 8px spatial rhythm, warm tactile
          linen canvas, custom agricultural SVG iconography, and trilingual typography.
        </p>

        {/* Quick Rule Checklist */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[var(--earth-border)] shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-[var(--earth-muted)] font-semibold">
              Theme Guard
            </span>
            <span className="font-serif text-lg font-bold text-[var(--forest-900)] mt-0.5">
              100% Light
            </span>
            <span className="text-[11px] text-[var(--earth-muted)]">Warm parchment `#FAF8F3`</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-[var(--earth-muted)] font-semibold">
              Brand Palette
            </span>
            <span className="font-serif text-lg font-bold text-[var(--forest-900)] mt-0.5">
              Max 3 Colors
            </span>
            <span className="text-[11px] text-[var(--earth-muted)]">Forest + Harvest + Earth</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-[var(--earth-muted)] font-semibold">
              Spatial Grid
            </span>
            <span className="font-serif text-lg font-bold text-[var(--forest-900)] mt-0.5">
              8px Rhythm
            </span>
            <span className="text-[11px] text-[var(--earth-muted)]">12-16px Radii, Soft Layers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-[var(--earth-muted)] font-semibold">
              Typography
            </span>
            <span className="font-serif text-lg font-bold text-[var(--forest-900)] mt-0.5">
              Fraunces + Inter
            </span>
            <span className="text-[11px] text-[var(--earth-muted)]">EN / ಕನ್ನಡ / हिन्दी</span>
          </div>
        </div>
      </section>

      {/* SECTION 1: COLOR SYSTEM */}
      <section className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--harvest-700)]">
              Token Architecture
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--forest-900)] mt-1">
              Curated Color Palette &amp; Contrast Audit
            </h2>
          </div>
          <p className="text-xs text-[var(--earth-muted)] max-w-sm">
            All text and UI controls strictly meet WCAG AA (4.5:1) or AAA (7:1+) contrast standards on the light linen canvas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {colorTokens.map((item) => (
            <div
              key={item.token}
              className="bg-white rounded-2xl border border-[var(--earth-border)] p-4 flex flex-col justify-between shadow-[0_2px_6px_rgba(27,67,50,0.03)] hover:shadow-md transition-shadow group"
            >
              <div
                className={`h-24 w-full rounded-xl ${item.bgClass} ${
                  item.border ? "border border-[var(--earth-border)]" : ""
                } p-3 flex items-start justify-between relative overflow-hidden`}
              >
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    item.textLight ? "bg-black/30 text-white" : "bg-white/80 text-black"
                  }`}
                >
                  {item.hex}
                </span>

                <button
                  type="button"
                  onClick={() => copyToClipboard(item.hex, item.name)}
                  aria-label={`Copy ${item.hex} to clipboard`}
                  className={`p-1.5 rounded-lg transition-transform active:scale-90 cursor-pointer ${
                    item.textLight
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : "bg-black/10 text-black hover:bg-black/20"
                  }`}
                >
                  {copiedToken === item.name ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-[var(--earth-ink)]">
                    {item.name}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-warm)] text-[var(--forest-800)] border border-[var(--earth-border-subtle)]">
                    {item.contrast}
                  </span>
                </div>
                <code className="text-xs font-mono text-[var(--forest-700)]">
                  var({item.token})
                </code>
                <p className="text-xs text-[var(--earth-muted)] mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: TYPOGRAPHY */}
      <section className="mb-20">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--harvest-700)]">
            Typography
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--forest-900)] mt-1">
            Editorial Serif &amp; Clean Sans Type Scale
          </h2>
          <p className="text-sm text-[var(--earth-muted)] mt-1 max-w-2xl">
            Headings utilize <strong>Fraunces</strong>, an expressive editorial serif with variable optical sizing. Body text is set in <strong>Inter</strong> with regional font fallbacks for Kannada and Devanagari.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--earth-border)] p-6 sm:p-8 space-y-8 shadow-sm">
          {/* Display 2XL */}
          <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-3 pb-6 border-b border-[var(--earth-line)]">
            <span className="text-xs font-mono text-[var(--earth-muted)] shrink-0 w-36">
              Display 2XL / 56px
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--forest-900)] tracking-tight">
              Harvest Mornings
            </h1>
          </div>

          {/* Display XL */}
          <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-3 pb-6 border-b border-[var(--earth-line)]">
            <span className="text-xs font-mono text-[var(--earth-muted)] shrink-0 w-36">
              Display XL / 40px
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--forest-900)]">
              Direct Farmer Mandi Network
            </h2>
          </div>

          {/* Heading 1 */}
          <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-3 pb-6 border-b border-[var(--earth-line)]">
            <span className="text-xs font-mono text-[var(--earth-muted)] shrink-0 w-36">
              Heading 1 / 28px
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--earth-ink)]">
              Organic Heirlooms &amp; Local Millets
            </h3>
          </div>

          {/* Heading 2 */}
          <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-3 pb-6 border-b border-[var(--earth-line)]">
            <span className="text-xs font-mono text-[var(--earth-muted)] shrink-0 w-36">
              Heading 2 / 24px
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[var(--earth-ink)]">
              Fair Weighing Scales &amp; Daily Price Board
            </h4>
          </div>

          {/* Body Large */}
          <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-3 pb-6 border-b border-[var(--earth-line)]">
            <span className="text-xs font-mono text-[var(--earth-muted)] shrink-0 w-36">
              Body Lg / 18px
            </span>
            <p className="text-lg text-[var(--earth-charcoal)] leading-relaxed max-w-2xl">
              Eliminating intermediaries through real-time mandi rate transparency and direct farmer contact channels.
            </p>
          </div>

          {/* Body Md */}
          <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-3 pb-6 border-b border-[var(--earth-line)]">
            <span className="text-xs font-mono text-[var(--earth-muted)] shrink-0 w-36">
              Body Md / 16px
            </span>
            <p className="text-base text-[var(--earth-charcoal)] leading-relaxed max-w-2xl">
              Freshly harvested produce listed directly with harvest dates, field locations, and verified grower profiles.
            </p>
          </div>

          {/* Regional Script Samples */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--surface-warm)] p-5 rounded-xl border border-[var(--earth-border-subtle)]">
            <div>
              <span className="text-xs font-semibold text-[var(--forest-800)] uppercase tracking-wider">
                Kannada Typography Specimen (ಕನ್ನಡ)
              </span>
              <p className="font-serif text-xl font-bold text-[var(--forest-900)] mt-2">
                ಖೇತ್ ಬಜಾರ್: ಮಣ್ಣಿನಿಂದ ನೇರವಾಗಿ ನಿಮ್ಮ ಮನೆಗೆ
              </p>
              <p className="text-sm text-[var(--earth-charcoal)] mt-1 leading-relaxed">
                ಕರ್ನಾಟಕದ ರೈತರು ತಮ್ಮ ತೋಟದ ತಾಜಾ ತರಕಾರಿಗಳು, ರಾಗಿ ಮತ್ತು ಧಾನ್ಯಗಳನ್ನು ಯಾವುದೇ ದಲ್ಲಾಳಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಮಾರಾಟ ಮಾಡಬಹುದು.
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-[var(--harvest-700)] uppercase tracking-wider">
                Hindi Typography Specimen (हिन्दी)
              </span>
              <p className="font-serif text-xl font-bold text-[var(--forest-900)] mt-2">
                खेतबाज़ार: खेत से सीधा आपकी थाली तक
              </p>
              <p className="text-sm text-[var(--earth-charcoal)] mt-1 leading-relaxed">
                पारदर्शी मंडी भाव, ताज़ा फसलों की उपलब्धता और किसानों से सीधा संपर्क — बिचौलियों की अब कोई ज़रूरत नहीं।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SPACING, RADII & NATURAL ELEVATION */}
      <section className="mb-20">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--harvest-700)]">
            Rhythm &amp; Depth
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--forest-900)] mt-1">
            8px Spatial Grid &amp; Soft Layered Shadows
          </h2>
          <p className="text-sm text-[var(--earth-muted)] mt-1">
            Natural depth achieved via soft, layered forest-tinted shadows, tactile 12–16px radii, and strict 8px multiples.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-5 border border-[var(--earth-border)] shadow-[var(--shadow-warm-sm)]">
            <span className="text-xs font-mono text-[var(--forest-700)]">
              --shadow-warm-sm
            </span>
            <h3 className="font-serif text-lg font-bold text-[var(--earth-ink)] mt-2">
              Subtle Surface
            </h3>
            <p className="text-xs text-[var(--earth-muted)] mt-1">
              Soft 1px-3px layer for inputs, segmented chips, and badges.
            </p>
            <div className="mt-4 h-12 rounded-lg bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] flex items-center justify-center text-xs font-semibold text-[var(--earth-muted)]">
              Radius: 12px
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[var(--earth-border)] shadow-[var(--shadow-warm-md)]">
            <span className="text-xs font-mono text-[var(--forest-700)]">
              --shadow-warm-md
            </span>
            <h3 className="font-serif text-lg font-bold text-[var(--earth-ink)] mt-2">
              Card Elevation
            </h3>
            <p className="text-xs text-[var(--earth-muted)] mt-1">
              Primary elevation for crop cards, mandi listings, and containers.
            </p>
            <div className="mt-4 h-12 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] flex items-center justify-center text-xs font-semibold text-[var(--earth-muted)]">
              Radius: 16px
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[var(--earth-border)] shadow-[var(--shadow-warm-lg)]">
            <span className="text-xs font-mono text-[var(--forest-700)]">
              --shadow-warm-lg
            </span>
            <h3 className="font-serif text-lg font-bold text-[var(--earth-ink)] mt-2">
              Hover Elevation
            </h3>
            <p className="text-xs text-[var(--earth-muted)] mt-1">
              Elevated pop state on active crop card hover and drawer popups.
            </p>
            <div className="mt-4 h-12 rounded-2xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] flex items-center justify-center text-xs font-semibold text-[var(--earth-muted)]">
              Radius: 20px
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[var(--earth-border)] shadow-[var(--shadow-warm-modal)]">
            <span className="text-xs font-mono text-[var(--forest-700)]">
              --shadow-warm-modal
            </span>
            <h3 className="font-serif text-lg font-bold text-[var(--earth-ink)] mt-2">
              Modal Backdrop Depth
            </h3>
            <p className="text-xs text-[var(--earth-muted)] mt-1">
              Rich 24px-50px spread with forest tint for focused dialogs.
            </p>
            <div className="mt-4 h-12 rounded-full bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] flex items-center justify-center text-xs font-semibold text-[var(--earth-muted)]">
              Radius: Full (Pill)
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE COMPONENT GALLERY */}
      <section className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--harvest-700)]">
              Component Architecture
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--forest-900)] mt-1">
              Base Interactive UI Components
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant={isSkeletonMode ? "primary" : "secondary"}
              onClick={() => setIsSkeletonMode(!isSkeletonMode)}
            >
              {isSkeletonMode ? "View Active Components" : "Toggle Skeleton Mode"}
            </Button>
          </div>
        </div>

        {/* 1. BUTTONS */}
        <div className="mb-14">
          <h3 className="font-serif text-xl font-bold text-[var(--earth-ink)] mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--forest-700)]" />
            1. Buttons (Variants, Sizes &amp; States)
          </h3>

          <div className="bg-white rounded-2xl border border-[var(--earth-border)] p-6 space-y-6 shadow-sm">
            {/* Variants */}
            <div>
              <p className="text-xs font-semibold text-[var(--earth-muted)] uppercase tracking-wider mb-3">
                Variants (Hover, Active Spring &amp; Focus Ring)
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  leftIcon={<SproutIcon size={18} />}
                  onClick={() =>
                    toast({
                      title: "Primary Action",
                      description: "Forest Green button activated.",
                      type: "success",
                    })
                  }
                >
                  Primary Forest
                </Button>

                <Button
                  variant="accent"
                  leftIcon={<WheatIcon size={18} />}
                  onClick={() =>
                    toast({
                      title: "Accent Action",
                      description: "Harvest Orange button triggered.",
                      type: "warning",
                    })
                  }
                >
                  Accent Harvest
                </Button>

                <Button
                  variant="secondary"
                  leftIcon={<MarketStallIcon size={18} />}
                  onClick={() =>
                    toast({
                      title: "Secondary Action",
                      description: "Warm tactile card button clicked.",
                      type: "info",
                    })
                  }
                >
                  Secondary Warm
                </Button>

                <Button
                  variant="ghost"
                  onClick={() =>
                    toast({
                      title: "Ghost Action",
                      description: "Minimal borderless button clicked.",
                      type: "info",
                    })
                  }
                >
                  Ghost Button
                </Button>

                <Button
                  variant="danger"
                  onClick={() =>
                    toast({
                      title: "Destructive Action",
                      description: "Cancel/Reject lot triggered.",
                      type: "error",
                    })
                  }
                >
                  Cancel Lot
                </Button>
              </div>
            </div>

            {/* Sizes & States */}
            <div className="pt-4 border-t border-[var(--earth-line)]">
              <p className="text-xs font-semibold text-[var(--earth-muted)] uppercase tracking-wider mb-3">
                Sizes &amp; Loading States
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" variant="primary">
                  Small (32px)
                </Button>
                <Button size="md" variant="primary">
                  Medium (40px)
                </Button>
                <Button size="lg" variant="primary">
                  Large (48px)
                </Button>

                <Button
                  variant="secondary"
                  isLoading={buttonLoading}
                  onClick={() => {
                    setButtonLoading(true);
                    setTimeout(() => setButtonLoading(false), 1800);
                  }}
                >
                  {buttonLoading ? "Loading..." : "Test Spinner State"}
                </Button>

                <Button variant="primary" disabled>
                  Disabled State
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FORM CONTROLS: INPUT & SELECT */}
        <div className="mb-14">
          <h3 className="font-serif text-xl font-bold text-[var(--earth-ink)] mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--harvest-600)]" />
            2. Inputs, Select &amp; Validation States
          </h3>

          <div className="bg-white rounded-2xl border border-[var(--earth-border)] p-6 shadow-sm">
            <form onSubmit={handleTestSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Produce / Crop Name"
                placeholder="e.g. Sona Masoori Rice, Red Onions"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                error={inputError}
                leftIcon={<Search className="w-4 h-4" />}
                helperText="Type any crop name or mandi location"
              />

              <Input
                label="Price Per Quintal (₹)"
                type="number"
                placeholder="2450"
                leftIcon={<RupeeIcon size={16} />}
                helperText="Fair mandi benchmark rate"
              />

              <Select
                label="Crop Category"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                options={[
                  { value: "tomatoes", label: "Vegetables — Fresh Harvest" },
                  { value: "ragi", label: "Millets & Grains (Ragi, Jowar)" },
                  { value: "tur_dal", label: "Pulses (Tur Dal, Moong)" },
                  { value: "spices", label: "Spices & Condiments" },
                  { value: "organic_fruits", label: "Certified Organic Fruits" },
                ]}
                helperText="Choose agricultural classification"
              />

              <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setInputValue("");
                    setInputError("");
                  }}
                >
                  Clear Form
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Test Form Validation
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* 3. ANIMATED TABS & CARDS */}
        <div className="mb-14">
          <h3 className="font-serif text-xl font-bold text-[var(--earth-ink)] mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--forest-700)]" />
            3. Animated Sliding Tabs &amp; Spotlight Cards
          </h3>

          <div className="bg-white rounded-2xl border border-[var(--earth-border)] p-6 shadow-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabTrigger value="vegetables">
                  Fresh Vegetables (ತರಕಾರಿಗಳು)
                </TabTrigger>
                <TabTrigger value="grains">
                  Grains &amp; Millets (ಧಾನ್ಯಗಳು)
                </TabTrigger>
                <TabTrigger value="organic">
                  Certified Organic (ಸಾವಯವ)
                </TabTrigger>
              </TabsList>

              <TabContent value="vegetables">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {isSkeletonMode ? (
                    <>
                      <div className="p-6 rounded-2xl bg-white border border-[var(--earth-border)] space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="p-6 rounded-2xl bg-white border border-[var(--earth-border)] space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="p-6 rounded-2xl bg-white border border-[var(--earth-border)] space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Card enableSpotlight variant="interactive">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <Badge variant="harvest" size="sm" icon={<WheatIcon size={12} />}>
                              Harvested Today
                            </Badge>
                            <span className="text-xs text-[var(--forest-700)] font-semibold">
                              Hubli Mandi
                            </span>
                          </div>
                          <CardTitle className="mt-2">Country Tomatoes (ನಾಟಿ ಟೊಮೆಟೊ)</CardTitle>
                          <CardDescription>
                            Farmer: Basavaraj Gowda, Haveri District. Plucked this morning at 6 AM.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-xs text-[var(--earth-muted)]">Direct Price</span>
                              <p className="font-serif text-2xl font-black text-[var(--forest-900)]">
                                ₹28 <span className="text-xs font-sans font-normal text-[var(--earth-muted)]">/ kg</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-[var(--earth-muted)]">Available</span>
                              <p className="text-sm font-bold text-[var(--earth-charcoal)]">
                                450 kg in crate
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => setIsModalOpen(true)}
                          >
                            Contact Farmer
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card enableSpotlight variant="interactive">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <Badge variant="forest" size="sm" icon={<OrganicLeafIcon size={12} />}>
                              Natural Farm
                            </Badge>
                            <span className="text-xs text-[var(--forest-700)] font-semibold">
                              Dharwad APMC
                            </span>
                          </div>
                          <CardTitle className="mt-2">Organic Green Chillies (ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ)</CardTitle>
                          <CardDescription>
                            Farmer: Savitri Patil, Dharwad. Zero chemical pesticides applied.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-xs text-[var(--earth-muted)]">Direct Price</span>
                              <p className="font-serif text-2xl font-black text-[var(--forest-900)]">
                                ₹45 <span className="text-xs font-sans font-normal text-[var(--earth-muted)]">/ kg</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-[var(--earth-muted)]">Available</span>
                              <p className="text-sm font-bold text-[var(--earth-charcoal)]">
                                120 kg
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => setIsModalOpen(true)}
                          >
                            Contact Farmer
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card enableSpotlight variant="interactive">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <Badge variant="neutral" size="sm">
                              Direct Field
                            </Badge>
                            <span className="text-xs text-[var(--forest-700)] font-semibold">
                              Kolar Rythu Bazaar
                            </span>
                          </div>
                          <CardTitle className="mt-2">Bell Peppers / Shimla Mirch</CardTitle>
                          <CardDescription>
                            Farmer: Ramesh Babu. Shade-net greenhouse produce, crisp harvest.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-xs text-[var(--earth-muted)]">Direct Price</span>
                              <p className="font-serif text-2xl font-black text-[var(--forest-900)]">
                                ₹60 <span className="text-xs font-sans font-normal text-[var(--earth-muted)]">/ kg</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-[var(--earth-muted)]">Available</span>
                              <p className="text-sm font-bold text-[var(--earth-charcoal)]">
                                200 kg
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => setIsModalOpen(true)}
                          >
                            Contact Farmer
                          </Button>
                        </CardFooter>
                      </Card>
                    </>
                  )}
                </div>
              </TabContent>

              <TabContent value="grains">
                <div className="p-6 rounded-2xl bg-[var(--surface-warm)] border border-[var(--earth-border)] mt-4 text-center">
                  <h4 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
                    Local Karnataka Millets &amp; Grains
                  </h4>
                  <p className="text-sm text-[var(--earth-muted)] mt-1 max-w-md mx-auto">
                    Featuring Finger Millet (Ragi), Foxtail Millet (Navane), and Little Millet (Same) direct from Mandya and Hassan farmers.
                  </p>
                </div>
              </TabContent>

              <TabContent value="organic">
                <div className="p-6 rounded-2xl bg-[var(--surface-warm)] border border-[var(--earth-border)] mt-4 text-center">
                  <h4 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
                    100% Jaivik Certified Organic Lots
                  </h4>
                  <p className="text-sm text-[var(--earth-muted)] mt-1 max-w-md mx-auto">
                    All crops certified by Karnataka State Organic Certification Agency (KSOCA).
                  </p>
                </div>
              </TabContent>
            </Tabs>
          </div>
        </div>

        {/* 4. BADGES, TOOLTIPS & TOAST SANDBOX */}
        <div className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Badges */}
          <div className="bg-white rounded-2xl border border-[var(--earth-border)] p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[var(--earth-ink)] mb-4">
              4. Badges &amp; Status Indicators
            </h3>
            <p className="text-xs text-[var(--earth-muted)] mb-4">
              Tactile pill badges for crop status, freshness, and mandi verification:
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Badge variant="forest" icon={<OrganicLeafIcon size={14} />}>
                100% Organic (ಸಾವಯವ)
              </Badge>
              <Badge variant="harvest" icon={<WheatIcon size={14} />}>
                Fresh Morning Harvest
              </Badge>
              <Badge variant="neutral" icon={<ShieldVerifiedIcon size={14} />}>
                Verified Grower
              </Badge>
              <Badge variant="outline" icon={<ScaleIcon size={14} />}>
                MSP Benchmark
              </Badge>
              <Badge variant="danger">
                Limited Stock (20 kg Left)
              </Badge>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--earth-line)]">
              <p className="text-xs font-semibold text-[var(--earth-muted)] uppercase tracking-wider mb-2">
                Tooltips (Hover / Keyboard Focus)
              </p>
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Farmer phone numbers are bot-protected. Click to reveal.">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--forest-700)] underline decoration-dotted cursor-help">
                    Bot Protection Policy
                  </span>
                </Tooltip>

                <Tooltip content="Mandi rates refreshed daily at 07:00 AM IST" position="bottom">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--harvest-700)] underline decoration-dotted cursor-help">
                    Price Refresh Cycle
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Toast Sandbox */}
          <div className="bg-white rounded-2xl border border-[var(--earth-border)] p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[var(--earth-ink)] mb-4">
              5. Interactive Toast Notifications
            </h3>
            <p className="text-xs text-[var(--earth-muted)] mb-4">
              Warm earthy toast notifications with auto-dismiss and accessibility announcements:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<CheckCircle className="w-4 h-4 text-[var(--forest-700)]" />}
                onClick={() =>
                  toast({
                    title: "Produce Registered",
                    description: "Tomato lot #402 successfully added to Hubli Mandi board.",
                    type: "success",
                  })
                }
              >
                Success Toast
              </Button>

              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Bell className="w-4 h-4 text-[var(--harvest-600)]" />}
                onClick={() =>
                  toast({
                    title: "Price Alert",
                    description: "Onion rates increased by ₹4/kg in Bangalore Yeshwanthpur.",
                    type: "warning",
                  })
                }
              >
                Harvest Warning
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  toast({
                    title: "Connection Failed",
                    description: "Unable to reach mandi server. Showing cached offline data.",
                    type: "error",
                  })
                }
              >
                Error State
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  toast({
                    title: "Language Switched",
                    description: "Preferences saved to local device storage.",
                    type: "info",
                  })
                }
              >
                Info Toast
              </Button>
            </div>
          </div>
        </div>

        {/* 5. EMPTY STATE SHOWCASE */}
        <div className="mb-14">
          <h3 className="font-serif text-xl font-bold text-[var(--earth-ink)] mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--forest-700)]" />
            6. Editorial Empty State Component
          </h3>

          <div className="bg-white rounded-2xl border border-[var(--earth-border)] p-8 shadow-sm">
            <EmptyState
              title="No Produce Listed in This Mandi Today"
              description="Local farmers have not uploaded active harvest batches for this market yet. Check back at 06:00 AM or select another nearby mandi."
              action={
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<CrateIcon size={18} />}
                  onClick={() =>
                    toast({
                      title: "Farmer Onboarding",
                      description: "Produce listing modal opened.",
                      type: "info",
                    })
                  }
                >
                  List Produce As Farmer
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* MODAL PREVIEW DIALOG */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Direct Farmer Contact"
        description="Connect with Basavaraj Gowda without broker commission."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--forest-700)] text-white flex items-center justify-center shrink-0">
              <SproutIcon size={20} />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[var(--earth-ink)]">
                Basavaraj Gowda
              </h4>
              <p className="text-xs text-[var(--earth-muted)]">
                Haveri Village • 6.5 Acres Organic Farm • 8 Years on KhetBazaar
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--earth-muted)] uppercase tracking-wider">
              Produce Details
            </span>
            <div className="p-3 rounded-lg border border-[var(--earth-border)] text-sm flex justify-between">
              <span className="text-[var(--earth-charcoal)]">Country Tomatoes (ನಾಟಿ ಟೊಮೆಟೊ)</span>
              <span className="font-bold text-[var(--forest-900)]">₹28 / kg</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--harvest-50)] border border-[var(--harvest-200)] text-xs text-[var(--harvest-900)] leading-relaxed">
            <strong>Bot Protection Active:</strong> Farmer phone numbers are protected from automated scrapers. Click below to confirm you are an authentic buyer.
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                toast({
                  title: "Contact Revealed",
                  description: "+91 9845X XXXXX (Basavaraj Gowda)",
                  type: "success",
                });
              }}
            >
              Reveal Phone &amp; WhatsApp
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
