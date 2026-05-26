export interface CarEngineSpecs {
  layout: string;
  type: string;
  displacementL: number;
  powerHp: number;
  powerRpm: number;
  torqueLbFt: number;
  torqueRpmRange: [number, number];
  redline: number;
  idleRpm: number;
}

export interface CarSpecs {
  make: string;
  model: string;
  generation: string;
  trim: string;
  year: number;
  engine: CarEngineSpecs;
  transmission: { type: string; gears: number };
  displays: { clusterInches: number; pcmInches: number };
  source: string;
}

export type InteractionType = "momentary" | "toggle" | "cycle" | "rotary" | "hold";

export interface InteractionDef {
  type: InteractionType;
  label: string;
  requires?: string[];
  states?: string[];
  action: string;
}

export interface CarManifest {
  slug: string;
  name: string;
  tagline: string;
  model: {
    type: "proxy" | "glb";
    path: string | null;
  };
  audio: {
    basePath: string;
    synthesized: boolean;
  };
  specsPath: string;
  interactionsPath: string;
  thumbnail?: string;
}

export interface CarBundle {
  manifest: CarManifest;
  specs: CarSpecs;
  interactions: Record<string, InteractionDef>;
}

export type Gear = "P" | "R" | "N" | "D";
export type PasmMode = "Normal" | "Sport" | "Sport Plus";
export type IgnitionPhase =
  | "parked_off"
  | "access_granted"
  | "ignition_on"
  | "cranking"
  | "engine_running"
  | "shutting_down";

export type PcmRoute = "home" | "nav" | "media" | "settings" | "vehicle";
export type CameraMode = "driver" | "showroom";
