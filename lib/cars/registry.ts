import type { CarManifest } from "@/lib/types/car";

export const CAR_REGISTRY: CarManifest[] = [
  {
    slug: "porsche-911-992-carrera",
    name: "Porsche 911 Carrera (992)",
    tagline: "3.0L twin-turbo flat-6 · 388 hp · PDK",
    model: { type: "proxy", path: null },
    audio: {
      basePath: "/cars/porsche-911-992-carrera/audio",
      synthesized: true,
    },
    specsPath: "/cars/porsche-911-992-carrera/specs.json",
    interactionsPath: "/cars/porsche-911-992-carrera/interactions.json",
  },
];

export function getCarManifest(slug: string): CarManifest | undefined {
  return CAR_REGISTRY.find((car) => car.slug === slug);
}
