"use client";

import { useCockpitStore } from "@/stores/cockpitStore";

export function InteractionHint() {
  const hoveredControl = useCockpitStore((s) => s.hoveredControl);
  const interactions = useCockpitStore((s) => s.interactions);
  const hint = useCockpitStore((s) => s.hint);

  const hoverLabel =
    hoveredControl && interactions?.[hoveredControl]
      ? interactions[hoveredControl].label
      : null;

  return (
    <div className="pointer-events-none absolute bottom-24 left-1/2 z-30 -translate-x-1/2 text-center">
      {hoverLabel && (
        <div className="mb-2 rounded-full border border-amber-500/30 bg-black/70 px-4 py-1.5 text-sm text-amber-100 backdrop-blur">
          {hoverLabel}
        </div>
      )}
      {hint && (
        <div className="rounded-lg bg-black/60 px-4 py-2 text-xs text-white/60 backdrop-blur">
          {hint}
        </div>
      )}
    </div>
  );
}
