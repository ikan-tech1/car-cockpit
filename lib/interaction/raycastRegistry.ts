import type { InteractionDef } from "@/lib/types/car";

export function buildInteractableSet(
  interactions: Record<string, InteractionDef>,
): Set<string> {
  return new Set(Object.keys(interactions));
}

export function getInteractionLabel(
  interactions: Record<string, InteractionDef>,
  meshName: string,
): string | null {
  return interactions[meshName]?.label ?? null;
}

export function findInteractableFromObject(
  objectName: string,
  interactables: Set<string>,
): string | null {
  if (interactables.has(objectName)) return objectName;
  return null;
}
