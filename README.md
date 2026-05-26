# Car Cockpit

Browser-based realistic car interior simulator. First car: **Porsche 911 Carrera (992.2)** with correct specs, synthesized flat-6 engine audio, and interactive cockpit controls.

**Live:** [car-cockpit.vercel.app](https://car-cockpit.vercel.app) · **Repo:** [github.com/ikan-tech1/car-cockpit](https://github.com/ikan-tech1/car-cockpit)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → select the 992 → enter the cockpit.

## Controls

| Input | Action |
|-------|--------|
| **Space** | Foot brake (required to start) |
| **W** | Throttle / rev |
| **I** | Ignition start/stop |
| **G** | Cycle PDK (P → R → N → D) |
| **P** | Sport Plus toggle |
| **M** | PASM cycle |
| Click | Any highlighted 3D control |

Toggle **Driver seat / Showroom orbit** from the top-right panel.

## Architecture

- **Next.js 16** + **React Three Fiber** for the 3D cockpit
- **Zustand** for simulation state (ignition, RPM, gear, modes)
- **Web Audio API** for layered flat-6 engine synthesis
- **Car plugin system** — each car lives in `public/cars/{slug}/`

See [docs/ADD-A-CAR.md](docs/ADD-A-CAR.md) to add another vehicle.

## 992 specs source

Porsche 992.2 911 Carrera technical specifications (newsroom.porsche.com). Not affiliated with Porsche AG.

## Swap in a photoreal GLB

1. Export interior with interactable mesh names matching `interactions.json`
2. Place at `public/cars/porsche-911-992-carrera/models/interior.glb`
3. Set `manifest.json` → `"model": { "type": "glb", "path": "/cars/.../interior.glb" }`

The proxy interior uses the same mesh names for drop-in replacement.
