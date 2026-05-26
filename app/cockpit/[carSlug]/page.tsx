import { CockpitExperience } from "@/components/cockpit/CockpitExperience";
import { getCarManifest } from "@/lib/cars/registry";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ carSlug: "porsche-911-992-carrera" }];
}

export default async function CockpitPage({
  params,
}: {
  params: Promise<{ carSlug: string }>;
}) {
  const { carSlug } = await params;
  if (!getCarManifest(carSlug)) notFound();
  return <CockpitExperience carSlug={carSlug} />;
}
