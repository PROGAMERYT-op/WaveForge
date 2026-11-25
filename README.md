# WaveForge Studio v9.1

WaveForge is a free, browser-based music visualizer and viral Phonk/Hardtekk video maker. It pre-analyzes your song using a **Predictive Lookahead Audio Engine**, renders 60 FPS audio-reactive visuals on HTML5 Canvas, and exports hardware-accelerated 4K 

MP4/WebM videos locally in your browser with zero watermarks.

**Live Studio:** https://progameryt-op.github.io/WaveForge/

## What's New in v9.1

* **Predictive Lookahead Audio Choreography**: Listens to and decodes your track before playback to compute a 60 FPS mathematical map of sub-bass energy, onset flux, auto-detected BPM, and 2.5-second forward lookahead drop detection. Automatically builds tension before drops, fires calibrated spring-damped shake, zoom punch, and drop flashes right on the beat (live and in MP4 export), auto-syncs the AirPods intro drop time, and places clickable drop pins directly on the timeline.

* **6 Unique Creator Templates + Trending Edit Fonts**: Every template now pairs a distinct visualizer engine with its own trending Google Font, EQ curve, and choreography profile:

  * **Hardtekk Purple Mage** — Mode 12 (`Hardtekk Phonk`) • `New Rocker` (Gothic) • 3.5s AirPods Volume Intro

  * **Brazilian Funk Hyper-Tunnel** — Mode 9 (`Cyber Tunnel`) • `Anton` (TikTok Bold) • Heavy Predictive Drop Shake

  * **Drift Phonk Outrun VHS** — Mode 11 (`Synthwave Grid`) • `Orbitron` (Cyber Drift) • CRT Scanlines & Drop Flash

  * **Ultra Slowed Bass Shockwave** — Mode 10 (`Bass Nation`) • `Syne` (Wide) • `0.85×` Slowed Playback

  * **24K Gold Luxury Crest** — Mode 8 (`Logo Visualizer`) • `Cinzel` (Royal Serif) • Orbiting Rays & Drone Pan

  * **YouTube Type-Beat 16:9** — Mode 0 (`Bar Spectrum`) • `Bebas Neue` • Widescreen Mirror Reflection

* **Streamlined Studio UX**:

  * **9 Curated Pro Visualizers**: `Hardtekk Phonk`, `Logo Visualizer`, `Bass Nation`, `Cyber Tunnel`, `Synthwave Grid`, `Bar Spectrum`, `Neon Waveform`, `Radial EQ`, and `Particles` (removed filler modes `Spectrogram`, `3D Bars`, `DNA Helix`, and `Galaxy`).

  * **Pro Transport & Ergonomics**: Hover seek-time tooltip, clickable drop markers, dynamic slider progress tracks with formatted units, Loop (`L`), Mute, Playback Speed (`0.75×`–`1.25×`), 1-click EQ presets, Zen Mode (`H`), safe 2-step Reset, and full keyboard navigation.

  * **Fixed Modal & Mobile UX**: Eliminated closed-modal click interception, fixed mobile drawer positioning and light-mode contrast, and made onboarding and file uploads reliable across mobile Safari, Android Chrome, and desktop.

## Core Capabilities

* **3-Band Hardware Equalizer + Presets**: Real-time 110Hz Low Shelf Bass, 1kHz Mid Presence, and 4.2kHz High Shelf Air with 1-click presets (`Flat`, `Phonk Bass`, `Hardtekk`, `Sub Destroyer`, `Vocal`).

* **Zero-Suspend Turbo 4K MP4 Export**: Pre-renders 3-band EQ audio via `OfflineAudioContext`, computes Radix-2 FFT frames, and encodes H.264 MP4 + AAC via WebCodecs and `mp4-muxer` (with automatic hardware profile/resolution negotiation and fallback to `MediaRecorder`).

* **Custom Branding & Post-FX**: Upload custom backgrounds and center logos, style beat-reactive track/artist typography with 7 trending fonts, toggle CRT scanlines, cinema vignette, and stereo mirror reflection, and frame for `9:16`, `16:9`, `1:1`, or `4:5`.

* **100% Local Privacy**: All audio decoding, predictive analysis, rendering, and video encoding happen locally in your browser.

## Keyboard Shortcuts

| Key | Action | 
| ----- | ----- | 
| `Space` | Play / Pause | 
| `S` | Stop playback | 
| `T` | Open Trending Templates | 
| `M` | Open Visualization Modes | 
| `R` | Randomize mode & palette | 
| `L` | Toggle track loop | 
| `H` | Toggle Zen Mode (Hide / Show UI) | 
| `C` | Save PNG screenshot | 
| `F` | Toggle fullscreen | 
| `←` / `→` | Seek ±5 seconds | 
| `↑` / `↓` | Adjust volume ±10% | 
| `?` | Show shortcuts dialog | 
| `Esc` | Close active dialog | 

## Local Testing

```
python3 -m http.server 8080

```

Then open `http://localhost:8080`.
