"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { InteractableMesh } from "@/components/interior/InteractableMesh";
import { useCockpitStore } from "@/stores/cockpitStore";

const LEATHER = "#1a1410";
const DASH = "#0f0f12";
const CHROME = "#b8b8bc";
const PCM_GLOW = "#1c3d5a";

function SteeringWheel() {
  return (
    <group position={[0, 0.95, -0.35]} rotation={[0.35, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.22, 0.025, 16, 48]} />
        <meshStandardMaterial color={LEATHER} roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[0.04, 0.12, 0.03]} />
        <meshStandardMaterial color={LEATHER} roughness={0.55} />
      </mesh>
    </group>
  );
}

function DashboardShell() {
  return (
    <group>
      <mesh position={[0, 0.78, -0.55]} receiveShadow>
        <boxGeometry args={[1.6, 0.35, 0.45]} />
        <meshStandardMaterial color={DASH} roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.72, -0.28]} name="cluster_display">
        <boxGeometry args={[0.55, 0.18, 0.02]} />
        <meshStandardMaterial
          color="#050508"
          emissive="#0a2a44"
          emissiveIntensity={0.35}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.42, 0.68, -0.26]} name="pcm_display">
        <boxGeometry args={[0.38, 0.22, 0.02]} />
        <meshStandardMaterial
          color="#040406"
          emissive={PCM_GLOW}
          emissiveIntensity={0.4}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

function CenterConsole() {
  const gear = useCockpitStore((s) => s.gear);
  const pasmMode = useCockpitStore((s) => s.pasmMode);
  const sportPlus = useCockpitStore((s) => s.sportPlus);

  return (
    <group position={[0.12, 0.55, -0.05]}>
      <mesh>
        <boxGeometry args={[0.22, 0.12, 0.35]} />
        <meshStandardMaterial color={DASH} roughness={0.4} />
      </mesh>
      <InteractableMesh
        name="pdk_selector"
        position={[0, 0.08, 0.02]}
        geometry={<cylinderGeometry args={[0.045, 0.045, 0.08, 24]} />}
        material={
          <meshStandardMaterial color={CHROME} metalness={0.85} roughness={0.2} />
        }
        rotation={[0, (["P", "R", "N", "D"].indexOf(gear) * Math.PI) / 2, 0]}
      />
      <Html position={[0, 0.16, 0]} center distanceFactor={1.8} transform>
        <div className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white">
          {gear}
        </div>
      </Html>
      <InteractableMesh
        name="sport_plus"
        position={[-0.06, 0.02, 0.12]}
        geometry={<boxGeometry args={[0.05, 0.02, 0.03]} />}
        material={
          <meshStandardMaterial
            color={sportPlus ? "#c41e3a" : "#333"}
            emissive={sportPlus ? "#801020" : "#000"}
            emissiveIntensity={sportPlus ? 0.6 : 0}
          />
        }
      />
      <InteractableMesh
        name="pasm_button"
        position={[0.06, 0.02, 0.12]}
        geometry={<boxGeometry args={[0.05, 0.02, 0.03]} />}
        material={
          <meshStandardMaterial
            color="#2a2a30"
            emissive="#1a3040"
            emissiveIntensity={pasmMode !== "Normal" ? 0.5 : 0.1}
          />
        }
      />
      <InteractableMesh
        name="hvac_temp_l"
        position={[-0.07, -0.02, -0.08]}
        geometry={<boxGeometry args={[0.04, 0.025, 0.025]} />}
        material={<meshStandardMaterial color="#222" />}
      />
      <InteractableMesh
        name="hvac_fan"
        position={[0.07, -0.02, -0.08]}
        geometry={<boxGeometry args={[0.04, 0.025, 0.025]} />}
        material={<meshStandardMaterial color="#222" />}
      />
    </group>
  );
}

