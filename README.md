# WaveForge

WaveForge is a free, browser-based music visualizer. It renders audio-reactive visuals in real time using the Web Audio API and Canvas, and can export the result as a WebM/MP4 video — all locally in the browser, no signup, no watermarks.

## Features

- 9 visualization modes: Wave, Bars, 3D Bars, Radial Spectrum, Particles, DNA, Galaxy, Spectrogram, and Logo Visualizer (2D/3D logo playback)
- Real-time beat detection with on-screen indicators and exported beat markers
- 8 color palettes plus custom colors
- Audio-reactive logo rendering with rotation, scale, and shake
- Video export: MediaRecorder (WebM VP9/VP8) and "fast export" (MP4 via mp4-muxer) with waveform overlays, fades, and a canvas-burn process for export fidelity
- Microphone input
- Uploaded images for logo + background
- Keyboard shortcuts (Space, S, M, F, arrows, Esc)
- Dark/light themes and high-contrast mode

## Getting started

Host the repository root on any static file server (GitHub Pages works out of the box):

```
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Project structure

```
index.html                     Landing page
visualizer.html                App shell (slider UI, positioning, overlays)
privacy.html / terms.html      Legal pages
Visualizers/                   One file per visualization mode + loading README
assets/css/                    app.css (app), landing.css, legal.css
assets/js/                     app.js (engine, audio, export, UI), landing.js, legal.js
assets/img/                    icons, logo, og images
mp4-muxer.min.js               Third-party MP4 muxer (vendored)
browserconfig.xml, sitemap.xml, robots.txt
```

## How it works

- `AudioEngine` (app.js) decodes audio via Web Audio API and drives an `AnalyserNode` → frequency/time-domain data.
- A `VisualizerEngine` runs a render loop per mode; each `Visualizers/*.js` file adds one mode (`MODES[name].mount/unmount/draw`).
- Export uses MediaRecorder for real-time capture, plus a render-aware fast path that suspends playback, advances frames, captures canvas frames, and muxes them with the audio through `mp4-muxer`.

## Adding a visualization mode

Each mode lives in `Visualizers/<name>.js` and is registered via `Visualizers/MODES.js`:

```js
MODES["my-mode"] = {
    humanName: "My Mode",
    mount: (c, engine, wrap) => { /* called when mode becomes active */ },
    unmount: (c, engine, wrap) => { /* called when engine switches away */ },
    draw: (c, engine, wrap, time, speed, beat) => { /* per-frame render */ }
};
```

`c` is the 2D canvas context, `wrap` is `[w, h]` (either live canvas or export canvas dims), and `engine` exposes config, audio state, beat track, particles, colors, and the logo/background image elements.

## License

All rights reserved. See `terms.html` for usage terms.