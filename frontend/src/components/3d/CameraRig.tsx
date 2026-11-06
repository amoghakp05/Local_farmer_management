"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

interface CameraRigProps {
  scrollProgress: number; // 0 to 1
  mousePos: { x: number; y: number };
}

export function CameraRig({ scrollProgress, mousePos }: CameraRigProps) {
  const { camera } = useThree();
  const currentProgressRef = useRef(0);
  const lookAtTargetRef = useRef(new THREE.Vector3(0, 0.8, 0));

  // 1. Camera Trajectory Spline (5 Chapters)
  const cameraSpline = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.4, 7.5),     // Chapter 1: Field
      new THREE.Vector3(2.4, 1.9, -10.5),  // Chapter 2: Harvest Basket
      new THREE.Vector3(-2.6, 2.0, -25.0), // Chapter 3: Crate & Scales
      new THREE.Vector3(2.8, 2.4, -40.5),  // Chapter 4: Market Stall
      new THREE.Vector3(0.0, 2.2, -56.5),  // Chapter 5: Consumer Table
    ]);
  }, []);

  // 2. Camera Focus Look-At Spline
  const lookAtSpline = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.9, 0),        // Looking at field crops
      new THREE.Vector3(0, 0.8, -14),      // Looking at harvest basket
      new THREE.Vector3(0, 1.0, -28),      // Looking at sorting crates
      new THREE.Vector3(0, 1.4, -44),      // Looking at mandi stall
      new THREE.Vector3(0, 0.9, -60),      // Looking at dining bowl
    ]);
  }, []);

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta || 0.016, 0.1);

    // Damped progression along spline
    const targetP = THREE.MathUtils.clamp(scrollProgress, 0, 1);
    currentProgressRef.current = THREE.MathUtils.damp(
      currentProgressRef.current,
      targetP,
      6,
      safeDelta
    );

    const t = currentProgressRef.current;

    // Sample camera spline point & look-at point
    const baseCamPos = cameraSpline.getPointAt(t);
    const targetLookAt = lookAtSpline.getPointAt(t);

    // Subtle idle floating breeze on hero (when scroll is near top)
    const isHeroIdle = t < 0.08;
    const idleY = isHeroIdle
      ? Math.sin(state.clock.getElapsedTime() * 1.2) * 0.08
      : 0;

    // Mouse parallax offsets
    const parallaxX = mousePos.x * 0.45;
    const parallaxY = mousePos.y * 0.25;

    // Apply combined position with gentle damp
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      baseCamPos.x + parallaxX,
      5,
      safeDelta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      baseCamPos.y + idleY - parallaxY,
      5,
      safeDelta
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      baseCamPos.z,
      5,
      safeDelta
    );

    // Interpolate lookAt target
    lookAtTargetRef.current.lerp(targetLookAt, 0.1);
    camera.lookAt(lookAtTargetRef.current);
  });

  return null;
}
