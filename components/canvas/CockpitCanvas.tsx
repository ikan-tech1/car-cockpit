"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, SSAO } from "@react-three/postprocessing";
import { InteriorScene } from "@/components/interior/InteriorScene";
import { useCockpitStore } from "@/stores/cockpitStore";

function PostEffects() {
  const degrade = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);

  if (degrade) return null;

  return (
    <EffectComposer multisampling={0}>
      <SSAO intensity={12} radius={0.08} luminanceInfluence={0.4} />
      <Bloom intensity={0.25} luminanceThreshold={0.85} luminanceSmoothing={0.2} />
    </EffectComposer>
  );
}

export function CockpitCanvas() {
  const setLoadingProgress = useCockpitStore((s) => s.setLoadingProgress);
  const loaded = useCockpitStore((s) => s.loaded);

  useEffect(() => {
    setLoadingProgress(40);
    const t = window.setTimeout(() => setLoadingProgress(100), 600);
    return () => window.clearTimeout(t);
  }, [setLoadingProgress]);

  return (
    <div className="absolute inset-0 bg-[#060608]">
      <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <color attach="background" args={["#060608"]} />
        <fog attach="fog" args={["#060608", 2, 8]} />
        <Suspense fallback={null}>
          {loaded ? <InteriorScene /> : null}
        </Suspense>
        <PostEffects />
      </Canvas>
    </div>
  );
}
