"use client";

import React from "react";
import {
  FarmFieldModel,
  HarvestBasketModel,
  CrateSortingModel,
  MarketStallModel,
  ConsumersTableModel,
} from "./LowPolyModels";

export function HarvestScene() {
  return (
    <>
      {/* Light morning mist / pastel atmosphere fog */}
      <color attach="background" args={["#FAF8F3"]} />
      <fog attach="fog" args={["#FAF8F3", 10, 68]} />

      {/* Warm Morning Sunlight */}
      <ambientLight color="#FFF6E8" intensity={1.1} />

      <directionalLight
        position={[14, 22, 12]}
        color="#FFE6B8"
        intensity={1.7}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.001}
      />

      {/* Earth bounce fill light */}
      <directionalLight
        position={[-12, 6, -25]}
        color="#EAD9BD"
        intensity={0.4}
      />

      {/* 5 Continuous Story Chapter Vignettes */}
      {/* Chapter 1: The Living Field */}
      <FarmFieldModel position={[0, 0, 0]} />

      {/* Chapter 2: The Morning Harvest */}
      <HarvestBasketModel position={[0, 0, -14]} />

      {/* Chapter 3: The Crate & Fair Weighing Scales */}
      <CrateSortingModel position={[0, 0, -28]} />

      {/* Chapter 4: The Local Market Stall / Mandi */}
      <MarketStallModel position={[0, 0, -44]} />

      {/* Chapter 5: The Consumer's Dining Table */}
      <ConsumersTableModel position={[0, 0, -60]} />
    </>
  );
}
