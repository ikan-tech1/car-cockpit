import { create } from "zustand";
import { engineAudio } from "@/lib/audio/LayeredEngineAudio";
import type {
  CameraMode,
  CarBundle,
  Gear,
  IgnitionPhase,
  InteractionDef,
  PasmMode,
  PcmRoute,
} from "@/lib/types/car";

export interface CockpitStore {
  carSlug: string | null;
  specs: CarBundle["specs"] | null;
  interactions: Record<string, InteractionDef> | null;
  manifest: CarBundle["manifest"] | null;
  loaded: boolean;
  loadingProgress: number;

  ignitionPhase: IgnitionPhase;
  rpm: number;
  throttle: number;
  footBrake: boolean;
  gear: Gear;
  sportPlus: boolean;
  pasmMode: PasmMode;
  indicatorLeft: boolean;
  indicatorRight: boolean;
  wiperMode: "Off" | "Auto" | "Low" | "High";
  hvacTemp: number;
  hvacFan: number;
  hoveredControl: string | null;
  hint: string | null;
  cameraMode: CameraMode;
  pcmRoute: PcmRoute;
  sportChronoMs: number;
  chronoRunning: boolean;
  audioReady: boolean;

  loadCar: (bundle: CarBundle) => void;
  setLoadingProgress: (value: number) => void;
  setHoveredControl: (name: string | null) => void;
  setHint: (hint: string | null) => void;
  setCameraMode: (mode: CameraMode) => void;
  setFootBrake: (pressed: boolean) => void;
  setThrottle: (value: number) => void;
  setRpm: (rpm: number) => void;
  setGear: (gear: Gear) => void;
  toggleSportPlus: () => void;
  cyclePasm: () => void;
  toggleIndicatorLeft: () => void;
  toggleIndicatorRight: () => void;
  cycleWipers: () => void;
  cycleHvacTemp: () => void;
  cycleHvacFan: () => void;
  setPcmRoute: (route: PcmRoute) => void;
  toggleSportChrono: () => void;
  tickSportChrono: (deltaMs: number) => void;
  beginCrank: () => void;
  finishCrank: () => void;
  beginShutdown: () => void;
  finishShutdown: () => void;
  initAudio: () => Promise<void>;
}

const pasmOrder: PasmMode[] = ["Normal", "Sport", "Sport Plus"];
const wiperOrder = ["Off", "Auto", "Low", "High"] as const;

export const useCockpitStore = create<CockpitStore>((set, get) => ({
  carSlug: null,
  specs: null,
  interactions: null,
  manifest: null,
  loaded: false,
  loadingProgress: 0,

  ignitionPhase: "access_granted",
  rpm: 0,
  throttle: 0,
  footBrake: false,
  gear: "P",
  sportPlus: false,
  pasmMode: "Normal",
  indicatorLeft: false,
  indicatorRight: false,
  wiperMode: "Off",
  hvacTemp: 21,
  hvacFan: 2,
  hoveredControl: null,
  hint: null,
  cameraMode: "driver",
  pcmRoute: "home",
  sportChronoMs: 0,
  chronoRunning: false,
  audioReady: false,

  loadCar: (bundle) =>
    set({
      carSlug: bundle.manifest.slug,
      specs: bundle.specs,
      interactions: bundle.interactions,
      manifest: bundle.manifest,
      loaded: true,
      loadingProgress: 100,
      ignitionPhase: "access_granted",
      rpm: 0,
      gear: "P",
      hint: "Hold Space for brake, click ignition or press I to start.",
    }),

  setLoadingProgress: (value) => set({ loadingProgress: value }),
  setHoveredControl: (name) => set({ hoveredControl: name }),
  setHint: (hint) => set({ hint }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setFootBrake: (pressed) => set({ footBrake: pressed }),
  setThrottle: (value) => set({ throttle: Math.max(0, Math.min(1, value)) }),
  setRpm: (rpm) => set({ rpm }),
  setGear: (gear) => set({ gear }),
  toggleSportPlus: () => set((s) => ({ sportPlus: !s.sportPlus })),
  cyclePasm: () =>
    set((s) => {
      const idx = pasmOrder.indexOf(s.pasmMode);
      return { pasmMode: pasmOrder[(idx + 1) % pasmOrder.length] };
    }),
  toggleIndicatorLeft: () =>
    set((s) => ({
      indicatorLeft: !s.indicatorLeft,
      indicatorRight: s.indicatorLeft ? s.indicatorRight : false,
    })),
  toggleIndicatorRight: () =>
    set((s) => ({
      indicatorRight: !s.indicatorRight,
      indicatorLeft: s.indicatorRight ? s.indicatorLeft : false,
    })),
  cycleWipers: () =>
    set((s) => {
      const idx = wiperOrder.indexOf(s.wiperMode);
      return { wiperMode: wiperOrder[(idx + 1) % wiperOrder.length] };
    }),
  cycleHvacTemp: () => set((s) => ({ hvacTemp: s.hvacTemp >= 28 ? 16 : s.hvacTemp + 1 })),
  cycleHvacFan: () => set((s) => ({ hvacFan: s.hvacFan >= 7 ? 1 : s.hvacFan + 1 })),
  setPcmRoute: (route) => set({ pcmRoute: route }),
  toggleSportChrono: () =>
    set((s) => ({
      chronoRunning: !s.chronoRunning,
      sportChronoMs: s.chronoRunning ? s.sportChronoMs : 0,
    })),
  tickSportChrono: (deltaMs) =>
    set((s) =>
      s.chronoRunning ? { sportChronoMs: s.sportChronoMs + deltaMs } : s,
    ),

  beginCrank: () => {
    set({ ignitionPhase: "cranking", hint: "Cranking flat-6…" });
    void engineAudio.playCrank().then(() => engineAudio.playStartBurst());
    window.setTimeout(() => get().finishCrank(), 900);
  },

  finishCrank: () => {
    const idle = get().specs?.engine.idleRpm ?? 900;
    engineAudio.startEngineLoop();
    set({
      ignitionPhase: "engine_running",
      rpm: idle,
      hint: "Engine running. Hold W to rev.",
    });
  },

  beginShutdown: () => {
    set({ ignitionPhase: "shutting_down", hint: "Engine stopping…" });
    engineAudio.stopEngineLoop();
    window.setTimeout(() => get().finishShutdown(), 600);
  },

  finishShutdown: () =>
    set({
      ignitionPhase: "ignition_on",
      rpm: 0,
      throttle: 0,
      hint: "Accessories on. Press ignition to crank again.",
    }),

  initAudio: async () => {
    await engineAudio.init();
    set({ audioReady: true });
  },
}));
