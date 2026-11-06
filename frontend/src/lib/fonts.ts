import { Fraunces, Inter } from "next/font/google";

/**
 * Editorial display serif: Fraunces
 * Warm, expressive, high-character serif for headings and hero moments.
 */
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/**
 * Clean body sans: Inter
 * Engineered for maximum legibility on digital screens, with Indian regional
 * script fallback definitions for Kannada and Hindi glyphs.
 */
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Noto Sans Devanagari",
    "Noto Sans Kannada",
    "Tiro Kannada",
    "Nirmala UI",
    "sans-serif",
  ],
});
