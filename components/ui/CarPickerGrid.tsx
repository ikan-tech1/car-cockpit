"use client";

import Link from "next/link";
import { CAR_REGISTRY } from "@/lib/cars/registry";

export function CarPickerGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CAR_REGISTRY.map((car) => (
        <Link
          key={car.slug}
          href={`/cockpit/${car.slug}`}
          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-500/40 hover:bg-white/[0.06]"
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">Enter cockpit</p>
          <h2 className="mt-2 text-lg font-medium text-white group-hover:text-cyan-100">
            {car.name}
          </h2>
          <p className="mt-1 text-sm text-white/50">{car.tagline}</p>
          <p className="mt-4 text-xs text-cyan-400/70">
            {car.model.type === "proxy" ? "Proxy interior · GLB-ready" : "Photoreal GLB"}
          </p>
        </Link>
      ))}
    </div>
  );
}
