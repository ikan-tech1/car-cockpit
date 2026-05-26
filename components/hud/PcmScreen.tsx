"use client";

import { useCockpitStore } from "@/stores/cockpitStore";
import type { PcmRoute } from "@/lib/types/car";

const routes: { id: PcmRoute; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "nav", label: "Nav" },
  { id: "media", label: "Media" },
  { id: "vehicle", label: "Vehicle" },
  { id: "settings", label: "Settings" },
];

export function PcmScreen() {
  const specs = useCockpitStore((s) => s.specs);
  const pcmRoute = useCockpitStore((s) => s.pcmRoute);
  const setPcmRoute = useCockpitStore((s) => s.setPcmRoute);
  const ignitionPhase = useCockpitStore((s) => s.ignitionPhase);
  const hvacTemp = useCockpitStore((s) => s.hvacTemp);
  const hvacFan = useCockpitStore((s) => s.hvacFan);
  const wiperMode = useCockpitStore((s) => s.wiperMode);
  const sportPlus = useCockpitStore((s) => s.sportPlus);
  const pasmMode = useCockpitStore((s) => s.pasmMode);

  if (!specs || ignitionPhase === "parked_off") return null;

  return (
    <div className="pointer-events-auto absolute right-[16%] top-[28%] z-20 w-[24%] min-w-[200px]">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a1624]/90 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">
            PCM {specs.displays.pcmInches}&quot;
          </span>
          <span className="text-[10px] text-cyan-300/70">992.2</span>
        </div>

        <div className="flex gap-1 border-b border-white/5 px-2 py-1.5">
          {routes.map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => setPcmRoute(route.id)}
              className={`rounded px-2 py-1 text-[10px] transition ${
                pcmRoute === route.id
                  ? "bg-cyan-600/40 text-white"
                  : "text-white/40 hover:bg-white/5 hover:text-white/70"
              }`}
            >
              {route.label}
            </button>
          ))}
        </div>

        <div className="space-y-3 p-3 text-xs text-white/80">
          {pcmRoute === "home" && (
            <>
              <p className="text-sm font-medium text-white">
                {specs.make} {specs.model}
              </p>
              <p className="text-white/50">{specs.trim} · {specs.generation}</p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Stat label="Power" value={`${specs.engine.powerHp} hp`} />
                <Stat label="Torque" value={`${specs.engine.torqueLbFt} lb-ft`} />
                <Stat label="Engine" value={`${specs.engine.displacementL}L flat-6`} />
                <Stat label="Trans" value={specs.transmission.type} />
              </div>
            </>
          )}
          {pcmRoute === "nav" && (
            <p className="text-white/60">Navigation ready. Destination input simulated.</p>
          )}
          {pcmRoute === "media" && (
            <p className="text-white/60">Bose surround · Apple CarPlay · Digital radio</p>
          )}
          {pcmRoute === "vehicle" && (
            <div className="space-y-1.5">
              <Row label="PASM" value={pasmMode} />
              <Row label="Sport Plus" value={sportPlus ? "Active" : "Off"} />
              <Row label="Wipers" value={wiperMode} />
              <Row label="Climate" value={`${hvacTemp}°C · Fan ${hvacFan}`} />
            </div>
          )}
          {pcmRoute === "settings" && (
            <p className="text-white/60">PCM 6.0 layout · Voice control · Porsche Connect</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-white/5 px-2 py-1.5">
      <div className="text-[10px] text-white/40">{label}</div>
      <div className="font-mono text-[11px] text-cyan-100">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 py-1">
      <span className="text-white/40">{label}</span>
      <span>{value}</span>
    </div>
  );
}
