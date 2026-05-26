import { engineAudio } from "@/lib/audio/LayeredEngineAudio";
import {
  advanceCrankPhase,
  canToggleIgnition,
  nextIgnitionPhase,
} from "@/lib/simulation/ignitionMachine";
import type { Gear, InteractionDef } from "@/lib/types/car";
import type { CockpitStore } from "@/stores/cockpitStore";

export function executeInteractionAction(
  meshName: string,
  interaction: InteractionDef,
  store: CockpitStore,
): void {
  const action = interaction.action;

  switch (action) {
    case "ignition.toggle":
      handleIgnitionToggle(store);
      break;
    case "brake.set":
      store.setFootBrake(true);
      break;
    case "throttle.set":
      store.setThrottle(1);
      break;
    case "transmission.setGear":
      cycleGear(store);
      break;
    case "driveMode.setSportPlus":
      store.toggleSportPlus();
      engineAudio.playUiSound("click");
      break;
    case "pasm.cycle":
      store.cyclePasm();
      engineAudio.playUiSound("click");
      break;
    case "indicators.toggleLeft":
      store.toggleIndicatorLeft();
      engineAudio.playUiSound("indicator");
      break;
    case "indicators.toggleRight":
      store.toggleIndicatorRight();
      engineAudio.playUiSound("indicator");
      break;
    case "wipers.cycle":
      store.cycleWipers();
      engineAudio.playUiSound("wiper");
      break;
    case "hvac.cycleTempDriver":
      store.cycleHvacTemp();
      engineAudio.playUiSound("click");
      break;
    case "hvac.cycleFan":
      store.cycleHvacFan();
      engineAudio.playUiSound("click");
      break;
    default:
      console.warn(`Unhandled interaction on ${meshName}: ${action}`);
  }
}

function handleIgnitionToggle(store: CockpitStore): void {
  const { ignitionPhase, footBrake } = store;
  if (!canToggleIgnition({ phase: ignitionPhase, footBrake, engineRunning: ignitionPhase === "engine_running" })) {
    engineAudio.playUiSound("belt_chime");
    store.setHint("Hold Space (foot brake) to start the engine.");
    return;
  }

  const next = nextIgnitionPhase(ignitionPhase, footBrake);
  if (!next) return;

  engineAudio.playUiSound("click");
  if (next === "cranking") {
    store.beginCrank();
  } else if (next === "shutting_down") {
    store.beginShutdown();
  }
}

function cycleGear(store: CockpitStore): void {
  const order: Gear[] = ["P", "R", "N", "D"];
  const idx = order.indexOf(store.gear);
  const next = order[(idx + 1) % order.length];
  if (store.ignitionPhase === "engine_running" && next === "R" && store.rpm > 1200) {
    store.setHint("Shift to R only at low RPM.");
    engineAudio.playUiSound("belt_chime");
    return;
  }
  store.setGear(next);
  engineAudio.playUiSound("click");
}

export function completeTimedIgnitionTransition(store: CockpitStore): void {
  const next = advanceCrankPhase(store.ignitionPhase);
  if (next === "engine_running") {
    store.finishCrank();
  } else if (next === "ignition_on") {
    store.finishShutdown();
  }
}
