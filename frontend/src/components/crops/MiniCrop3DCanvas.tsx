"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MiniCrop3DCanvasProps {
  cropName: string;
  className?: string;
}

function LowPolyCropMesh({ cropName }: { cropName: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prevPointer, setPrevPointer] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0.2, y: 0.4 });

  // Slow idle rotation when not dragging
  useFrame((_, delta) => {
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  const handlePointerDown = (e: any) => {
    setIsDragging(true);
    setPrevPointer({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: any) => {
    if (isDragging && meshRef.current) {
      const deltaX = e.clientX - prevPointer.x;
      const deltaY = e.clientY - prevPointer.y;
      meshRef.current.rotation.y += deltaX * 0.02;
      meshRef.current.rotation.x += deltaY * 0.02;
      setPrevPointer({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const isTomato = cropName.toLowerCase().includes("tomato");
  const isChilli = cropName.toLowerCase().includes("chilli");
  const isOnion = cropName.toLowerCase().includes("onion");
  const isCapsicum = cropName.toLowerCase().includes("bell") || cropName.toLowerCase().includes("capsicum") || cropName.toLowerCase().includes("mirch");

  return (
    <group
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {isTomato ? (
        // Tomato model
        <group>
          <mesh castShadow>
            <sphereGeometry args={[1.0, 7, 7]} />
            <meshLambertMaterial color="#C83E25" flatShading />
          </mesh>
          {/* Stem */}
          <mesh position={[0, 1.05, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.35, 5]} />
            <meshLambertMaterial color="#2E5C35" flatShading />
          </mesh>
          {/* Calyx Leaves */}
          {[-0.6, 0, 0.6].map((rot, i) => (
            <mesh key={i} position={[0, 0.98, 0]} rotation={[0, rot * 2, 0.4]}>
              <boxGeometry args={[0.5, 0.04, 0.16]} />
              <meshLambertMaterial color="#4A7C45" flatShading />
            </mesh>
          ))}
        </group>
      ) : isChilli ? (
        // Chilli model
        <group rotation={[0.4, 0, -0.2]}>
          <mesh castShadow position={[0, 0, 0]}>
            <coneGeometry args={[0.45, 2.2, 6]} />
            <meshLambertMaterial color="#B82416" flatShading />
          </mesh>
          <mesh position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.4, 5]} />
            <meshLambertMaterial color="#2E5C35" flatShading />
          </mesh>
        </group>
      ) : isCapsicum ? (
        // Capsicum model
        <group>
          <mesh castShadow>
            <boxGeometry args={[1.2, 1.4, 1.2]} />
            <meshLambertMaterial color="#387A3E" flatShading />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 0.4, 5]} />
            <meshLambertMaterial color="#224A26" flatShading />
          </mesh>
        </group>
      ) : isOnion ? (
        // Onion model
        <group>
          <mesh castShadow>
            <sphereGeometry args={[0.95, 8, 8]} />
            <meshLambertMaterial color="#9B3A5A" flatShading />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <coneGeometry args={[0.2, 0.6, 6]} />
            <meshLambertMaterial color="#4A6C35" flatShading />
          </mesh>
        </group>
      ) : (
        // Wheat / Grain Sheaf default
        <group>
          <mesh castShadow position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.15, 0.18, 1.8, 6]} />
            <meshLambertMaterial color="#D8A845" flatShading />
          </mesh>
          <mesh castShadow position={[0, 0.9, 0]}>
            <coneGeometry args={[0.35, 1.0, 6]} />
            <meshLambertMaterial color="#E8BE65" flatShading />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function MiniCrop3DCanvas({ cropName, className = "" }: MiniCrop3DCanvasProps) {
  return (
    <div className={`w-full h-full cursor-grab active:cursor-grabbing ${className}`}>
      <Canvas
        camera={{ position: [0, 0.8, 3.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} color="#FFF8ED" />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#FFE6B8" />
        <directionalLight position={[-4, 2, -4]} intensity={0.4} color="#D5C5A5" />
        <LowPolyCropMesh cropName={cropName} />
      </Canvas>
    </div>
  );
}
