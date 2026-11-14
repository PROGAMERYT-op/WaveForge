/**
 * WaveForge Music Visualizer Studio v7.0
 * Features:
 *  - 13 Visualization Modes (including Mode 12: Hardtekk / Phonk Liquid Ring + AirPods Intro)
 *  - 1-Click Trending Templates Hub (6 viral presets + 3-step guided workflow bar)
 *  - 3-Band Hardware Equalizer, On-Canvas Typography, Post-FX & 4 Aspect Ratios
 *  - Zero-Suspend Radix-2 FFT Turbo MP4 Export Engine
 *  - 8-Second Ad-Timer + Instant Sponsor Unlock Download Gate
 */
(function () {
    'use strict';

    // ============================================
    // TRENDING TEMPLATES REGISTRY (v7.0)
    // ============================================
    const TRENDING_TEMPLATES = [
        {
            id: 'hardtekk-mage',
            name: 'Hardtekk Purple Mage',
            tag: '🔥 EXACT VIDEO MATCH',
            desc: '9:16 Vertical • AirPods 3.5s Volume Intro • Electric Purple Liquid Ring • Dark Mage Backdrop & Kick Zoom-Blur',
            color: '#a855f7',
            settings: {
                mode: 12,
                aspectRatio: '9:16',
                waveColor: '#a855f7',
                palette: 'synthwave',
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
                fxVignette: true,
                fxScanlines: false
            }
        },
        {
            id: 'brazilian-funk',
            name: 'Brazilian Funk Toxic Green',
            tag: '⚡ VIRAL REELS / TIKTOK',
            desc: '9:16 Vertical • Toxic Emerald Liquid Plasma Ring • Heavy Sub-Bass Camera Shake & Radial Warp Sparks',
            color: '#00ff88',
            settings: {
                mode: 12,
                aspectRatio: '9:16',
                waveColor: '#00ff88',
                palette: 'trapneon',
                phonkIntroEnabled: true,
                phonkIntroDuration: 3.0,
                phonkBgTheme: 'mage',
                logoShakeIntensity: 22,
                logoGlowSize: 45,
                logoParticles: true,
                eqBass: 10,
                eqMid: 0,
                eqTreble: 4,
                sensitivity: 1.85,
                fxVignette: true,
                fxScanlines: false
            }
        },
        {
            id: 'drift-phonk-crimson',
            name: 'Drift Phonk Blood Crimson',
            tag: '🩸 PHONK EDIT',
            desc: '9:16 Vertical • Crimson Neon Plasma Ring • CRT Retro Scanlines • Aggressive Kick-Drum Echo Trail',
            color: '#ff0055',
            settings: {
                mode: 12,
                aspectRatio: '9:16',
                waveColor: '#ff0055',
                palette: 'fire',
                phonkIntroEnabled: true,
                phonkIntroDuration: 3.5,
                phonkBgTheme: 'drift',
                logoShakeIntensity: 20,
                logoGlowSize: 40,
                logoParticles: true,
                eqBass: 9,
                eqMid: 2,
                eqTreble: 2,
                sensitivity: 1.75,
                fxVignette: true,
                fxScanlines: true
            }
        },
        {
            id: 'ultra-slowed-ice',
            name: 'Ultra Slowed Glacier Cyan',
            tag: '❄️ SLOWED + REVERB',
            desc: '9:16 Vertical • Ice Cyan & White Liquid Ring • AirPods Volume Intro • Deep Atmospheric Sub-Bass Glow',
            color: '#00f2ff',
            settings: {
                mode: 12,
                aspectRatio: '9:16',
                waveColor: '#00f2ff',
                palette: 'cyberpunk',
                phonkIntroEnabled: true,
                phonkIntroDuration: 3.5,
                phonkBgTheme: 'mage',
                logoShakeIntensity: 14,
                logoGlowSize: 48,
                logoParticles: true,
                eqBass: 7,
                eqMid: -1,
                eqTreble: 3,
                sensitivity: 1.6,
                fxVignette: true,
                fxScanlines: false
            }
        },
        {
            id: 'golden-royalty',
            name: 'Golden Phonk Royalty',
            tag: '👑 24K GOLD',
            desc: '9:16 Vertical • 24K Gold & White Plasma Ring • Crown Emblem • High-Contrast Luxury Vignette',
            color: '#fbbf24',
            settings: {
                mode: 12,
                aspectRatio: '9:16',
                waveColor: '#fbbf24',
                palette: 'gold',
                phonkIntroEnabled: false,
                phonkIntroDuration: 0,
                phonkBgTheme: 'mage',
                logoShakeIntensity: 15,
                logoGlowSize: 40,
                logoParticles: true,
                eqBass: 6,
                eqMid: 1,
                eqTreble: 2,
                sensitivity: 1.65,
                fxVignette: true,
                fxScanlines: false
            }
        },
        {
            id: 'youtube-type-beat',
            name: 'YouTube Type-Beat 16:9 Master',
            tag: '📺 16:9 WIDESCREEN',
            desc: '16:9 Widescreen • Classic Logo Visualizer with Drone Camera Pan, Radial Rays & Lower-Third Title',
            color: '#6366f1',
            settings: {
                mode: 8,
                aspectRatio: '16:9',
                waveColor: '#00ff88',
                palette: 'cyberpunk',
                phonkIntroEnabled: false,
                phonkIntroDuration: 0,
                logoShakeIntensity: 12,
                logoGlowSize: 35,
                logoParticles: true,
                eqBass: 4,
                eqMid: 1,
                eqTreble: 2,
                sensitivity: 1.5,
                fxVignette: true,
                fxScanlines: false
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
        phonkKickEnv: 0,
        phonkSparks: null,
        bgImg: null,
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
        unlockTimerId: null
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
        overlayPosition: 'bottom-left',
        overlayBeatPulse: true,
        fxScanlines: false,
        fxVignette: true,
        fxProgressBar: true,
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
                if (data.config && typeof data.config === 'object') Object.assign(CONFIG, data.config);
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
            this.destinationNode = this.ctx.createMediaStreamDestination();

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
            const volEl = document.getElementById('vol-slider');
            this.gainNode.gain.value = Math.min(parseFloat(volEl ? volEl.value : 0.8) || 0.8, 1);

            this.micSource = null;
            this.audioElement = new Audio();
            this.audioElement.crossOrigin = 'anonymous';
            window.__wfAudioElement = this.audioElement;

            this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);
            this.sourceNode.connect(this.bassFilter);
            this.bassFilter.connect(this.midFilter);
            this.midFilter.connect(this.trebleFilter);
            this.trebleFilter.connect(this.analyser);
            this.analyser.connect(this.gainNode);
            this.gainNode.connect(this.ctx.destination);
            this.analyser.connect(this.destinationNode);

            this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
            this.waveData = new Uint8Array(this.analyser.fftSize);

            this.fileURL = null;
            this.updateSettings();

            this.audioElement.addEventListener('ended', () => {
                APP_STATE.isPlaying = false;
                UI.updatePlayButton();
                if (APP_STATE.isRecording) {
                    Exporter.stop();
                }
            });

            this.audioElement.addEventListener('timeupdate', () => UI.updateProgressBar());
            this.audioElement.addEventListener('loadedmetadata', () => UI.updateProgressBar());
        }

        resume() {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playFile(url) {
            this.resume();
            this.stopMic();
            if (this.fileURL && this.fileURL !== url) URL.revokeObjectURL(this.fileURL);
            this.fileURL = url;
            this.audioElement.src = url;
            this.audioElement.currentTime = 0;
            this.audioElement.play().then(() => {
                APP_STATE.isPlaying = true;
                UI.updatePlayButton();
                UI.showToast('🎵 Audio playing — ready to customize or export!', 'success');
            }).catch(e => {
                UI.showToast('Error: ' + e.message, 'error');
            });
        }

        togglePlay() {
            this.resume();
            if (this.micSource) return;

            if (this.audioElement.paused) {
                if (!this.audioElement.src) {
                    UI.showToast('Loading built-in demo track...', 'info');
                    UI.loadDemoTrack();
                    return;
                }
                this.audioElement.play().catch(() => {});
                APP_STATE.isPlaying = true;
            } else {
                this.audioElement.pause();
                APP_STATE.isPlaying = false;
            }
            UI.updatePlayButton();
        }

        stop() {
            this.stopMic();
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            APP_STATE.isPlaying = false;
            UI.updatePlayButton();
        }

        async enableMic() {
            if (this.micSource) {
                this.stopMic();
                APP_STATE.isPlaying = false;
                UI.updatePlayButton();
                UI.showToast('Microphone disabled', 'info');
                return;
            }

            this.resume();
            this.stop();

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
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
                this.micSource.disconnect();
                this.micSource = null;
                document.getElementById('btn-mic').classList.remove('active');
            }
        }

        updateSettings() {
            this.analyser.fftSize = CONFIG.fftSize;
            this.analyser.smoothingTimeConstant = CONFIG.smoothing;
            const volEl = document.getElementById('vol-slider');
            const vol = Math.min(parseFloat(volEl ? volEl.value : 0.8) || 0.8, 1);
            this.gainNode.gain.value = vol;

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
            return this.audioElement.src && this.audioElement.src !== '';
        }

        getDuration() {
            return this.audioElement.duration || 0;
        }

        getCurrentTime() {
            return this.audioElement.currentTime || 0;
        }
    }

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
            const range = Math.floor(freqData.length * 0.12);

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

        init() {
            document.getElementById('btn-export').onclick = () => this.showModal();
            document.getElementById('btn-close-export').onclick = () => this.hideModal();
            document.getElementById('btn-start-export').onclick = () => this.startRecording();
            document.getElementById('btn-cancel-export').onclick = () => this.stop();

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

        _clearUnlockGate() {
            if (APP_STATE.unlockTimerId) {
                clearInterval(APP_STATE.unlockTimerId);
                APP_STATE.unlockTimerId = null;
            }
            const gate = document.getElementById('export-unlock-gate');
            if (gate) gate.classList.add('hidden');
            const startBtn = document.getElementById('btn-start-export');
            if (startBtn) startBtn.style.display = 'inline-flex';
        },

        _presentAdUnlockGate(blobUrl, filename, summaryText) {
            if (APP_STATE.pendingExportBlobUrl) {
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
            this._clearUnlockGate();
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

        _videoCodecCandidates: [
            'avc1.42E028',
            'avc1.4D4028',
            'avc1.640028',
            'avc1.640032',
            'avc1.640033',
            'avc1.640034'
        ],

        async _pickVideoCodec(width, height, fps, bitrate) {
            const accelModes = ['prefer-hardware', 'no-preference'];
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

        async _pickAudioCodec(sampleRate, channels) {
            try {
                const cfg = { codec: 'mp4a.40.2', sampleRate, numberOfChannels: channels, bitrate: 192000 };
                const support = await AudioEncoder.isConfigSupported(cfg);
                if (support && support.supported) return support.config;
            } catch (e) {}
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
                note.textContent = '⏺ Realtime recording (WebM).';
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
            this._clearUnlockGate();
            const isMobileDevice = window.innerWidth < 820 || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);
            if (isMobileDevice && !this._mobileDefaultApplied) {
                this._mobileDefaultApplied = true;
                const fpsEl = document.getElementById('export-fps');
                if (fpsEl) fpsEl.value = '30';
                const q720 = document.querySelector('input[name="export-quality"][value="720"]');
                if (q720) {
                    q720.checked = true;
                    document.querySelectorAll('.export-option').forEach(o => o.classList.remove('selected'));
                    q720.closest('.export-option').classList.add('selected');
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
            if (APP_STATE.isRecording) return;
            this._clearUnlockGate();
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
            this._clearUnlockGate();

            const aspectSelect = document.getElementById('export-aspect');
            if (aspectSelect) {
                CONFIG.aspectRatio = aspectSelect.value;
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

        async _startMediaRecorderExport() {
            if (APP_STATE.isRecording) return;

            const quality = document.querySelector('input[name="export-quality"]:checked').value;
            const durationSetting = document.getElementById('export-duration').value;
            const fps = parseInt(document.getElementById('export-fps').value);
            const modeSelect = document.getElementById('export-mode').value;

            if (modeSelect !== 'current') {
                setMode(parseInt(modeSelect));
            }

            const { width, height } = getExportDimensions(quality, CONFIG.aspectRatio);

            APP_STATE.exportCanvas = document.createElement('canvas');
            APP_STATE.exportCanvas.width = width;
            APP_STATE.exportCanvas.height = height;
            APP_STATE.exportCtx = APP_STATE.exportCanvas.getContext('2d');

            let maxDuration = audio.getDuration() - audio.getCurrentTime();
            if (durationSetting !== 'full') {
                maxDuration = Math.min(maxDuration, parseInt(durationSetting));
            }

            APP_STATE.isRecording = true;
            APP_STATE.recordedChunks = [];
            APP_STATE.recordingStartTime = audio.getCurrentTime();
            APP_STATE.recordingDuration = maxDuration;

            const canvasStream = APP_STATE.exportCanvas.captureStream(fps);
            const audioStream = audio.getAudioStream();
            const audioTracks = audioStream.getAudioTracks();

            if (audioTracks.length > 0) {
                canvasStream.addTrack(audioTracks[0]);
            }

            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
                ? 'video/webm;codecs=vp9,opus'
                : 'video/webm;codecs=vp8,opus';

            APP_STATE.mediaRecorder = new MediaRecorder(canvasStream, {
                mimeType: mimeType,
                videoBitsPerSecond: quality === '2160' ? 20000000 : quality === '1440' ? 12000000 : 8000000
            });

            APP_STATE.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
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
            if (!APP_STATE.isRecording) return;

            const elapsed = audio.getCurrentTime() - APP_STATE.recordingStartTime;
            const progress = Math.min((elapsed / APP_STATE.recordingDuration) * 100, 100);

            document.getElementById('progress-fill').style.width = progress + '%';
            document.getElementById('progress-percent').textContent = Math.round(progress) + '%';
            document.getElementById('progress-status').textContent = `Recording... ${this.formatTime(elapsed)} / ${this.formatTime(APP_STATE.recordingDuration)}`;

            if (elapsed >= APP_STATE.recordingDuration) {
                this.stop();
                return;
            }

            requestAnimationFrame(() => this.monitorProgress());
        },

        stop() {
            if (!APP_STATE.isRecording) return;

            if (APP_STATE.isFastExporting) {
                this._cancelFast = true;
                document.getElementById('status-dot').classList.remove('recording');
                document.getElementById('status-text').textContent = 'Cancelling…';
                return;
            }

            APP_STATE.isRecording = false;

            if (APP_STATE.mediaRecorder && APP_STATE.mediaRecorder.state !== 'inactive') {
                APP_STATE.mediaRecorder.stop();
            }

            document.getElementById('status-dot').classList.remove('recording');
            document.getElementById('status-text').textContent = 'Processing...';
        },

        async startFastExport() {
            const quality = document.querySelector('input[name="export-quality"]:checked').value;
            const durationSetting = document.getElementById('export-duration').value;
            const fps = parseInt(document.getElementById('export-fps').value);
            const modeSelect = document.getElementById('export-mode').value;

            if (modeSelect !== 'current') {
                setMode(parseInt(modeSelect));
            }

            const bitrates = { '720': 5_000_000, '1080': 8_500_000, '1440': 14_000_000, '2160': 24_000_000 };
            const bitrate = bitrates[quality] || 8_500_000;
            const { width, height } = getExportDimensions(quality, CONFIG.aspectRatio);

            const videoCfg = await this._pickVideoCodec(width, height, fps, bitrate);
            if (!videoCfg) throw new Error('No supported H.264 codec for ' + width + 'x' + height + '@' + fps);

            this._setStatus('Decoding audio…', 0);
            const srcUrl = audio.audioElement.src;
            if (!srcUrl) throw new Error('No audio source loaded');

            let decoded = APP_STATE.decodedAudioBuffer;
            if (!decoded || APP_STATE.decodedAudioSrc !== srcUrl) {
                const resp = await fetch(srcUrl);
                const buf = await resp.arrayBuffer();
                decoded = await audio.ctx.decodeAudioData(buf.slice(0));
                APP_STATE.decodedAudioBuffer = decoded;
                APP_STATE.decodedAudioSrc = srcUrl;
            }

            const audioCfg = await this._pickAudioCodec(decoded.sampleRate, Math.min(2, decoded.numberOfChannels));
            if (!audioCfg) throw new Error('No supported AAC encoder for ' + decoded.sampleRate + 'Hz');

            // If Phonk Intro is enabled, start export from 0:00 so the 3.5s AirPods Intro is captured!
            const startTime = (APP_STATE.mode === 12 && CONFIG.phonkIntroEnabled) ? 0 : audio.getCurrentTime();
            let clipDuration = decoded.duration - startTime;
            if (durationSetting !== 'full') clipDuration = Math.min(clipDuration, parseInt(durationSetting));
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
            let audioBuffer;
            try {
                const offlineCtx = new OfflineAudioContext(
                    numChannels,
                    Math.ceil(clipDuration * decoded.sampleRate),
                    decoded.sampleRate
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

            const muxer = new Mp4Muxer.Muxer({
                target: new Mp4Muxer.ArrayBufferTarget(),
                video: { codec: 'avc', width, height, frameRate: fps },
                audio: { codec: 'aac', numberOfChannels: numChannels, sampleRate },
                fastStart: 'in-memory',
                firstTimestampBehavior: 'offset'
            });

            let encodeError = null;
            const videoEncoder = new VideoEncoder({
                output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
                error: (e) => { encodeError = e; }
            });
            videoEncoder.configure(videoCfg);

            const audioEncoder = new AudioEncoder({
                output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
                error: (e) => { encodeError = e; }
            });
            audioEncoder.configure(audioCfg);

            const renderCanvas = document.createElement('canvas');
            renderCanvas.width = width;
            renderCanvas.height = height;
            const renderCtx = renderCanvas.getContext('2d', { alpha: false, desynchronized: true, willReadFrequently: false });

            try {
                Object.defineProperty(renderCtx, 'shadowBlur', {
                    get() { return 0; },
                    set() {},
                    configurable: true
                });
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

                    APP_STATE.exportTime = tFrame;
                    const isBeat = BeatDetector.update(freqArr);
                    this.renderFrame(renderCtx, width, height, { freq: freqArr, wave: waveArr }, isBeat, tFrame / clipDuration);

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

            this._setStatus('Finalizing MP4 container…', 98);
            await videoEncoder.flush();
            await audioEncoder.flush();
            videoEncoder.close();
            audioEncoder.close();

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
            const filename = `waveforge_${this.downloadBaseName()}_${CONFIG.aspectRatio.replace(':', 'x')}_${Date.now()}.mp4`;

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

            // Present the 8-Second Ad-Timer + Sponsor Smartlink Unlock Gate!
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
            const blob = new Blob(APP_STATE.recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const filename = `waveforge_${this.downloadBaseName()}_${CONFIG.aspectRatio.replace(':', 'x')}_${Date.now()}.webm`;

            APP_STATE.exportCanvas = null;
            APP_STATE.exportCtx = null;
            APP_STATE.recordedChunks = [];
            document.getElementById('status-text').textContent = 'Ready';

            this._presentAdUnlockGate(url, filename, '✅ WebM Video Recorded & Ready to Download!');
        },

        formatTime(seconds) {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        },

        renderFrame(ctx, width, height, data, isBeat, progressRatio) {
            const mod = VIS_MODS[APP_STATE.mode];
            if (!mod) return;

            if (typeof viz !== 'undefined' && viz) data = viz.processData(data);

            if (!mod.ownBackground) {
                ctx.fillStyle = CONFIG.highContrast ? '#000000' : 'rgba(5, 5, 5, 0.2)';
                ctx.fillRect(0, 0, width, height);
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
                this.resizeTimer = setTimeout(() => this.resize(), 150);
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

        resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.canvas.width = window.innerWidth * dpr;
            this.canvas.height = window.innerHeight * dpr;
            this.ctx.scale(dpr, dpr);
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.cx = this.width / 2;
            this.cy = this.height / 2;
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
                out[i] = sum / (b - a);
            }
            return { freq: out, wave: data.wave };
        }

        renderPostOverlays(ctx, w, h, isBeat, progressRatio, isExport) {
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
                for (let y = 0; y < h; y += 4) {
                    ctx.fillRect(0, y, w, 1.5);
                }
                ctx.restore();
            }

            const title = (CONFIG.overlayTitle || '').trim();
            const artist = (CONFIG.overlayArtist || '').trim();
            if (title || artist) {
                ctx.save();
                const pulse = (CONFIG.overlayBeatPulse && isBeat) ? 1.05 : 1.0;
                const baseSize = Math.max(18, Math.round(Math.min(w, h) * 0.042));
                const subSize = Math.max(12, Math.round(baseSize * 0.56));
                let tx = w * 0.06;
                let ty = h * 0.84;
                let align = 'left';

                if (CONFIG.overlayPosition === 'center') {
                    tx = w / 2;
                    ty = h / 2;
                    align = 'center';
                } else if (CONFIG.overlayPosition === 'top-center') {
                    tx = w / 2;
                    ty = h * 0.14;
                    align = 'center';
                } else if (CONFIG.overlayPosition === 'bottom-center') {
                    tx = w / 2;
                    ty = h * 0.85;
                    align = 'center';
                }

                ctx.translate(tx, ty);
                ctx.scale(pulse, pulse);
                ctx.textAlign = align;
                ctx.textBaseline = 'middle';

                if (title) {
                    ctx.font = `800 ${baseSize}px 'Space Grotesk', Inter, sans-serif`;
                    ctx.shadowColor = this.getColor(0);
                    ctx.shadowBlur = isBeat ? 22 : 12;
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

            if (!isExport && CONFIG.aspectRatio && CONFIG.aspectRatio !== '16:9') {
                const ratios = { '9:16': 9 / 16, '1:1': 1, '4:5': 4 / 5 };
                const targetRatio = ratios[CONFIG.aspectRatio];
                if (targetRatio) {
                    let fw = h * 0.82 * targetRatio;
                    let fh = h * 0.82;
                    if (fw > w * 0.92) {
                        fw = w * 0.92;
                        fh = fw / targetRatio;
                    }
                    const fx = (w - fw) / 2;
                    const fy = (h - fh) / 2;
                    ctx.save();
                    ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([6, 6]);
                    ctx.strokeRect(fx, fy, fw, fh);
                    ctx.setLineDash([]);
                    ctx.font = '600 11px Inter, sans-serif';
                    ctx.fillStyle = 'rgba(168, 85, 247, 0.85)';
                    ctx.fillText(`Export Frame (${CONFIG.aspectRatio})`, fx + 8, fy + 16);
                    ctx.restore();
                }
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

            const data = audio.getAnalysis();
            const isBeat = BeatDetector.update(data.freq);

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

            if (!mod.ownBackground) {
                ctx.fillStyle = CONFIG.highContrast ? '#000000' : 'rgba(5, 5, 5, 0.2)';
                ctx.fillRect(0, 0, w, h);
            }

            ctx.lineWidth = 2;
            ctx.lineCap = 'round';

            mod.render(this, ctx, w, h, cx, cy, data, isBeat);

            const prog = audio.getDuration() > 0 ? audio.getCurrentTime() / audio.getDuration() : 0;
            this.renderPostOverlays(ctx, w, h, isBeat, prog, false);
        }
    }

    // ============================================
    // UI CONTROLLER & TRENDING TEMPLATES ENGINE
    // ============================================

    const UI = {
        settingsOpen: false,

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
        },

        cacheElements() {
            this.els = {
                fileInput: document.getElementById('file-input'),
                playBtn: document.getElementById('btn-play'),
                playIcon: document.getElementById('play-icon'),
                seek: document.getElementById('seek-bar'),
                dropOverlay: document.getElementById('drop-overlay'),
                settingsModal: document.getElementById('settings-modal'),
                exportModal: document.getElementById('export-modal'),
                shareModal: document.getElementById('share-modal'),
                modeSelectorModal: document.getElementById('mode-selector-modal'),
                templatesModal: document.getElementById('templates-modal'),
                shortcutsModal: document.getElementById('shortcuts-modal'),
                uiLayer: document.getElementById('ui-layer'),
                modeName: document.getElementById('mode-name'),
                toastContainer: document.getElementById('toast-container')
            };
        },

        buildTemplatesGrid() {
            const grid = document.getElementById('templates-grid');
            if (!grid) return;
            grid.innerHTML = '';

            TRENDING_TEMPLATES.forEach((tpl) => {
                const card = document.createElement('div');
                card.className = 'template-card' + (APP_STATE.activeTemplateId === tpl.id ? ' active' : '');
                card.dataset.templateId = tpl.id;
                card.innerHTML = `
                    <div class="tpl-preview" style="--tpl-color: ${tpl.color};">
                        <div class="tpl-ring-demo"></div>
                        <span class="tpl-badge">${tpl.tag}</span>
                    </div>
                    <div class="tpl-body">
                        <h3>${tpl.name}</h3>
                        <p>${tpl.desc}</p>
                        <button type="button" class="tpl-use-btn">✨ Use This Template</button>
                    </div>
                `;
                card.onclick = () => this.applyTemplate(tpl.id);
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

            audio.updateSettings();
            this.applyConfigToUI();
            this.updateModeDisplay();
            this.updateModeCards();
            this.updateSliderLabels();
            persistConfig();

            document.querySelectorAll('.template-card').forEach(c => {
                c.classList.toggle('active', c.dataset.templateId === tpl.id);
            });

            if (this.els.templatesModal) {
                this.els.templatesModal.classList.remove('open');
            }

            // Show the 3-Step Guided Template Bar so user knows exactly what to upload next!
            const wizardBar = document.getElementById('template-wizard-bar');
            const wizardName = document.getElementById('wizard-template-name');
            if (wizardBar) {
                if (wizardName) wizardName.textContent = tpl.name;
                wizardBar.classList.remove('hidden');
            }

            // Hide welcome card so user sees the live template immediately
            const onboard = document.getElementById('studio-onboarding');
            if (onboard) onboard.classList.add('hidden-card');

            // Auto-start demo track if no audio is loaded yet so template comes alive!
            if (!audio.hasAudio()) {
                this.loadDemoTrack();
            } else if (APP_STATE.mode === 12 && CONFIG.phonkIntroEnabled) {
                // Restart track at 0:00 so user sees the 3.5s AirPods volume intro!
                audio.audioElement.currentTime = 0;
                if (audio.audioElement.paused) audio.togglePlay();
            }

            this.showToast(`🔥 Applied "${tpl.name}" template!`, 'success');
        },

        buildModeGrid() {
            const grid = document.getElementById('mode-grid');
            if (!grid) return;
            grid.innerHTML = '';
            // Put Mode 12 (Hardtekk Phonk) and Mode 8 (Logo Viz) right at the top!
            const order = [12, 8, 10, 9, 11, 0, 1, 2, 3, 4, 5, 6, 7].filter(k => VIS_MODS[k]);

            order.forEach(key => {
                const mod = VIS_MODS[key];
                const card = document.createElement('div');
                card.className = 'mode-card' + (mod.newBadge ? ' new-badge' : '');
                card.dataset.mode = key;
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
                card.onclick = () => {
                    setMode(parseInt(key));
                    this.showToast(mod.icon + ' ' + mod.name, 'info');
                    setTimeout(() => this.closeModeSelector(), 220);
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
                        setMode(parseInt(key));
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
            Object.keys(VIS_MODS).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
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

            // Templates Modal triggers
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

            const onboardClose = document.getElementById('onboard-close-btn');
            if (onboardClose) {
                onboardClose.onclick = () => {
                    const card = document.getElementById('studio-onboarding');
                    if (card) card.classList.add('hidden-card');
                };
            }
            const onboardDemo = document.getElementById('onboard-demo-btn');
            if (onboardDemo) onboardDemo.onclick = () => this.loadDemoTrack();
            const onboardUpload = document.getElementById('onboard-upload-btn');
            if (onboardUpload) onboardUpload.onclick = () => this.els.fileInput.click();

            this.els.fileInput.onchange = (e) => this.handleFile(e.target.files[0]);
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

            this.els.seek.oninput = (e) => {
                if (audio.audioElement.duration) {
                    audio.audioElement.currentTime = (e.target.value / 100) * audio.audioElement.duration;
                }
            };

            document.getElementById('vol-slider').oninput = () => audio.updateSettings();

            document.getElementById('btn-settings').onclick = () => this.toggleSettings(true);
            document.getElementById('btn-close-settings').onclick = () => this.toggleSettings(false);

            document.getElementById('btn-fullscreen').onclick = () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen();
                }
            };

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

            let hideTimeout;
            const revealUI = () => {
                this.els.uiLayer.style.opacity = '1';
                clearTimeout(hideTimeout);
            };
            document.addEventListener('pointermove', (e) => {
                if (e.pointerType === 'touch') return;
                revealUI();
                hideTimeout = setTimeout(() => {
                    if (APP_STATE.isPlaying && !this.settingsOpen && !APP_STATE.isRecording) {
                        this.els.uiLayer.style.opacity = '0';
                    }
                }, 3200);
            });
            document.addEventListener('pointerdown', revealUI);
            document.addEventListener('touchstart', revealUI, { passive: true });

            this.els.settingsModal.onclick = (e) => {
                if (e.target === this.els.settingsModal) this.toggleSettings(false);
            };

            this.els.exportModal.onclick = (e) => {
                if (e.target === this.els.exportModal && !APP_STATE.isRecording) {
                    Exporter.hideModal();
                }
            };

            this.setupShare();
        },

        getShareablePresetUrl() {
            const base = 'https://progameryt-op.github.io/WaveForge/visualizer.html';
            const params = new URLSearchParams();
            params.set('mode', String(APP_STATE.mode));
            params.set('palette', CONFIG.palette);
            params.set('sens', String(CONFIG.sensitivity));
            params.set('aspect', CONFIG.aspectRatio || '9:16');
            if (CONFIG.overlayTitle) params.set('title', CONFIG.overlayTitle);
            if (CONFIG.overlayArtist) params.set('artist', CONFIG.overlayArtist);
            return `${base}?${params.toString()}`;
        },

        setupShare() {
            const SHARE_TITLE = 'Check out my custom Phonk/Music visualizer preset on WaveForge Studio!';
            const embed = (str) => encodeURIComponent(str);

            const openShare = () => {
                const shareUrl = this.getShareablePresetUrl();
                if (navigator.share) {
                    navigator.share({ title: SHARE_TITLE, url: shareUrl }).catch(() => {});
                    return;
                }
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
                const done = () => this.showToast('Shareable preset link copied!', 'success');
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(shareUrl).then(done).catch(() => {});
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
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

                switch (e.code) {
                    case 'Space':
                        e.preventDefault();
                        audio.togglePlay();
                        break;
                    case 'KeyS':
                        audio.stop();
                        break;
                    case 'KeyM':
                        UI.openModeSelector();
                        break;
                    case 'KeyT':
                        if (this.els.templatesModal) this.els.templatesModal.classList.toggle('open');
                        break;
                    case 'KeyF':
                        document.getElementById('btn-fullscreen').click();
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
                    case 'Escape':
                        this.toggleSettings(false);
                        Exporter.hideModal();
                        this.closeModeSelector();
                        if (this.els.templatesModal) this.els.templatesModal.classList.remove('open');
                        this.els.shareModal.classList.remove('open');
                        this.els.shortcutsModal.classList.remove('open');
                        break;
                }
            });
        },

        setupSettings() {
            const linkSetting = (id, configKey, type = 'float') => {
                const el = document.getElementById(id);
                if (!el) return;

                el.onchange = el.oninput = (e) => {
                    let val = e.target.value;
                    if (type === 'float') val = parseFloat(val);
                    else if (type === 'int') val = parseInt(val);
                    else if (type === 'bool') val = e.target.checked;
                    CONFIG[configKey] = val;
                    audio.updateSettings();
                    persistConfig();
                };
            };

            linkSetting('set-fft', 'fftSize', 'int');
            linkSetting('set-smoothing', 'smoothing', 'float');
            linkSetting('set-sensitivity', 'sensitivity', 'float');
            linkSetting('set-bloom', 'bloomIntensity', 'float');
            linkSetting('set-beat-thresh', 'beatThreshold', 'float');
            linkSetting('set-palette', 'palette', 'string');
            linkSetting('set-beat-enabled', 'beatEnabled', 'bool');
            linkSetting('set-mirror', 'mirror', 'bool');
            linkSetting('set-watermark', 'watermark', 'bool');
            linkSetting('set-freq-scale', 'freqScale', 'string');
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

            // Phonk / Hardtekk Intro bindings
            linkSetting('set-phonk-intro', 'phonkIntroEnabled', 'bool');
            linkSetting('set-phonk-intro-dur', 'phonkIntroDuration', 'float');

            document.querySelectorAll('#settings-modal input[type="range"]').forEach((input) => {
                input.addEventListener('input', () => this.updateSliderLabels());
            });

            document.getElementById('btn-reset-settings').onclick = () => {
                Object.assign(CONFIG, DEFAULT_CONFIG);
                audio.updateSettings();
                document.body.classList.toggle('high-contrast', CONFIG.highContrast);
                document.getElementById('fps-display').style.display = CONFIG.showFps ? '' : 'none';
                this.applyConfigToUI();
                this.updateSliderLabels();
                persistConfig();
                this.showToast('Settings reset to defaults', 'success');
            };

            document.getElementById('set-hc').onchange = (e) => {
                CONFIG.highContrast = e.target.checked;
                document.body.classList.toggle('high-contrast', CONFIG.highContrast);
                persistConfig();
            };

            document.getElementById('set-show-fps').onchange = (e) => {
                CONFIG.showFps = e.target.checked;
                document.getElementById('fps-display').style.display = CONFIG.showFps ? '' : 'none';
                persistConfig();
            };

            document.getElementById('btn-export-preset').onclick = () => {
                const preset = { ...CONFIG, mode: APP_STATE.mode };
                const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `waveforge_preset_${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 60_000);
                this.showToast('Preset saved!', 'success');
            };

            document.getElementById('btn-screenshot').onclick = () => {
                try {
                    const a = document.createElement('a');
                    a.href = document.getElementById('viz-canvas').toDataURL('image/png');
                    a.download = `waveforge_screenshot_${Date.now()}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    this.showToast('Screenshot saved!', 'success');
                } catch (err) {
                    this.showToast('Screenshot failed', 'error');
                }
            };

            document.getElementById('btn-upload-bg').onclick = () => document.getElementById('logo-bg-input').click();
            document.getElementById('btn-upload-logo').onclick = () => document.getElementById('logo-img-input').click();

            document.getElementById('logo-bg-input').onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                        APP_STATE.bgImg = img;
                        document.getElementById('btn-upload-bg').classList.add('has-file');
                        document.getElementById('bg-label').textContent = 'BG: ' + file.name.substring(0, 14);
                        const wizBg = document.getElementById('wiz-btn-bg');
                        if (wizBg) wizBg.classList.add('done-step');
                        this.showToast('🖼️ Custom background loaded!', 'success');
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
                e.target.value = '';
            };

            document.getElementById('logo-img-input').onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                        APP_STATE.logoImg = img;
                        document.getElementById('btn-upload-logo').classList.add('has-file');
                        document.getElementById('logo-label').textContent = 'Logo: ' + file.name.substring(0, 14);
                        const wizLogo = document.getElementById('wiz-btn-logo');
                        if (wizLogo) wizLogo.classList.add('done-step');
                        this.showToast('⭕ Custom center logo loaded!', 'success');
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
                e.target.value = '';
            };

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

            document.getElementById('set-shake').oninput = (e) => { CONFIG.logoShakeIntensity = parseFloat(e.target.value); persistConfig(); };
            document.getElementById('set-ray-count').oninput = (e) => { CONFIG.logoRayCount = parseInt(e.target.value); persistConfig(); };
            document.getElementById('set-line-thick').oninput = (e) => { CONFIG.logoLineThickness = parseFloat(e.target.value); persistConfig(); };
            document.getElementById('set-glow-size').oninput = (e) => { CONFIG.logoGlowSize = parseFloat(e.target.value); persistConfig(); };
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
            setVal('set-overlay-pos', CONFIG.overlayPosition);
            setVal('set-aspect', CONFIG.aspectRatio);
            setVal('export-aspect', CONFIG.aspectRatio);
            setVal('set-phonk-intro-dur', CONFIG.phonkIntroDuration);

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

            document.body.classList.toggle('high-contrast', CONFIG.highContrast);
            document.getElementById('fps-display').style.display = CONFIG.showFps ? '' : 'none';

            document.querySelectorAll('.color-swatch').forEach(s => {
                s.classList.toggle('active', s.dataset.color === CONFIG.waveColor);
            });
        },

        handleFile(file) {
            if (!file) return;

            if (file.type.includes('json') || file.name.endsWith('.json')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const preset = JSON.parse(e.target.result);
                        Object.assign(CONFIG, preset);
                        if (preset.mode !== undefined && VIS_MODS[preset.mode]) {
                            APP_STATE.mode = preset.mode;
                        }
                        audio.updateSettings();
                        this.applyConfigToUI();
                        this.updateModeDisplay();
                        this.updateModeCards();
                        persistConfig();
                        this.showToast('Preset loaded!', 'success');
                    } catch (err) {
                        this.showToast('Invalid preset file', 'error');
                    }
                };
                reader.readAsText(file);
            } else if (file.type.includes('audio') || file.name.match(/\.(mp3|wav|ogg|flac|m4a|aac|webm)$/i)) {
                const wizMusic = document.getElementById('wiz-btn-music');
                if (wizMusic) wizMusic.classList.add('done-step');
                audio.playFile(URL.createObjectURL(file));
                document.getElementById('status-text').textContent = file.name.substring(0, 18) + (file.name.length > 18 ? '...' : '');
            } else {
                this.showToast('Unsupported file type', 'error');
            }
        },

        loadDemoTrack() {
            audio.playFile('assets/audio/demo-track.wav');
            document.getElementById('status-text').textContent = 'Demo track';
        },

        toggleSettings(show) {
            this.settingsOpen = show;
            this.els.settingsModal.classList.toggle('open', show);
        },

        updatePlayButton() {
            this.els.playIcon.textContent = APP_STATE.isPlaying ? '⏸' : '▶';
            this.els.playBtn.classList.toggle('active', APP_STATE.isPlaying);
            document.getElementById('status-text').textContent = APP_STATE.isPlaying ? 'Playing' : 'Paused';
            const onboard = document.getElementById('studio-onboarding');
            if (onboard && (APP_STATE.isPlaying || audio.hasAudio())) {
                onboard.classList.add('hidden-card');
            }
        },

        updateProgressBar() {
            const el = audio.audioElement;
            if (!el.duration || isNaN(el.duration)) return;

            const pct = (el.currentTime / el.duration) * 100;
            this.els.seek.value = pct;

            const formatTime = (s) => {
                if (isNaN(s)) return '0:00';
                const m = Math.floor(s / 60);
                const sec = Math.floor(s % 60);
                return `${m}:${sec < 10 ? '0' : ''}${sec}`;
            };

            document.getElementById('time-current').textContent = formatTime(el.currentTime);
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
                const modeNum = parseInt(card.dataset.mode);
                card.classList.toggle('active', modeNum === APP_STATE.mode);
            });
        },

        updateModeDisplay() {
            const mod = VIS_MODS[APP_STATE.mode];
            this.els.modeName.textContent = mod ? mod.name : 'Unknown';
            const logoSettings = document.getElementById('logo-viz-settings');
            if (logoSettings) logoSettings.classList.toggle('hidden', APP_STATE.mode !== 8 && APP_STATE.mode !== 12);
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
                label.textContent = Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0$/, '');
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
            persistConfig();
            const mod = VIS_MODS[APP_STATE.mode];
            this.showToast('🎲 ' + (mod ? mod.name : 'Randomized') + ' · ' + CONFIG.palette, 'success');
        },

        showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            this.els.toastContainer.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    };

    // ============================================
    // INITIALIZATION
    // ============================================

    let audio, viz;

    document.addEventListener('DOMContentLoaded', () => {
        hydrateConfig();

        audio = new AudioEngine();
        viz = new VisualizerEngine();

        UI.init();
        Exporter.init();

        viz.loop();

        // If user launched via ?template=... on index.html, automatically open the 3-step guided bar
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('template')) {
            UI.applyTemplate(urlParams.get('template'));
        }

        console.log('%c🎵 WaveForge Studio v7.0.0', 'color: #a855f7; font-size: 20px; font-weight: bold;');
    });

    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(r => r.update()).catch(() => {});
        });
    }
})();
