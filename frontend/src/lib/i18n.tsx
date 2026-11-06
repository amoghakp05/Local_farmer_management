"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";

import enMessages from "@/messages/en.json";
import knMessages from "@/messages/kn.json";
import hiMessages from "@/messages/hi.json";

export type Locale = "en" | "kn" | "hi";

export interface LocaleOption {
  code: Locale;
  label: string;
  nativeLabel: string;
}

export const LOCALES: LocaleOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
];

const messagesMap: Record<Locale, any> = {
  en: enMessages,
  kn: knMessages,
  hi: hiMessages,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  messages: any;
  t: (keyPath: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Initialize from cookie / localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("khetbazaar_locale") as Locale | null;
    if (saved && (saved === "en" || saved === "kn" || saved === "hi")) {
      setLocaleState(saved);
      document.cookie = `NEXT_LOCALE=${saved}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("khetbazaar_locale", newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const messages = messagesMap[locale] || messagesMap.en;

  // Simple dot notation getter helper
  const t = (keyPath: string): string => {
    const parts = keyPath.split(".");
    let curr: any = messages;
    for (const part of parts) {
      if (curr && typeof curr === "object" && part in curr) {
        curr = curr[part];
      } else {
        return keyPath;
      }
    }
    return typeof curr === "string" ? curr : keyPath;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, messages, t }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within LocaleProvider");
  }
  return context;
}
