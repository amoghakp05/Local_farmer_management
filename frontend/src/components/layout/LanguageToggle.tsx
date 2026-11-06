"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useI18n, LOCALES, Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLocaleObj = LOCALES.find((l) => l.code === locale) || LOCALES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select application language"
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--surface-warm)] border border-[var(--earth-border)] text-[var(--earth-ink)] hover:bg-[var(--surface-muted)] hover:border-[var(--earth-muted)] active:scale-95 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--forest-700)]"
      >
        <Globe className="w-3.5 h-3.5 text-[var(--forest-700)] shrink-0" aria-hidden="true" />
        <span>{activeLocaleObj.nativeLabel}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white border border-[var(--earth-border)] shadow-[var(--shadow-warm-md)] p-1 z-50 focus:outline-none animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {LOCALES.map((item) => {
            const isSelected = item.code === locale;
            return (
              <button
                key={item.code}
                role="menuitem"
                type="button"
                onClick={() => handleSelect(item.code)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                  isSelected
                    ? "bg-[var(--forest-100)] text-[var(--forest-900)] font-semibold"
                    : "text-[var(--earth-charcoal)] hover:bg-[var(--surface-warm)]"
                )}
              >
                <div className="flex flex-col text-left">
                  <span>{item.nativeLabel}</span>
                  <span className="text-[10px] text-[var(--earth-muted)]">{item.label}</span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[var(--forest-700)]" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
