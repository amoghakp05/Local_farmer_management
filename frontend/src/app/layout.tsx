import type { Metadata, Viewport } from "next";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { LocaleProvider } from "@/lib/i18n";
import { ToastProvider } from "@/components/ui/Toast";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/auth-context";
import { PwaProvider } from "@/components/pwa/PwaProvider";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF8F3",
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://khetbazaar.org";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "KhetBazaar — Local Farmer Market Information System",
    template: "%s | KhetBazaar",
  },
  description:
    "Direct from the soil to your table. Connecting local Karnataka farmers directly with consumers with transparent crop availability, live APMC mandi pricing benchmarks, and verified contact info.",
  keywords: [
    "farmer market",
    "khet bazaar",
    "mandi prices karnataka",
    "local agriculture bangalore",
    "organic crops mysuru",
    "direct farm produce",
    "apmc agmarknet rates",
  ],
  authors: [{ name: "KhetBazaar Initiative" }],
  creator: "KhetBazaar Open Agricultural Collective",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.svg",
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "kn-IN": "/?lang=kn",
      "hi-IN": "/?lang=hi",
    },
  },
  openGraph: {
    title: "KhetBazaar — Direct from the Soil to Your Table",
    description:
      "Connecting local Karnataka farmers directly with consumers for transparent prices, verified crop lots, and zero middleman cuts.",
    url: baseUrl,
    siteName: "KhetBazaar",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KhetBazaar — Direct Farm to Table Market",
    description: "Eliminating middleman cuts. Transparent APMC mandi benchmarks across Karnataka.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F3] text-[var(--earth-ink)] grain-texture selection:bg-[var(--forest-100)] selection:text-[var(--forest-900)]">
        {/* Accessible Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2.5 rounded-xl bg-[var(--forest-800)] text-[#FAF8F3] font-bold shadow-lg ring-2 ring-white transition-all"
        >
          Skip to main agricultural content
        </a>

        <LocaleProvider>
          <ToastProvider>
            <AuthProvider>
              <PwaProvider>
                <SmoothScrollProvider>
                  <Header />
                  <main id="main-content" className="flex-1 flex flex-col">
                    {children}
                  </main>
                  <Footer />
                </SmoothScrollProvider>
              </PwaProvider>
            </AuthProvider>
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
