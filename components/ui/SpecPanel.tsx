"use client";

import { useState } from "react";
import { useCockpitStore } from "@/stores/cockpitStore";

export function SpecPanel() {
  const specs = useCockpitStore((s) => s.specs);
  const manifest = useCockpitStore((s) => s.manifest);
  const [open, setOpen] = useState(false);

  if (!specs || !manifest) return null;

  return (
    <div className="pointer-events-auto absolute bottom-4 left-4 z-30 max-w-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-lg border border-white/10 bg-black/70 px-3 py-2 text-xs text-white/80 backdrop-blur hover:bg-black/85"
      >
        {open ? "Hide" : "Show"} specs · {manifest.name}
      </button>
      {open && (
        <div className="mt-2 rounded-xl border border-white/10 bg-black/80 p-4 text-xs text-white/75 backdrop-blur-md">
          <h3 className="mb-2 text-sm font-medium text-white">
            {specs.make} {specs.model} ({specs.generation})
          </h3>
          <ul className="space-y-1.5">
            <li>Engine: {specs.engine.displacementL}L {specs.engine.type}</li>
            <li>Power: {specs.engine.powerHp} hp @ {specs.engine.powerRpm.toLocaleString()} rpm</li>
            <li>Torque: {specs.engine.torqueLbFt} lb-ft ({specs.engine.torqueRpmRange[0]}–{specs.engine.torqueRpmRange[1]} rpm)</li>
            <li>Redline: {specs.engine.redline.toLocaleString()} rpm</li>
            <li>Transmission: {specs.transmission.gears}-speed {specs.transmission.type}</li>
            <li>Cluster: {specs.displays.clusterInches}&quot; digital · PCM: {specs.displays.pcmInches}&quot;</li>
          </ul>
          <p className="mt-3 text-[10px] text-white/35">{specs.source}</p>
        </div>
      )}
    </div>
  );
}
