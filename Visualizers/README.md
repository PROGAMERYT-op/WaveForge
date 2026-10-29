# WaveForge Visualizers — mode registry

Each file in this folder implements **one** visualization mode and registers it
into the shared `window.WaveForgeVisualizers` registry, keyed by mode number.

| Mode # | File             | Mode name         |
|--------|------------------|-------------------|
| 0      | `bars.js`        | Bar Spectrum      |
| 1      | `wave.js`        | Waveform          |
| 2      | `radial.js`      | Radial EQ         |
| 3      | `particles.js`   | Particles         |
| 4      | `spectrogram.js` | Spectrogram       |
| 5      | `3dbars.js`      | 3D Bars           |
| 6      | `dna.js`         | DNA Helix         |
| 7      | `galaxy.js`      | Galaxy            |
| 8      | `logo.js`        | Logo Visualizer   |
| 9      | `tunnel.js`      | Cyber Tunnel      |
| 10     | `trapnation.js`  | Bass Nation       |
| 11     | `synthwave.js`   | Synthwave Grid    |

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