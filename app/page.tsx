import { CarPickerGrid } from "@/components/ui/CarPickerGrid";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#060608] text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">Car Cockpit</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-light tracking-tight">
          Realistic interior simulators with correct specs, engine audio, and interactive controls.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-white/50">
          Start with the Porsche 911 Carrera (992.2). Hold brake, start the flat-6, rev the engine,
          and interact with PDK, PASM, Sport Plus, and PCM.
        </p>
        <div className="mt-12">
          <CarPickerGrid />
        </div>
        <p className="mt-12 text-xs text-white/30">
          Specs sourced from Porsche technical documentation. Not affiliated with Porsche AG.
        </p>
      </div>
    </main>
  );
}
