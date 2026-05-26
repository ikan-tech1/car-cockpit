"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { CockpitCanvas } from "@/components/canvas/CockpitCanvas";
import { InstrumentCluster } from "@/components/hud/InstrumentCluster";
import { PcmScreen } from "@/components/hud/PcmScreen";
import { ControlsLegend } from "@/components/ui/ControlsLegend";
import { InteractionHint } from "@/components/ui/InteractionHint";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SpecPanel } from "@/components/ui/SpecPanel";
import { loadCarBundle } from "@/lib/cars/loadCarManifest";
import { executeInteractionAction } from "@/lib/interaction/executeAction";
import { useCockpitStore } from "@/stores/cockpitStore";

export function CockpitExperience({ carSlug }: { carSlug: string }) {
  const loadCar = useCockpitStore((s) => s.loadCar);
  const initAudio = useCockpitStore((s) => s.initAudio);
  const interactions = useCockpitStore((s) => s.interactions);
  const manifest = useCockpitStore((s) => s.manifest);

  useEffect(() => {
    let cancelled = false;
    loadCarBundle(carSlug)
      .then((bundle) => {
        if (!cancelled) loadCar(bundle);
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [carSlug, loadCar]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const store = useCockpitStore.getState();
      if (!interactions) return;

      if (e.code === "Space") {
        e.preventDefault();
        store.setFootBrake(true);
      }
      if (e.code === "KeyW") {
        store.setThrottle(1);
      }
      if (e.code === "KeyI" && interactions.ignition_button) {
        executeInteractionAction("ignition_button", interactions.ignition_button, store);
      }
      if (e.code === "KeyG" && interactions.pdk_selector) {
        executeInteractionAction("pdk_selector", interactions.pdk_selector, store);
      }
      if (e.code === "KeyP" && interactions.sport_plus) {
        executeInteractionAction("sport_plus", interactions.sport_plus, store);
      }
      if (e.code === "KeyM" && interactions.pasm_button) {
        executeInteractionAction("pasm_button", interactions.pasm_button, store);
      }
    },
    [interactions],
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const store = useCockpitStore.getState();
    if (e.code === "Space") store.setFootBrake(false);
    if (e.code === "KeyW") store.setThrottle(0);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const enableAudio = useCallback(() => {
    void initAudio();
  }, [initAudio]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#060608]" onClick={enableAudio}>
      <LoadingScreen />
      <CockpitCanvas />
      <InstrumentCluster />
      <PcmScreen />
      <InteractionHint />
      <SpecPanel />
      <ControlsLegend />
      <header className="pointer-events-auto absolute left-4 top-4 z-30">
        <Link
          href="/"
          className="rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs text-white/60 backdrop-blur hover:text-white"
        >
          ← Garage
        </Link>
        {manifest && (
          <p className="mt-2 text-sm text-white/50">{manifest.tagline}</p>
        )}
      </header>
    </div>
  );
}
