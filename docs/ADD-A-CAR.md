# Adding a New Car

Each car is a self-contained plugin under `public/cars/{slug}/`.

## 1. Create the car folder

```
public/cars/my-car-slug/
├── manifest.json
├── specs.json
├── interactions.json
├── models/
│   └── interior.glb      # optional — omit for proxy interior
└── audio/                # optional when synthesized: true
```

## 2. Register in the garage

Add an entry to [`lib/cars/registry.ts`](../lib/cars/registry.ts):

```typescript
{
  slug: "my-car-slug",
  name: "Make Model (Generation)",
  tagline: "Engine summary · power · transmission",
  model: { type: "glb", path: "/cars/my-car-slug/models/interior.glb" },
  audio: { basePath: "/cars/my-car-slug/audio", synthesized: true },
  specsPath: "/cars/my-car-slug/specs.json",
  interactionsPath: "/cars/my-car-slug/interactions.json",
}
```

## 3. Author specs.json

Use OEM press-kit or technical PDF values. Include at minimum:

- `engine.redline`, `engine.idleRpm`, `engine.powerHp`, `engine.torqueLbFt`
- `transmission.type`, `transmission.gears`
- `displays.clusterInches`, `displays.pcmInches`
- `source` — citation string for the spec panel

## 4. Map interactable mesh names

In `interactions.json`, keys must match **GLB mesh names** or **ProxyInterior `InteractableMesh` names**:

| Key | Action |
|-----|--------|
| `ignition_button` | `ignition.toggle` |
| `foot_brake` | `brake.set` |
| `throttle_pedal` | `throttle.set` |
| `pdk_selector` | `transmission.setGear` |
| `sport_plus` | `driveMode.setSportPlus` |
| `pasm_button` | `pasm.cycle` |

See the 992 example: [`public/cars/porsche-911-992-carrera/interactions.json`](../public/cars/porsche-911-992-carrera/interactions.json).

## 5. GLB vs proxy

- **Proxy** (`model.type: "proxy"`): Built-in R3F geometry in [`components/interior/ProxyInterior.tsx`](../components/interior/ProxyInterior.tsx). Swap to GLB later without code changes if mesh names match.
- **GLB** (`model.type: "glb"`): Place Draco-compressed model at `model.path`. Name every interactable mesh in Blender before export.

## 6. Static route (optional)

Add `{ carSlug: "my-car-slug" }` to `generateStaticParams` in [`app/cockpit/[carSlug]/page.tsx`](../app/cockpit/[carSlug]/page.tsx).

## 7. Verify

```bash
npm run dev
# Open http://localhost:3000 → select car → test ignition, audio, controls
npm run build
```
