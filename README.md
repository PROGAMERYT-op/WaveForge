# WaveForge Studio v7.1

WaveForge is a free, browser-based music visualizer and viral Phonk/Hardtekk video editor. It renders audio-reactive visuals in real time using the Web Audio API and HTML5 Canvas, and exports hardware-accelerated MP4/WebM videos locally in the browser with zero watermarks.

## Key Features (v7.1)

- **13 Visualization Modes**:
  - `0` Bar Spectrum (`bars.js`)
  - `1` Neon Waveform (`wave.js`)
  - `2` Radial EQ (`radial.js`)
  - `3` Particles (`particles.js`)
  - `4` Spectrogram (`spectrogram.js`)
  - `5` 3D Bars (`3dbars.js`)
  - `6` DNA Helix (`dna.js`)
  - `7` Galaxy (`galaxy.js`)
  - `8` Logo Visualizer (`logo.js`)
  - `9` Cyber Tunnel (`tunnel.js`)
  - `10` Bass Nation (`trapnation.js`)
  - `11` Synthwave Grid (`synthwave.js`)
  - `12` Hardtekk Phonk (`phonk.js`) — Liquid neon plasma ring + AirPods volume charge-up intro + kick zoom-blur
- **1-Click Viral Phonk & Funk Templates**: 6 pre-configured creator templates (`Hardtekk Purple Mage`, `Brazilian Funk Toxic Green`, `Drift Phonk Blood Crimson`, `Ultra Slowed Glacier Cyan`, `Golden Phonk Royalty`, `YouTube Type-Beat 16:9 Master`).
- **3-Band Hardware Equalizer**: Real-time 110Hz Low Shelf Bass, 1kHz Mid Presence, and 4.2kHz High Shelf Air.
- **Zero-Suspend Turbo 4K MP4 Export**: Pre-renders 3-band EQ audio via `OfflineAudioContext`, computes Radix-2 FFT frames, and encodes H.264 MP4 + AAC via WebCodecs and `mp4-muxer` (with automatic hardware profile/resolution negotiation and fallback to `MediaRecorder`).
- **Custom Branding & Post-FX**: Upload custom background images and center logos, add beat-reactive track titles/artist overlays, toggle CRT scanlines, vignette, and stereo mirror reflection, and frame for `9:16`, `16:9`, `1:1`, or `4:5`.

## Local Testing

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.