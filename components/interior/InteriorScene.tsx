"use client";

import { Suspense } from "react";
import { ContactShadows, Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { InteriorModel } from "@/components/interior/ProxyInterior";
import { SimulationLoop } from "@/components/interior/SimulationLoop";
import { useCockpitStore } from "@/stores/cockpitStore";

function InteriorLighting() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        castShadow
        intensity={0.8}
        position={[2, 4, 2]}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 1.2, -0.2]} intensity={0.5} color="#ffe8cc" />
      <pointLight position={[0.4, 0.9, -0.3]} intensity={0.35} color="#6ab4ff" />
      <spotLight
        position={[0, 1.5, 0.5]}
        angle={0.5}
        penumbra={0.8}
        intensity={0.4}
        color="#fff5e6"
      />
    </>
  );
}

function DriverCamera() {
  const cameraMode = useCockpitStore((s) => s.cameraMode);
  if (cameraMode !== "driver") return null;
  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 1.05, 0.35]}
      fov={68}
      near={0.1}
      far={50}
    />
  );
}

function ShowroomCamera() {
  const cameraMode = useCockpitStore((s) => s.cameraMode);
  if (cameraMode !== "showroom") return null;
  return (
    <>
      <PerspectiveCamera makeDefault position={[1.2, 1.4, 1.4]} fov={50} near={0.1} far={50} />
      <OrbitControls
        target={[0, 0.75, -0.2]}
        minDistance={0.8}
        maxDistance={3}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export function InteriorScene() {
  const manifest = useCockpitStore((s) => s.manifest);

  if (!manifest) return null;

  return (
    <>
      <DriverCamera />
      <ShowroomCamera />
      <InteriorLighting />
      <Environment preset="warehouse" environmentIntensity={0.35} />
      <Suspense fallback={null}>
        <InteriorModel
          modelType={manifest.model.type}
          modelPath={manifest.model.path}
        />
      </Suspense>
      <ContactShadows
        position={[0, 0.12, 0]}
        opacity={0.45}
        scale={4}
        blur={2.5}
        far={2}
      />
      <SimulationLoop />
    </>
  );
}
