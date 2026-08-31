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
- Built-in demo track (🎵 Demo button) — try it instantly, no audio file needed
- Installable PWA with offline support (service worker)

## Getting started

### GitHub Pages (recommended)

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, pick your branch and `/ (root)`, then save.
4. Your app goes live at `https://<username>.github.io/<repo>/` — no build step needed.

All paths are relative, so it works both at a user site root and at a project subpath
(`username.github.io/<repo>/`).

### Local testing

Host the repository root on any static file server:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080`. (Opening `index.html` directly via `file://` is not
supported — the service worker and some browser APIs require HTTP(S).)

## Project structure

```
index.html                     Landing page
visualizer.html                App shell (slider UI, positioning, overlays)
privacy.html / terms.html      Legal pages
Visualizers/                   One file per visualization mode + registry README
assets/css/                    app.css (app), landing.css, legal.css
assets/js/                     app.js (engine, audio, export, UI), landing.js, legal.js
assets/audio/                  demo-track.wav (built-in demo loop)
assets/img/                    icons, logo, og images
sw.js                          Service worker (offline PWA support)
.nojekyll                      Skips Jekyll processing on GitHub Pages
browserconfig.xml, sitemap.xml, robots.txt
mp4-muxer                      Loaded from jsDelivr CDN at runtime; export falls back to MediaRecorder if unavailable
```

## How it works

- `AudioEngine` (app.js) decodes audio via Web Audio API and drives an `AnalyserNode` → frequency/time-domain data.
- A `VisualizerEngine` runs a render loop per mode; each `Visualizers/*.js` file registers one mode into `window.WaveForgeVisualizers`.
- Export uses MediaRecorder for real-time capture, plus a render-aware fast path that suspends playback, advances frames, captures canvas frames, and muxes them with the audio through `mp4-muxer`.

## Adding a visualization mode

Each mode lives in `Visualizers/<name>.js` and registers itself into the shared
`window.WaveForgeVisualizers` registry (see `Visualizers/README.md` for the full contract):

```js
window.WaveForgeVisualizers = window.WaveForgeVisualizers || {};
window.WaveForgeVisualizers[9] = {
    name: "My Mode",
    icon: "✨",
    desc: "Short description shown on the mode card.",
    render(engine, ctx, w, h, cx, cy, data, isBeat) { /* per-frame render */ }
};
```

Then load it in `visualizer.html` with a `<script src="Visualizers/my-mode.js"></script>` tag
placed **before** `assets/js/app.js`. The mode selector grid, export dropdown, and keyboard
mode cycling pick it up automatically. `engine` exposes config, audio state, beat track,
particles, colors, and the logo/background image elements.

## License

All rights reserved. See `terms.html` for usage terms.