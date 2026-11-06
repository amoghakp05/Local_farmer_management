"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Reusable warm color materials for low-poly baked morning aesthetic
const MAT = {
  soil: new THREE.MeshLambertMaterial({ color: "#C6B79B", flatShading: true }),
  soilDark: new THREE.MeshLambertMaterial({ color: "#A89679", flatShading: true }),
  grass: new THREE.MeshLambertMaterial({ color: "#6A8D56", flatShading: true }),
  wheat: new THREE.MeshLambertMaterial({ color: "#E0B354", flatShading: true }),
  wheatTip: new THREE.MeshLambertMaterial({ color: "#F0CA72", flatShading: true }),
  tomato: new THREE.MeshLambertMaterial({ color: "#C83E25", flatShading: true }),
  leafGreen: new THREE.MeshLambertMaterial({ color: "#486E3A", flatShading: true }),
  cabbage: new THREE.MeshLambertMaterial({ color: "#7BA862", flatShading: true }),
  woodLight: new THREE.MeshLambertMaterial({ color: "#B8966E", flatShading: true }),
  woodDark: new THREE.MeshLambertMaterial({ color: "#8E6845", flatShading: true }),
  basket: new THREE.MeshLambertMaterial({ color: "#A87D4B", flatShading: true }),
  ironBrass: new THREE.MeshLambertMaterial({ color: "#8C7A3E", flatShading: true }),
  metal: new THREE.MeshLambertMaterial({ color: "#6A6E72", flatShading: true }),
  awningGreen: new THREE.MeshLambertMaterial({ color: "#1B4332", flatShading: true }),
  awningCream: new THREE.MeshLambertMaterial({ color: "#F6F1E3", flatShading: true }),
  chalkboard: new THREE.MeshLambertMaterial({ color: "#2B332C", flatShading: true }),
  ceramicWhite: new THREE.MeshLambertMaterial({ color: "#FAF6ED", flatShading: true }),
  runnerLinen: new THREE.MeshLambertMaterial({ color: "#E8E0D0", flatShading: true }),
  fruitOrange: new THREE.MeshLambertMaterial({ color: "#DB7324", flatShading: true }),
};

/**
 * CHAPTER 1: Low-poly Farm Field
 */
