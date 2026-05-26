"use client";

import { useCockpitStore } from "@/stores/cockpitStore";

function formatChrono(ms: number): string {
  const total = Math.floor(ms / 10);
  const mins = Math.floor(total / 6000);
  const secs = Math.floor((total % 6000) / 100);
  const cents = total % 100;
  return `${mins}:${secs.toString().padStart(2, "0")}.${cents.toString().padStart(2, "0")}`;
}

export function InstrumentCluster() {
  const specs = useCockpitStore((s) => s.specs);
  const rpm = useCockpitStore((s) => s.rpm);
  const gear = useCockpitStore((s) => s.gear);
  const ignitionPhase = useCockpitStore((s) => s.ignitionPhase);
  const sportPlus = useCockpitStore((s) => s.sportPlus);
  const pasmMode = useCockpitStore((s) => s.pasmMode);
  const indicatorLeft = useCockpitStore((s) => s.indicatorLeft);
  const indicatorRight = useCockpitStore((s) => s.indicatorRight);
  const sportChronoMs = useCockpitStore((s) => s.sportChronoMs);
  const chronoRunning = useCockpitStore((s) => s.chronoRunning);
  const electronicsOn = ignitionPhase !== "parked_off";

  if (!specs || !electronicsOn) return null;

  const redline = specs.engine.redline;
  const rpmPct = Math.min(100, (rpm / redline) * 100);
  const nearRedline = rpm > redline * 0.92;

  return (
    <div className="pointer-events-none absolute left-[18%] top-[22%] z-20 w-[28%] min-w-[220px]">
      <div className="rounded-xl border border-white/10 bg-black/75 p-4 backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/50">
          <span>992 Digital Cluster</span>
          <span>{specs.engine.type}</span>
        </div>

        <div className="relative mb-2 h-24 overflow-hidden rounded-lg bg-[#050508]">
          <div
            className={`absolute bottom-0 left-0 w-full origin-bottom bg-gradient-to-t ${
              nearRedline ? "from-red-600 to-orange-400" : "from-sky-700 to-cyan-300"
            } transition-all duration-75`}
            style={{ height: `${Math.max(4, rpmPct)}%` }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-mono text-4xl font-light tabular-nums ${nearRedline ? "text-red-300" : "text-white"}`}>
              {Math.round(rpm)}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">rpm</span>
          </div>
          <div className="absolute right-2 top-2 font-mono text-[10px] text-red-400/80">
            {redline}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded bg-white/5 py-2">
            <div className="text-white/40">Gear</div>
            <div className="font-mono text-xl text-white">{gear}</div>
          </div>
          <div className="rounded bg-white/5 py-2">
            <div className="text-white/40">PASM</div>
            <div className="text-[11px] font-medium text-cyan-200">{pasmMode}</div>
          </div>
          <div className="rounded bg-white/5 py-2">
            <div className="text-white/40">Sport+</div>
            <div className={sportPlus ? "text-red-400" : "text-white/30"}>
              {sportPlus ? "ON" : "OFF"}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span className={indicatorLeft ? "text-green-400" : "text-white/20"}>◀ LEFT</span>
          <button
            type="button"
            className="pointer-events-auto rounded bg-white/10 px-2 py-1 text-[10px] text-white/70 hover:bg-white/20"
            onClick={() => useCockpitStore.getState().toggleSportChrono()}
          >
            Chrono {chronoRunning ? "■" : "▶"} {formatChrono(sportChronoMs)}
          </button>
          <span className={indicatorRight ? "text-green-400" : "text-white/20"}>RIGHT ▶</span>
        </div>
      </div>
    </div>
  );
}
