import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KhetBazaar — Local Farmer Market",
    short_name: "KhetBazaar",
    description:
      "Direct soil-to-table platform connecting Karnataka farmers with consumers. Transparent real-time APMC mandi price benchmarks.",
    start_url: "/",
    display: "standalone",
    background_color: "#1B4332",
    theme_color: "#FAF8F3",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    categories: ["shopping", "agriculture", "business", "food"],
    lang: "en-IN",
    dir: "ltr",
  };
}