export function FarmFieldModel({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const wheatGroupRef = useRef<THREE.Group>(null);

  // Gentle morning breeze idle sway
  useFrame((state) => {
    if (wheatGroupRef.current) {
      const t = state.clock.getElapsedTime();
      wheatGroupRef.current.children.forEach((child, i) => {
        child.rotation.z = Math.sin(t * 1.8 + i * 0.4) * 0.08;
      });
    }
  });

  return (
    <group position={position}>
      {/* Ground Furrows */}
      <mesh material={MAT.soil} receiveShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[14, 0.4, 16]} />
      </mesh>

      {/* Raised Furrow Ridges */}
      {[-3, -1.5, 0, 1.5, 3].map((x, idx) => (
        <mesh material={MAT.soilDark} key={idx} receiveShadow position={[x, 0.08, 0]}>
          <boxGeometry args={[0.9, 0.2, 14]} />
        </mesh>
      ))}

      {/* Swaying Wheat Stalks */}
      <group ref={wheatGroupRef} position={[-2, 0.1, -1]}>
        {Array.from({ length: 18 }).map((_, i) => {
          const row = Math.floor(i / 6);
          const col = i % 6;
          return (
            <group key={i} position={[col * 0.45 - 1.1, 0, row * 0.8 - 1]}>
              {/* Stalk */}
              <mesh material={MAT.wheat} castShadow position={[0, 0.6, 0]}>
                <cylinderGeometry args={[0.025, 0.035, 1.2, 5]} />
              </mesh>
              {/* Head grain */}
              <mesh material={MAT.wheatTip} castShadow position={[0, 1.2, 0]}>
                <coneGeometry args={[0.08, 0.35, 5]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Tomato Plants with Red Fruit */}
      <group position={[1.8, 0.1, -0.5]}>
        {[-1.2, 0, 1.2].map((z, idx) => (
          <group key={idx} position={[0, 0, z]}>
            {/* Foliage bush */}
            <mesh material={MAT.leafGreen} castShadow position={[0, 0.5, 0]}>
              <dodecahedronGeometry args={[0.55, 0]} />
            </mesh>
            {/* Stake */}
            <mesh material={MAT.woodDark} castShadow position={[0.2, 0.6, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 1.4, 4]} />
            </mesh>
            {/* Ripe Tomatoes */}
            <mesh material={MAT.tomato} castShadow position={[-0.25, 0.4, 0.2]}>
              <sphereGeometry args={[0.16, 6, 6]} />
            </mesh>
            <mesh material={MAT.tomato} castShadow position={[0.2, 0.6, 0.25]}>
              <sphereGeometry args={[0.14, 6, 6]} />
            </mesh>
            <mesh material={MAT.tomato} castShadow position={[-0.1, 0.7, -0.2]}>
              <sphereGeometry args={[0.13, 6, 6]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Low-Poly Farm Tree */}
      <group position={[-4.5, 0, -4]}>
        {/* Trunk */}
        <mesh material={MAT.woodDark} castShadow position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.25, 0.38, 2.8, 6]} />
        </mesh>
        {/* Canopy Layers */}
        <mesh material={MAT.leafGreen} castShadow position={[0, 3.2, 0]}>
          <dodecahedronGeometry args={[1.5, 0]} />
        </mesh>
        <mesh material={MAT.cabbage} castShadow position={[0.3, 4.2, 0.2]}>
          <dodecahedronGeometry args={[1.1, 0]} />
        </mesh>
      </group>

      {/* Rustic Wooden Post & Rail Fence */}
      <group position={[4.5, 0, 0]}>
        {[-4, -1.5, 1, 3.5].map((z, idx) => (
          <mesh material={MAT.woodLight} key={idx} castShadow position={[0, 0.6, z]}>
            <cylinderGeometry args={[0.08, 0.1, 1.2, 5]} />
          </mesh>
        ))}
        <mesh material={MAT.woodLight} castShadow position={[0, 0.8, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 8, 4]} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * CHAPTER 2: The Harvest Moment (Basket & Tools)
 */
export function HarvestBasketModel({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Wooden Harvest Plinth */}
      <mesh material={MAT.soilDark} receiveShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[2.4, 2.6, 0.3, 8]} />
      </mesh>

      {/* Large Woven Harvest Basket */}
      <group position={[0, 0.45, 0]}>
        <mesh material={MAT.basket} castShadow receiveShadow>
          <cylinderGeometry args={[0.9, 0.65, 0.9, 10]} />
        </mesh>
        {/* Basket Rim */}
        <mesh material={MAT.woodLight} castShadow position={[0, 0.45, 0]}>
          <torusGeometry args={[0.9, 0.06, 6, 12]} />
        </mesh>
        {/* Handle */}
        <mesh material={MAT.woodDark} castShadow position={[0, 0.7, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.8, 0.05, 5, 12, Math.PI]} />
        </mesh>

        {/* Heaping Tomatoes inside Basket */}
        <mesh material={MAT.tomato} castShadow position={[-0.2, 0.45, 0.1]}>
          <sphereGeometry args={[0.22, 6, 6]} />
        </mesh>
        <mesh material={MAT.tomato} castShadow position={[0.2, 0.48, -0.1]}>
          <sphereGeometry args={[0.24, 6, 6]} />
        </mesh>
        <mesh material={MAT.tomato} castShadow position={[0.0, 0.55, 0.2]}>
          <sphereGeometry args={[0.2, 6, 6]} />
        </mesh>
        <mesh material={MAT.fruitOrange} castShadow position={[-0.3, 0.38, -0.2]}>
          <sphereGeometry args={[0.21, 6, 6]} />
        </mesh>

        {/* Golden wheat sheaves protruding */}
        {[-0.25, 0.15, 0.3].map((rot, idx) => (
          <group key={idx} position={[0.1, 0.5, -0.2]} rotation={[rot, 0.2, rot]}>
            <mesh material={MAT.wheat} castShadow position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.02, 0.03, 1, 4]} />
            </mesh>
            <mesh material={MAT.wheatTip} castShadow position={[0, 1.0, 0]}>
              <coneGeometry args={[0.08, 0.3, 4]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Fresh Cabbages placed beside basket */}
      <mesh material={MAT.cabbage} castShadow position={[1.1, 0.3, 0.4]}>
        <dodecahedronGeometry args={[0.34, 0]} />
      </mesh>
      <mesh material={MAT.leafGreen} castShadow position={[1.0, 0.25, -0.4]}>
        <dodecahedronGeometry args={[0.28, 0]} />
      </mesh>

      {/* Traditional Hand Sickle / Scythe */}
      <group position={[-1.1, 0.15, 0.3]} rotation={[0.2, 0.5, -Math.PI / 4]}>
        {/* Handle */}
        <mesh material={MAT.woodDark} castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 5]} />
        </mesh>
        {/* Curved blade */}
        <mesh material={MAT.metal} castShadow position={[0.25, 0.3, 0]} rotation={[0, 0, -Math.PI / 3]}>
          <torusGeometry args={[0.3, 0.02, 4, 10, Math.PI / 1.5]} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * CHAPTER 3: Crates, Grading & Mandi Weighing Scale
 */
export function CrateSortingModel({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Sorting Platform Table */}
      <mesh material={MAT.woodLight} receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[4.2, 0.15, 2.6]} />
      </mesh>
      {/* Legs */}
      {[
        [-1.8, -1],
        [1.8, -1],
        [-1.8, 1],
        [1.8, 1],
      ].map(([x, z], idx) => (
        <mesh material={MAT.woodDark} key={idx} castShadow position={[x, 0.22, z]}>
          <boxGeometry args={[0.16, 0.5, 0.16]} />
        </mesh>
      ))}

      {/* Weathered Wooden Farm Crates */}
      <group position={[-1.0, 0.85, 0]}>
        {/* Crate Base & Slats */}
        <mesh material={MAT.woodLight} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.55, 1.0]} />
        </mesh>
        {/* Hollow interior visual */}
        <mesh material={MAT.woodDark} position={[0, 0.1, 0]}>
          <boxGeometry args={[1.25, 0.45, 0.85]} />
        </mesh>
        {/* Sorted Produce in Crate */}
        <mesh material={MAT.tomato} castShadow position={[-0.3, 0.3, 0]}>
          <sphereGeometry args={[0.2, 6, 6]} />
        </mesh>
        <mesh material={MAT.fruitOrange} castShadow position={[0.3, 0.3, 0]}>
          <sphereGeometry args={[0.2, 6, 6]} />
        </mesh>
      </group>

      {/* Second Crate on Ground */}
      <group position={[1.4, 0.28, 0.8]} rotation={[0, 0.25, 0]}>
        <mesh material={MAT.woodDark} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.5, 0.9]} />
        </mesh>
      </group>

      {/* Traditional Brass / Iron Balance Weighing Scale (Mandi Taraju) */}
      <group position={[0.9, 0.95, -0.1]}>
        {/* Center Support Stand */}
        <mesh material={MAT.ironBrass} castShadow position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.04, 0.08, 0.9, 6]} />
        </mesh>
        {/* Base Plate */}
        <mesh material={MAT.ironBrass} castShadow position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.08, 8]} />
        </mesh>
        {/* Horizontal Beam */}
        <mesh material={MAT.ironBrass} castShadow position={[0, 0.88, 0]} rotation={[0, 0, 0.06]}>
          <boxGeometry args={[1.4, 0.04, 0.04]} />
        </mesh>
        {/* Left Pan */}
        <group position={[-0.6, 0.5, 0]}>
          <mesh material={MAT.ironBrass} castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.22, 0.06, 8]} />
          </mesh>
          {/* Weights */}
          <mesh material={MAT.metal} castShadow position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.08, 0.09, 0.1, 6]} />
          </mesh>
        </group>
        {/* Right Pan with Tomatoes */}
        <group position={[0.6, 0.58, 0]}>
          <mesh material={MAT.ironBrass} castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.22, 0.06, 8]} />
          </mesh>
          <mesh material={MAT.tomato} castShadow position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.1, 5, 5]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * CHAPTER 4: The Local Market Stall (Mandi / Bazaar)
 */
