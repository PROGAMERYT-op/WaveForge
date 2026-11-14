# WaveForge Visualizers — mode registry

Each file in this folder implements **one** visualization mode and registers it
into the shared `window.WaveForgeVisualizers` registry, keyed by mode number.

| Mode # | File          | Mode name         |
|--------|---------------|-------------------|
| 0      | `bars.js`     | Bar Spectrum      |
| 1      | `wave.js`     | Waveform          |
| 2      | `radial.js`   | Radial EQ         |
| 3      | `particles.js`| Particles         |
| 4      | `spectrogram.js` | Spectrogram    |
| 5      | `3dbars.js`   | 3D Bars           |
| 6      | `dna.js`      | DNA Helix         |
| 7      | `galaxy.js`   | Galaxy            |
| 8      | `logo.js`     | Logo Visualizer   |

## Registry contract

```js
window.WaveForgeVisualizers = window.WaveForgeVisualizers || {};
window.WaveForgeVisualizers[MODE_NUMBER] = {
    name: 'Mode Name',          // shown in the UI + export dropdown
    icon: '🔊',                 // emoji shown on the mode card
    desc: 'Short description.', // shown on the mode card
    newBadge: false,            // optional — shows the "NEW" pill
    ownBackground: false,       // optional — true if the mode paints its own background
    render(engine, ctx, w, h, cx, cy, data, isBeat) { ... },
    renderExport(engine, ctx, w, h, cx, cy, data, isBeat) { ... } // optional, falls back to render()
};
```

`engine` exposes:

- `engine.config` — the live `CONFIG` (sensitivity, palette, mirror, logo settings…)
- `engine.state` — the live `APP_STATE` (helixAngle, galaxyAngle, spectrogramData, logo/beat state…). Also a shared `engine.state.peaks` object you can use for per-mode peak-hold arrays (see `bars.js` / `radial.js`)
- `engine.palette` — the active `PALETTES[CONFIG.palette]` array (already hue-rotated when Hue Cycling is enabled)
- `engine.getColor(i)` / `engine.getGradient(ctx, h)` — palette helpers (hue-cycle aware)
- `engine.particles` — the 200-particle field (shared with Particles & Logo modes)
- `engine.width` / `engine.height` — live canvas CSS size (for scaling exports)
- `engine.nowSec()` — animation clock (real time, or export timeline during fast export)

`data` is `{ freq: Uint8Array, wave: Uint8Array }` and `isBeat` is the beat flag.
When **Frequency Scale** is set to *Logarithmic* (the default), `data.freq` is
pre-mapped into log-spaced bands by the engine (`processData()`), so bass doesn't
dominate — modes read it exactly like before and benefit automatically.

## How to add a new mode

1. Create `Visualizers/<name>.js` implementing the contract above.
2. Load it in `visualizer.html` (before `assets/js/app.js`).
3. Done — the mode selector grid, export dropdown, and keyboard cycle pick it up
   automatically.