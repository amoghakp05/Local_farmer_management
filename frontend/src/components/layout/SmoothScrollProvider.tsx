"use client";

import React from "react";

/**
 * SmoothScrollProvider:
 * Uses clean native browser smooth scrolling to prevent touchpad lag,
 * inertial swipe conflicts, or scroll hijacking with 3D canvas and GSAP ScrollTrigger.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
