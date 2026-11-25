/**
 * WaveForge Music Visualizer Studio v10.0
 * Features:
 *  - 13 Visualization Modes (including Mode 12: Hardtekk / Phonk Liquid Ring + AirPods Intro)
 *  - 1-Click Trending Templates Hub (6 viral presets + 3-step guided workflow bar)
 *  - 3-Band Hardware Equalizer, On-Canvas Typography, Post-FX & 4 Aspect Ratios
 *  - Zero-Suspend Radix-2 FFT Turbo MP4 Export Engine (with automatic mobile codec/resolution negotiation & neon glow preservation)
 *  - 8-Second Ad-Timer + Instant Sponsor Unlock Download Gate
 */
(function () {
    'use strict';

    // ============================================
    // TRENDING TEMPLATES REGISTRY (v7.1)
    // ============================================
    const TRENDING_TEMPLATES = [
        {
            id: 'hardtekk-mage',
            name: 'Hardtekk Purple Mage',
            tag: '😈 PHONK RING',
            fontLabel: 'Font: New Rocker (Gothic)',
            desc: '9:16 Vertical • Liquid Neon Plasma Ring • 3.5s AirPods Volume Intro • Dark Mage Backdrop & Predictive Kick Zoom',
            color: '#a855f7',
            speed: 1,
            settings: {
                mode: 12,
                aspectRatio: '9:16',
                waveColor: '#a855f7',
                palette: 'synthwave',
                overlayFont: 'New Rocker',
                phonkIntroEnabled: true,
                phonkIntroDuration: 3.5,
                phonkBgTheme: 'mage',
                logoShakeIntensity: 18,
                logoGlowSize: 42,
                logoParticles: true,
                eqBass: 8,
                eqMid: 1,
                eqTreble: 3,
                sensitivity: 1.7,
                bloomIntensity: 68,
                predictiveIntensity: 1.25,
                fxVignette: true,
                fxScanlines: false,
                mirror: false,
                fxChromatic: 30,
                fxGlitch: 10,
                fxVhs: 0,
                fxZoomBlur: 40
            }
        },
        {
            id: 'brazilian-funk',
            name: 'Brazilian Funk Hyper-Tunnel',
            tag: '⚡ 3D WARP TUNNEL',
            fontLabel: 'Font: Anton (TikTok Bold)',
            desc: '9:16 Vertical • Toxic Emerald 3D Hyperspace Octagon Tunnel • +10dB Sub-Bass • Heavy Predictive Drop Shake',
            color: '#00ff88',
            speed: 1,
            settings: {
                mode: 9,
                aspectRatio: '9:16',
                waveColor: '#00ff88',
                palette: 'trapneon',
                overlayFont: 'Anton',
                phonkIntroEnabled: false,
                phonkIntroDuration: 0,
                eqBass: 10,
                eqMid: 0,
                eqTreble: 4,
                sensitivity: 1.9,
                bloomIntensity: 78,
                predictiveIntensity: 1.45,
                fxVignette: true,
                fxScanlines: false,
                mirror: false,
                fxChromatic: 45,
                fxGlitch: 35,
                fxVhs: 0,
                fxZoomBlur: 45
            }
        },
        {
            id: 'drift-phonk-crimson',
            name: 'Drift Phonk Outrun VHS',
            tag: '🩸 RETRO LASER GRID',
            fontLabel: 'Font: Orbitron (Cyber Drift)',
            desc: '9:16 Vertical • Crimson Synthwave Laser Horizon & Mountains • CRT VHS Scanlines • Aggressive Drop Flash',
            color: '#ff0055',
            speed: 1,
            settings: {
                mode: 11,
                aspectRatio: '9:16',
                waveColor: '#ff0055',
                palette: 'fire',
                overlayFont: 'Orbitron',
                phonkIntroEnabled: false,
                phonkIntroDuration: 0,
                eqBass: 9,
                eqMid: 2,
                eqTreble: 2,
                sensitivity: 1.8,
                bloomIntensity: 75,
                predictiveIntensity: 1.35,
                fxVignette: true,
                fxScanlines: true,
                mirror: false,
                fxChromatic: 35,
                fxGlitch: 20,
                fxVhs: 45,
                fxZoomBlur: 25
            }
        },
        {
            id: 'ultra-slowed-ice',
            name: 'Ultra Slowed Bass Shockwave',
            tag: '❄️ 0.85× SLOWED',
            fontLabel: 'Font: Syne (Avant-Garde)',
            desc: '9:16 Vertical • Glacier Cyan Triple Harmonic Bass Nation Rings • 0.85× Slowed Speed • Deep Sub-Bass Glow',
            color: '#00f2ff',
            speed: 0.85,
            settings: {
                mode: 10,
                aspectRatio: '9:16',
                waveColor: '#00f2ff',
                palette: 'cyberpunk',
                overlayFont: 'Syne',
                phonkIntroEnabled: false,
                phonkIntroDuration: 0,
                eqBass: 7,
                eqMid: -1,
                eqTreble: 3,
                sensitivity: 1.65,
                bloomIntensity: 82,
                predictiveIntensity: 1.05,
                fxVignette: true,
                fxScanlines: false,
                mirror: false
            }
        },
        {
            id: 'golden-royalty',
            name: '24K Gold Luxury Crest',
            tag: '👑 LOGO SPOTLIGHT',
            fontLabel: 'Font: Cinzel (Royal Serif)',
            desc: '9:16 Vertical • Classic Logo Visualizer with 24K Gold Radial Rays, Orbiting Particles & Cinematic Drone Pan',
            color: '#fbbf24',
            speed: 1,
            settings: {
                mode: 8,
                aspectRatio: '9:16',
                waveColor: '#fbbf24',
                palette: 'gold',
                overlayFont: 'Cinzel',
                phonkIntroEnabled: false,
                phonkIntroDuration: 0,
                logoShakeIntensity: 14,
                logoGlowSize: 42,
                logoParticles: true,
                logoRotateRing: true,
                eqBass: 6,
                eqMid: 1,
                eqTreble: 2,
                sensitivity: 1.65,
                bloomIntensity: 72,
                predictiveIntensity: 1.1,
                fxVignette: true,
                fxScanlines: false,
                mirror: false
            }
        },
        {
            id: 'youtube-type-beat',
            name: 'YouTube Type-Beat 16:9',
            tag: '📺 16:9 STUDIO BARS',
            fontLabel: 'Font: Bebas Neue (Clean)',
            desc: '16:9 Widescreen • Studio Bar Spectrum Analyzer with Mirror Floor Reflection, Peak LEDs & Lower-Third Title',
            color: '#6366f1',
            speed: 1,
            settings: {
                mode: 0,
                aspectRatio: '16:9',
                waveColor: '#00f2ff',
                palette: 'cyberpunk',
                overlayFont: 'Bebas Neue',
                phonkIntroEnabled: false,
                phonkIntroDuration: 0,
                eqBass: 4,
                eqMid: 1,
                eqTreble: 2,
                sensitivity: 1.55,
                bloomIntensity: 62,
                predictiveIntensity: 0.85,
                fxVignette: true,
                fxScanlines: false,
                mirror: true
            }
        }
    ];

    // ============================================
    // GLOBAL STATE & CONFIGURATION
    // ============================================

    const APP_STATE = {
        isPlaying: false,
        mode: 12,
        modesCount: 13,
        lastTime: 0,
        fps: 0,
        frames: 0,
        showStats: true,
        beatDetected: false,
        beatTimer: 0,
        isRecording: false,
        recordedChunks: [],
        mediaRecorder: null,
        exportCanvas: null,
        exportCtx: null,
        spectrogramData: [],
        helixAngle: 0,
        galaxyAngle: 0,
        shakeX: 0,
        shakeY: 0,
        shakeTrauma: 0,
        lastLogoT: 0,
        lastPhonkT: 0,
        lastPartT: 0,
        lastDnaT: 0,
        lastGalT: 0,
        lastTrapT: 0,
        phonkKickEnv: 0,
        phonkSparks: null,
        bgImg: null,
        bgVideo: null,
        bgVideoUrl: null,
        logoImg: null,
        logoAngle: 0,
        shockwaves: [],
        exportTime: null,
        isFastExporting: false,
        decodedAudioBuffer: null,
        decodedAudioSrc: null,
        activeTemplateId: 'hardtekk-mage',
        pendingExportBlobUrl: null,
        pendingExportFilename: null,
        unlockTimerId: null,
        trackTitleLabel: '',
        isLooping: false,
        isMuted: false,
        prevVolume: 0.8,
        playbackSpeed: 1,
        isZenMode: false,
        isSeeking: false,
        hasPredictiveMap: false,
        predShake: 0,
        predZoom: 0,
        predBuildup: 0,
        predFlash: 0,
        predEnergy: 0,
        predBpm: 0,
        predDrops: []
    };

    const VIS_MODS = window.WaveForgeVisualizers || {};

    function nowSec() {
        return APP_STATE.exportTime !== null
            ? APP_STATE.exportTime
            : performance.now() * 0.001;
    }

    const CONFIG = {
        fftSize: 2048,
        smoothing: 0.85,
        minDecibels: -90,
        maxDecibels: -10,
        sensitivity: 1.65,
        bloomIntensity: 60,
        beatThreshold: 1.3,
        beatEnabled: true,
        palette: 'synthwave',
        highContrast: false,
        mirror: false,
        showFps: true,
        waveColor: '#a855f7',
        logoShakeIntensity: 16,
        logoRayCount: 128,
        logoLineThickness: 2,
        logoGlowSize: 40,
        logoParticles: true,
        logoRotateRing: false,
        phonkIntroEnabled: true,
        phonkIntroDuration: 3.5,
        phonkBgTheme: 'mage',
        watermark: false,
        freqScale: 'log',
        hueCycle: false,
        hueCycleSpeed: 15,
        eqBass: 6,
        eqMid: 0,
        eqTreble: 2,
        overlayTitle: '',
        overlayArtist: '',
        overlayFont: 'New Rocker',
        overlayPosition: 'bottom-left',
        predictiveEnabled: true,
        predictiveIntensity: 1.1,
        overlayBeatPulse: true,
        fxScanlines: false,
        fxVignette: true,
        fxProgressBar: true,
        fxChromatic: 25,
        fxGlitch: 0,
        fxVhs: 0,
        fxZoomBlur: 30,
        bgOpacity: 80,
        bgVideoSpeed: 1.0,
        aspectRatio: '9:16'
    };

    const DEFAULT_CONFIG = JSON.parse(JSON.stringify(CONFIG));

    function hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0;
        const l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                default: h = (r - g) / d + 4;
            }
            h *= 60;
        }
        return [h, s, l];
    }

    function hslToHex(h, s, l) {
        h = ((h % 360) + 360) % 360;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        if (h < 60) [r, g, b] = [c, x, 0];
        else if (h < 120) [r, g, b] = [x, c, 0];
        else if (h < 180) [r, g, b] = [0, c, x];
        else if (h < 240) [r, g, b] = [0, x, c];
        else if (h < 300) [r, g, b] = [x, 0, c];
        else [r, g, b] = [c, 0, x];
        const to = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
        return '#' + to(r) + to(g) + to(b);
    }

    function rotateHue(hex, deg) {
        const [h, s, l] = hexToHsl(hex);
        return hslToHex(h + deg, s, l);
    }

    const PALETTES = {
        cyberpunk: ['#00f2ff', '#ff0099', '#ffffff', '#7b2dff'],
        fire: ['#ff0000', '#ff6600', '#ffaa00', '#ffff00'],
        ocean: ['#001144', '#0066ff', '#00ccff', '#00ffff'],
        matrix: ['#001100', '#00ff00', '#66ff66', '#ccffcc'],
        rainbow: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'],
        gold: ['#bf953f', '#fcf6ba', '#b38728', '#aa771c'],
        sunset: ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec'],
        arctic: ['#a8dadc', '#457b9d', '#1d3557', '#f1faee'],
        synthwave: ['#a855f7', '#00f5d4', '#ff2a85', '#fee440'],
        trapneon: ['#00ff88', '#00c4ff', '#ff0055', '#ffffff'],
        vaporwave: ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff'],
        noir: ['#ffffff', '#cbd5e1', '#64748b', '#94a3b8']
    };

    const CONFIG_KEY = 'wf-config-v7';

    function persistConfig() {
        try {
            localStorage.setItem(CONFIG_KEY, JSON.stringify({ config: CONFIG, mode: APP_STATE.mode }));
        } catch (e) {}
    }

    function hydrateConfig() {
        try {
            const raw = localStorage.getItem(CONFIG_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                if (data.config && typeof data.config === 'object') {
                    Object.keys(CONFIG).forEach((k) => {
                        if (data.config[k] !== undefined) CONFIG[k] = data.config[k];
                    });
                }
                if (typeof data.mode === 'number' && VIS_MODS[data.mode]) APP_STATE.mode = data.mode;
            }
        } catch (e) {}

        try {
            const params = new URLSearchParams(window.location.search);
            if (params.has('template')) {
                const tpl = TRENDING_TEMPLATES.find(t => t.id === params.get('template'));
                if (tpl) {
                    Object.assign(CONFIG, tpl.settings);
                    APP_STATE.mode = tpl.settings.mode;
                    APP_STATE.activeTemplateId = tpl.id;
                }
            }
            if (params.has('mode')) {
                const m = parseInt(params.get('mode'), 10);
                if (VIS_MODS[m]) APP_STATE.mode = m;
            }
            if (params.has('palette') && PALETTES[params.get('palette')]) {
                CONFIG.palette = params.get('palette');
            }
            if (params.has('sens')) {
                const s = parseFloat(params.get('sens'));
                if (!isNaN(s) && s >= 0.5 && s <= 5.0) CONFIG.sensitivity = s;
            }
            if (params.has('aspect') && ['16:9', '9:16', '1:1', '4:5'].includes(params.get('aspect'))) {
                CONFIG.aspectRatio = params.get('aspect');
            }
            if (params.has('title')) {
                CONFIG.overlayTitle = params.get('title').slice(0, 60);
            }
            if (params.has('artist')) {
                CONFIG.overlayArtist = params.get('artist').slice(0, 60);
            }
            if (window.location.hash && window.location.hash.startsWith('#p=')) {
                try {
                    const b64 = window.location.hash.slice(3).replace(/-/g, '+').replace(/_/g, '/');
                    const jsonStr = decodeURIComponent(escape(atob(b64)));
                    const parsed = JSON.parse(jsonStr);
                    if (parsed && typeof parsed === 'object') {
                        Object.keys(CONFIG).forEach((k) => {
                            if (parsed[k] !== undefined) CONFIG[k] = parsed[k];
                        });
                        if (typeof parsed.mode === 'number' && VIS_MODS[parsed.mode]) {
                            APP_STATE.mode = parsed.mode;
                        }
                    }
                } catch (e) {}
            }
        } catch (e) {}
    }

    function setMode(n) {
        if (!VIS_MODS[n]) return;
        APP_STATE.mode = n;
        UI.updateModeDisplay();
        UI.updateModeCards();
        persistConfig();
    }

    function getExportDimensions(qualityTier, aspectRatio) {
        const baseShort = { '720': 720, '1080': 1080, '1440': 1440, '2160': 2160 }[String(qualityTier)] || 1080;
        const baseLong = { '720': 1280, '1080': 1920, '1440': 2560, '2160': 3840 }[String(qualityTier)] || 1920;
        const even = (n) => Math.round(n / 2) * 2;
        switch (aspectRatio) {
            case '9:16':
                return { width: even(baseShort), height: even(baseLong) };
            case '1:1':
                return { width: even(baseShort), height: even(baseShort) };
            case '4:5':
                return { width: even(baseShort), height: even(baseShort * 1.25) };
            case '16:9':
            default:
                return { width: even(baseLong), height: even(baseShort) };
        }
    }

    // ============================================
    // AUDIO ENGINE (WITH 3-BAND HARDWARE EQ)
    // ============================================

    class AudioEngine {
        constructor() {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.analyser = this.ctx.createAnalyser();
            this.gainNode = this.ctx.createGain();
            try {
                this.destinationNode = this.ctx.createMediaStreamDestination();
            } catch (e) {
                this.destinationNode = null;
            }

            this.bassFilter = this.ctx.createBiquadFilter();
            this.bassFilter.type = 'lowshelf';
            this.bassFilter.frequency.value = 110;

            this.midFilter = this.ctx.createBiquadFilter();
            this.midFilter.type = 'peaking';
            this.midFilter.frequency.value = 1000;
            this.midFilter.Q.value = 1.0;

            this.trebleFilter = this.ctx.createBiquadFilter();
            this.trebleFilter.type = 'highshelf';
            this.trebleFilter.frequency.value = 4200;

            this.analyser.fftSize = CONFIG.fftSize;
            this.analyser.smoothingTimeConstant = CONFIG.smoothing;
            this.analyser.minDecibels = CONFIG.minDecibels || -90;
            this.analyser.maxDecibels = CONFIG.maxDecibels || -10;

            const volEl = document.getElementById('vol-slider');
            this.gainNode.gain.value = Math.min(parseFloat(volEl ? volEl.value : 0.8) || 0.8, 1);

            this.micSource = null;
            this.micStream = null;
            this.audioElement = new Audio();
            this.audioElement.preload = 'auto';
            window.__wfAudioElement = this.audioElement;

            this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);
            this.sourceNode.connect(this.bassFilter);
            this.bassFilter.connect(this.midFilter);
            this.midFilter.connect(this.trebleFilter);
            this.trebleFilter.connect(this.analyser);
            this.analyser.connect(this.gainNode);
            this.gainNode.connect(this.ctx.destination);
            if (this.destinationNode) this.analyser.connect(this.destinationNode);

            this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
            this.waveData = new Uint8Array(this.analyser.fftSize);

            this.fileURL = null;
            this.updateSettings();

            this.audioElement.addEventListener('ended', () => {
                APP_STATE.isPlaying = false;
                UI.updatePlayButton();
                if (APP_STATE.isRecording && !APP_STATE.isFastExporting) {
                    Exporter.stop(false);
                }
            });

            this.audioElement.addEventListener('timeupdate', () => UI.updateProgressBar());
            this.audioElement.addEventListener('loadedmetadata', () => UI.updateProgressBar());
        }

        async resume() {
            if (this.ctx.state === 'suspended') {
                try {
                    await this.ctx.resume();
                } catch (e) {}
            }
        }

        async playFile(url, label) {
            this.resume();
            this.stopMic();
            if (this.fileURL && this.fileURL !== url && this.fileURL.startsWith('blob:')) {
                try { URL.revokeObjectURL(this.fileURL); } catch (e) {}
            }
            if (APP_STATE.decodedAudioSrc && APP_STATE.decodedAudioSrc !== url) {
                APP_STATE.decodedAudioBuffer = null;
                APP_STATE.decodedAudioSrc = null;
            }
            this.fileURL = url;
            APP_STATE.trackTitleLabel = label || '';
            this.audioElement.pause();
            this.audioElement.src = url;
            this.audioElement.currentTime = 0;

            const onboard = document.getElementById('studio-onboarding');
            if (onboard) onboard.classList.add('hidden-card');

            // Offline Pre-Analysis: Listen to full track first, compute BPM, drops & predictive shake map!
            if (CONFIG.predictiveEnabled) {
                try {
                    await PredictiveChoreographer.analyzeUrl(url, this.ctx);
                } catch (err) {
                    PredictiveChoreographer.clear();
                }
            } else {
                PredictiveChoreographer.clear();
            }

            this.updateSettings();
            this.audioElement.play().then(() => {
                APP_STATE.isPlaying = true;
                UI.updatePlayButton();
                const bpmTxt = APP_STATE.predBpm ? ` • ${APP_STATE.predBpm} BPM` : '';
                const dropTxt = APP_STATE.predDrops.length ? ` • ${APP_STATE.predDrops.length} drops predicted` : '';
                UI.showToast(`🧠 Synced & playing${bpmTxt}${dropTxt}!`, 'success');
            }).catch(() => {
                APP_STATE.isPlaying = false;
                UI.updatePlayButton();
                UI.showToast('Track analyzed! Tap Play (▶) to start', 'info');
            });
        }

        togglePlay() {
            this.resume();
            if (this.micSource) return;

            if (this.audioElement.paused) {
                if (!this.hasAudio()) {
                    UI.showToast('Loading built-in demo track...', 'info');
                    UI.loadDemoTrack();
                    return;
                }
                this.audioElement.play().then(() => {
                    APP_STATE.isPlaying = true;
                    UI.updatePlayButton();
                }).catch(() => {});
            } else {
                this.audioElement.pause();
                APP_STATE.isPlaying = false;
                UI.updatePlayButton();
            }
        }

        stop() {
            this.stopMic();
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            APP_STATE.isPlaying = false;
            UI.updatePlayButton();
            UI.updateProgressBar();
        }

        async enableMic() {
            if (this.micSource) {
                this.stopMic();
                APP_STATE.isPlaying = false;
                UI.updatePlayButton();
                UI.showToast('Microphone disabled', 'info');
                return;
            }

            await this.resume();
            this.stop();

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                this.micStream = stream;
                this.micSource = this.ctx.createMediaStreamSource(stream);
                this.micSource.connect(this.bassFilter);
                APP_STATE.isPlaying = true;
                UI.showToast('🎤 Microphone active', 'success');
                document.getElementById('status-text').textContent = 'Mic Active';
                document.getElementById('btn-mic').classList.add('active');
            } catch (err) {
                UI.showToast('Microphone permission denied', 'error');
            }
        }

        stopMic() {
            if (this.micSource) {
                try { this.micSource.disconnect(); } catch (e) {}
                this.micSource = null;
            }
            if (this.micStream) {
                try {
                    this.micStream.getTracks().forEach(track => track.stop());
                } catch (e) {}
                this.micStream = null;
            }
            const micBtn = document.getElementById('btn-mic');
            if (micBtn) micBtn.classList.remove('active');
        }

        updateSettings() {
            if (this.analyser.fftSize !== CONFIG.fftSize) {
                try { this.analyser.fftSize = CONFIG.fftSize; } catch (e) {}
            }
            this.analyser.smoothingTimeConstant = CONFIG.smoothing;
            this.analyser.minDecibels = CONFIG.minDecibels || -90;
            this.analyser.maxDecibels = CONFIG.maxDecibels || -10;

            const volEl = document.getElementById('vol-slider');
            const vol = Math.min(parseFloat(volEl ? volEl.value : 0.8), 1);
            const safeVol = isNaN(vol) ? 0.8 : vol;
            this.gainNode.gain.value = APP_STATE.isMuted ? 0 : safeVol;
            if (this.audioElement) {
                this.audioElement.loop = Boolean(APP_STATE.isLooping);
                this.audioElement.playbackRate = APP_STATE.playbackSpeed || 1;
            }

            this.bassFilter.gain.value = Number(CONFIG.eqBass) || 0;
            this.midFilter.gain.value = Number(CONFIG.eqMid) || 0;
            this.trebleFilter.gain.value = Number(CONFIG.eqTreble) || 0;

            if (this.freqData.length !== this.analyser.frequencyBinCount) {
                this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
                this.waveData = new Uint8Array(this.analyser.fftSize);
            }
        }

        getAnalysis() {
            this.analyser.getByteFrequencyData(this.freqData);
            this.analyser.getByteTimeDomainData(this.waveData);
            return { freq: this.freqData, wave: this.waveData };
        }

        getAudioStream() {
            return this.destinationNode.stream;
        }

        hasAudio() {
            return Boolean(this.audioElement.src && this.audioElement.src !== '' && this.audioElement.src !== window.location.href);
        }

        getDuration() {
            return this.audioElement.duration || 0;
        }

        getCurrentTime() {
            return this.audioElement.currentTime || 0;
        }
    }

    // ============================================
    // PREDICTIVE LOOKAHEAD AUDIO CHOREOGRAPHER (v9.0)
    // Pre-analyzes entire song before playback to predict BPM,
    // build-ups, true drops, and mathematically optimal shake/zoom/flash!
    // ============================================

    const PredictiveChoreographer = {
        fps: 60,
        duration: 0,
        totalFrames: 0,
        shake: null,
        zoom: null,
        buildup: null,
        flash: null,
        energy: null,
        dropTimes: [],
        bpm: 0,

        clear() {
            this.duration = 0;
            this.totalFrames = 0;
            this.shake = this.zoom = this.buildup = this.flash = this.energy = null;
            this.dropTimes = [];
            this.bpm = 0;
            APP_STATE.hasPredictiveMap = false;
            APP_STATE.predShake = APP_STATE.predZoom = APP_STATE.predBuildup = APP_STATE.predFlash = APP_STATE.predEnergy = 0;
            APP_STATE.predBpm = 0;
            APP_STATE.predDrops = [];
            const bpmEl = document.getElementById('bpm-badge');
            if (bpmEl) bpmEl.classList.add('hidden');
            const markersEl = document.getElementById('seek-markers');
            if (markersEl) markersEl.innerHTML = '';
        },

        _setOverlay(show, title, sub, pct) {
            const ov = document.getElementById('analysis-overlay');
            if (!ov) return;
            ov.classList.toggle('hidden', !show);
            const tEl = document.getElementById('analysis-title');
            const sEl = document.getElementById('analysis-sub');
            const fEl = document.getElementById('analysis-fill');
            if (tEl && title) tEl.textContent = title;
            if (sEl && sub) sEl.textContent = sub;
            if (fEl && typeof pct === 'number') fEl.style.width = Math.max(0, Math.min(100, pct)) + '%';
        },

        async analyzeUrl(url, audioCtx) {
            this._setOverlay(true, '🧠 Listening to Track...', 'Decoding full audio waveform for mathematical prediction', 18);
            await new Promise(r => setTimeout(r, 16));

            let decoded = (APP_STATE.decodedAudioSrc === url && APP_STATE.decodedAudioBuffer)
                ? APP_STATE.decodedAudioBuffer
                : null;

            if (!decoded) {
                const resp = await fetch(url);
                const ab = await resp.arrayBuffer();
                this._setOverlay(true, '🧠 Computing Bass & Transients...', 'Running full-song sub-bass & onset flux math', 45);
                await new Promise(r => setTimeout(r, 16));
                decoded = await audioCtx.decodeAudioData(ab.slice(0));
                APP_STATE.decodedAudioBuffer = decoded;
                APP_STATE.decodedAudioSrc = url;
            }

            this._setOverlay(true, '⚡ Predicting Drops & Shake Map...', 'Calculating lookahead build-ups, BPM & impact physics', 75);
            await new Promise(r => setTimeout(r, 16));

            this.analyzeBuffer(decoded);

            this._setOverlay(true, '✨ Choreography Ready!', `${this.bpm} BPM • ${this.dropTimes.length} drops locked in`, 100);
            await new Promise(r => setTimeout(r, 180));
            this._setOverlay(false);
        },

        analyzeBuffer(audioBuffer) {
            const sr = audioBuffer.sampleRate;
            const len = audioBuffer.length;
            const duration = audioBuffer.duration;
            const ch0 = audioBuffer.getChannelData(0);
            const ch1 = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : null;

            const fps = this.fps;
            const totalFrames = Math.max(1, Math.ceil(duration * fps));
            const hop = Math.max(1, Math.floor(sr / fps));

            const rawBass = new Float32Array(totalFrames);
            const rawRms = new Float32Array(totalFrames);
            const rawFlux = new Float32Array(totalFrames);

            // Fast 1-pole low-pass filter (~135Hz) for sub-bass kick isolation
            const lpAlpha = Math.min(0.25, (2 * Math.PI * 135) / sr);
            let lp = 0;
            let prevBass = 0;

            for (let f = 0; f < totalFrames; f++) {
                const start = f * hop;
                const end = Math.min(len, start + hop);
                let sumSq = 0;
                let bassSq = 0;
                const stride = hop > 1024 ? 2 : 1;
                let count = 0;
                for (let i = start; i < end; i += stride) {
                    const s = ch1 ? (ch0[i] + ch1[i]) * 0.5 : ch0[i];
                    lp += lpAlpha * (s - lp);
                    sumSq += s * s;
                    bassSq += lp * lp;
                    count++;
                }
                const rms = Math.sqrt(sumSq / Math.max(1, count));
                const bass = Math.sqrt(bassSq / Math.max(1, count));
                rawRms[f] = rms;
                rawBass[f] = bass;
                rawFlux[f] = Math.max(0, bass - prevBass);
                prevBass = bass;
            }

            // Whole-song 95th-percentile normalization so quiet & loud songs both scale accurately
            const sortedBass = Array.from(rawBass).sort((a, b) => a - b);
            const sortedFlux = Array.from(rawFlux).sort((a, b) => a - b);
            const bassRef = Math.max(0.001, sortedBass[Math.floor(sortedBass.length * 0.96)] || 0.1);
            const fluxRef = Math.max(0.0005, sortedFlux[Math.floor(sortedFlux.length * 0.97)] || 0.05);

            const normBass = new Float32Array(totalFrames);
            const normFlux = new Float32Array(totalFrames);
            for (let f = 0; f < totalFrames; f++) {
                normBass[f] = Math.min(1.4, rawBass[f] / bassRef);
                normFlux[f] = Math.min(1.5, rawFlux[f] / fluxRef);
            }

            // Prefix sum of bass energy for O(1) lookback & lookahead window averages
            const prefix = new Float32Array(totalFrames + 1);
            for (let f = 0; f < totalFrames; f++) prefix[f + 1] = prefix[f] + normBass[f];
            const winAvg = (a, b) => {
                const lo = Math.max(0, a);
                const hi = Math.min(totalFrames, b);
                return hi > lo ? (prefix[hi] - prefix[lo]) / (hi - lo) : 0;
            };

            // Detect True Musical Drops via 2.5s forward lookahead vs 2.0s lookback energy jump
            const lookBack = Math.round(fps * 2.0);
            const lookAhead = Math.round(fps * 2.2);
            const minDropGap = Math.round(fps * 6.0);
            const dropFrames = [];
            let lastDropF = -minDropGap;

            for (let f = Math.round(fps * 1.2); f < totalFrames - Math.round(fps * 0.8); f++) {
                if (f - lastDropF < minDropGap) continue;
                const before = winAvg(f - lookBack, f);
                const after = winAvg(f, f + lookAhead);
                const jump = after - before;
                if (normFlux[f] > 0.58 && normBass[f] > 0.62 && after > 0.52 && jump > 0.14) {
                    dropFrames.push(f);
                    lastDropF = f;
                }
            }

            // Fallback: if song is constant energy (e.g. short loop), pick strongest bass transient
            if (dropFrames.length === 0 && totalFrames > fps * 2) {
                let bestF = Math.round(fps * 1.5);
                let bestScore = 0;
                for (let f = Math.round(fps * 1.0); f < Math.min(totalFrames, fps * 18); f++) {
                    const sc = normFlux[f] * 0.65 + normBass[f] * 0.35;
                    if (sc > bestScore) { bestScore = sc; bestF = f; }
                }
                if (bestScore > 0.35) dropFrames.push(bestF);
            }

            // Auto-BPM estimation via autocorrelation on onset flux (75–180 BPM)
            const sampleLen = Math.min(totalFrames, fps * 35);
            const minLag = Math.round((fps * 60) / 180);
            const maxLag = Math.round((fps * 60) / 75);
            let bestLag = Math.round((fps * 60) / 130);
            let bestCorr = -1;
            for (let lag = minLag; lag <= maxLag; lag++) {
                let corr = 0;
                for (let i = 0; i < sampleLen - lag; i++) {
                    corr += normFlux[i] * normFlux[i + lag];
                }
                if (corr > bestCorr) { bestCorr = corr; bestLag = lag; }
            }
            const estBpm = Math.round((fps * 60) / Math.max(1, bestLag));

            // Precompute predictive choreography curves: buildup, shake, zoom, flash, energy
            const shakeArr = new Float32Array(totalFrames);
            const zoomArr = new Float32Array(totalFrames);
            const buildupArr = new Float32Array(totalFrames);
            const flashArr = new Float32Array(totalFrames);
            const energyArr = new Float32Array(totalFrames);

            // 1. Mark 2.5-second pre-drop anticipation build-ups & drop flashes
            const buildupLen = Math.round(fps * 2.5);
            const dropSet = new Set(dropFrames);
            for (const df of dropFrames) {
                for (let k = 1; k <= buildupLen; k++) {
                    const idx = df - k;
                    if (idx >= 0) {
                        const ramp = Math.pow(1 - k / buildupLen, 1.7);
                        if (ramp > buildupArr[idx]) buildupArr[idx] = ramp;
                    }
                }
            }

            // 2. Compute spring-damped shake, zoom punch & flash envelopes
            let shakeEnv = 0;
            let flashEnv = 0;
            for (let f = 0; f < totalFrames; f++) {
                const localE = winAvg(f - 15, f + 15);
                energyArr[f] = Math.min(1, localE);

                const isDrop = dropSet.has(f);
                const kickImpact = (normFlux[f] > 0.42 && normBass[f] > 0.48)
                    ? Math.min(1, normFlux[f] * 0.72 + normBass[f] * 0.35) * (0.45 + 0.65 * energyArr[f])
                    : 0;

                if (isDrop) {
                    shakeEnv = 1.25;
                    flashEnv = 1.0;
                } else if (kickImpact > shakeEnv) {
                    shakeEnv = kickImpact;
                    if (kickImpact > 0.88 && energyArr[f] > 0.62) {
                        flashEnv = Math.max(flashEnv, 0.38);
                    }
                }

                shakeArr[f] = Math.min(1.25, shakeEnv);
                zoomArr[f] = Math.min(1.2, shakeEnv * 0.85 + buildupArr[f] * 0.45);
                flashArr[f] = flashEnv;

                shakeEnv *= 0.84;
                flashEnv *= 0.80;
            }

            this.duration = duration;
            this.totalFrames = totalFrames;
            this.shake = shakeArr;
            this.zoom = zoomArr;
            this.buildup = buildupArr;
            this.flash = flashArr;
            this.energy = energyArr;
            this.dropTimes = dropFrames.map(f => f / fps);
            this.bpm = estBpm;

            APP_STATE.hasPredictiveMap = true;
            APP_STATE.predBpm = estBpm;
            APP_STATE.predDrops = this.dropTimes.slice();

            // Auto-sync AirPods intro beat-drop to first detected drop if in 1.5s–6.0s range
            if (this.dropTimes.length > 0 && this.dropTimes[0] >= 1.5 && this.dropTimes[0] <= 6.0) {
                const snapped = Math.round(this.dropTimes[0] * 2) / 2;
                CONFIG.phonkIntroDuration = snapped;
                const durEl = document.getElementById('set-phonk-intro-dur');
                if (durEl) durEl.value = snapped;
                if (typeof UI !== 'undefined' && UI.updateSliderLabels) {
                    UI.updateSliderLabels();
                    UI.syncAllRangeTracks();
                }
            }

            // Update BPM & Drop Markers UI
            const bpmEl = document.getElementById('bpm-badge');
            if (bpmEl) {
                bpmEl.textContent = `⚡ ${estBpm} BPM${this.dropTimes.length ? ' · ' + this.dropTimes.length + ' Drops' : ''}`;
                bpmEl.classList.remove('hidden');
            }
            const markersEl = document.getElementById('seek-markers');
            if (markersEl && duration > 0) {
                markersEl.innerHTML = '';
                this.dropTimes.forEach((dt, idx) => {
                    const pct = (dt / duration) * 100;
                    const pin = document.createElement('button');
                    pin.type = 'button';
                    pin.className = 'drop-marker';
                    pin.style.left = pct + '%';
                    pin.title = `Predicted Drop #${idx + 1} (${Math.floor(dt / 60)}:${String(Math.floor(dt % 60)).padStart(2, '0')}) — click to jump`;
                    pin.onclick = (e) => {
                        e.stopPropagation();
                        if (audio && audio.audioElement) {
                            audio.audioElement.currentTime = Math.max(0, dt - 1.5);
                            if (audio.audioElement.paused) audio.togglePlay();
                        }
                    };
                    markersEl.appendChild(pin);
                });
            }
        },

        sampleAt(timeSec) {
            if (!this.shake || !this.totalFrames) {
                APP_STATE.predShake = APP_STATE.predZoom = APP_STATE.predBuildup = APP_STATE.predFlash = APP_STATE.predEnergy = 0;
                return;
            }
            const fFloat = Math.max(0, Math.min(this.totalFrames - 1, timeSec * this.fps));
            const f0 = Math.floor(fFloat);
            const f1 = Math.min(this.totalFrames - 1, f0 + 1);
            const frac = fFloat - f0;
            const lerp = (arr) => arr[f0] + (arr[f1] - arr[f0]) * frac;
            const mul = typeof CONFIG.predictiveIntensity === 'number' ? CONFIG.predictiveIntensity : 1.1;

            APP_STATE.predShake = lerp(this.shake) * mul;
            APP_STATE.predZoom = lerp(this.zoom) * mul;
            APP_STATE.predBuildup = lerp(this.buildup);
            APP_STATE.predFlash = lerp(this.flash) * mul;
            APP_STATE.predEnergy = lerp(this.energy);
        }
    };

    // ============================================
    // BEAT DETECTOR
    // ============================================

    const BeatDetector = {
        history: [],
        prevEnergy: 0,

        update(freqData) {
            if (!CONFIG.beatEnabled) {
                APP_STATE.beatDetected = false;
                return false;
            }

            let energy = 0;
            const range = Math.max(1, Math.floor(freqData.length * 0.12));

            for (let i = 0; i < range; i++) {
                energy += freqData[i] * freqData[i];
            }
            energy = Math.sqrt(energy / range);

            const flux = Math.max(0, energy - this.prevEnergy);
            this.prevEnergy = energy;

            this.history.push(energy);
            if (this.history.length > 180) this.history.shift();

            const avg = this.history.reduce((a, b) => a + b, 0) / this.history.length;

            if (APP_STATE.beatTimer > 0) {
                APP_STATE.beatTimer--;
                APP_STATE.beatDetected = false;
                return false;
            }

            const levelBeat = energy > avg * CONFIG.beatThreshold && energy > 50;
            const fluxBeat = flux > avg * 0.35 && energy > avg * 0.85;

            if (levelBeat || fluxBeat) {
                APP_STATE.beatDetected = true;
                APP_STATE.beatTimer = 10;
                return true;
            }

            APP_STATE.beatDetected = false;
            return false;
        }
    };

    // ============================================
    // VIDEO EXPORTER + 8-SECOND AD-TIMER UNLOCK GATE
    // ============================================

    const Exporter = {
        _cancelFast: false,
        _cancelledMediaRecorder: false,
        _recordedMimeExt: 'webm',
        _recordedMimeType: 'video/webm',

        init() {
            document.getElementById('btn-export').onclick = () => this.showModal();
            document.getElementById('btn-close-export').onclick = () => this.hideModal();
            document.getElementById('btn-start-export').onclick = () => this.startRecording();
            document.getElementById('btn-cancel-export').onclick = () => this.stop(true);

            const unlockSponsorBtn = document.getElementById('btn-unlock-sponsor');
            if (unlockSponsorBtn) {
                unlockSponsorBtn.onclick = () => {
                    if (window.WaveForgeAds && window.WaveForgeAds.config.smartlink) {
                        window.open(window.WaveForgeAds.config.smartlink, '_blank', 'noopener,noreferrer');
                    }
                    this.triggerFinalDownload();
                };
            }

            const downloadReadyBtn = document.getElementById('btn-download-ready');
            if (downloadReadyBtn) {
                downloadReadyBtn.onclick = () => {
                    if (downloadReadyBtn.disabled) return;
                    this.triggerFinalDownload();
                };
            }

            document.querySelectorAll('.export-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    document.querySelectorAll('.export-option').forEach(o => o.classList.remove('selected'));
                    opt.classList.add('selected');
                });
            });

            const spotifyBtn = document.getElementById('btn-spotify-canvas-preset');
            if (spotifyBtn) {
                spotifyBtn.onclick = () => {
                    CONFIG.aspectRatio = '9:16';
                    const expAspect = document.getElementById('export-aspect');
                    const sAspect = document.getElementById('set-aspect');
                    if (expAspect) expAspect.value = '9:16';
                    if (sAspect) sAspect.value = '9:16';
                    const durEl = document.getElementById('export-duration');
                    if (durEl) durEl.value = '8';
                    const silentEl = document.getElementById('export-silent');
                    if (silentEl) silentEl.checked = true;
                    const q1080 = document.querySelector('input[name="export-quality"][value="1080"]');
                    if (q1080) {
                        q1080.checked = true;
                        document.querySelectorAll('.export-option').forEach(o => o.classList.remove('selected'));
                        q1080.closest('.export-option').classList.add('selected');
                    }
                    const startEl = document.getElementById('export-start-time');
                    if (startEl && APP_STATE.predDrops && APP_STATE.predDrops.length > 0) {
                        startEl.value = Math.max(0, (APP_STATE.predDrops[0] - 0.5)).toFixed(1);
                    }
                    spotifyBtn.classList.add('active-canvas');
                    persistConfig();
                    UI.showToast('🟢 Spotify Canvas ready: 1080×1920 • 8s • Silent MP4', 'success');
                };
            }
            const muteTestBtn = document.getElementById('btn-canvas-mute-test');
            if (muteTestBtn) {
                muteTestBtn.onclick = () => {
                    APP_STATE.isMuted = !APP_STATE.isMuted;
                    audio.updateSettings();
                    UI.syncMuteUI();
                    muteTestBtn.textContent = APP_STATE.isMuted ? '🔊 Unmute Preview' : '🔇 Test Muted';
                    UI.showToast(APP_STATE.isMuted ? '🔇 Muted Preview active (Spotify Canvas check)' : '🔊 Preview unmuted', 'info');
                };
            }
            const drop1Btn = document.getElementById('btn-export-drop1');
            if (drop1Btn) {
                drop1Btn.onclick = () => {
                    const startEl = document.getElementById('export-start-time');
                    if (!startEl) return;
                    if (APP_STATE.predDrops && APP_STATE.predDrops.length > 0) {
                        startEl.value = Math.max(0, APP_STATE.predDrops[0] - 1.0).toFixed(1);
                        UI.showToast(`⚡ Clip start set to Drop #1 (${startEl.value}s)`, 'success');
                    } else {
                        UI.showToast('Load a track first to detect Drop #1', 'info');
                    }
                };
            }

            const aspectSelect = document.getElementById('export-aspect');
            if (aspectSelect) {
                aspectSelect.value = CONFIG.aspectRatio || '9:16';
                aspectSelect.addEventListener('change', (e) => {
                    CONFIG.aspectRatio = e.target.value;
                    const sAspect = document.getElementById('set-aspect');
                    if (sAspect) sAspect.value = CONFIG.aspectRatio;
                    persistConfig();
                });
            }
        },

        _clearUnlockGate(revokePending = false) {
            if (APP_STATE.unlockTimerId) {
                clearInterval(APP_STATE.unlockTimerId);
                APP_STATE.unlockTimerId = null;
            }
            if (revokePending && APP_STATE.pendingExportBlobUrl) {
                try { URL.revokeObjectURL(APP_STATE.pendingExportBlobUrl); } catch (e) {}
                APP_STATE.pendingExportBlobUrl = null;
                APP_STATE.pendingExportFilename = null;
            }
            const gate = document.getElementById('export-unlock-gate');
            if (gate) gate.classList.add('hidden');
            const startBtn = document.getElementById('btn-start-export');
            if (startBtn) startBtn.style.display = 'inline-flex';
        },

        _presentAdUnlockGate(blobUrl, filename, summaryText) {
            if (APP_STATE.pendingExportBlobUrl && APP_STATE.pendingExportBlobUrl !== blobUrl) {
                try { URL.revokeObjectURL(APP_STATE.pendingExportBlobUrl); } catch (e) {}
            }
            APP_STATE.pendingExportBlobUrl = blobUrl;
            APP_STATE.pendingExportFilename = filename;

            document.getElementById('btn-start-export').style.display = 'none';
            document.getElementById('btn-cancel-export').style.display = 'none';
            document.getElementById('export-progress').classList.remove('active');

            const gate = document.getElementById('export-unlock-gate');
            const summaryEl = document.getElementById('unlock-gate-summary');
            const dlBtn = document.getElementById('btn-download-ready');
            const timerFill = document.getElementById('unlock-timer-fill');
            if (!gate || !dlBtn) {
                this.triggerFinalDownload();
                return;
            }

            if (summaryEl) summaryEl.textContent = summaryText || '✅ Your video is rendered and ready!';
            gate.classList.remove('hidden');

            // Refresh modal ad banner right when user enters the 8-second unlock gate
            if (window.WaveForgeAds) {
                window.WaveForgeAds.mountResponsiveBanner(document.getElementById('export-ad-slot'), { compact: true, eager: true });
            }

            let secondsLeft = 8;
            dlBtn.disabled = true;
            dlBtn.innerHTML = `<span>⏳ Viewing Sponsor Ad... (${secondsLeft}s)</span>`;
            if (timerFill) timerFill.style.width = '0%';

            if (APP_STATE.unlockTimerId) clearInterval(APP_STATE.unlockTimerId);
            APP_STATE.unlockTimerId = setInterval(() => {
                secondsLeft--;
                const pct = Math.min(100, ((8 - secondsLeft) / 8) * 100);
                if (timerFill) timerFill.style.width = pct + '%';

                if (secondsLeft <= 0) {
                    clearInterval(APP_STATE.unlockTimerId);
                    APP_STATE.unlockTimerId = null;
                    dlBtn.disabled = false;
                    dlBtn.innerHTML = '<span>⬇️ Download Video Now (Unlocked)</span>';
                    UI.showToast('🔓 Video download unlocked!', 'success');
                } else {
                    dlBtn.innerHTML = `<span>⏳ Viewing Sponsor Ad... (${secondsLeft}s)</span>`;
                }
            }, 1000);
        },

        triggerFinalDownload() {
            if (!APP_STATE.pendingExportBlobUrl) return;
            if (APP_STATE.unlockTimerId) {
                clearInterval(APP_STATE.unlockTimerId);
                APP_STATE.unlockTimerId = null;
            }
            const a = document.createElement('a');
            a.href = APP_STATE.pendingExportBlobUrl;
            a.download = APP_STATE.pendingExportFilename || `waveforge_${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            const urlToRevoke = APP_STATE.pendingExportBlobUrl;
            setTimeout(() => { try { URL.revokeObjectURL(urlToRevoke); } catch (e) {} }, 60000);
            APP_STATE.pendingExportBlobUrl = null;
            APP_STATE.pendingExportFilename = null;

            UI.showToast('🎉 Downloading your video!', 'success');
            this._clearUnlockGate(false);
            this.hideModal();
        },

        _hasFastExportApis() {
            return typeof window !== 'undefined'
                && 'VideoEncoder' in window
                && 'AudioEncoder' in window
                && 'VideoFrame' in window
                && 'AudioData' in window
                && typeof window.Mp4Muxer !== 'undefined'
                && typeof OfflineAudioContext !== 'undefined';
        },

        // Expanded H.264 / AVC profiles & levels for full Android / iOS / Desktop compatibility
        _videoCodecCandidates: [
            'avc1.640034',
            'avc1.640033',
            'avc1.640032',
            'avc1.64002A',
            'avc1.640029',
            'avc1.640028',
            'avc1.64001F',
            'avc1.4D4034',
            'avc1.4D4033',
            'avc1.4D4032',
            'avc1.4D402A',
            'avc1.4D4029',
            'avc1.4D4028',
            'avc1.4D401F',
            'avc1.42E034',
            'avc1.42E033',
            'avc1.42E032',
            'avc1.42E02A',
            'avc1.42E028',
            'avc1.42E01F',
            'avc1.420028',
            'avc1.42001F'
        ],

        async _pickVideoCodec(width, height, fps, bitrate) {
            const accelModes = ['prefer-hardware', 'no-preference', 'prefer-software'];
            for (const hardwareAcceleration of accelModes) {
                for (const codec of this._videoCodecCandidates) {
                    try {
                        const cfg = {
                            codec,
                            width,
                            height,
                            framerate: fps,
                            bitrate,
                            hardwareAcceleration,
                            latencyMode: 'realtime',
                            avc: { format: 'avc' }
                        };
                        const support = await VideoEncoder.isConfigSupported(cfg);
                        if (support && support.supported) return support.config;
                    } catch (e) {}
                }
            }
            return null;
        },

        async _negotiateBestVideoConfig(quality, aspectRatio, requestedFps) {
            const bitrates = { '720': 5_000_000, '1080': 8_500_000, '1440': 14_000_000, '2160': 24_000_000 };
            const tierOrder = ['2160', '1440', '1080', '720'];
            const startIdx = Math.max(0, tierOrder.indexOf(String(quality)));
            const candidateTiers = tierOrder.slice(startIdx);
            const fpsCandidates = requestedFps > 30 ? [requestedFps, 30] : [requestedFps];

            for (const tier of candidateTiers) {
                const { width, height } = getExportDimensions(tier, aspectRatio);
                const br = bitrates[tier] || 8_500_000;
                for (const fpsTry of fpsCandidates) {
                    const cfg = await this._pickVideoCodec(width, height, fpsTry, br);
                    if (cfg) {
                        return {
                            videoCfg: cfg,
                            width,
                            height,
                            fps: fpsTry,
                            tier,
                            downgraded: tier !== String(quality) || fpsTry !== requestedFps
                        };
                    }
                }
            }
            return null;
        },

        async _pickAudioCodec(sampleRate, channels) {
            const rates = [sampleRate, 48000, 44100];
            for (const sr of rates) {
                try {
                    const cfg = { codec: 'mp4a.40.2', sampleRate: sr, numberOfChannels: channels, bitrate: 192000 };
                    const support = await AudioEncoder.isConfigSupported(cfg);
                    if (support && support.supported) return support.config;
                } catch (e) {}
            }
            return null;
        },

        async _checkFastExportSupport() {
            if (!this._hasFastExportApis()) return { supported: false, reason: 'apis' };
            const v = await this._pickVideoCodec(720, 1280, 30, 5_000_000) || await this._pickVideoCodec(1280, 720, 30, 5_000_000);
            if (!v) return { supported: false, reason: 'video-codec' };
            const a = await this._pickAudioCodec(48000, 2);
            if (!a) return { supported: false, reason: 'audio-codec' };
            return { supported: true };
        },

        async _refreshEngineNote() {
            const note = document.getElementById('export-engine-note');
            if (!note) return;
            const result = await this._checkFastExportSupport().catch(() => ({ supported: false }));
            if (result.supported) {
                note.textContent = '⚡ Turbo Zero-Suspend Engine active — hardware H.264 MP4 + Radix-2 FFT.';
                note.style.background = 'rgba(16, 185, 129, 0.08)';
                note.style.color = '#34d399';
                note.style.borderColor = 'rgba(16, 185, 129, 0.25)';
            } else {
                note.textContent = '⏺ Realtime recording mode active.';
                note.style.background = 'rgba(255, 200, 80, 0.08)';
                note.style.color = '#ffc850';
                note.style.borderColor = 'rgba(255, 200, 80, 0.25)';
            }
        },

        showModal() {
            if (!audio.hasAudio()) {
                UI.showToast('Loading built-in demo track so you can test export...', 'info');
                UI.loadDemoTrack();
            }
            this._clearUnlockGate(true);
            const isMobileDevice = window.innerWidth < 820 || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);
            if (isMobileDevice && !this._mobileDefaultApplied) {
                this._mobileDefaultApplied = true;
                const fpsEl = document.getElementById('export-fps');
                if (fpsEl) fpsEl.value = '30';
                const q1080 = document.querySelector('input[name="export-quality"][value="1080"]');
                if (q1080) {
                    q1080.checked = true;
                    document.querySelectorAll('.export-option').forEach(o => o.classList.remove('selected'));
                    q1080.closest('.export-option').classList.add('selected');
                }
            }
            const aspectSelect = document.getElementById('export-aspect');
            if (aspectSelect) aspectSelect.value = CONFIG.aspectRatio || '9:16';
            document.getElementById('export-modal').classList.add('open');
            this._refreshEngineNote();
            if (window.WaveForgeAds) {
                window.WaveForgeAds.startModalAdRefresh('export-ad-slot', true);
                window.WaveForgeAds.injectSocialBar(500);
            }
        },

        hideModal() {
            if (APP_STATE.isRecording) {
                UI.showToast('Cancel the active render first to close', 'warning');
                return;
            }
            this._clearUnlockGate(true);
            document.getElementById('export-modal').classList.remove('open');
            if (window.WaveForgeAds) {
                window.WaveForgeAds.stopModalAdRefresh();
            }
        },

        downloadBaseName() {
            const mod = VIS_MODS[APP_STATE.mode];
            const name = mod ? mod.name : 'visualization';
            return name.toLowerCase().replace(/\s+/g, '_');
        },

        _createFastFftAnalyzer(fftSize) {
            const N = fftSize;
            const halfN = N >> 1;
            const bits = Math.round(Math.log2(N));
            const rev = new Uint32Array(N);
            for (let i = 0; i < N; i++) {
                let x = i, y = 0;
                for (let j = 0; j < bits; j++) { y = (y << 1) | (x & 1); x >>= 1; }
                rev[i] = y;
            }
            const win = new Float32Array(N);
            for (let i = 0; i < N; i++) {
                const a0 = 0.42, a1 = 0.5, a2 = 0.08;
                const w = 2 * Math.PI * i / (N - 1);
                win[i] = a0 - a1 * Math.cos(w) + a2 * Math.cos(2 * w);
            }
            const cosTable = new Float32Array(halfN);
            const sinTable = new Float32Array(halfN);
            for (let i = 0; i < halfN; i++) {
                const ang = -2 * Math.PI * i / N;
                cosTable[i] = Math.cos(ang);
                sinTable[i] = Math.sin(ang);
            }
            const re = new Float32Array(N);
            const im = new Float32Array(N);
            const smoothMag = new Float32Array(halfN);
            const minDb = CONFIG.minDecibels || -90;
            const maxDb = CONFIG.maxDecibels || -10;
            const dbScale = 255 / (maxDb - minDb);
            const invN = 1 / N;

            return {
                extractFrame(monoPcm, sampleIndex, smoothing, freqOut, waveOut) {
                    const pcmLen = monoPcm.length;
                    for (let i = 0; i < N; i++) {
                        const idx = sampleIndex + i;
                        const s = (idx >= 0 && idx < pcmLen) ? monoPcm[idx] : 0;
                        if (i < waveOut.length) {
                            waveOut[i] = Math.max(0, Math.min(255, Math.round((s + 1) * 128)));
                        }
                        re[rev[i]] = s * win[i];
                        im[rev[i]] = 0;
                    }
                    for (let size = 2; size <= N; size <<= 1) {
                        const half = size >> 1;
                        const step = N / size;
                        for (let i = 0; i < N; i += size) {
                            for (let j = 0; j < half; j++) {
                                const k = j * step;
                                const tre = re[i + j + half] * cosTable[k] - im[i + j + half] * sinTable[k];
                                const tim = re[i + j + half] * sinTable[k] + im[i + j + half] * cosTable[k];
                                re[i + j + half] = re[i + j] - tre;
                                im[i + j + half] = im[i + j] - tim;
                                re[i + j] += tre;
                                im[i + j] += tim;
                            }
                        }
                    }
                    const outBins = Math.min(halfN, freqOut.length);
                    for (let i = 0; i < outBins; i++) {
                        const mag = Math.hypot(re[i], im[i]) * invN;
                        const sm = smoothing * smoothMag[i] + (1 - smoothing) * mag;
                        smoothMag[i] = sm;
                        const db = sm > 1e-12 ? 20 * Math.log10(sm) : minDb;
                        const byteVal = (db - minDb) * dbScale;
                        freqOut[i] = byteVal <= 0 ? 0 : (byteVal >= 255 ? 255 : byteVal | 0);
                    }
                }
            };
        },

        async startRecording() {
            if (APP_STATE.isRecording) return;
            this._clearUnlockGate(true);

            const aspectSelect = document.getElementById('export-aspect');
            if (aspectSelect) {
                CONFIG.aspectRatio = aspectSelect.value;
                const sAspect = document.getElementById('set-aspect');
                if (sAspect) sAspect.value = CONFIG.aspectRatio;
                persistConfig();
            }

            const support = await this._checkFastExportSupport().catch(() => ({ supported: false }));
            if (support.supported) {
                try {
                    await this.startFastExport();
                    return;
                } catch (err) {
                    console.error('Fast export failed, falling back to MediaRecorder:', err);
                    UI.showToast('Fast export fallback — using realtime recording', 'warning');
                    APP_STATE.isFastExporting = false;
                    APP_STATE.exportTime = null;
                    APP_STATE.isRecording = false;
                    this._cancelFast = false;
                }
            }
            await this._startMediaRecorderExport();
        },

        _pickMediaRecorderMime() {
            if (typeof MediaRecorder === 'undefined') return { mimeType: '', ext: 'webm' };
            const candidates = [
                { mimeType: 'video/mp4;codecs=avc1,mp4a.40.2', ext: 'mp4' },
                { mimeType: 'video/mp4', ext: 'mp4' },
                { mimeType: 'video/webm;codecs=vp9,opus', ext: 'webm' },
                { mimeType: 'video/webm;codecs=vp8,opus', ext: 'webm' },
                { mimeType: 'video/webm', ext: 'webm' }
            ];
            for (const c of candidates) {
                try {
                    if (MediaRecorder.isTypeSupported(c.mimeType)) return c;
                } catch (e) {}
            }
            return { mimeType: '', ext: 'webm' };
        },

        async _startMediaRecorderExport() {
            if (APP_STATE.isRecording) return;

            const quality = document.querySelector('input[name="export-quality"]:checked').value;
            const durationSetting = document.getElementById('export-duration').value;
            const fps = parseInt(document.getElementById('export-fps').value, 10) || 30;
            const modeSelect = document.getElementById('export-mode').value;

            if (modeSelect !== 'current') {
                setMode(parseInt(modeSelect, 10));
            }

            const { width, height } = getExportDimensions(quality, CONFIG.aspectRatio);

            APP_STATE.exportCanvas = document.createElement('canvas');
            APP_STATE.exportCanvas.width = width;
            APP_STATE.exportCanvas.height = height;
            APP_STATE.exportCtx = APP_STATE.exportCanvas.getContext('2d');

            const trackDur = audio.getDuration() || 30;
            if ((APP_STATE.mode === 12 && CONFIG.phonkIntroEnabled) || durationSetting === 'full' || (trackDur - audio.getCurrentTime() < 2)) {
                audio.audioElement.currentTime = 0;
            }

            let maxDuration = Math.max(1, (audio.getDuration() || 30) - audio.getCurrentTime());
            if (durationSetting !== 'full') {
                maxDuration = Math.min(maxDuration, parseInt(durationSetting, 10));
            }

            APP_STATE.isRecording = true;
            this._cancelledMediaRecorder = false;
            APP_STATE.recordedChunks = [];
            APP_STATE.recordingStartTime = audio.getCurrentTime();
            APP_STATE.recordingDuration = maxDuration;

            const canvasStream = APP_STATE.exportCanvas.captureStream(fps);
            const audioStream = audio.getAudioStream();
            const audioTracks = audioStream.getAudioTracks();

            if (audioTracks.length > 0) {
                canvasStream.addTrack(audioTracks[0]);
            }

            const picked = this._pickMediaRecorderMime();
            this._recordedMimeExt = picked.ext;
            this._recordedMimeType = picked.mimeType || 'video/webm';

            const recOptions = {
                videoBitsPerSecond: quality === '2160' ? 20000000 : quality === '1440' ? 12000000 : 8000000
            };
            if (picked.mimeType) recOptions.mimeType = picked.mimeType;

            APP_STATE.mediaRecorder = new MediaRecorder(canvasStream, recOptions);

            APP_STATE.mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    APP_STATE.recordedChunks.push(e.data);
                }
            };

            APP_STATE.mediaRecorder.onstop = () => this.finishRecording();
            APP_STATE.mediaRecorder.start(100);

            if (audio.audioElement.paused) {
                audio.audioElement.play().catch(() => {});
                APP_STATE.isPlaying = true;
                UI.updatePlayButton();
            }

            document.getElementById('btn-start-export').style.display = 'none';
            document.getElementById('btn-cancel-export').style.display = 'block';
            document.getElementById('export-progress').classList.add('active');
            document.getElementById('status-dot').classList.add('recording');
            document.getElementById('status-text').textContent = 'Recording...';

            UI.showToast('Recording started', 'info');
            this.monitorProgress();
        },

        monitorProgress() {
            if (!APP_STATE.isRecording || APP_STATE.isFastExporting) return;

            const elapsed = Math.max(0, audio.getCurrentTime() - APP_STATE.recordingStartTime);
            const progress = Math.min((elapsed / Math.max(0.1, APP_STATE.recordingDuration)) * 100, 100);

            document.getElementById('progress-fill').style.width = progress + '%';
            document.getElementById('progress-percent').textContent = Math.round(progress) + '%';
            document.getElementById('progress-status').textContent = `Recording... ${this.formatTime(elapsed)} / ${this.formatTime(APP_STATE.recordingDuration)}`;

            if (elapsed >= APP_STATE.recordingDuration) {
                this.stop(false);
                return;
            }

            requestAnimationFrame(() => this.monitorProgress());
        },

        stop(userCancelled = true) {
            if (!APP_STATE.isRecording) return;

            if (APP_STATE.isFastExporting) {
                this._cancelFast = true;
                document.getElementById('status-dot').classList.remove('recording');
                document.getElementById('status-text').textContent = 'Cancelling…';
                return;
            }

            this._cancelledMediaRecorder = Boolean(userCancelled);
            APP_STATE.isRecording = false;

            if (APP_STATE.mediaRecorder && APP_STATE.mediaRecorder.state !== 'inactive') {
                try { APP_STATE.mediaRecorder.stop(); } catch (e) {}
            }

            document.getElementById('status-dot').classList.remove('recording');
            document.getElementById('status-text').textContent = userCancelled ? 'Ready' : 'Processing...';
        },

        async startFastExport() {
            const quality = document.querySelector('input[name="export-quality"]:checked').value;
            const durationSetting = document.getElementById('export-duration').value;
            const requestedFps = parseInt(document.getElementById('export-fps').value, 10) || 60;
            const modeSelect = document.getElementById('export-mode').value;

            if (modeSelect !== 'current') {
                setMode(parseInt(modeSelect, 10));
            }

            const negotiated = await this._negotiateBestVideoConfig(quality, CONFIG.aspectRatio, requestedFps);
            if (!negotiated) {
                throw new Error('No supported H.264 hardware encoder found');
            }
            const { videoCfg, width, height, fps, downgraded } = negotiated;
            if (downgraded) {
                UI.showToast(`⚡ Adjusted to ${width}×${height} @ ${fps}fps for your device's hardware encoder`, 'info');
            }

            this._setStatus('Decoding audio…', 0);
            const srcUrl = audio.audioElement.src;
            if (!srcUrl) throw new Error('No audio source loaded');

            let decoded = APP_STATE.decodedAudioBuffer;
            if (!decoded || APP_STATE.decodedAudioSrc !== srcUrl) {
                const resp = await fetch(srcUrl);
                const buf = await resp.arrayBuffer();
                decoded = await audio.ctx.decodeAudioData(buf);
                APP_STATE.decodedAudioBuffer = decoded;
                APP_STATE.decodedAudioSrc = srcUrl;
            }

            const targetAudioRate = decoded.sampleRate;
            const audioCfg = await this._pickAudioCodec(targetAudioRate, Math.min(2, decoded.numberOfChannels));
            if (!audioCfg) throw new Error('No supported AAC encoder for ' + targetAudioRate + 'Hz');

            const isSilentExport = Boolean(document.getElementById('export-silent') && document.getElementById('export-silent').checked);
            const startInputEl = document.getElementById('export-start-time');
            const requestedStart = startInputEl ? Math.max(0, parseFloat(startInputEl.value) || 0) : 0;
            const startTime = durationSetting === 'full'
                ? 0
                : Math.min(Math.max(0, decoded.duration - 1.0), requestedStart);

            let clipDuration = decoded.duration - startTime;
            if (durationSetting !== 'full') clipDuration = Math.min(clipDuration, parseInt(durationSetting, 10));
            if (clipDuration <= 0.05) throw new Error('Nothing to export from current position');

            const totalFrames = Math.max(1, Math.floor(clipDuration * fps));

            const wasPlaying = !audio.audioElement.paused;
            if (wasPlaying) {
                audio.audioElement.pause();
                APP_STATE.isPlaying = false;
                UI.updatePlayButton();
            }

            APP_STATE.isRecording = true;
            APP_STATE.isFastExporting = true;
            this._cancelFast = false;
            this._showProgressUI();
            document.getElementById('status-dot').classList.add('recording');
            document.getElementById('status-text').textContent = 'Turbo export…';
            UI.showToast('⚡ Turbo export started (' + width + '×' + height + ')', 'info');

            const savedState = this._saveAndResetVizState();

            this._setStatus('Pre-rendering 3-band EQ audio…', 2);
            const numChannels = Math.min(2, decoded.numberOfChannels);
            const renderSampleRate = audioCfg.sampleRate || decoded.sampleRate;
            let audioBuffer;
            try {
                const offlineCtx = new OfflineAudioContext(
                    numChannels,
                    Math.max(1, Math.ceil(clipDuration * renderSampleRate)),
                    renderSampleRate
                );
                const offlineSrc = offlineCtx.createBufferSource();
                offlineSrc.buffer = decoded;

                const offBass = offlineCtx.createBiquadFilter();
                offBass.type = 'lowshelf';
                offBass.frequency.value = 110;
                offBass.gain.value = Number(CONFIG.eqBass) || 0;

                const offMid = offlineCtx.createBiquadFilter();
                offMid.type = 'peaking';
                offMid.frequency.value = 1000;
                offMid.Q.value = 1.0;
                offMid.gain.value = Number(CONFIG.eqMid) || 0;

                const offTreble = offlineCtx.createBiquadFilter();
                offTreble.type = 'highshelf';
                offTreble.frequency.value = 4200;
                offTreble.gain.value = Number(CONFIG.eqTreble) || 0;

                offlineSrc.connect(offBass);
                offBass.connect(offMid);
                offMid.connect(offTreble);
                offTreble.connect(offlineCtx.destination);
                offlineSrc.start(0, startTime, clipDuration);

                audioBuffer = await offlineCtx.startRendering();
            } catch (err) {
                this._abortFastExport(savedState, null, null, wasPlaying);
                throw err;
            }

            const sampleRate = audioBuffer.sampleRate;
            const totalSamples = audioBuffer.length;
            const monoPcm = new Float32Array(totalSamples);
            if (numChannels === 1) {
                monoPcm.set(audioBuffer.getChannelData(0));
            } else {
                const ch0 = audioBuffer.getChannelData(0);
                const ch1 = audioBuffer.getChannelData(1);
                for (let s = 0; s < totalSamples; s++) {
                    monoPcm[s] = (ch0[s] + ch1[s]) * 0.5;
                }
            }

            const muxerOpts = {
                target: new Mp4Muxer.ArrayBufferTarget(),
                video: { codec: 'avc', width, height, frameRate: fps },
                fastStart: 'in-memory',
                firstTimestampBehavior: 'offset'
            };
            if (!isSilentExport) {
                muxerOpts.audio = { codec: 'aac', numberOfChannels: numChannels, sampleRate };
            }
            const muxer = new Mp4Muxer.Muxer(muxerOpts);

            let encodeError = null;
            const videoEncoder = new VideoEncoder({
                output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
                error: (e) => { encodeError = e; }
            });
            videoEncoder.configure(videoCfg);

            let audioEncoder = null;
            if (!isSilentExport) {
                audioEncoder = new AudioEncoder({
                    output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
                    error: (e) => { encodeError = e; }
                });
                audioEncoder.configure(audioCfg);
            }

            const renderCanvas = document.createElement('canvas');
            renderCanvas.width = width;
            renderCanvas.height = height;
            const renderCtx = renderCanvas.getContext('2d', { alpha: false, desynchronized: true, willReadFrequently: false });

            // Preserve neon glow while capping maximum blur radius for fast hardware-friendly frame rasterization
            try {
                const protoDesc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'shadowBlur');
                if (protoDesc && protoDesc.set && protoDesc.get) {
                    const maxBlur = Math.max(width, height) > 2000 ? 18 : 26;
                    Object.defineProperty(renderCtx, 'shadowBlur', {
                        get() { return protoDesc.get.call(this); },
                        set(v) { protoDesc.set.call(this, Math.min(Number(v) || 0, maxBlur)); },
                        configurable: true
                    });
                }
            } catch (e) {}

            APP_STATE.exportCanvas = renderCanvas;
            APP_STATE.exportCtx = renderCtx;

            const exportFftSize = Math.min(CONFIG.fftSize, 1024);
            const fftAnalyzer = this._createFastFftAnalyzer(exportFftSize);
            const freqArr = new Uint8Array(exportFftSize >> 1);
            const waveArr = new Uint8Array(exportFftSize);
            const smoothing = CONFIG.smoothing;
            const usPerFrame = Math.round(1_000_000 / fps);
            const keyFrameInterval = Math.max(1, fps * 2);

            const startWall = performance.now();
            let lastUiUpdateWall = startWall;

            const fastYield = () => new Promise((resolve) => {
                if (typeof MessageChannel !== 'undefined') {
                    const mc = new MessageChannel();
                    mc.port1.onmessage = () => resolve();
                    mc.port2.postMessage(null);
                } else {
                    setTimeout(resolve, 0);
                }
            });

            const waitForEncoderQueue = () => new Promise((resolve) => {
                if (videoEncoder.encodeQueueSize <= 14 || this._cancelFast) {
                    resolve();
                    return;
                }
                const done = () => {
                    videoEncoder.removeEventListener('dequeue', onDeq);
                    resolve();
                };
                const onDeq = () => {
                    if (videoEncoder.encodeQueueSize <= 10 || this._cancelFast) done();
                };
                videoEncoder.addEventListener('dequeue', onDeq);
                setTimeout(done, 12);
            });

            try {
                for (let i = 0; i < totalFrames; i++) {
                    if (this._cancelFast || encodeError) break;

                    const tFrame = i / fps;
                    const sampleIdx = Math.floor(tFrame * sampleRate);

                    fftAnalyzer.extractFrame(monoPcm, sampleIdx, smoothing, freqArr, waveArr);

                    APP_STATE.exportTime = startTime + tFrame;
                    const isBeat = BeatDetector.update(freqArr);
                    this.renderFrame(renderCtx, width, height, { freq: freqArr, wave: waveArr }, isBeat, (startTime + tFrame) / decoded.duration);

                    const vf = new VideoFrame(renderCanvas, {
                        timestamp: i * usPerFrame,
                        duration: usPerFrame
                    });
                    try {
                        videoEncoder.encode(vf, { keyFrame: i % keyFrameInterval === 0 });
                    } finally {
                        vf.close();
                    }

                    if (videoEncoder.encodeQueueSize > 14) {
                        await waitForEncoderQueue();
                    }

                    const nowWall = performance.now();
                    if (nowWall - lastUiUpdateWall >= 180 || i === totalFrames - 1) {
                        lastUiUpdateWall = nowWall;
                        const framesDone = i + 1;
                        const pct = 4 + (framesDone / totalFrames) * 88;
                        const elapsedSec = (nowWall - startWall) / 1000;
                        const speedX = (framesDone / fps) / Math.max(0.001, elapsedSec);
                        const remSec = Math.max(0, Math.round(((totalFrames - framesDone) / fps) / Math.max(0.05, speedX)));
                        this._setStatus(
                            `Encoding ${framesDone}/${totalFrames} • ${speedX.toFixed(1)}× speed • ~${remSec}s left`,
                            pct
                        );
                        await fastYield();
                    }
                }
            } catch (err) {
                this._abortFastExport(savedState, videoEncoder, audioEncoder, wasPlaying);
                throw err;
            }

            if (this._cancelFast) {
                this._abortFastExport(savedState, videoEncoder, audioEncoder, wasPlaying);
                UI.showToast('Export cancelled', 'warning');
                return;
            }

            if (!isSilentExport && audioEncoder) {
                this._setStatus('Muxing AAC audio…', 94);

                const chunkFrames = 4096;
                const planar = new Float32Array(numChannels * chunkFrames);
                const chans = [];
                for (let c = 0; c < numChannels; c++) chans.push(audioBuffer.getChannelData(c));

                for (let offset = 0; offset < totalSamples; offset += chunkFrames) {
                    if (this._cancelFast) {
                        this._abortFastExport(savedState, videoEncoder, audioEncoder, wasPlaying);
                        UI.showToast('Export cancelled', 'warning');
                        return;
                    }
                    const len = Math.min(chunkFrames, totalSamples - offset);
                    const buf = len === chunkFrames ? planar : new Float32Array(numChannels * len);
                    for (let c = 0; c < numChannels; c++) {
                        buf.set(chans[c].subarray(offset, offset + len), c * len);
                    }
                    const ad = new AudioData({
                        format: 'f32-planar',
                        sampleRate,
                        numberOfFrames: len,
                        numberOfChannels: numChannels,
                        timestamp: Math.round(offset * 1_000_000 / sampleRate),
                        data: buf
                    });
                    try { audioEncoder.encode(ad); } finally { ad.close(); }
                }
            }

            this._setStatus(isSilentExport ? 'Finalizing Silent Spotify Canvas MP4…' : 'Finalizing MP4 container…', 98);
            await videoEncoder.flush();
            if (audioEncoder) await audioEncoder.flush();
            videoEncoder.close();
            if (audioEncoder) audioEncoder.close();

            if (encodeError) {
                this._abortFastExport(savedState, null, null, wasPlaying);
                throw encodeError;
            }

            muxer.finalize();
            const buffer = muxer.target.buffer;

            this._restoreVizState(savedState);
            APP_STATE.exportTime = null;
            APP_STATE.isFastExporting = false;
            APP_STATE.isRecording = false;
            APP_STATE.exportCanvas = null;
            APP_STATE.exportCtx = null;

            const blob = new Blob([buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const filename = isSilentExport ? `waveforge_spotify_canvas_${CONFIG.aspectRatio.replace(':', 'x')}_${Date.now()}.mp4` : `waveforge_${this.downloadBaseName()}_${CONFIG.aspectRatio.replace(':', 'x')}_${Date.now()}.mp4`;

            if (wasPlaying) {
                try {
                    audio.audioElement.play();
                    APP_STATE.isPlaying = true;
                    UI.updatePlayButton();
                } catch (e) {}
            }

            document.getElementById('status-dot').classList.remove('recording');
            document.getElementById('status-text').textContent = 'Ready';

            const totalElapsed = (performance.now() - startWall) / 1000;
            const speedX = clipDuration / Math.max(0.001, totalElapsed);
            const summaryText = `✅ MP4 Rendered in ${totalElapsed.toFixed(1)}s (${speedX.toFixed(1)}× speed) • ${width}×${height}`;

            this._presentAdUnlockGate(url, filename, summaryText);
        },

        _abortFastExport(savedState, videoEncoder, audioEncoder, wasPlaying) {
            try { if (videoEncoder && videoEncoder.state !== 'closed') videoEncoder.close(); } catch (e) {}
            try { if (audioEncoder && audioEncoder.state !== 'closed') audioEncoder.close(); } catch (e) {}
            this._restoreVizState(savedState);
            APP_STATE.exportTime = null;
            APP_STATE.isFastExporting = false;
            APP_STATE.isRecording = false;
            APP_STATE.exportCanvas = null;
            APP_STATE.exportCtx = null;
            this._cancelFast = false;
            this._hideProgressUI();
            document.getElementById('status-dot').classList.remove('recording');
            document.getElementById('status-text').textContent = 'Ready';
            if (wasPlaying) {
                try { audio.audioElement.play(); APP_STATE.isPlaying = true; UI.updatePlayButton(); } catch (e) {}
            }
        },

        _saveAndResetVizState() {
            const snap = {
                beatHistory: BeatDetector.history.slice(),
                beatPrev: BeatDetector.prevEnergy,
                beatDetected: APP_STATE.beatDetected,
                beatTimer: APP_STATE.beatTimer,
                shakeX: APP_STATE.shakeX,
                shakeY: APP_STATE.shakeY,
                shakeTrauma: APP_STATE.shakeTrauma,
                lastLogoT: APP_STATE.lastLogoT,
                lastPhonkT: APP_STATE.lastPhonkT,
                lastPartT: APP_STATE.lastPartT,
                lastDnaT: APP_STATE.lastDnaT,
                lastGalT: APP_STATE.lastGalT,
                lastTrapT: APP_STATE.lastTrapT,
                phonkKickEnv: APP_STATE.phonkKickEnv,
                logoAngle: APP_STATE.logoAngle,
                helixAngle: APP_STATE.helixAngle,
                galaxyAngle: APP_STATE.galaxyAngle,
                spectrogram: APP_STATE.spectrogramData.slice(),
                shockwaves: (APP_STATE.shockwaves || []).slice()
            };
            BeatDetector.history = [];
            BeatDetector.prevEnergy = 0;
            APP_STATE.beatDetected = false;
            APP_STATE.beatTimer = 0;
            APP_STATE.shakeX = 0;
            APP_STATE.shakeY = 0;
            APP_STATE.shakeTrauma = 0;
            APP_STATE.lastLogoT = 0;
            APP_STATE.lastPhonkT = 0;
            APP_STATE.lastPartT = 0;
            APP_STATE.lastDnaT = 0;
            APP_STATE.lastGalT = 0;
            APP_STATE.lastTrapT = 0;
            APP_STATE.phonkKickEnv = 0;
            APP_STATE.logoAngle = 0;
            APP_STATE.helixAngle = 0;
            APP_STATE.galaxyAngle = 0;
            APP_STATE.spectrogramData = [];
            APP_STATE.shockwaves = [];
            return snap;
        },

        _restoreVizState(snap) {
            if (!snap) return;
            BeatDetector.history = snap.beatHistory;
            BeatDetector.prevEnergy = snap.beatPrev;
            APP_STATE.beatDetected = snap.beatDetected;
            APP_STATE.beatTimer = snap.beatTimer;
            APP_STATE.shakeX = snap.shakeX;
            APP_STATE.shakeY = snap.shakeY;
            APP_STATE.shakeTrauma = snap.shakeTrauma;
            APP_STATE.lastLogoT = snap.lastLogoT;
            APP_STATE.lastPhonkT = snap.lastPhonkT;
            APP_STATE.lastPartT = snap.lastPartT;
            APP_STATE.lastDnaT = snap.lastDnaT;
            APP_STATE.lastGalT = snap.lastGalT;
            APP_STATE.lastTrapT = snap.lastTrapT;
            APP_STATE.phonkKickEnv = snap.phonkKickEnv;
            APP_STATE.logoAngle = snap.logoAngle;
            APP_STATE.helixAngle = snap.helixAngle;
            APP_STATE.galaxyAngle = snap.galaxyAngle;
            APP_STATE.spectrogramData = snap.spectrogram;
            APP_STATE.shockwaves = snap.shockwaves;
        },

        _showProgressUI() {
            document.getElementById('btn-start-export').style.display = 'none';
            document.getElementById('btn-cancel-export').style.display = 'block';
            document.getElementById('export-progress').classList.add('active');
        },
        _hideProgressUI() {
            document.getElementById('btn-start-export').style.display = 'inline-flex';
            document.getElementById('btn-cancel-export').style.display = 'none';
            document.getElementById('export-progress').classList.remove('active');
            document.getElementById('progress-fill').style.width = '0%';
            document.getElementById('progress-percent').textContent = '0%';
            document.getElementById('progress-status').textContent = 'Preparing...';
        },
        _setStatus(text, pct) {
            const status = document.getElementById('progress-status');
            const fill = document.getElementById('progress-fill');
            const percent = document.getElementById('progress-percent');
            if (status) status.textContent = text;
            if (typeof pct === 'number') {
                if (fill) fill.style.width = Math.max(0, Math.min(100, pct)) + '%';
                if (percent) percent.textContent = Math.round(pct) + '%';
            }
        },

        finishRecording() {
            if (this._cancelledMediaRecorder) {
                this._cancelledMediaRecorder = false;
                APP_STATE.exportCanvas = null;
                APP_STATE.exportCtx = null;
                APP_STATE.recordedChunks = [];
                this._hideProgressUI();
                document.getElementById('status-text').textContent = 'Ready';
                UI.showToast('Recording cancelled', 'warning');
                return;
            }

            const blob = new Blob(APP_STATE.recordedChunks, { type: this._recordedMimeType || 'video/webm' });
            const url = URL.createObjectURL(blob);
            const ext = this._recordedMimeExt || 'webm';
            const filename = `waveforge_${this.downloadBaseName()}_${CONFIG.aspectRatio.replace(':', 'x')}_${Date.now()}.${ext}`;

            APP_STATE.exportCanvas = null;
            APP_STATE.exportCtx = null;
            APP_STATE.recordedChunks = [];
            document.getElementById('status-text').textContent = 'Ready';

            this._presentAdUnlockGate(url, filename, `✅ ${ext.toUpperCase()} Video Recorded & Ready to Download!`);
        },

        formatTime(seconds) {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        },

        renderFrame(ctx, width, height, data, isBeat, progressRatio) {
            const mod = VIS_MODS[APP_STATE.mode];
            if (!mod) return;
            if (APP_STATE.hasPredictiveMap && APP_STATE.exportTime !== null) {
                PredictiveChoreographer.sampleAt(APP_STATE.exportTime);
            }

            if (typeof viz !== 'undefined' && viz) data = viz.processData(data);

            if (!mod.ownBackground) {
                const bgMedia = (APP_STATE.bgVideo && APP_STATE.bgVideo.readyState >= 2 && APP_STATE.bgVideo.videoWidth > 0)
                    ? APP_STATE.bgVideo
                    : APP_STATE.bgImg;
                if (bgMedia) {
                    const mw = bgMedia.videoWidth || bgMedia.width || 1;
                    const mh = bgMedia.videoHeight || bgMedia.height || 1;
                    const scale = Math.max(width / mw, height / mh);
                    const bw = mw * scale;
                    const bh = mh * scale;
                    ctx.fillStyle = '#03040a';
                    ctx.fillRect(0, 0, width, height);
                    ctx.save();
                    ctx.globalAlpha = Math.max(0.2, Math.min(1, (CONFIG.bgOpacity || 80) / 100));
                    ctx.drawImage(bgMedia, (width - bw) / 2, (height - bh) / 2, bw, bh);
                    ctx.restore();
                } else {
                    ctx.fillStyle = 'rgba(5, 5, 10, 0.22)';
                    ctx.fillRect(0, 0, width, height);
                }
            }

            const renderFn = mod.renderExport || mod.render;
            renderFn(viz, ctx, width, height, width / 2, height / 2, data, isBeat);

            if (typeof viz !== 'undefined' && viz) {
                const prog = typeof progressRatio === 'number'
                    ? progressRatio
                    : (audio.getDuration() > 0 ? audio.getCurrentTime() / audio.getDuration() : 0);
                viz.renderPostOverlays(ctx, width, height, isBeat, prog, true);
            }

            if (CONFIG.watermark) {
                const fs = Math.max(13, Math.round(height * 0.022));
                ctx.save();
                ctx.font = `600 ${fs}px Inter, -apple-system, 'Segoe UI', sans-serif`;
                ctx.textBaseline = 'bottom';
                ctx.textAlign = 'right';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
                ctx.fillText('Made with WaveForge', width - Math.max(14, fs * 0.7), height - Math.max(12, fs * 0.6));
                ctx.restore();
            }
        }
    };

    // ============================================
    // VISUALIZER ENGINE
    // ============================================

    class VisualizerEngine {
        constructor() {
            this.canvas = document.getElementById('viz-canvas');
            this.ctx = this.canvas.getContext('2d', { alpha: false, desynchronized: true });

            this.particles = [];
            for (let i = 0; i < 200; i++) {
                this.particles.push(this.createParticle());
            }

            this.resize();
            window.addEventListener('resize', () => {
                clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(() => this.resize(), 120);
            });
        }

        get config() { return CONFIG; }
        get state() { return APP_STATE; }
        get palette() {
            const base = PALETTES[CONFIG.palette] || PALETTES.cyberpunk;
            if (!CONFIG.hueCycle) return base;
            const deg = Math.round((nowSec() * CONFIG.hueCycleSpeed) % 360 * 10) / 10;
            const key = CONFIG.palette + '|' + deg;
            if (this._hueKey !== key) {
                this._hueKey = key;
                this._hueCache = base.map((c) => c.startsWith('#') ? rotateHue(c, deg) : c);
            }
            return this._hueCache;
        }
        nowSec() { return nowSec(); }

        getActiveFrameBounds(w, h, isExport) {
            if (isExport || !CONFIG.aspectRatio || CONFIG.aspectRatio === '16:9') {
                return { fx: 0, fy: 0, fw: w, fh: h };
            }
            const ratios = { '9:16': 9 / 16, '1:1': 1, '4:5': 4 / 5 };
            const targetRatio = ratios[CONFIG.aspectRatio];
            if (!targetRatio) return { fx: 0, fy: 0, fw: w, fh: h };
            const screenRatio = w / Math.max(1, h);
            if (Math.abs(screenRatio - targetRatio) < 0.15) {
                return { fx: 0, fy: 0, fw: w, fh: h };
            }
            let fw = h * 0.84 * targetRatio;
            let fh = h * 0.84;
            if (fw > w * 0.92) {
                fw = w * 0.92;
                fh = fw / targetRatio;
            }
            return { fx: (w - fw) / 2, fy: (h - fh) / 2, fw, fh };
        }

        getActiveMinDim(w, h) {
            const isExportCanvas = (APP_STATE.exportCanvas && w === APP_STATE.exportCanvas.width && h === APP_STATE.exportCanvas.height);
            const bounds = this.getActiveFrameBounds(w, h, isExportCanvas);
            return Math.min(bounds.fw, bounds.fh);
        }

        resize() {
            const oldW = this.width || window.innerWidth;
            const oldH = this.height || window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = Math.round(this.width * dpr);
            this.canvas.height = Math.round(this.height * dpr);
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.cx = this.width / 2;
            this.cy = this.height / 2;

            if (oldW > 0 && oldH > 0 && (oldW !== this.width || oldH !== this.height)) {
                const sx = this.width / oldW;
                const sy = this.height / oldH;
                for (let i = 0; i < this.particles.length; i++) {
                    this.particles[i].x *= sx;
                    this.particles[i].y *= sy;
                }
            }
        }

        createParticle() {
            return {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2.5,
                vy: (Math.random() - 0.5) * 2.5,
                size: Math.random() * 4 + 1,
                color: Math.floor(Math.random() * 4),
                life: Math.random()
            };
        }

        getColor(index) {
            const p = this.palette;
            return p[index % p.length];
        }

        getGradient(ctx, h) {
            const grad = ctx.createLinearGradient(0, h, 0, 0);
            const p = this.palette;
            p.forEach((color, i) => {
                grad.addColorStop(i / (p.length - 1), color);
            });
            return grad;
        }

        _buildLogRanges(binCount) {
            const bands = Math.min(binCount, 256);
            const usable = Math.floor(binCount * 0.9);
            const step = Math.pow(usable, 1 / bands);
            const ranges = new Array(bands);
            let prev = 0;
            for (let i = 1; i <= bands; i++) {
                let cur = Math.round(Math.pow(step, i));
                if (cur <= prev) cur = prev + 1;
                ranges[i - 1] = [prev, Math.min(cur, usable)];
                prev = cur;
            }
            this._logRanges = ranges;
            this._logRangesBinCount = binCount;
        }

        processData(data) {
            if (CONFIG.freqScale !== 'log') return data;
            const src = data.freq;
            if (!src || !src.length) return data;
            if (!this._logRanges || this._logRangesBinCount !== src.length) this._buildLogRanges(src.length);
            if (!this._logBuf || this._logBuf.length !== this._logRanges.length) {
                this._logBuf = new Uint8Array(this._logRanges.length);
            }
            const out = this._logBuf;
            for (let i = 0; i < this._logRanges.length; i++) {
                const a = this._logRanges[i][0];
                const b = this._logRanges[i][1];
                let sum = 0;
                for (let j = a; j < b; j++) sum += src[j];
                out[i] = sum / Math.max(1, b - a);
            }
            return { freq: out, wave: data.wave };
        }

        renderPostOverlays(ctx, w, h, isBeat, progressRatio, isExport) {
            // WebGL2 GPU Beat-Synced Post-FX Shader Pass (Chromatic Aberration, Glitch, VHS, Radial Kick Zoom-Blur)
            if (window.WaveForgeFX && window.WaveForgeFX.supported && (CONFIG.fxChromatic > 0 || CONFIG.fxGlitch > 0 || CONFIG.fxVhs > 0 || CONFIG.fxZoomBlur > 0)) {
                const srcCanvas = isExport ? APP_STATE.exportCanvas : this.canvas;
                const kickVal = APP_STATE.hasPredictiveMap
                    ? Math.max(APP_STATE.predShake || 0, APP_STATE.predFlash || 0)
                    : (isBeat ? 1.0 : 0.15);
                window.WaveForgeFX.apply(ctx, srcCanvas, w, h, {
                    time: nowSec(),
                    chromatic: CONFIG.fxChromatic,
                    glitch: CONFIG.fxGlitch,
                    vhs: CONFIG.fxVhs,
                    zoomBlur: CONFIG.fxZoomBlur,
                    kick: kickVal
                });
            }

            // Stereo Mirror Reflection FX across modes (when enabled and not Mode 1 which handles its own wave mirror)
            if (CONFIG.mirror && APP_STATE.mode !== 1) {
                try {
                    const srcCanvas = isExport ? APP_STATE.exportCanvas : this.canvas;
                    if (srcCanvas) {
                        ctx.save();
                        const reflH = h * 0.24;
                        ctx.globalAlpha = 0.22;
                        ctx.translate(0, h);
                        ctx.scale(1, -1);
                        ctx.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height, 0, 0, w, reflH);
                        ctx.restore();
                    }
                } catch (e) {}
            }

            // Ambient Bloom FX driven by CONFIG.bloomIntensity
            if (CONFIG.bloomIntensity > 65) {
                const extraAlpha = ((CONFIG.bloomIntensity - 65) / 35) * (isBeat ? 0.16 : 0.08);
                const bloomGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.min(w, h) * 0.55);
                bloomGrad.addColorStop(0, this.getColor(0));
                bloomGrad.addColorStop(1, 'transparent');
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                ctx.globalAlpha = extraAlpha;
                ctx.fillStyle = bloomGrad;
                ctx.fillRect(0, 0, w, h);
                ctx.restore();
            }

            // Predictive Drop Flash & Buildup Aura
            if (APP_STATE.hasPredictiveMap && (APP_STATE.predFlash > 0.04 || APP_STATE.predBuildup > 0.1)) {
                ctx.save();
                if (APP_STATE.predFlash > 0.04) {
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.globalAlpha = Math.min(0.24, APP_STATE.predFlash * 0.22);
                    ctx.fillStyle = this.getColor(0);
                    ctx.fillRect(0, 0, w, h);
                }
                if (APP_STATE.predBuildup > 0.1) {
                    const aura = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.15, w / 2, h / 2, Math.max(w, h) * 0.65);
                    aura.addColorStop(0, 'transparent');
                    aura.addColorStop(1, this.getColor(0));
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.globalAlpha = APP_STATE.predBuildup * 0.22;
                    ctx.fillStyle = aura;
                    ctx.fillRect(0, 0, w, h);
                }
                ctx.restore();
            }

            if (CONFIG.fxVignette) {
                const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.28, w / 2, h / 2, Math.max(w, h) * 0.72);
                vig.addColorStop(0, 'rgba(0,0,0,0)');
                vig.addColorStop(1, 'rgba(0,0,0,0.68)');
                ctx.fillStyle = vig;
                ctx.fillRect(0, 0, w, h);
            }

            if (CONFIG.fxScanlines) {
                ctx.save();
                ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
                const stepY = Math.max(3, Math.round(h / 240));
                for (let y = 0; y < h; y += stepY) {
                    ctx.fillRect(0, y, w, Math.max(1, stepY * 0.38));
                }
                ctx.restore();
            }

            const bounds = this.getActiveFrameBounds(w, h, isExport);
            const title = (CONFIG.overlayTitle || '').trim();
            const artist = (CONFIG.overlayArtist || '').trim();
            if (title || artist) {
                ctx.save();
                const pulse = (CONFIG.overlayBeatPulse && isBeat) ? 1.05 : 1.0;
                const minFrame = Math.min(bounds.fw, bounds.fh);
                const baseSize = Math.max(16, Math.round(minFrame * 0.046));
                const subSize = Math.max(11, Math.round(baseSize * 0.56));
                let tx = bounds.fx + bounds.fw * 0.07;
                let ty = bounds.fy + bounds.fh * 0.84;
                let align = 'left';

                if (CONFIG.overlayPosition === 'center') {
                    tx = bounds.fx + bounds.fw / 2;
                    ty = bounds.fy + bounds.fh / 2;
                    align = 'center';
                } else if (CONFIG.overlayPosition === 'top-center') {
                    tx = bounds.fx + bounds.fw / 2;
                    ty = bounds.fy + bounds.fh * 0.14;
                    align = 'center';
                } else if (CONFIG.overlayPosition === 'bottom-center') {
                    tx = bounds.fx + bounds.fw / 2;
                    ty = bounds.fy + bounds.fh * 0.85;
                    align = 'center';
                }

                ctx.translate(tx, ty);
                ctx.scale(pulse, pulse);
                ctx.textAlign = align;
                ctx.textBaseline = 'middle';

                if (title) {
                    const fontFace = CONFIG.overlayFont || 'Space Grotesk';
                    const fontWeight = (fontFace === 'Anton' || fontFace === 'Bebas Neue' || fontFace === 'New Rocker') ? '400' : '800';
                    const fontSizeMul = (fontFace === 'Bebas Neue' || fontFace === 'Anton') ? 1.18 : 1.0;
                    ctx.font = `${fontWeight} ${Math.round(baseSize * fontSizeMul)}px '${fontFace}', 'Space Grotesk', sans-serif`;
                    ctx.shadowColor = this.getColor(0);
                    ctx.shadowBlur = (isBeat || APP_STATE.predFlash > 0.25) ? 26 : 12;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(title, 0, 0);
                }
                if (artist) {
                    ctx.font = `600 ${subSize}px Inter, sans-serif`;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = 'rgba(0,0,0,0.8)';
                    ctx.fillStyle = this.getColor(0);
                    ctx.fillText(artist.toUpperCase(), 0, title ? baseSize * 0.85 : 0);
                }
                ctx.restore();
            }

            if (CONFIG.fxProgressBar && progressRatio > 0) {
                const barH = Math.max(3, Math.round(h * 0.005));
                ctx.save();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
                ctx.fillRect(0, h - barH, w, barH);
                const grad = ctx.createLinearGradient(0, 0, w, 0);
                grad.addColorStop(0, this.getColor(0));
                grad.addColorStop(1, this.getColor(1));
                ctx.fillStyle = grad;
                ctx.fillRect(0, h - barH, Math.min(1, progressRatio) * w, barH);
                ctx.restore();
            }

            if (!isExport && (bounds.fw < w - 4 || bounds.fh < h - 4)) {
                ctx.save();
                ctx.strokeStyle = 'rgba(168, 85, 247, 0.48)';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([6, 6]);
                ctx.strokeRect(bounds.fx, bounds.fy, bounds.fw, bounds.fh);
                ctx.setLineDash([]);
                ctx.font = '600 11px Inter, sans-serif';
                ctx.fillStyle = 'rgba(168, 85, 247, 0.88)';
                ctx.fillText(`Export Frame (${CONFIG.aspectRatio})`, bounds.fx + 8, bounds.fy + 16);
                ctx.restore();
            }
        }

        loop() {
            requestAnimationFrame(() => this.loop());

            const now = performance.now();
            const delta = now - APP_STATE.lastTime;
            APP_STATE.frames++;

            if (delta >= 1000) {
                APP_STATE.fps = Math.round((APP_STATE.frames * 1000) / delta);
                APP_STATE.frames = 0;
                APP_STATE.lastTime = now;
                if (CONFIG.showFps) {
                    const fpsEl = document.getElementById('fps-display');
                    if (fpsEl) fpsEl.textContent = `${APP_STATE.fps} FPS`;
                }
            }

            // Skip redundant live canvas rendering while Zero-Suspend Fast Export is monopolizing the encoder
            if (APP_STATE.isFastExporting) return;

            const data = audio.getAnalysis();
            const isBeat = BeatDetector.update(data.freq);
            const sDot = document.getElementById('status-dot');
            if (sDot && !APP_STATE.isRecording) sDot.classList.toggle('beat-hit', Boolean(isBeat && APP_STATE.isPlaying));

            this.render(this.ctx, this.width, this.height, this.cx, this.cy, data, isBeat);

            if (APP_STATE.isRecording && !APP_STATE.isFastExporting && APP_STATE.exportCtx) {
                const expW = APP_STATE.exportCanvas.width;
                const expH = APP_STATE.exportCanvas.height;
                Exporter.renderFrame(APP_STATE.exportCtx, expW, expH, data, isBeat);
            }
        }

        render(ctx, w, h, cx, cy, data, isBeat) {
            data = this.processData(data);
            const mod = VIS_MODS[APP_STATE.mode];
            if (!mod) return;

            if (APP_STATE.hasPredictiveMap && APP_STATE.isPlaying) {
                PredictiveChoreographer.sampleAt(audio.getCurrentTime());
            } else if (!APP_STATE.isPlaying) {
                APP_STATE.predShake = APP_STATE.predZoom = APP_STATE.predBuildup = APP_STATE.predFlash = 0;
            }

            if (!mod.ownBackground) {
                const bgMedia = (APP_STATE.bgVideo && APP_STATE.bgVideo.readyState >= 2 && APP_STATE.bgVideo.videoWidth > 0)
                    ? APP_STATE.bgVideo
                    : APP_STATE.bgImg;
                if (bgMedia) {
                    const mw = bgMedia.videoWidth || bgMedia.width || 1;
                    const mh = bgMedia.videoHeight || bgMedia.height || 1;
                    const scale = Math.max(w / mw, h / mh);
                    const bw = mw * scale;
                    const bh = mh * scale;
                    ctx.fillStyle = '#03040a';
                    ctx.fillRect(0, 0, w, h);
                    ctx.save();
                    ctx.globalAlpha = Math.max(0.2, Math.min(1, (CONFIG.bgOpacity || 80) / 100));
                    ctx.drawImage(bgMedia, (w - bw) / 2, (h - bh) / 2, bw, bh);
                    ctx.restore();
                } else {
                    ctx.fillStyle = 'rgba(5, 5, 10, 0.22)';
                    ctx.fillRect(0, 0, w, h);
                }
            }

            // Apply global Predictive Camera Shake & Buildup Zoom for all non-Phonk/Logo modes
            const applyGlobalPred = APP_STATE.hasPredictiveMap && APP_STATE.mode !== 12 && APP_STATE.mode !== 8 && (APP_STATE.predShake > 0.02 || APP_STATE.predBuildup > 0.02);
            ctx.save();
            if (applyGlobalPred) {
                const t = nowSec();
                const sAmp = Math.min(w, h) * 0.014 * APP_STATE.predShake;
                const sx = Math.sin(t * 46) * sAmp;
                const sy = Math.cos(t * 39) * sAmp * 0.72;
                const zScale = 1 + APP_STATE.predZoom * 0.055;
                ctx.translate(cx + sx, cy + sy);
                ctx.scale(zScale, zScale);
                ctx.translate(-cx, -cy);
            }

            ctx.lineWidth = 2;
            ctx.lineCap = 'round';

            mod.render(this, ctx, w, h, cx, cy, data, isBeat);
            ctx.restore();

            const prog = audio.getDuration() > 0 ? audio.getCurrentTime() / audio.getDuration() : 0;
            this.renderPostOverlays(ctx, w, h, isBeat, prog, false);
        }
    }

    // ============================================
    // UI CONTROLLER & TRENDING TEMPLATES ENGINE
    // ============================================

    const MODE_CATEGORIES = {
        12: 'viral', 8: 'viral', 10: 'viral',
        9: '3d', 11: '3d',
        0: 'classic', 1: 'classic', 2: 'classic', 3: 'classic'
    };

    const SPEED_STEPS = [0.75, 0.85, 1, 1.15, 1.25];

    const UI = {
        settingsOpen: false,
        _resetConfirmTimer: null,
        _isHoveringUI: false,

        init() {
            this.cacheElements();
            this.buildTemplatesGrid();
            this.buildModeGrid();
            this.buildExportModeOptions();
            this.bindEvents();
            this.setupDragDrop();
            this.setupKeyboard();
            this.setupSettings();
            this.applyConfigToUI();
            this.updateModeDisplay();
            this.updateModeCards();
            this.updateSliderLabels();
            this.syncWizardBar();
            this.syncDependentSettings();
            this.syncAllRangeTracks();
        },

        cacheElements() {
            this.els = {
                fileInput: document.getElementById('file-input'),
                playBtn: document.getElementById('btn-play'),
                playIcon: document.getElementById('play-icon'),
                seek: document.getElementById('seek-bar'),
                seekTooltip: document.getElementById('seek-tooltip'),
                dropOverlay: document.getElementById('drop-overlay'),
                settingsModal: document.getElementById('settings-modal'),
                exportModal: document.getElementById('export-modal'),
                shareModal: document.getElementById('share-modal'),
                modeSelectorModal: document.getElementById('mode-selector-modal'),
                templatesModal: document.getElementById('templates-modal'),
                shortcutsModal: document.getElementById('shortcuts-modal'),
                uiLayer: document.getElementById('ui-layer'),
                modeName: document.getElementById('mode-name'),
                toastContainer: document.getElementById('toast-container'),
                exitZenBtn: document.getElementById('btn-exit-zen')
            };
        },

        isAnyModalOpen() {
            return [
                this.els.settingsModal,
                this.els.exportModal,
                this.els.shareModal,
                this.els.modeSelectorModal,
                this.els.templatesModal,
                this.els.shortcutsModal
            ].some(m => m && m.classList.contains('open'));
        },

        syncRangeTrack(input) {
            if (!input) return;
            const min = parseFloat(input.min || '0');
            const max = parseFloat(input.max || '100');
            const val = parseFloat(input.value || '0');
            const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
            input.style.setProperty('--pct', Math.max(0, Math.min(100, pct)) + '%');
        },

        syncAllRangeTracks() {
            document.querySelectorAll('input[type="range"]').forEach(inp => this.syncRangeTrack(inp));
        },

        syncDependentSettings() {
            const setDisabled = (rowId, disabled) => {
                const row = document.getElementById(rowId);
                if (!row) return;
                row.classList.toggle('is-disabled', disabled);
                row.querySelectorAll('input, select').forEach(el => { el.disabled = disabled; });
            };
            setDisabled('row-phonk-intro-dur', !CONFIG.phonkIntroEnabled);
            setDisabled('row-hue-speed', !CONFIG.hueCycle);
            setDisabled('row-beat-thresh', !CONFIG.beatEnabled);
            setDisabled('row-pred-intensity', !CONFIG.predictiveEnabled);
        },

        syncWizardBar() {
            const wizardBar = document.getElementById('template-wizard-bar');
            const wizardName = document.getElementById('wizard-template-name');
            if (!wizardBar) return;
            const tpl = TRENDING_TEMPLATES.find(t => t.id === APP_STATE.activeTemplateId);
            if (wizardName && tpl) wizardName.textContent = tpl.name;
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode') && !params.has('template') && APP_STATE.mode !== 12 && APP_STATE.mode !== 8) {
                wizardBar.classList.add('hidden');
            }
        },

        setZenMode(enabled) {
            APP_STATE.isZenMode = Boolean(enabled);
            if (this.els.uiLayer) {
                this.els.uiLayer.classList.toggle('ui-hidden', APP_STATE.isZenMode);
                if (!APP_STATE.isZenMode) this.els.uiLayer.style.opacity = '1';
            }
            if (this.els.exitZenBtn) {
                this.els.exitZenBtn.classList.toggle('hidden', !APP_STATE.isZenMode);
            }
            if (APP_STATE.isZenMode) {
                const onboard = document.getElementById('studio-onboarding');
                if (onboard) onboard.classList.add('hidden-card');
                this.showToast('👁 Zen Mode active — press H or tap Show Controls', 'info');
            }
        },

        setPlaybackSpeed(speed) {
            APP_STATE.playbackSpeed = speed;
            audio.updateSettings();
            const btn = document.getElementById('btn-speed');
            if (btn) {
                btn.textContent = speed.toFixed(speed === 1 ? 1 : 2).replace(/0$/, '') + '×';
                btn.classList.toggle('modified', speed !== 1);
            }
            const sel = document.getElementById('set-playback-speed');
            if (sel) sel.value = String(speed);
        },

        syncMuteUI() {
            const muteBtn = document.getElementById('btn-mute');
            const onIcon = document.getElementById('icon-vol-on');
            const offIcon = document.getElementById('icon-vol-off');
            if (muteBtn) {
                muteBtn.classList.toggle('muted', APP_STATE.isMuted);
                muteBtn.setAttribute('aria-pressed', APP_STATE.isMuted ? 'true' : 'false');
            }
            if (onIcon) onIcon.classList.toggle('hidden', APP_STATE.isMuted);
            if (offIcon) offIcon.classList.toggle('hidden', !APP_STATE.isMuted);
        },

        syncEqPresetButtons() {
            const cur = `${CONFIG.eqBass},${CONFIG.eqMid},${CONFIG.eqTreble}`;
            document.querySelectorAll('.eq-preset-btn').forEach(btn => {
                btn.classList.toggle('active-eq', btn.dataset.eq === cur);
            });
        },

        buildTemplatesGrid() {
            const grid = document.getElementById('templates-grid');
            if (!grid) return;
            grid.innerHTML = '';

            TRENDING_TEMPLATES.forEach((tpl) => {
                const isActive = APP_STATE.activeTemplateId === tpl.id;
                const card = document.createElement('div');
                card.className = 'template-card' + (isActive ? ' active' : '');
                card.dataset.templateId = tpl.id;
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.innerHTML = `
                    <div class="tpl-preview" style="--tpl-color: ${tpl.color};">
                        ${tpl.id === 'brazilian-funk'
                            ? '<div class="tpl-vis-tunnel"></div>'
                            : tpl.id === 'drift-phonk-crimson'
                            ? '<div class="tpl-vis-synth"><div class="tpl-vis-sun"></div><div class="tpl-vis-grid"></div></div>'
                            : tpl.id === 'ultra-slowed-ice'
                            ? '<div class="tpl-vis-shock"></div>'
                            : tpl.id === 'golden-royalty'
                            ? '<div class="tpl-vis-gold">👑</div>'
                            : tpl.id === 'youtube-type-beat'
                            ? '<div class="tpl-vis-bars"><span style="height:36%"></span><span style="height:72%"></span><span style="height:100%"></span><span style="height:64%"></span><span style="height:88%"></span><span style="height:48%"></span><span style="height:78%"></span></div>'
                            : '<div class="tpl-ring-demo"></div>'}
                        <span class="tpl-badge">${tpl.tag}</span>
                    </div>
                    <div class="tpl-body">
                        <h3>${tpl.name}</h3>
                        <span class="tpl-font-tag">${tpl.fontLabel || ''}</span>
                        <p>${tpl.desc}</p>
                        <button type="button" class="tpl-use-btn" data-use-template="${tpl.id}">${isActive ? '✓ Active Template' : '✨ Use This Template'}</button>
                    </div>
                `;
                const activate = () => this.applyTemplate(tpl.id);
                card.onclick = activate;
                card.onkeydown = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        activate();
                    }
                };
                grid.appendChild(card);
            });
        },

        applyTemplate(templateId) {
            const tpl = TRENDING_TEMPLATES.find(t => t.id === templateId);
            if (!tpl) return;

            APP_STATE.activeTemplateId = tpl.id;
            Object.assign(CONFIG, tpl.settings);
            if (VIS_MODS[tpl.settings.mode]) {
                APP_STATE.mode = tpl.settings.mode;
            }
            if (typeof tpl.speed === 'number') {
                this.setPlaybackSpeed(tpl.speed);
            }

            audio.updateSettings();
            this.applyConfigToUI();
            this.updateModeDisplay();
            this.updateModeCards();
            this.updateSliderLabels();
            this.syncDependentSettings();
            this.syncEqPresetButtons();
            this.syncAllRangeTracks();
            persistConfig();

            document.querySelectorAll('.template-card').forEach(c => {
                const active = c.dataset.templateId === tpl.id;
                c.classList.toggle('active', active);
                const btn = c.querySelector('.tpl-use-btn');
                if (btn) btn.textContent = active ? '✓ Active Template' : '✨ Use This Template';
            });

            if (this.els.templatesModal) {
                this.els.templatesModal.classList.remove('open');
            }

            const wizardBar = document.getElementById('template-wizard-bar');
            const wizardName = document.getElementById('wizard-template-name');
            if (wizardBar) {
                if (wizardName) wizardName.textContent = tpl.name;
                wizardBar.classList.remove('hidden');
            }

            const onboard = document.getElementById('studio-onboarding');
            if (onboard) onboard.classList.add('hidden-card');

            if (!audio.hasAudio()) {
                this.loadDemoTrack();
            } else if (APP_STATE.mode === 12 && CONFIG.phonkIntroEnabled) {
                audio.audioElement.currentTime = 0;
                if (audio.audioElement.paused) audio.togglePlay();
            }

            this.showToast(`🔥 Applied "${tpl.name}" template!`, 'success');
        },

        buildModeGrid() {
            const grid = document.getElementById('mode-grid');
            if (!grid) return;
            grid.innerHTML = '';
            const order = [12, 8, 10, 9, 11, 0, 1, 2, 3].filter(k => VIS_MODS[k]);

            order.forEach(key => {
                const mod = VIS_MODS[key];
                const card = document.createElement('div');
                card.className = 'mode-card' + (mod.newBadge ? ' new-badge' : '');
                card.dataset.mode = key;
                card.dataset.cat = MODE_CATEGORIES[key] || 'classic';
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                const icon = document.createElement('span');
                icon.className = 'mode-card-icon';
                icon.textContent = mod.icon;
                const name = document.createElement('span');
                name.className = 'mode-card-name';
                name.textContent = mod.name;
                const desc = document.createElement('span');
                desc.className = 'mode-card-desc';
                desc.textContent = mod.desc;
                card.appendChild(icon);
                card.appendChild(name);
                card.appendChild(desc);

                const selectMode = () => {
                    setMode(parseInt(key, 10));
                    this.showToast(mod.icon + ' ' + mod.name, 'info');
                    setTimeout(() => this.closeModeSelector(), 180);
                };
                card.onclick = selectMode;
                card.onkeydown = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectMode();
                    }
                };
                grid.appendChild(card);
            });

            const qStrip = document.getElementById('quick-mode-strip');
            if (qStrip) {
                qStrip.innerHTML = '';
                order.forEach(key => {
                    const mod = VIS_MODS[key];
                    const pill = document.createElement('button');
                    pill.type = 'button';
                    pill.className = 'qmode-pill';
                    pill.dataset.mode = key;
                    pill.textContent = mod.icon + ' ' + mod.name;
                    pill.onclick = () => {
                        setMode(parseInt(key, 10));
                        this.showToast(mod.icon + ' ' + mod.name, 'info');
                    };
                    qStrip.appendChild(pill);
                });
            }
        },

        buildExportModeOptions() {
            const select = document.getElementById('export-mode');
            if (!select) return;
            select.innerHTML = '';
            const current = document.createElement('option');
            current.value = 'current';
            current.textContent = 'Current Active Mode';
            select.appendChild(current);
            Object.keys(VIS_MODS).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).forEach(key => {
                const mod = VIS_MODS[key];
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = mod.name + (mod.newBadge ? ' (NEW)' : '');
                select.appendChild(opt);
            });
        },

        bindEvents() {
            document.getElementById('btn-upload').onclick = () => this.els.fileInput.click();
            document.getElementById('btn-demo').onclick = () => this.loadDemoTrack();
            document.getElementById('btn-random').onclick = () => this.randomizeVisual();

            const openTemplates = () => {
                if (this.els.templatesModal) this.els.templatesModal.classList.add('open');
            };
            const closeTemplates = () => {
                if (this.els.templatesModal) this.els.templatesModal.classList.remove('open');
            };
            ['btn-templates', 'dock-btn-templates', 'onboard-templates-btn'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.onclick = openTemplates;
            });
            const closeTplBtn = document.getElementById('btn-close-templates');
            if (closeTplBtn) closeTplBtn.onclick = closeTemplates;
            if (this.els.templatesModal) {
                this.els.templatesModal.onclick = (e) => {
                    if (e.target === this.els.templatesModal) closeTemplates();
                };
            }

            // Mode Category Filter Pills
            document.querySelectorAll('.mode-filter-pill').forEach(btn => {
                btn.addEventListener('click', () => {
                    const cat = btn.dataset.cat;
                    document.querySelectorAll('.mode-filter-pill').forEach(b => b.classList.toggle('active', b === btn));
                    document.querySelectorAll('.mode-card').forEach(c => {
                        c.classList.toggle('filtered-out', cat !== 'all' && c.dataset.cat !== cat);
                    });
                });
            });

            // Switch to Phonk Mode button inside Settings Tab 1 notice
            const switchPhonkBtn = document.getElementById('btn-switch-phonk-mode');
            if (switchPhonkBtn) {
                switchPhonkBtn.onclick = () => {
                    setMode(12);
                    this.showToast('😈 Switched to Hardtekk Phonk mode', 'success');
                };
            }

            // Zen Mode controls
            const zenBtn = document.getElementById('btn-zen');
            if (zenBtn) zenBtn.onclick = () => this.setZenMode(!APP_STATE.isZenMode);
            if (this.els.exitZenBtn) this.els.exitZenBtn.onclick = () => this.setZenMode(false);

            // Loop toggle
            const loopBtn = document.getElementById('btn-loop');
            if (loopBtn) {
                loopBtn.onclick = () => {
                    APP_STATE.isLooping = !APP_STATE.isLooping;
                    audio.updateSettings();
                    loopBtn.classList.toggle('active', APP_STATE.isLooping);
                    loopBtn.setAttribute('aria-pressed', APP_STATE.isLooping ? 'true' : 'false');
                    this.showToast(APP_STATE.isLooping ? '🔁 Loop enabled' : 'Loop disabled', 'info');
                };
            }

            // Playback Speed cycle button
            const speedBtn = document.getElementById('btn-speed');
            if (speedBtn) {
                speedBtn.onclick = () => {
                    const idx = SPEED_STEPS.indexOf(APP_STATE.playbackSpeed);
                    const next = SPEED_STEPS[(idx + 1) % SPEED_STEPS.length];
                    this.setPlaybackSpeed(next);
                    const label = next < 1 ? 'Slowed' : (next > 1 ? 'Sped Up' : 'Normal');
                    this.showToast(`⚡ Speed: ${next}× (${label})`, 'info');
                };
            }

            // Mute button
            const muteBtn = document.getElementById('btn-mute');
            if (muteBtn) {
                muteBtn.onclick = () => {
                    APP_STATE.isMuted = !APP_STATE.isMuted;
                    audio.updateSettings();
                    this.syncMuteUI();
                    this.showToast(APP_STATE.isMuted ? '🔇 Audio muted' : '🔊 Audio unmuted', 'info');
                };
            }

            // 3-Step Guided Wizard Bar buttons
            const wizMusic = document.getElementById('wiz-btn-music');
            if (wizMusic) wizMusic.onclick = () => this.els.fileInput.click();
            const wizBg = document.getElementById('wiz-btn-bg');
            if (wizBg) wizBg.onclick = () => document.getElementById('logo-bg-input').click();
            const wizLogo = document.getElementById('wiz-btn-logo');
            if (wizLogo) wizLogo.onclick = () => document.getElementById('logo-img-input').click();
            const wizExport = document.getElementById('wiz-btn-export');
            if (wizExport) wizExport.onclick = () => Exporter.showModal();
            const wizClose = document.getElementById('wiz-btn-close');
            if (wizClose) {
                wizClose.onclick = () => {
                    const bar = document.getElementById('template-wizard-bar');
                    if (bar) bar.classList.add('hidden');
                };
            }

            // Resilient delegated + direct click handling for Welcome Card & Template Cards
            document.addEventListener('click', (e) => {
                const closeBtn = e.target.closest('#onboard-close-btn');
                if (closeBtn) {
                    e.preventDefault();
                    const card = document.getElementById('studio-onboarding');
                    if (card) card.classList.add('hidden-card');
                    return;
                }
                const upBtn = e.target.closest('#onboard-upload-btn');
                if (upBtn) {
                    e.preventDefault();
                    const fi = document.getElementById('file-input');
                    if (fi) fi.click();
                    return;
                }
                const demoBtn = e.target.closest('#onboard-demo-btn');
                if (demoBtn) {
                    e.preventDefault();
                    this.loadDemoTrack();
                    return;
                }
                const tplBtn = e.target.closest('[data-use-template]');
                if (tplBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.applyTemplate(tplBtn.getAttribute('data-use-template'));
                }
            });

            this.els.fileInput.onchange = (e) => {
                this.handleFile(e.target.files[0]);
                e.target.value = '';
            };
            this.els.playBtn.onclick = () => audio.togglePlay();
            document.getElementById('btn-stop').onclick = () => audio.stop();
            document.getElementById('btn-mic').onclick = () => audio.enableMic();

            document.getElementById('btn-mode').onclick = () => this.openModeSelector();
            const topModePill = document.getElementById('top-mode-pill');
            if (topModePill) topModePill.onclick = () => this.openModeSelector();

            document.querySelectorAll('.settings-tab').forEach((tabBtn) => {
                tabBtn.addEventListener('click', () => {
                    const targetId = tabBtn.getAttribute('data-tab');
                    document.querySelectorAll('.settings-tab').forEach(b => {
                        b.classList.toggle('active', b === tabBtn);
                        b.setAttribute('aria-selected', b === tabBtn ? 'true' : 'false');
                    });
                    document.querySelectorAll('.settings-pane').forEach(pane => {
                        pane.classList.toggle('active', pane.id === targetId);
                    });
                });
            });

            document.getElementById('btn-close-mode-selector').onclick = () => this.closeModeSelector();
            this.els.modeSelectorModal.onclick = (e) => {
                if (e.target.id === 'mode-selector-modal') this.closeModeSelector();
            };

            // Smooth Seek Bar Scrubbing + Hover Time Tooltip
            const formatSeekTime = (s) => {
                if (!s || isNaN(s)) return '0:00';
                const m = Math.floor(s / 60);
                const sec = Math.floor(s % 60);
                return `${m}:${sec < 10 ? '0' : ''}${sec}`;
            };
            this.els.seek.addEventListener('pointerdown', () => { APP_STATE.isSeeking = true; });
            const endSeek = () => {
                if (!APP_STATE.isSeeking) return;
                APP_STATE.isSeeking = false;
                if (audio.audioElement.duration) {
                    audio.audioElement.currentTime = (parseFloat(this.els.seek.value) / 100) * audio.audioElement.duration;
                }
            };
            window.addEventListener('pointerup', endSeek);
            this.els.seek.oninput = (e) => {
                this.syncRangeTrack(e.target);
                if (audio.audioElement.duration) {
                    const targetTime = (parseFloat(e.target.value) / 100) * audio.audioElement.duration;
                    document.getElementById('time-current').textContent = formatSeekTime(targetTime);
                    if (!APP_STATE.isSeeking) {
                        audio.audioElement.currentTime = targetTime;
                    }
                }
            };
            this.els.seek.addEventListener('pointermove', (e) => {
                if (!this.els.seekTooltip || !audio.audioElement.duration) return;
                const rect = this.els.seek.getBoundingClientRect();
                const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
                this.els.seekTooltip.textContent = formatSeekTime(ratio * audio.audioElement.duration);
                this.els.seekTooltip.style.left = (ratio * 100) + '%';
                this.els.seekTooltip.classList.add('visible');
            });
            this.els.seek.addEventListener('pointerleave', () => {
                if (this.els.seekTooltip) this.els.seekTooltip.classList.remove('visible');
            });

            const volSlider = document.getElementById('vol-slider');
            if (volSlider) {
                volSlider.oninput = (e) => {
                    APP_STATE.isMuted = parseFloat(e.target.value) === 0;
                    this.syncMuteUI();
                    this.syncRangeTrack(e.target);
                    audio.updateSettings();
                };
            }

            document.getElementById('btn-settings').onclick = () => this.toggleSettings(true);
            document.getElementById('btn-close-settings').onclick = () => this.toggleSettings(false);

            // Fullscreen with icon sync & iOS Safari Zen Mode fallback
            const fsBtn = document.getElementById('btn-fullscreen');
            const syncFsIcon = () => {
                const isFs = Boolean(document.fullscreenElement);
                const enterIcon = document.getElementById('icon-fs-enter');
                const exitIcon = document.getElementById('icon-fs-exit');
                if (enterIcon) enterIcon.classList.toggle('hidden', isFs);
                if (exitIcon) exitIcon.classList.toggle('hidden', !isFs);
            };
            document.addEventListener('fullscreenchange', syncFsIcon);
            if (fsBtn) {
                fsBtn.onclick = () => {
                    if (!document.documentElement.requestFullscreen) {
                        this.setZenMode(!APP_STATE.isZenMode);
                        return;
                    }
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(() => this.setZenMode(!APP_STATE.isZenMode));
                    } else {
                        document.exitFullscreen().catch(() => {});
                    }
                };
            }

            document.getElementById('btn-shortcuts').onclick = () => {
                this.els.shortcutsModal.classList.add('open');
            };
            document.getElementById('btn-close-shortcuts').onclick = () => {
                this.els.shortcutsModal.classList.remove('open');
            };
            this.els.shortcutsModal.onclick = (e) => {
                if (e.target === this.els.shortcutsModal) {
                    this.els.shortcutsModal.classList.remove('open');
                }
            };

            // Smart UI Auto-Hide (never hides while hovering controls, when any modal is open, or in onboarding)
            document.querySelectorAll('.top-bar, .template-wizard-bar, .control-bar').forEach(el => {
                el.addEventListener('pointerenter', () => { this._isHoveringUI = true; });
                el.addEventListener('pointerleave', () => { this._isHoveringUI = false; });
            });

            let hideTimeout;
            const revealUI = () => {
                if (APP_STATE.isZenMode) return;
                this.els.uiLayer.style.opacity = '1';
                clearTimeout(hideTimeout);
            };
            document.addEventListener('pointermove', (e) => {
                if (e.pointerType === 'touch' || APP_STATE.isZenMode) return;
                revealUI();
                hideTimeout = setTimeout(() => {
                    const onboard = document.getElementById('studio-onboarding');
                    const onboardVisible = onboard && !onboard.classList.contains('hidden-card');
                    if (APP_STATE.isPlaying && !this._isHoveringUI && !this.isAnyModalOpen() && !APP_STATE.isRecording && !onboardVisible) {
                        this.els.uiLayer.style.opacity = '0';
                    }
                }, 3800);
            });
            document.addEventListener('pointerdown', revealUI);
            document.addEventListener('touchstart', revealUI, { passive: true });

            this.els.settingsModal.onclick = (e) => {
                if (e.target === this.els.settingsModal) this.toggleSettings(false);
            };

            this.els.exportModal.onclick = (e) => {
                if (e.target === this.els.exportModal) {
                    Exporter.hideModal();
                }
            };

            this.setupShare();
        },

        getShareablePresetUrl() {
            const base = 'https://progameryt-op.github.io/WaveForge/visualizer.html';
            try {
                const payload = { ...CONFIG, mode: APP_STATE.mode };
                const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
                    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                return `${base}#p=${b64}`;
            } catch (e) {
                return `${base}?mode=${APP_STATE.mode}&palette=${encodeURIComponent(CONFIG.palette)}`;
            }
        },

        setupShare() {
            const SHARE_TITLE = 'Check out my custom Phonk/Music visualizer preset on WaveForge Studio!';
            const embed = (str) => encodeURIComponent(str);
            const urlInput = document.getElementById('share-url-input');
            const nativeBtn = document.getElementById('btn-native-share');

            if (nativeBtn && navigator.share) {
                nativeBtn.classList.remove('hidden');
                nativeBtn.onclick = () => {
                    navigator.share({ title: SHARE_TITLE, url: this.getShareablePresetUrl() }).catch(() => {});
                };
            }

            const openShare = () => {
                const shareUrl = this.getShareablePresetUrl();
                if (urlInput) urlInput.value = shareUrl;
                const networks = {
                    x: `https://twitter.com/intent/tweet?text=${embed(SHARE_TITLE)}&url=${embed(shareUrl)}`,
                    reddit: `https://www.reddit.com/submit?url=${embed(shareUrl)}&title=${embed(SHARE_TITLE)}`,
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${embed(shareUrl)}`
                };
                document.querySelectorAll('#share-buttons [data-share-network]').forEach(a => {
                    a.href = networks[a.dataset.shareNetwork] || '#';
                });
                this.els.shareModal.classList.add('open');
            };

            const closeShare = () => {
                this.els.shareModal.classList.remove('open');
            };

            document.getElementById('btn-share').onclick = openShare;
            document.getElementById('btn-close-share').onclick = closeShare;
            this.els.shareModal.onclick = (e) => {
                if (e.target === this.els.shareModal) closeShare();
            };

            document.getElementById('btn-copy-link').onclick = () => {
                const shareUrl = this.getShareablePresetUrl();
                const done = () => this.showToast('🔗 Shareable preset link copied!', 'success');
                const fallbackCopy = () => {
                    try {
                        const ta = document.createElement('textarea');
                        ta.value = shareUrl;
                        ta.style.position = 'fixed';
                        ta.style.opacity = '0';
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                        done();
                    } catch (err) {
                        if (urlInput) { urlInput.focus(); urlInput.select(); }
                        this.showToast('Press Ctrl+C to copy the link above', 'info');
                    }
                };
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(shareUrl).then(done).catch(fallbackCopy);
                } else {
                    fallbackCopy();
                }
            };
        },

        setupDragDrop() {
            window.ondragover = (e) => {
                e.preventDefault();
                this.els.dropOverlay.style.display = 'flex';
            };
            window.ondragleave = (e) => {
                if (e.relatedTarget === null) {
                    this.els.dropOverlay.style.display = 'none';
                }
            };
            window.ondrop = (e) => {
                e.preventDefault();
                this.els.dropOverlay.style.display = 'none';
                if (e.dataTransfer.files.length) {
                    this.handleFile(e.dataTransfer.files[0]);
                }
            };
        },

        setupKeyboard() {
            document.addEventListener('keydown', (e) => {
                const tag = e.target.tagName;
                if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

                if (e.key === '?') {
                    e.preventDefault();
                    this.els.shortcutsModal.classList.toggle('open');
                    return;
                }

                switch (e.code) {
                    case 'Space':
                        if (tag === 'BUTTON' || tag === 'A') return;
                        e.preventDefault();
                        audio.togglePlay();
                        break;
                    case 'KeyS':
                        audio.stop();
                        break;
                    case 'KeyM':
                        this.openModeSelector();
                        break;
                    case 'KeyT':
                        if (this.els.templatesModal) this.els.templatesModal.classList.toggle('open');
                        break;
                    case 'KeyF':
                        document.getElementById('btn-fullscreen').click();
                        break;
                    case 'KeyH':
                        this.setZenMode(!APP_STATE.isZenMode);
                        break;
                    case 'KeyL': {
                        const loopBtn = document.getElementById('btn-loop');
                        if (loopBtn) loopBtn.click();
                        break;
                    }
                    case 'KeyC':
                        document.getElementById('btn-screenshot').click();
                        break;
                    case 'KeyR':
                        this.randomizeVisual();
                        break;
                    case 'ArrowRight':
                        audio.audioElement.currentTime = Math.min(
                            audio.audioElement.currentTime + 5,
                            audio.audioElement.duration || 0
                        );
                        break;
                    case 'ArrowLeft':
                        audio.audioElement.currentTime = Math.max(
                            audio.audioElement.currentTime - 5,
                            0
                        );
                        break;
                    case 'ArrowUp':
                    case 'ArrowDown': {
                        e.preventDefault();
                        const volEl = document.getElementById('vol-slider');
                        if (volEl) {
                            const delta = e.code === 'ArrowUp' ? 0.1 : -0.1;
                            const next = Math.max(0, Math.min(1, parseFloat(volEl.value) + delta));
                            volEl.value = next.toFixed(2);
                            APP_STATE.isMuted = next === 0;
                            this.syncMuteUI();
                            this.syncRangeTrack(volEl);
                            audio.updateSettings();
                        }
                        break;
                    }
                    case 'Escape':
                        if (APP_STATE.isZenMode) this.setZenMode(false);
                        this.toggleSettings(false);
                        if (!APP_STATE.isRecording) Exporter.hideModal();
                        this.closeModeSelector();
                        if (this.els.templatesModal) this.els.templatesModal.classList.remove('open');
                        this.els.shareModal.classList.remove('open');
                        this.els.shortcutsModal.classList.remove('open');
                        const onboard = document.getElementById('studio-onboarding');
                        if (onboard) onboard.classList.add('hidden-card');
                        break;
                }
            });
        },

        _loadCustomVideo(file) {
            if (!file) return;
            if (APP_STATE.bgVideoUrl) {
                try { URL.revokeObjectURL(APP_STATE.bgVideoUrl); } catch (e) {}
            }
            const url = URL.createObjectURL(file);
            const vid = document.createElement('video');
            vid.src = url;
            vid.muted = true;
            vid.loop = true;
            vid.playsInline = true;
            vid.crossOrigin = 'anonymous';
            vid.playbackRate = CONFIG.bgVideoSpeed || 1.0;
            vid.onloadeddata = () => {
                APP_STATE.bgVideo = vid;
                APP_STATE.bgVideoUrl = url;
                vid.play().catch(() => {});
                document.getElementById('btn-upload-bg').classList.add('has-file');
                document.getElementById('bg-label').textContent = '🎬 ' + file.name.substring(0, 14);
                const wizBg = document.getElementById('wiz-btn-bg');
                if (wizBg) wizBg.classList.add('done-step');
                const clearRow = document.getElementById('clear-branding-row');
                if (clearRow) clearRow.classList.remove('hidden');
                this.showToast('🎬 Looping MP4 video background loaded!', 'success');
            };
        },

        _loadCustomImage(file, targetType) {
            if (!file) return;
            if (targetType === 'bg' && (file.type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(file.name))) {
                this._loadCustomVideo(file);
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    if (targetType === 'logo') {
                        APP_STATE.logoImg = img;
                        document.getElementById('btn-upload-logo').classList.add('has-file');
                        document.getElementById('logo-label').textContent = 'Logo: ' + file.name.substring(0, 14);
                        const wizLogo = document.getElementById('wiz-btn-logo');
                        if (wizLogo) wizLogo.classList.add('done-step');
                        this.showToast('⭕ Custom center logo loaded!', 'success');
                    } else {
                        APP_STATE.bgImg = img;
                        document.getElementById('btn-upload-bg').classList.add('has-file');
                        document.getElementById('bg-label').textContent = 'BG: ' + file.name.substring(0, 14);
                        const wizBg = document.getElementById('wiz-btn-bg');
                        if (wizBg) wizBg.classList.add('done-step');
                        this.showToast('🖼️ Custom background loaded!', 'success');
                    }
                    const clearRow = document.getElementById('clear-branding-row');
                    if (clearRow) clearRow.classList.remove('hidden');
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        },

        setupSettings() {
            const linkSetting = (id, configKey, type = 'float') => {
                const el = document.getElementById(id);
                if (!el) return;

                el.onchange = el.oninput = (e) => {
                    let val = e.target.value;
                    if (type === 'float') val = parseFloat(val);
                    else if (type === 'int') val = parseInt(val, 10);
                    else if (type === 'bool') val = e.target.checked;
                    CONFIG[configKey] = val;
                    if (configKey === 'aspectRatio') {
                        const expAspect = document.getElementById('export-aspect');
                        if (expAspect) expAspect.value = val;
                    }
                    if (el.type === 'range') this.syncRangeTrack(el);
                    if (configKey === 'phonkIntroEnabled' || configKey === 'hueCycle' || configKey === 'beatEnabled' || configKey === 'predictiveEnabled') {
                        this.syncDependentSettings();
                    }
                    if (configKey === 'eqBass' || configKey === 'eqMid' || configKey === 'eqTreble') {
                        this.syncEqPresetButtons();
                    }
                    audio.updateSettings();
                    persistConfig();
                };
            };

            linkSetting('set-smoothing', 'smoothing', 'float');
            linkSetting('set-sensitivity', 'sensitivity', 'float');
            linkSetting('set-bloom', 'bloomIntensity', 'float');
            linkSetting('set-beat-thresh', 'beatThreshold', 'float');
            linkSetting('set-palette', 'palette', 'string');
            linkSetting('set-beat-enabled', 'beatEnabled', 'bool');
            linkSetting('set-mirror', 'mirror', 'bool');
            linkSetting('set-watermark', 'watermark', 'bool');
            linkSetting('set-overlay-font', 'overlayFont', 'string');
            linkSetting('set-pred-enabled', 'predictiveEnabled', 'bool');
            linkSetting('set-pred-intensity', 'predictiveIntensity', 'float');
            linkSetting('set-bg-opacity', 'bgOpacity', 'float');
            linkSetting('set-bg-speed', 'bgVideoSpeed', 'float');
            linkSetting('set-fx-chromatic', 'fxChromatic', 'float');
            linkSetting('set-fx-glitch', 'fxGlitch', 'float');
            linkSetting('set-fx-vhs', 'fxVhs', 'float');
            linkSetting('set-fx-zoomblur', 'fxZoomBlur', 'float');

            const bgSpeedEl = document.getElementById('set-bg-speed');
            if (bgSpeedEl) {
                bgSpeedEl.addEventListener('input', (e) => {
                    if (APP_STATE.bgVideo) APP_STATE.bgVideo.playbackRate = parseFloat(e.target.value) || 1.0;
                });
            }
            const importPresetBtn = document.getElementById('btn-import-preset');
            if (importPresetBtn) {
                importPresetBtn.onclick = () => {
                    const fi = document.getElementById('file-input');
                    if (fi) fi.click();
                };
            }
            linkSetting('set-hue-cycle', 'hueCycle', 'bool');
            linkSetting('set-hue-speed', 'hueCycleSpeed', 'float');

            linkSetting('set-eq-bass', 'eqBass', 'float');
            linkSetting('set-eq-mid', 'eqMid', 'float');
            linkSetting('set-eq-treble', 'eqTreble', 'float');

            linkSetting('set-overlay-title', 'overlayTitle', 'string');
            linkSetting('set-overlay-artist', 'overlayArtist', 'string');
            linkSetting('set-overlay-pos', 'overlayPosition', 'string');
            linkSetting('set-overlay-pulse', 'overlayBeatPulse', 'bool');
            linkSetting('set-fx-scanlines', 'fxScanlines', 'bool');
            linkSetting('set-fx-vignette', 'fxVignette', 'bool');
            linkSetting('set-fx-progress', 'fxProgressBar', 'bool');
            linkSetting('set-aspect', 'aspectRatio', 'string');

            // Phonk / Hardtekk Intro & Backdrop bindings
            linkSetting('set-phonk-intro', 'phonkIntroEnabled', 'bool');
            linkSetting('set-phonk-intro-dur', 'phonkIntroDuration', 'float');
            linkSetting('set-phonk-bg', 'phonkBgTheme', 'string');

            // 1-Click EQ Presets
            document.querySelectorAll('.eq-preset-btn').forEach(btn => {
                btn.onclick = () => {
                    const [b, m, t] = btn.dataset.eq.split(',').map(Number);
                    CONFIG.eqBass = b;
                    CONFIG.eqMid = m;
                    CONFIG.eqTreble = t;
                    this.applyConfigToUI();
                    this.updateSliderLabels();
                    this.syncAllRangeTracks();
                    this.syncEqPresetButtons();
                    audio.updateSettings();
                    persistConfig();
                    this.showToast(`🎛️ EQ Preset: ${btn.textContent}`, 'success');
                };
            });

            // Playback speed dropdown inside Settings
            const speedSel = document.getElementById('set-playback-speed');
            if (speedSel) {
                speedSel.onchange = (e) => this.setPlaybackSpeed(parseFloat(e.target.value));
            }

            document.querySelectorAll('#settings-modal input[type="range"]').forEach((input) => {
                input.addEventListener('input', () => {
                    this.updateSliderLabels();
                    this.syncRangeTrack(input);
                });
            });

            // Safe 2-Step Reset Button
            const resetBtn = document.getElementById('btn-reset-settings');
            if (resetBtn) {
                resetBtn.onclick = () => {
                    if (!resetBtn.classList.contains('confirming')) {
                        resetBtn.classList.add('confirming');
                        resetBtn.textContent = '⚠ Click Again to Reset';
                        clearTimeout(this._resetConfirmTimer);
                        this._resetConfirmTimer = setTimeout(() => {
                            resetBtn.classList.remove('confirming');
                            resetBtn.textContent = '↺ Reset';
                        }, 3500);
                        return;
                    }
                    clearTimeout(this._resetConfirmTimer);
                    resetBtn.classList.remove('confirming');
                    resetBtn.textContent = '↺ Reset';
                    Object.assign(CONFIG, DEFAULT_CONFIG);
                    this.setPlaybackSpeed(1);
                    audio.updateSettings();
                    document.body.classList.toggle('high-contrast', CONFIG.highContrast);
                    document.getElementById('fps-display').style.display = CONFIG.showFps ? '' : 'none';
                    this.applyConfigToUI();
                    this.updateSliderLabels();
                    this.syncDependentSettings();
                    this.syncEqPresetButtons();
                    this.syncAllRangeTracks();
                    persistConfig();
                    this.showToast('↺ Settings reset to studio defaults', 'success');
                };
            }

            // Streamlined v9.0 settings (removed High Contrast & FPS toggle clutter)

            document.getElementById('btn-export-preset').onclick = () => {
                const preset = { ...CONFIG, mode: APP_STATE.mode };
                const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `waveforge_preset_${Date.now()}.wfpreset.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 60_000);
                this.showToast('💾 Preset saved!', 'success');
            };

            document.getElementById('btn-screenshot').onclick = () => {
                try {
                    const a = document.createElement('a');
                    a.href = document.getElementById('viz-canvas').toDataURL('image/png');
                    a.download = `waveforge_screenshot_${Date.now()}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    this.showToast('📷 Screenshot saved!', 'success');
                } catch (err) {
                    this.showToast('Screenshot failed', 'error');
                }
            };

            document.getElementById('btn-upload-bg').onclick = () => document.getElementById('logo-bg-input').click();
            document.getElementById('btn-upload-logo').onclick = () => document.getElementById('logo-img-input').click();

            document.getElementById('logo-bg-input').onchange = (e) => {
                this._loadCustomImage(e.target.files[0], 'bg');
                e.target.value = '';
            };

            document.getElementById('logo-img-input').onchange = (e) => {
                this._loadCustomImage(e.target.files[0], 'logo');
                e.target.value = '';
            };

            const clearBrandingBtn = document.getElementById('btn-clear-branding');
            if (clearBrandingBtn) {
                clearBrandingBtn.onclick = () => {
                    APP_STATE.bgImg = null;
                    APP_STATE.logoImg = null;
                    if (APP_STATE.bgVideo) {
                        try { APP_STATE.bgVideo.pause(); } catch (e) {}
                        APP_STATE.bgVideo = null;
                    }
                    if (APP_STATE.bgVideoUrl) {
                        try { URL.revokeObjectURL(APP_STATE.bgVideoUrl); } catch (e) {}
                        APP_STATE.bgVideoUrl = null;
                    }
                    document.getElementById('btn-upload-bg').classList.remove('has-file');
                    document.getElementById('btn-upload-logo').classList.remove('has-file');
                    document.getElementById('bg-label').textContent = 'Upload Background';
                    document.getElementById('logo-label').textContent = 'Upload Center Logo';
                    const wizBg = document.getElementById('wiz-btn-bg');
                    const wizLogo = document.getElementById('wiz-btn-logo');
                    if (wizBg) wizBg.classList.remove('done-step');
                    if (wizLogo) wizLogo.classList.remove('done-step');
                    const clearRow = document.getElementById('clear-branding-row');
                    if (clearRow) clearRow.classList.add('hidden');
                    this.showToast('Custom background & logo cleared', 'info');
                };
            }

            document.getElementById('set-wave-color').oninput = (e) => {
                CONFIG.waveColor = e.target.value;
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                persistConfig();
            };

            document.querySelectorAll('.color-swatch').forEach(swatch => {
                swatch.onclick = () => {
                    CONFIG.waveColor = swatch.dataset.color;
                    document.getElementById('set-wave-color').value = swatch.dataset.color;
                    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                    swatch.classList.add('active');
                    persistConfig();
                };
            });

            document.getElementById('set-shake').oninput = (e) => { CONFIG.logoShakeIntensity = parseFloat(e.target.value); this.syncRangeTrack(e.target); persistConfig(); };
            document.getElementById('set-ray-count').oninput = (e) => { CONFIG.logoRayCount = parseInt(e.target.value, 10); this.syncRangeTrack(e.target); persistConfig(); };
            document.getElementById('set-line-thick').oninput = (e) => { CONFIG.logoLineThickness = parseFloat(e.target.value); this.syncRangeTrack(e.target); persistConfig(); };
            document.getElementById('set-glow-size').oninput = (e) => { CONFIG.logoGlowSize = parseFloat(e.target.value); this.syncRangeTrack(e.target); persistConfig(); };
            document.getElementById('set-logo-particles').onchange = (e) => { CONFIG.logoParticles = e.target.checked; persistConfig(); };
            document.getElementById('set-logo-rotate').onchange = (e) => { CONFIG.logoRotateRing = e.target.checked; persistConfig(); };
        },

        applyConfigToUI() {
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el && val !== undefined) el.value = val;
            };
            const setChk = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.checked = Boolean(val);
            };
            setVal('set-smoothing', CONFIG.smoothing);
            setVal('set-sensitivity', CONFIG.sensitivity);
            setVal('set-fft', CONFIG.fftSize);
            setVal('set-palette', CONFIG.palette);
            setVal('set-freq-scale', CONFIG.freqScale);
            setVal('set-hue-speed', CONFIG.hueCycleSpeed);
            setVal('set-beat-thresh', CONFIG.beatThreshold);
            setVal('set-bloom', CONFIG.bloomIntensity);
            setVal('set-wave-color', CONFIG.waveColor);
            setVal('set-shake', CONFIG.logoShakeIntensity);
            setVal('set-ray-count', CONFIG.logoRayCount);
            setVal('set-line-thick', CONFIG.logoLineThickness);
            setVal('set-glow-size', CONFIG.logoGlowSize);
            setVal('set-eq-bass', CONFIG.eqBass);
            setVal('set-eq-mid', CONFIG.eqMid);
            setVal('set-eq-treble', CONFIG.eqTreble);
            setVal('set-overlay-title', CONFIG.overlayTitle);
            setVal('set-overlay-artist', CONFIG.overlayArtist);
            setVal('set-overlay-font', CONFIG.overlayFont || 'New Rocker');
            setVal('set-overlay-pos', CONFIG.overlayPosition);
            setVal('set-pred-intensity', CONFIG.predictiveIntensity);
            setVal('set-bg-opacity', CONFIG.bgOpacity);
            setVal('set-bg-speed', CONFIG.bgVideoSpeed);
            setVal('set-fx-chromatic', CONFIG.fxChromatic);
            setVal('set-fx-glitch', CONFIG.fxGlitch);
            setVal('set-fx-vhs', CONFIG.fxVhs);
            setVal('set-fx-zoomblur', CONFIG.fxZoomBlur);
            setVal('set-aspect', CONFIG.aspectRatio);
            setVal('export-aspect', CONFIG.aspectRatio);
            setVal('set-phonk-intro-dur', CONFIG.phonkIntroDuration);
            setVal('set-phonk-bg', CONFIG.phonkBgTheme || 'mage');

            setChk('set-beat-enabled', CONFIG.beatEnabled);
            setChk('set-mirror', CONFIG.mirror);
            setChk('set-hue-cycle', CONFIG.hueCycle);
            setChk('set-watermark', CONFIG.watermark);
            setChk('set-hc', CONFIG.highContrast);
            setChk('set-show-fps', CONFIG.showFps);
            setChk('set-logo-particles', CONFIG.logoParticles);
            setChk('set-logo-rotate', CONFIG.logoRotateRing);
            setChk('set-overlay-pulse', CONFIG.overlayBeatPulse);
            setChk('set-fx-scanlines', CONFIG.fxScanlines);
            setChk('set-fx-vignette', CONFIG.fxVignette);
            setChk('set-fx-progress', CONFIG.fxProgressBar);
            setChk('set-phonk-intro', CONFIG.phonkIntroEnabled);
            setChk('set-pred-enabled', CONFIG.predictiveEnabled);

            document.body.classList.toggle('high-contrast', CONFIG.highContrast);
            document.getElementById('fps-display').style.display = CONFIG.showFps ? '' : 'none';

            document.querySelectorAll('.color-swatch').forEach(s => {
                s.classList.toggle('active', s.dataset.color === CONFIG.waveColor);
            });
            this.syncEqPresetButtons();
        },

        handleFile(file) {
            if (!file) return;

            if (file.type.includes('json') || file.name.endsWith('.json') || file.name.endsWith('.wfpreset')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const preset = JSON.parse(e.target.result);
                        Object.keys(CONFIG).forEach((k) => {
                            if (preset[k] !== undefined) CONFIG[k] = preset[k];
                        });
                        if (preset.mode !== undefined && VIS_MODS[preset.mode]) {
                            APP_STATE.mode = preset.mode;
                        }
                        audio.updateSettings();
                        this.applyConfigToUI();
                        this.updateModeDisplay();
                        this.updateModeCards();
                        this.updateSliderLabels();
                        this.syncDependentSettings();
                        this.syncAllRangeTracks();
                        persistConfig();
                        this.showToast('✅ Preset loaded!', 'success');
                    } catch (err) {
                        this.showToast('Invalid preset file', 'error');
                    }
                };
                reader.readAsText(file);
            } else if (file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov)$/i)) {
                this._loadCustomVideo(file);
            } else if (file.type.startsWith('image/') || file.name.match(/\.(png|jpe?g|webp|gif|svg)$/i)) {
                this._loadCustomImage(file, APP_STATE.bgImg && !APP_STATE.logoImg ? 'logo' : 'bg');
            } else if (file.type.includes('audio') || file.name.match(/\.(mp3|wav|ogg|flac|m4a|aac|webm)$/i)) {
                const wizMusic = document.getElementById('wiz-btn-music');
                if (wizMusic) wizMusic.classList.add('done-step');
                const cleanName = file.name.replace(/\.[^/.]+$/, '');
                const shortLabel = cleanName.substring(0, 18) + (cleanName.length > 18 ? '…' : '');
                audio.playFile(URL.createObjectURL(file), shortLabel);
            } else {
                this.showToast('Unsupported file type', 'error');
            }
        },

        loadDemoTrack() {
            const wizMusic = document.getElementById('wiz-btn-music');
            if (wizMusic) wizMusic.classList.add('done-step');
            audio.playFile('assets/audio/demo-track.wav', 'Demo Track');
        },

        toggleSettings(show) {
            this.settingsOpen = show;
            this.els.settingsModal.classList.toggle('open', show);
            if (show) {
                this.updateSliderLabels();
                this.syncDependentSettings();
                this.syncAllRangeTracks();
            }
        },

        updatePlayButton() {
            this.els.playIcon.textContent = APP_STATE.isPlaying ? '⏸' : '▶';
            this.els.playBtn.classList.toggle('is-playing', APP_STATE.isPlaying);
            const labelSuffix = APP_STATE.trackTitleLabel ? ` · ${APP_STATE.trackTitleLabel}` : '';
            document.getElementById('status-text').textContent = (APP_STATE.isPlaying ? 'Playing' : 'Paused') + labelSuffix;
            const onboard = document.getElementById('studio-onboarding');
            if (onboard && (APP_STATE.isPlaying || audio.hasAudio())) {
                onboard.classList.add('hidden-card');
            }
        },

        updateProgressBar() {
            const el = audio.audioElement;
            if (!el.duration || isNaN(el.duration)) return;

            const pct = (el.currentTime / el.duration) * 100;
            if (!APP_STATE.isSeeking) {
                this.els.seek.value = pct;
                this.syncRangeTrack(this.els.seek);
            }

            const formatTime = (s) => {
                if (isNaN(s)) return '0:00';
                const m = Math.floor(s / 60);
                const sec = Math.floor(s % 60);
                return `${m}:${sec < 10 ? '0' : ''}${sec}`;
            };

            if (!APP_STATE.isSeeking) {
                document.getElementById('time-current').textContent = formatTime(el.currentTime);
            }
            document.getElementById('time-total').textContent = formatTime(el.duration);
        },

        openModeSelector() {
            this.els.modeSelectorModal.classList.add('open');
            this.updateModeCards();
        },

        closeModeSelector() {
            this.els.modeSelectorModal.classList.remove('open');
        },

        updateModeCards() {
            document.querySelectorAll('.mode-card, .qmode-pill').forEach(card => {
                const modeNum = parseInt(card.dataset.mode, 10);
                card.classList.toggle('active', modeNum === APP_STATE.mode);
            });
        },

        updateModeDisplay() {
            const mod = VIS_MODS[APP_STATE.mode];
            this.els.modeName.textContent = mod ? mod.name : 'Unknown';
            const isLogoOrPhonk = APP_STATE.mode === 8 || APP_STATE.mode === 12;
            const logoSettings = document.getElementById('logo-viz-settings');
            const logoNotice = document.getElementById('logo-mode-notice');
            if (logoSettings) logoSettings.classList.toggle('hidden', !isLogoOrPhonk);
            if (logoNotice) logoNotice.classList.toggle('hidden', isLogoOrPhonk);
        },

        updateSliderLabels() {
            document.querySelectorAll('#settings-modal input[type="range"]').forEach((input) => {
                let label = input.parentElement.querySelector('.slider-value');
                if (!label) {
                    label = document.createElement('span');
                    label.className = 'slider-value';
                    input.insertAdjacentElement('afterend', label);
                }
                const v = parseFloat(input.value);
                const unit = input.dataset.unit || '';
                const signed = input.dataset.signed === 'true';
                const numStr = Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0$/, '');
                const prefix = signed && v > 0 ? '+' : '';
                label.textContent = prefix + numStr + unit;
            });
        },

        randomizeVisual() {
            const modeKeys = Object.keys(VIS_MODS).map(Number);
            if (modeKeys.length) APP_STATE.mode = modeKeys[Math.floor(Math.random() * modeKeys.length)];
            const paletteKeys = Object.keys(PALETTES);
            CONFIG.palette = paletteKeys[Math.floor(Math.random() * paletteKeys.length)];
            CONFIG.sensitivity = Math.round((1.1 + Math.random() * 1.4) * 10) / 10;
            audio.updateSettings();
            this.applyConfigToUI();
            this.updateModeDisplay();
            this.updateModeCards();
            this.updateSliderLabels();
            this.syncAllRangeTracks();
            persistConfig();
            const mod = VIS_MODS[APP_STATE.mode];
            this.showToast('🎲 ' + (mod ? mod.name : 'Randomized') + ' · ' + CONFIG.palette, 'success');
        },

        showToast(message, type = 'info') {
            if (!this.els.toastContainer) return;
            while (this.els.toastContainer.children.length >= 3) {
                this.els.toastContainer.firstElementChild.remove();
            }
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            this.els.toastContainer.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('toast-exit');
                setTimeout(() => toast.remove(), 240);
            }, 2800);
        }
    };

    // ============================================
    // INITIALIZATION
    // ============================================

    let audio, viz;

    document.addEventListener('DOMContentLoaded', () => {
        hydrateConfig();

        try { audio = new AudioEngine(); } catch (e) { console.warn('AudioEngine init deferred:', e); }
        try { viz = new VisualizerEngine(); } catch (e) { console.warn('VisualizerEngine init error:', e); }

        UI.init();
        try { Exporter.init(); } catch (e) { console.warn('Exporter init error:', e); }

        if (viz) viz.loop();

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('template')) {
            UI.applyTemplate(urlParams.get('template'));
        }

        console.log('%c🧠 WaveForge Studio v10.0.0 — Predictive Audio Engine', 'color: #a855f7; font-size: 20px; font-weight: bold;');
    });

    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(r => r.update()).catch(() => {});
        });
    }
})();
