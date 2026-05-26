"use client";

import { useFrame } from "@react-three/fiber";
import { engineAudio } from "@/lib/audio/LayeredEngineAudio";
import { isEngineRunning } from "@/lib/simulation/ignitionMachine";
import { rpmToSpeedMph, simulateRpm } from "@/lib/simulation/rpmModel";
import { useCockpitStore } from "@/stores/cockpitStore";

export function SimulationLoop() {
  useFrame((_, delta) => {
    const store = useCockpitStore.getState();
    const { specs, ignitionPhase, throttle, sportPlus, pasmMode, rpm, gear } = store;
    if (!specs) return;

    const running = isEngineRunning(ignitionPhase);
    const nextRpm = simulateRpm(rpm, {
      engineRunning: running,
      throttle,
      sportPlus,
      pasmMode,
      delta,
      specs: specs.engine,
    });

    if (Math.abs(nextRpm - rpm) > 0.5) {
      store.setRpm(nextRpm);
    }

    if (running) {
      engineAudio.updateEngine(nextRpm, throttle, specs.engine.redline, specs.engine.idleRpm);
    }

    store.tickSportChrono(delta * 1000);

    if (running && gear === "D" && throttle > 0.1) {
      const speed = rpmToSpeedMph(nextRpm, gear);
      if (speed > 0) {
        useCockpitStore.setState({ hint: `${speed} mph · ${Math.round(nextRpm)} rpm` });
      }
    }
  });

  return null;
}
