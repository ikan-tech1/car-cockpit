"use client";

import { useCockpitStore } from "@/stores/cockpitStore";

export function ControlsLegend() {
  const cameraMode = useCockpitStore((s) => s.cameraMode);
  const setCameraMode = useCockpitStore((s) => s.setCameraMode);
  const audioReady = useCockpitStore((s) => s.audioReady);

  return (
    <div className="pointer-events-auto absolute right-4 top-4 z-30 space-y-2">
      <div className="rounded-xl border border-white/10 bg-black/70 p-3 text-[11px] text-white/60 backdrop-blur">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-white/35">Controls</p>
        <ul className="space-y-1">
          <li><kbd className="text-white/80">Space</kbd> Foot brake</li>
          <li><kbd className="text-white/80">W</kbd> Throttle</li>
          <li><kbd className="text-white/80">I</kbd> Ignition</li>
          <li><kbd className="text-white/80">G</kbd> Cycle PDK</li>
          <li><kbd className="text-white/80">P</kbd> Sport Plus</li>
          <li><kbd className="text-white/80">M</kbd> PASM</li>
          <li>Click controls in 3D scene</li>
        </ul>
        {!audioReady && (
          <p className="mt-2 text-amber-300/80">Click anywhere to enable audio</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => setCameraMode(cameraMode === "driver" ? "showroom" : "driver")}
        className="w-full rounded-lg border border-white/10 bg-black/70 px-3 py-2 text-xs text-white/70 backdrop-blur hover:bg-white/10"
      >
        Camera: {cameraMode === "driver" ? "Driver seat" : "Showroom orbit"}
      </button>
    </div>
  );
}
