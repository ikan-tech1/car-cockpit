import type { CarEngineSpecs } from "@/lib/types/car";

export interface RpmSimulationInput {
  engineRunning: boolean;
  throttle: number;
  sportPlus: boolean;
  pasmMode: string;
  delta: number;
  specs: CarEngineSpecs;
}

export function simulateRpm(
  currentRpm: number,
  input: RpmSimulationInput,
): number {
  const { engineRunning, throttle, sportPlus, pasmMode, delta, specs } = input;
  const idle = specs.idleRpm;
  const redline = specs.redline;

  if (!engineRunning) {
    return Math.max(idle * 0.1, currentRpm - 1200 * delta);
  }

  let response = throttle > 0.05 ? 6.5 : 3.2;
  if (sportPlus) response *= 1.12;
  if (pasmMode === "Sport") response *= 1.06;
  if (pasmMode === "Sport Plus") response *= 1.12;

  const target = idle + throttle * (redline - idle);
  const next = currentRpm + (target - currentRpm) * response * delta;

  const friction = throttle > 0.02 ? 0 : 900 * delta;
  const rpm = Math.max(idle, next - friction);

  return Math.min(redline, rpm);
}

export function rpmToSpeedMph(rpm: number, gear: string): number {
  const gearRatios: Record<string, number> = {
    P: 0,
    R: 3.99,
    N: 0,
    D: 1.0,
  };
  const ratio = gearRatios[gear] ?? 0;
  if (ratio === 0) return 0;
  const wheelRpm = rpm / (ratio * 3.39);
  return Math.round(wheelRpm * 0.08);
}
