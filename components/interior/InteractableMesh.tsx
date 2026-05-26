"use client";

import { useRef, useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { executeInteractionAction } from "@/lib/interaction/executeAction";
import { useCockpitStore } from "@/stores/cockpitStore";

interface InteractableMeshProps {
  name: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  geometry: React.ReactNode;
  material: React.ReactNode;
  onPointerDownExtra?: () => void;
}

export function InteractableMesh({
  name,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  geometry,
  material,
  onPointerDownExtra,
}: InteractableMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const interactions = useCockpitStore((s) => s.interactions);
  const hoveredControl = useCockpitStore((s) => s.hoveredControl);
  const setHoveredControl = useCockpitStore((s) => s.setHoveredControl);
  const [localHover, setLocalHover] = useState(false);

  const interaction = interactions?.[name];
  const isHovered = hoveredControl === name || localHover;

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setLocalHover(true);
    setHoveredControl(name);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setLocalHover(false);
    setHoveredControl(null);
    document.body.style.cursor = "auto";
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!interaction) return;
    executeInteractionAction(name, interaction, useCockpitStore.getState());
    onPointerDownExtra?.();
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (name === "foot_brake") {
      useCockpitStore.getState().setFootBrake(false);
    }
    if (name === "throttle_pedal") {
      useCockpitStore.getState().setThrottle(0);
    }
  };

  return (
    <mesh
      ref={meshRef}
      name={name}
      position={position}
      rotation={rotation}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {geometry}
      {isHovered && interaction ? (
        <meshStandardMaterial
          color="#c9a962"
          emissive="#806830"
          emissiveIntensity={0.45}
          metalness={0.4}
          roughness={0.3}
        />
      ) : (
        material
      )}
    </mesh>
  );
}
