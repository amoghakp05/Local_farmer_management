"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { HarvestScene } from "./HarvestScene";
import { HarvestJourneyFallback } from "./HarvestJourneyFallback";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";

interface HarvestJourneyCanvasProps {
  scrollProgress: number; // 0 to 1
  className?: string;
}

/**
 * Checks whether WebGL / WebGL2 context is available in browser.
 */
function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function CanvasInlineLoader() {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-transparent pointer-events-none">
      <div className="w-8 h-8 rounded-full border-3 border-[var(--forest-600)] border-t-transparent animate-spin" />
    </div>
  );
}

export default function HarvestJourneyCanvas({
  scrollProgress,
  className = "",
}: HarvestJourneyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 1. Accessibility & Hardware Capability Guard
  useEffect(() => {
    if (typeof window === "undefined") return;

    setHasWebGL(isWebGLAvailable());

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    const nav = navigator as any;
    if (nav.connection?.saveData) {
      setIsLowBandwidth(true);
    }

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // 2. Mouse Parallax Tracker
  useEffect(() => {
    if (typeof window === "undefined" || isReducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (clientX / innerWidth) * 2 - 1,
        y: (clientY / innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [isReducedMotion]);

  // If client lacks WebGL, prefers reduced motion, or is on low-bandwidth, render safe static fallback
  if (!hasWebGL || isReducedMotion || isLowBandwidth) {
    return <HarvestJourneyFallback />;
  }

  return (
    <CanvasErrorBoundary fallback={<HarvestJourneyFallback />}>
      <div
        ref={containerRef}
        className={`relative w-full h-full min-h-[500px] overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing ${className}`}
      >
        <Suspense fallback={<CanvasInlineLoader />}>
          <Canvas
            shadows
            dpr={[1, 1.5]}
            frameloop="always"
            camera={{
              position: [0, 2.4, 7.5],
              fov: 46,
              near: 0.1,
              far: 100,
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: false,
            }}
          >
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2 - 0.05}
              minPolarAngle={0.2}
              rotateSpeed={0.5}
            />
            <CameraRig scrollProgress={scrollProgress} mousePos={mousePos} />
            <HarvestScene />
          </Canvas>
        </Suspense>
      </div>
    </CanvasErrorBoundary>
  );
}
