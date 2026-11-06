import { ImageResponse } from "next/og";

export const alt = "KhetBazaar — Local Farmer Market Information System";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAF8F3",
          backgroundImage: "radial-gradient(#E8E3D7 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          padding: "60px 80px",
          fontFamily: "serif",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                backgroundColor: "#1B4332",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FAF8F3",
                fontSize: "28px",
              }}
            >
              🌱
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: "900",
                  color: "#0F281E",
                  letterSpacing: "-0.03em",
                }}
              >
                KhetBazaar
              </span>
              <span
                style={{
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "#C85A17",
                  fontWeight: "700",
                }}
              >
                Direct Soil-to-Market Infrastructure
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#E8F0EA",
              color: "#1B4332",
              padding: "10px 18px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "700",
              border: "1px solid #C4D9CA",
            }}
          >
            ✓ 100% Direct Farmer Exchange
          </div>
        </div>

        {/* Center Hero Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "900",
              color: "#0F281E",
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Connecting Karnataka Farmers Directly with Conscious Consumers
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#5C564B",
              fontFamily: "sans-serif",
              margin: 0,
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Transparent APMC mandi benchmark pricing, Grade A+ certified produce, and zero middleman
            take-rate.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            borderTop: "2px solid #E4DFD3",
            paddingTop: "28px",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🌾</span>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#1B4332" }}>
              18+ APMC Mandis
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🛡️</span>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#1B4332" }}>
              Verified Soil &amp; Origin
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🗣️</span>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#1B4332" }}>
              Kannada • Hindi • English
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" }}>
            <span style={{ fontSize: "16px", fontWeight: "800", color: "#C85A17" }}>
              khetbazaar.org
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