function IgnitionAndStalks() {
  return (
    <group>
      <InteractableMesh
        name="ignition_button"
        position={[-0.28, 0.82, -0.32]}
        geometry={<cylinderGeometry args={[0.025, 0.025, 0.015, 24]} />}
        material={
          <meshStandardMaterial
            color="#111"
            emissive="#401010"
            emissiveIntensity={0.25}
            metalness={0.6}
          />
        }
        rotation={[Math.PI / 2, 0, 0]}
      />
      <InteractableMesh
        name="stalk_indicator_left"
        position={[-0.34, 0.88, -0.34]}
        geometry={<boxGeometry args={[0.02, 0.08, 0.02]} />}
        material={<meshStandardMaterial color="#111" />}
      />
      <InteractableMesh
        name="stalk_indicator_right"
        position={[0.34, 0.88, -0.34]}
        geometry={<boxGeometry args={[0.02, 0.08, 0.02]} />}
        material={<meshStandardMaterial color="#111" />}
      />
      <InteractableMesh
        name="stalk_wiper"
        position={[-0.38, 0.86, -0.28]}
        geometry={<boxGeometry args={[0.02, 0.1, 0.02]} />}
        material={<meshStandardMaterial color="#111" />}
      />
    </group>
  );
}

function Pedals() {
  const footBrake = useCockpitStore((s) => s.footBrake);
  const throttle = useCockpitStore((s) => s.throttle);

  return (
    <group position={[0, 0.18, 0.15]}>
      <InteractableMesh
        name="foot_brake"
        position={[-0.08, 0, 0]}
        geometry={<boxGeometry args={[0.07, 0.015, 0.12]} />}
        material={
          <meshStandardMaterial
            color={footBrake ? "#555" : "#222"}
            emissive={footBrake ? "#224422" : "#000"}
            emissiveIntensity={footBrake ? 0.3 : 0}
          />
        }
        rotation={[footBrake ? 0.25 : 0.05, 0, 0]}
      />
      <InteractableMesh
        name="throttle_pedal"
        position={[0.08, 0, 0]}
        geometry={<boxGeometry args={[0.06, 0.012, 0.1]} />}
        material={
          <meshStandardMaterial
            color={throttle > 0.1 ? "#666" : "#222"}
            emissive={throttle > 0.1 ? "#442222" : "#000"}
            emissiveIntensity={throttle > 0.1 ? 0.25 : 0}
          />
        }
        rotation={[throttle > 0.1 ? 0.2 : 0.04, 0, 0]}
      />
    </group>
  );
}

function CockpitShell() {
  return (
    <group>
      <mesh position={[0, 0.45, 0.1]} receiveShadow>
        <boxGeometry args={[1.7, 0.05, 1.4]} />
        <meshStandardMaterial color="#141418" roughness={0.8} />
      </mesh>
      <mesh position={[-0.75, 0.65, 0]} rotation={[0, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.6, 1.2]} />
        <meshStandardMaterial color={LEATHER} roughness={0.65} />
      </mesh>
      <mesh position={[0.75, 0.65, 0]} rotation={[0, -0.15, 0]}>
        <boxGeometry args={[0.08, 0.6, 1.2]} />
        <meshStandardMaterial color={LEATHER} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.55, 0.55]}>
        <boxGeometry args={[1.5, 0.5, 0.06]} />
        <meshStandardMaterial color="#101014" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function ProxyInterior() {
  return (
    <group>
      <CockpitShell />
      <DashboardShell />
      <SteeringWheel />
      <CenterConsole />
      <IgnitionAndStalks />
      <Pedals />
    </group>
  );
}

function GlbInterior({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  const groupRef = useRef<THREE.Group>(null);
  const [cloned] = useState(() => scene.clone(true));

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
    </group>
  );
}

export function InteriorModel({
  modelType,
  modelPath,
}: {
  modelType: "proxy" | "glb";
  modelPath: string | null;
}) {
  if (modelType === "glb" && modelPath) {
    return <GlbInterior path={modelPath} />;
  }
  return <ProxyInterior />;
}
