"use client";

import { useCockpitStore } from "@/stores/cockpitStore";

export function LoadingScreen() {
  const progress = useCockpitStore((s) => s.loadingProgress);
  const loaded = useCockpitStore((s) => s.loaded);
  const manifest = useCockpitStore((s) => s.manifest);

  if (loaded && progress >= 100) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#060608]">
      <div className="mb-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">Loading cockpit</p>
        <h2 className="mt-2 text-xl font-light text-white">
          {manifest?.name ?? "Porsche 911 Carrera (992)"}
        </h2>
      </div>
      <div className="h-1 w-56 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-cyan-600 to-amber-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 font-mono text-xs text-white/40">{progress}%</p>
    </div>
  );
}
