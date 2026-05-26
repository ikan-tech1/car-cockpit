import type { IgnitionPhase } from "@/lib/types/car";

export interface IgnitionContext {
  phase: IgnitionPhase;
  footBrake: boolean;
  engineRunning: boolean;
}

export function canToggleIgnition(ctx: IgnitionContext): boolean {
  if (!ctx.footBrake) return false;
  return (
    ctx.phase === "access_granted" ||
    ctx.phase === "ignition_on" ||
    ctx.phase === "engine_running"
  );
}

export function nextIgnitionPhase(
  phase: IgnitionPhase,
  footBrake: boolean,
): IgnitionPhase | null {
  if (!footBrake) return null;

  switch (phase) {
    case "access_granted":
    case "ignition_on":
      return "cranking";
    case "engine_running":
      return "shutting_down";
    default:
      return null;
  }
}

export function advanceCrankPhase(phase: IgnitionPhase): IgnitionPhase {
  if (phase === "cranking") return "engine_running";
  if (phase === "shutting_down") return "ignition_on";
  return phase;
}

export function isEngineRunning(phase: IgnitionPhase): boolean {
  return phase === "engine_running" || phase === "cranking";
}

export function ignitionAllowsElectronics(phase: IgnitionPhase): boolean {
  return phase !== "parked_off";
}