export function MarketStallModel({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Wooden Market Stall Frame */}
      {/* 4 Corner Posts */}
      {[
        [-1.8, -1.2],
        [1.8, -1.2],
        [-1.8, 1.2],
        [1.8, 1.2],
      ].map(([x, z], idx) => (
        <mesh material={MAT.woodDark} key={idx} castShadow position={[x, 1.4, z]}>
          <cylinderGeometry args={[0.07, 0.08, 2.8, 5]} />
        </mesh>
      ))}

      {/* Slanted Awning Canopy (Striped Forest Green & Cream) */}
      <group position={[0, 2.8, 0]} rotation={[0.15, 0, 0]}>
        <mesh material={MAT.awningGreen} castShadow>
          <boxGeometry args={[4.2, 0.08, 3.0]} />
        </mesh>
        {/* Striped Accents */}
        {[-1.4, -0.7, 0, 0.7, 1.4].map((x, idx) => (
          <mesh material={MAT.awningCream} key={idx} position={[x, 0.05, 0]}>
            <boxGeometry args={[0.35, 0.03, 3.02]} />
          </mesh>
        ))}
      </group>

      {/* Main Vendor Display Table */}
      <mesh material={MAT.woodLight} receiveShadow position={[0, 0.85, 0.2]}>
        <boxGeometry args={[3.6, 0.15, 1.6]} />
      </mesh>

      {/* Produce Pyramids in Trays */}
      <group position={[-1.0, 1.05, 0.2]}>
        <mesh material={MAT.tomato} castShadow>
          <coneGeometry args={[0.4, 0.45, 6]} />
        </mesh>
      </group>

      <group position={[0, 1.05, 0.2]}>
        <mesh material={MAT.fruitOrange} castShadow>
          <coneGeometry args={[0.38, 0.42, 6]} />
        </mesh>
      </group>

      <group position={[1.0, 1.05, 0.2]}>
        <mesh material={MAT.cabbage} castShadow>
          <coneGeometry args={[0.42, 0.45, 6]} />
        </mesh>
      </group>

      {/* Chalkboard Rate Slate */}
      <group position={[-1.7, 1.8, 0.8]} rotation={[0, 0.3, 0]}>
        <mesh material={MAT.woodDark} castShadow>
          <boxGeometry args={[0.65, 0.9, 0.05]} />
        </mesh>
        <mesh material={MAT.chalkboard} position={[0, 0, 0.03]}>
          <boxGeometry args={[0.55, 0.78, 0.02]} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * CHAPTER 5: The Consumer's Table (Kitchen / Dining Moment)
 */
export function ConsumersTableModel({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Solid Oak Kitchen Table */}
      <mesh material={MAT.woodLight} receiveShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[3.2, 0.12, 2.0]} />
      </mesh>

      {/* Table Legs */}
      {[
        [-1.4, -0.8],
        [1.4, -0.8],
        [-1.4, 0.8],
        [1.4, 0.8],
      ].map(([x, z], idx) => (
        <mesh material={MAT.woodDark} key={idx} castShadow position={[x, 0.35, z]}>
          <cylinderGeometry args={[0.07, 0.09, 0.72, 6]} />
        </mesh>
      ))}

      {/* Linen Table Runner */}
      <mesh material={MAT.runnerLinen} receiveShadow position={[0, 0.82, 0]}>
        <boxGeometry args={[1.0, 0.02, 2.04]} />
      </mesh>

      {/* Hand-thrown Ceramic Serving Bowl */}
      <group position={[0, 0.95, 0]}>
        <mesh material={MAT.ceramicWhite} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.32, 0.22, 10]} />
        </mesh>
        {/* Fresh Salad & Tomatoes in Bowl */}
        <mesh material={MAT.leafGreen} castShadow position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.38, 7, 7]} />
        </mesh>
        <mesh material={MAT.tomato} castShadow position={[-0.1, 0.22, 0.1]}>
          <sphereGeometry args={[0.12, 6, 6]} />
        </mesh>
        <mesh material={MAT.fruitOrange} castShadow position={[0.12, 0.24, -0.08]}>
          <sphereGeometry args={[0.11, 6, 6]} />
        </mesh>
      </group>

      {/* Terracotta Water Jug */}
      <group position={[0.85, 1.05, -0.4]}>
        <mesh material={MAT.basket} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.5, 8]} />
        </mesh>
        <mesh material={MAT.basket} castShadow position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.16, 8]} />
        </mesh>
      </group>

      {/* Ceramic Tumbler / Cup */}
      <mesh material={MAT.ceramicWhite} castShadow position={[0.85, 0.94, 0.3]}>
        <cylinderGeometry args={[0.1, 0.08, 0.2, 8]} />
      </mesh>

      {/* Wooden Dining Chairs */}
      {[-1.2, 1.2].map((z, idx) => (
        <group key={idx} position={[0, 0, z]} rotation={[0, idx === 0 ? 0 : Math.PI, 0]}>
          {/* Seat */}
          <mesh material={MAT.woodLight} castShadow position={[0, 0.45, 0]}>
            <boxGeometry args={[0.8, 0.08, 0.8]} />
          </mesh>
          {/* Backrest */}
          <mesh material={MAT.woodDark} castShadow position={[0, 0.9, -0.35]}>
            <boxGeometry args={[0.75, 0.85, 0.08]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
