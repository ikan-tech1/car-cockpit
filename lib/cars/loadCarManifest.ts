import { getCarManifest } from "@/lib/cars/registry";
import type { CarBundle, CarManifest, CarSpecs, InteractionDef } from "@/lib/types/car";

export async function loadCarBundle(slug: string): Promise<CarBundle> {
  const manifest = getCarManifest(slug);
  if (!manifest) {
    throw new Error(`Unknown car slug: ${slug}`);
  }

  const [specs, interactions] = await Promise.all([
    fetchSpecs(manifest),
    fetchInteractions(manifest),
  ]);

  return { manifest, specs, interactions };
}

async function fetchSpecs(manifest: CarManifest): Promise<CarSpecs> {
  const response = await fetch(manifest.specsPath);
  if (!response.ok) {
    throw new Error(`Failed to load specs for ${manifest.slug}`);
  }
  return response.json() as Promise<CarSpecs>;
}

async function fetchInteractions(
  manifest: CarManifest,
): Promise<Record<string, InteractionDef>> {
  const response = await fetch(manifest.interactionsPath);
  if (!response.ok) {
    throw new Error(`Failed to load interactions for ${manifest.slug}`);
  }
  return response.json() as Promise<Record<string, InteractionDef>>;
}
