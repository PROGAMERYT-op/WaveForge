# WaveForge Studio v10.4 — Free 4K Online Music Visualizer

**WaveForge** is a free, privacy-first browser music visualizer and 4K MP4/WebM video exporter built for **every music genre** — Lo-Fi, Hip-Hop & Type-Beats, EDM, Trap, Synthwave, Indie, Pop, Podcasts, Phonk, Hardtekk, and Brazilian Funk.

Everything runs **100% locally in your browser** (desktop and mobile) using the Web Audio API, HTML5 Canvas, WebGL2 shaders, and WebCodecs — with **zero watermarks**, **no sign-up**, and **instant downloads**.

**Live Studio:** [https://progameryt-op.github.io/WaveForge/](https://progameryt-op.github.io/WaveForge/)

---

## Key Features

- **9 Curated Audio-Reactive Visualizers**:
  - `Bar Spectrum` (`Visualizers/bars.js`) — Clean studio spectrum bars with mirror floor reflection and peak-hold LEDs (great for Hip-Hop, Type-Beats & YouTube).
  - `Neon Waveform` (`Visualizers/wave.js`) — Layered oscilloscope ribbons with aurora fill (great for Lo-Fi, Chillhop, Indie & Podcasts).
  - `Radial EQ` (`Visualizers/radial.js`) — 360° circular spectrum reactor with rotating HUD rings.
  - `Particles` (`Visualizers/particles.js`) — Constellation plexus network with bass vortex physics (great for Ambient, Chill & Electronic).
  - `Logo Visualizer` (`Visualizers/logo.js`) — Custom center emblem with radial frequency rays and orbiting sparks (great for Pop, Artist Releases & Labels).
  - `Cyber Tunnel` (`Visualizers/tunnel.js`) — 3D geometric warp tunnel reacting to sub-bass kicks (great for EDM & Brazilian Funk).
  - `Bass Nation` (`Visualizers/trapnation.js`) — Triple harmonic bass spectrum rings with expanding shockwaves (great for Trap, Dubstep & EDM).
  - `Synthwave Grid` (`Visualizers/synthwave.js`) — Retro 80s Outrun laser horizon and audio-reactive mountains (great for Synthwave & Retrowave).
  - `Hardtekk Phonk` (`Visualizers/phonk.js`) — Liquid neon plasma ring with optional AirPods volume charge-up intro and kick zoom-blur.
- **9 Genre-Matched Presets**: Pick your music style (`Lo-Fi & Chill`, `Ambient & Indie`, `EDM & Bass`, `Hip-Hop & Type-Beats`, `Pop & Artist Logo`, `Synthwave & Retro`, `Phonk & Hardtekk`, `Brazilian Funk`) to auto-configure the best visualizer, color palette, typography, aspect ratio, and 3-band EQ.
- **Predictive Beat-Drop Choreography**: Offline pre-analysis computes track BPM, detects major drops with timeline jump pins, and drives frame-accurate camera shake, buildup tension, and zoom punch.
- **Offline Frame-by-Frame 4K Export**:
  - Pre-renders 3-band EQ and playback speed via `OfflineAudioContext`, extracts centered Radix-2 FFT frames with FPS-normalized smoothing, and encodes via **WebCodecs** (`mp4-muxer` / `webm-muxer`) with strict backpressure so exports stay smooth on 4 GB RAM laptops and mobile browsers.
  - Supports **9:16** (TikTok / Reels / Shorts), **16:9** (YouTube), **1:1** (Square), **4:5** (Instagram Feed), and **1-Click Spotify Canvas** (8s silent 9:16).
- **Custom Media & Post-FX**: Looping MP4/WebM video backgrounds, custom images & center logos, 7 on-canvas typography styles, 3-band hardware EQ (`110 Hz`, `1 kHz`, `4.2 kHz`), and WebGL2 beat-synced shaders (chromatic aberration, glitch, VHS tape grain, radial zoom-blur).
- **Instant Shareable Presets**: Share any custom setup via URL hash (`#p=...`) or `.wfpreset.json` files.

---

## Project Structure

```text
WaveForge/
├── index.html              # Landing page & genre preset showcase
├── visualizer.html         # Full studio application
├── sw.js                   # Offline PWA Service Worker (v10.4.0)
├── assets/
│   ├── manifest.json       # PWA web app manifest
│   ├── css/                # app.css, landing.css, legal.css
│   ├── js/                 # app.js, webgl-fx.js, landing.js, ads.js
│   ├── audio/              # Built-in demo-track.wav
│   └── img/                # App icons & social preview assets
└── Visualizers/            # 9 modular canvas visualizer engines
```

---

## Local Development

No build step or Node dependencies required. Serve the repository root with any static HTTP server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

---

## License

Released under the [MIT License](LICENSE).