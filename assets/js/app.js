/**
 * WaveForge Music Visualizer v2.0
 * Professional audio visualization with video export.
 *
 * Rendering code for each mode lives in Visualizers/<mode>.js and registers
 * itself into window.WaveForgeVisualizers (see Visualizers/README.md).
 */
(function () {
    'use strict';

    // ============================================
    // GLOBAL STATE & CONFIGURATION
    // ============================================

    const APP_STATE = {
        isPlaying: false,
        mode: 8,
        modesCount: 9,
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
        bgImg: null,
        logoImg: null,
        logoAngle: 0,
        // Fast-export driven render time (seconds). Null = use real wall-clock.
        exportTime: null,
        // Set to true while a fast WebCodecs export is running
        isFastExporting: false,
        decodedAudioBuffer: null,
        decodedAudioSrc: null
    };

    // Visualization mode registry (populated by Visualizers/*.js)
    const VIS_MODS = window.WaveForgeVisualizers || {};

    // Returns the time (seconds) renderers should use for time-based animation.
    // During a fast (offline) export this comes from the export timeline so
    // animations are tied to audio time rather than wall-clock time.
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
        sensitivity: 1.5,
        bloomIntensity: 60,
        beatThreshold: 1.3,
        beatEnabled: true,
        palette: 'cyberpunk',
        highContrast: false,
        mirror: false,
        showFps: true,
        waveColor: '#00ff88',
        logoShakeIntensity: 10,
        logoRayCount: 128,
        logoLineThickness: 2,
        logoGlowSize: 35,
        logoParticles: true,
        logoRotateRing: false,
        watermark: false
    };

    const PALETTES = {
        cyberpunk: ['#00f2ff', '#ff0099', '#ffffff', '#7b2dff'],
        fire: ['#ff0000', '#ff6600', '#ffaa00', '#ffff00'],
        ocean: ['#001144', '#0066ff', '#00ccff', '#00ffff'],
        matrix: ['#001100', '#00ff00', '#66ff66', '#ccffcc'],
        rainbow: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'],
        gold: ['#bf953f', '#fcf6ba', '#b38728', '#aa771c'],
        sunset: ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec'],
        arctic: ['#a8dadc', '#457b9d', '#1d3557', '#f1faee']
    };

    // ============================================
    // SETTINGS PERSISTENCE
    // ============================================

    const CONFIG_KEY = 'wf-config';

    function persistConfig() {
        try {
            localStorage.setItem(CONFIG_KEY, JSON.stringify({ config: CONFIG, mode: APP_STATE.mode }));
        } catch (e) { /* storage unavailable */ }
    }

    function hydrateConfig() {
        try {
            const raw = localStorage.getItem(CONFIG_KEY);
            if (!raw) return;
            const data = JSON.parse(raw);
            if (data.config && typeof data.config === 'object') Object.assign(CONFIG, data.config);
            if (typeof data.mode === 'number' && VIS_MODS[data.mode]) APP_STATE.mode = data.mode;
        } catch (e) { /* corrupted storage — start fresh */ }
    }

    function setMode(n) {
        if (!VIS_MODS[n]) return;
        APP_STATE.mode = n;
        UI.updateModeDisplay();
        UI.updateModeCards();
        persistConfig();
    }

    // ============================================
    // AUDIO ENGINE
    // ============================================

    class AudioEngine {
        constructor() {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.analyser = this.ctx.createAnalyser();
            this.gainNode = this.ctx.createGain();
            this.destinationNode = this.ctx.createMediaStreamDestination();

            this.analyser.fftSize = CONFIG.fftSize;
            this.analyser.smoothingTimeConstant = CONFIG.smoothing;
            this.gainNode.gain.value = Math.min(parseFloat(document.getElementById('vol-slider').value) || 0.8, 1);

            this.micSource = null;
            this.audioElement = new Audio();
            this.audioElement.crossOrigin = "anonymous";

            this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.gainNode);
            this.gainNode.connect(this.ctx.destination);
            // Recording stream taps the analyser directly so exports are
            // always captured at full volume, independent of the speaker gain.
            this.analyser.connect(this.destinationNode);

            this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
            this.waveData = new Uint8Array(this.analyser.fftSize);

            this.fileURL = null;

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
            this.audioElement.play().then(() => {
                APP_STATE.isPlaying = true;
                UI.updatePlayButton();
                UI.showToast('Audio loaded successfully', 'success');
            }).catch(e => {
                UI.showToast('Error: ' + e.message, 'error');
            });
        }

        togglePlay() {
            this.resume();
            if (this.micSource) return;

            if (this.audioElement.paused) {
                if (!this.audioElement.src) {
                    UI.showToast('Please load an audio file first', 'warning');
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
            // Toggle: pressing Mic again disables the microphone.
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
                this.micSource.connect(this.analyser);
                // Route mic through the gain node too so the volume slider works
                this.micSource.connect(this.gainNode);
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
            // Clamp gain to 100% — values above 1 clip the audio
            const vol = Math.min(parseFloat(document.getElementById('vol-slider').value) || 0.8, 1);
            this.gainNode.gain.value = vol;

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

            // Spectral flux: positive energy rise from the previous frame
            const flux = Math.max(0, energy - this.prevEnergy);
            this.prevEnergy = energy;

            // Long history (~3 seconds) so the avg can't catch up to sustained bass
            this.history.push(energy);
            if (this.history.length > 180) this.history.shift();

            const avg = this.history.reduce((a, b) => a + b, 0) / this.history.length;

            if (APP_STATE.beatTimer > 0) {
                APP_STATE.beatTimer--;
                APP_STATE.beatDetected = false;
                return false;
            }

            // Level beat: energy well above long-term average
            const levelBeat = energy > avg * CONFIG.beatThreshold && energy > 50;
            // Flux beat: sharp rise this frame, even if avg is high
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
    // VIDEO EXPORTER
    // ============================================

    const Exporter = {
        // Cancellation flag for the fast (WebCodecs) export pipeline
        _cancelFast: false,

        init() {
            document.getElementById('btn-export').onclick = () => this.showModal();
            document.getElementById('btn-close-export').onclick = () => this.hideModal();
            document.getElementById('btn-start-export').onclick = () => this.startRecording();
            document.getElementById('btn-cancel-export').onclick = () => this.stop();

            // Quality option selection styling
            document.querySelectorAll('.export-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    document.querySelectorAll('.export-option').forEach(o => o.classList.remove('selected'));
                    opt.classList.add('selected');
                });
            });
        },

        // ---------- WebCodecs / mp4-muxer feature detection ----------
        _hasFastExportApis() {
            return typeof window !== 'undefined'
                && 'VideoEncoder' in window
                && 'AudioEncoder' in window
                && 'VideoFrame' in window
                && 'AudioData' in window
                && typeof window.Mp4Muxer !== 'undefined'
                && typeof OfflineAudioContext !== 'undefined';
        },

        // H.264 codec strings ordered by quality. Pick the first browser-supported one.
        _videoCodecCandidates: [
            'avc1.640034', // High @ L5.2 (4K60)
            'avc1.640033', // High @ L5.1 (4K30)
            'avc1.640032', // High @ L5.0
            'avc1.640028', // High @ L4.0 (1080p60)
            'avc1.4D4028', // Main @ L4.0
            'avc1.42E028'  // Baseline @ L4.0
        ],

        async _pickVideoCodec(width, height, fps, bitrate) {
            for (const codec of this._videoCodecCandidates) {
                try {
                    const cfg = { codec, width, height, framerate: fps, bitrate };
                    const support = await VideoEncoder.isConfigSupported(cfg);
                    if (support && support.supported) return support.config;
                } catch (e) { /* keep trying */ }
            }
            return null;
        },

        async _pickAudioCodec(sampleRate, channels) {
            try {
                const cfg = { codec: 'mp4a.40.2', sampleRate, numberOfChannels: channels, bitrate: 192000 };
                const support = await AudioEncoder.isConfigSupported(cfg);
                if (support && support.supported) return support.config;
            } catch (e) { /* unsupported */ }
            return null;
        },

        async _checkFastExportSupport() {
            if (!this._hasFastExportApis()) return { supported: false, reason: 'apis' };
            const v = await this._pickVideoCodec(1280, 720, 30, 6_000_000);
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
                note.textContent = '⚡ Fast export enabled — encodes faster than realtime, outputs MP4 (H.264 + AAC).';
                note.style.background = 'rgba(0, 255, 136, 0.08)';
                note.style.color = '#00ff88';
                note.style.borderColor = 'rgba(0, 255, 136, 0.25)';
            } else {
                note.textContent = '⏺ Realtime recording (your browser doesn\'t support fast export). Output: WebM.';
                note.style.background = 'rgba(255, 200, 80, 0.08)';
                note.style.color = '#ffc850';
                note.style.borderColor = 'rgba(255, 200, 80, 0.25)';
            }
        },

        showModal() {
            if (!audio.hasAudio()) {
                UI.showToast('Please load an audio file first', 'warning');
                return;
            }
            document.getElementById('export-modal').classList.add('open');
            this._refreshEngineNote();
        },

        hideModal() {
            if (APP_STATE.isRecording) return;
            document.getElementById('export-modal').classList.remove('open');
        },

        downloadBaseName() {
            const mod = VIS_MODS[APP_STATE.mode];
            const name = mod ? mod.name : 'visualization';
            return name.toLowerCase().replace(/\s+/g, '_');
        },

        async startRecording() {
            if (APP_STATE.isRecording) return;

            // Try the fast WebCodecs path first; auto-fall back to MediaRecorder.
            const support = await this._checkFastExportSupport().catch(() => ({ supported: false }));
            if (support.supported) {
                try {
                    await this.startFastExport();
                    return;
                } catch (err) {
                    console.error('Fast export failed, falling back to MediaRecorder:', err);
                    UI.showToast('Fast export failed — using realtime fallback', 'warning');
                    // Reset any partial state from fast export attempt
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

            // Set export mode
            if (modeSelect !== 'current') {
                setMode(parseInt(modeSelect));
            }

            // Quality dimensions
            const qualities = {
                '720': { width: 1280, height: 720 },
                '1080': { width: 1920, height: 1080 },
                '1440': { width: 2560, height: 1440 },
                '2160': { width: 3840, height: 2160 }
            };

            const { width, height } = qualities[quality];

            // Create export canvas
            APP_STATE.exportCanvas = document.createElement('canvas');
            APP_STATE.exportCanvas.width = width;
            APP_STATE.exportCanvas.height = height;
            APP_STATE.exportCtx = APP_STATE.exportCanvas.getContext('2d');

            // Determine duration
            let maxDuration = audio.getDuration() - audio.getCurrentTime();
            if (durationSetting !== 'full') {
                maxDuration = Math.min(maxDuration, parseInt(durationSetting));
            }

            APP_STATE.isRecording = true;
            APP_STATE.recordedChunks = [];
            APP_STATE.recordingStartTime = audio.getCurrentTime();
            APP_STATE.recordingDuration = maxDuration;

            // Create video stream from canvas
            const canvasStream = APP_STATE.exportCanvas.captureStream(fps);

            // Add audio track
            const audioStream = audio.getAudioStream();
            const audioTracks = audioStream.getAudioTracks();

            if (audioTracks.length > 0) {
                canvasStream.addTrack(audioTracks[0]);
            }

            // Setup MediaRecorder
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

            // Start recording
            APP_STATE.mediaRecorder.start(100);

            // Start audio playback if paused
            if (audio.audioElement.paused) {
                audio.audioElement.play().catch(() => {});
                APP_STATE.isPlaying = true;
                UI.updatePlayButton();
            }

            // Update UI
            document.getElementById('btn-start-export').style.display = 'none';
            document.getElementById('btn-cancel-export').style.display = 'block';
            document.getElementById('export-progress').classList.add('active');
            document.getElementById('status-dot').classList.add('recording');
            document.getElementById('status-text').textContent = 'Recording...';

            UI.showToast('Recording started', 'info');

            // Monitor progress
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

            // Signal cancellation to the fast-export pipeline (if running)
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

        // ============================================
        // FAST EXPORT — WebCodecs + mp4-muxer
        // Encodes video off the wall clock by:
        //  1) Decoding the audio file once into an AudioBuffer
        //  2) Running an OfflineAudioContext that suspends at every frame
        //     timestamp so we can read AnalyserNode data deterministically
        //  3) Rendering each frame to a hidden canvas, wrapping it in a
        //     VideoFrame, and pushing it through a hardware H.264 VideoEncoder
        //  4) Streaming AAC audio chunks through an AudioEncoder
        //  5) Muxing both into a real .mp4 with mp4-muxer
        // ============================================
        async startFastExport() {
            const quality = document.querySelector('input[name="export-quality"]:checked').value;
            const durationSetting = document.getElementById('export-duration').value;
            const fps = parseInt(document.getElementById('export-fps').value);
            const modeSelect = document.getElementById('export-mode').value;

            // Apply mode if user picked a specific one
            if (modeSelect !== 'current') {
                setMode(parseInt(modeSelect));
            }

            const qualities = {
                '720':  { width: 1280, height: 720,  bitrate:  6_000_000 },
                '1080': { width: 1920, height: 1080, bitrate: 10_000_000 },
                '1440': { width: 2560, height: 1440, bitrate: 16_000_000 },
                '2160': { width: 3840, height: 2160, bitrate: 28_000_000 }
            };
            const { width, height, bitrate } = qualities[quality];

            // ---------- Pick supported codecs for the chosen resolution ----------
            const videoCfg = await this._pickVideoCodec(width, height, fps, bitrate);
            if (!videoCfg) throw new Error('No supported H.264 codec for ' + width + 'x' + height + '@' + fps);

            // ---------- Decode the audio file (cached if same source) ----------
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

            // ---------- Compute clip range (relative to the song) ----------
            const startTime = audio.getCurrentTime();
            let clipDuration = decoded.duration - startTime;
            if (durationSetting !== 'full') clipDuration = Math.min(clipDuration, parseInt(durationSetting));
            if (clipDuration <= 0.05) throw new Error('Nothing to export from current position');

            const totalFrames = Math.max(1, Math.floor(clipDuration * fps));

            // ---------- Pause live audio & enter export mode ----------
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
            document.getElementById('status-text').textContent = 'Fast export…';
            UI.showToast('⚡ Fast export started', 'info');

            // ---------- Save & reset visualization state for a clean run ----------
            const savedState = this._saveAndResetVizState();

            // ---------- Set up offline analysis (AnalyserNode in OfflineAudioContext) ----------
            this._setStatus('Preparing analysis…', 1);
            const numChannels = Math.min(2, decoded.numberOfChannels);
            const offlineCtx = new OfflineAudioContext(
                numChannels,
                Math.ceil(clipDuration * decoded.sampleRate),
                decoded.sampleRate
            );
            const offlineSrc = offlineCtx.createBufferSource();
            offlineSrc.buffer = decoded;
            const offlineAnalyser = offlineCtx.createAnalyser();
            offlineAnalyser.fftSize = CONFIG.fftSize;
            offlineAnalyser.smoothingTimeConstant = CONFIG.smoothing;
            offlineSrc.connect(offlineAnalyser);
            offlineAnalyser.connect(offlineCtx.destination);
            // Play the slice [startTime, startTime + clipDuration]
            offlineSrc.start(0, startTime, clipDuration);

            // ---------- Set up muxer + encoders ----------
            const muxer = new Mp4Muxer.Muxer({
                target: new Mp4Muxer.ArrayBufferTarget(),
                video: { codec: 'avc', width, height, frameRate: fps },
                audio: { codec: 'aac', numberOfChannels: numChannels, sampleRate: decoded.sampleRate },
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

            // ---------- Render canvas (offscreen, 2D) ----------
            const renderCanvas = document.createElement('canvas');
            renderCanvas.width = width;
            renderCanvas.height = height;
            const renderCtx = renderCanvas.getContext('2d');
            APP_STATE.exportCanvas = renderCanvas;
            APP_STATE.exportCtx = renderCtx;

            const freqArr = new Uint8Array(offlineAnalyser.frequencyBinCount);
            const waveArr = new Uint8Array(offlineAnalyser.fftSize);
            const usPerFrame = Math.round(1_000_000 / fps);
            const keyFrameInterval = Math.max(1, fps * 2); // keyframe every 2s

            let framesEncoded = 0;
            const startWall = performance.now();
            const exporter = this;

            // Schedule a suspend at every frame timestamp; in each callback,
            // sample the analyser, render, encode the frame, then resume.
            const framePromises = [];
            for (let i = 0; i < totalFrames; i++) {
                const tFrame = i / fps;
                // Last frame: suspend slightly before end to avoid overrun
                const suspendAt = Math.min(tFrame, clipDuration - 1e-4);
                const p = offlineCtx.suspend(suspendAt).then(async () => {
                    if (exporter._cancelFast) {
                        try { offlineCtx.resume(); } catch (e) {}
                        return;
                    }
                    offlineAnalyser.getByteFrequencyData(freqArr);
                    offlineAnalyser.getByteTimeDomainData(waveArr);

                    // Drive renderers' time from the export timeline
                    APP_STATE.exportTime = tFrame;
                    const isBeat = BeatDetector.update(freqArr);
                    exporter.renderFrame(renderCtx, width, height, { freq: freqArr, wave: waveArr }, isBeat);

                    // Encode this frame
                    const vf = new VideoFrame(renderCanvas, {
                        timestamp: i * usPerFrame,
                        duration: usPerFrame
                    });
                    try {
                        videoEncoder.encode(vf, { keyFrame: i % keyFrameInterval === 0 });
                    } finally {
                        vf.close();
                    }

                    framesEncoded++;
                    // Update progress (cheap, every ~half second)
                    if (framesEncoded % Math.max(1, Math.floor(fps / 2)) === 0 || framesEncoded === totalFrames) {
                        const pct = (framesEncoded / totalFrames) * 90; // 0–90 = render+video
                        const elapsed = (performance.now() - startWall) / 1000;
                        const speed = framesEncoded / Math.max(0.001, elapsed) / fps; // x realtime
                        exporter._setStatus(
                            `Rendering frames ${framesEncoded}/${totalFrames} • ${speed.toFixed(1)}× realtime`,
                            pct
                        );
                    }

                    // Backpressure: if encoder is overwhelmed, yield
                    while (videoEncoder.encodeQueueSize > 30 && !exporter._cancelFast) {
                        await new Promise(r => setTimeout(r, 4));
                    }

                    offlineCtx.resume();
                });
                framePromises.push(p);
            }

            // Run the offline render — suspend callbacks fire sequentially during it.
            // startRendering() itself returns the fully rendered AudioBuffer.
            let audioBuffer;
            try {
                const renderPromise = offlineCtx.startRendering();
                audioBuffer = await renderPromise;
                await Promise.all(framePromises);
            } catch (err) {
                this._abortFastExport(savedState, videoEncoder, audioEncoder, wasPlaying);
                throw err;
            }

            if (this._cancelFast) {
                this._abortFastExport(savedState, videoEncoder, audioEncoder, wasPlaying);
                UI.showToast('Export cancelled', 'warning');
                return;
            }

            // ---------- Encode audio from the rendered offline buffer ----------
            this._setStatus('Encoding audio…', 92);

            const sampleRate = audioBuffer.sampleRate;
            const totalAudioFrames = audioBuffer.length;
            const chunkFrames = 1024;
            const planar = new Float32Array(numChannels * chunkFrames);
            const chans = [];
            for (let c = 0; c < numChannels; c++) chans.push(audioBuffer.getChannelData(c));

            for (let offset = 0; offset < totalAudioFrames; offset += chunkFrames) {
                if (this._cancelFast) {
                    this._abortFastExport(savedState, videoEncoder, audioEncoder, wasPlaying);
                    UI.showToast('Export cancelled', 'warning');
                    return;
                }
                const len = Math.min(chunkFrames, totalAudioFrames - offset);
                // Pack as f32-planar: [ch0[0..len], ch1[0..len], ...]
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

            this._setStatus('Finalizing MP4…', 97);
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

            // ---------- Restore state, hand the file to the user ----------
            this._restoreVizState(savedState);
            APP_STATE.exportTime = null;
            APP_STATE.isFastExporting = false;
            APP_STATE.isRecording = false;
            APP_STATE.exportCanvas = null;
            APP_STATE.exportCtx = null;

            const blob = new Blob([buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `waveforge_${this.downloadBaseName()}_${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 60_000);

            // Resume playback if the track was playing before the export
            if (wasPlaying) {
                try {
                    audio.audioElement.play();
                    APP_STATE.isPlaying = true;
                    UI.updatePlayButton();
                } catch (e) { /* autoplay not allowed */ }
            }

            this._hideProgressUI();
            document.getElementById('status-dot').classList.remove('recording');
            document.getElementById('status-text').textContent = 'Ready';

            const totalElapsed = (performance.now() - startWall) / 1000;
            const speedX = clipDuration / Math.max(0.001, totalElapsed);
            UI.showToast(`✅ Exported MP4 in ${totalElapsed.toFixed(1)}s (${speedX.toFixed(1)}× realtime)`, 'success');
            this.hideModal();
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

        // Snapshot mutable state the renderers and beat detector accumulate, so
        // an export starts from a clean slate and the live preview is restored after.
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
                logoAngle: APP_STATE.logoAngle,
                helixAngle: APP_STATE.helixAngle,
                galaxyAngle: APP_STATE.galaxyAngle,
                spectrogram: APP_STATE.spectrogramData.slice(),
                bassFloorEMA: APP_STATE.bassFloorEMA,
                bassEnvelope: APP_STATE.bassEnvelope,
                lastBass: APP_STATE.lastBass,
                logoIntensity: APP_STATE.logoIntensity,
                shakePhaseX: APP_STATE.shakePhaseX,
                shakePhaseY: APP_STATE.shakePhaseY,
                dronePhaseX: APP_STATE.dronePhaseX,
                dronePhaseY: APP_STATE.dronePhaseY,
                dronePhaseZoom: APP_STATE.dronePhaseZoom,
                dronePhaseSkew: APP_STATE.dronePhaseSkew
            };
            BeatDetector.history = [];
            BeatDetector.prevEnergy = 0;
            APP_STATE.beatDetected = false;
            APP_STATE.beatTimer = 0;
            APP_STATE.shakeX = 0;
            APP_STATE.shakeY = 0;
            APP_STATE.shakeTrauma = 0;
            APP_STATE.lastLogoT = 0;
            APP_STATE.logoAngle = 0;
            APP_STATE.helixAngle = 0;
            APP_STATE.galaxyAngle = 0;
            APP_STATE.spectrogramData = [];
            APP_STATE.bassFloorEMA = undefined;
            APP_STATE.bassEnvelope = undefined;
            APP_STATE.lastBass = undefined;
            APP_STATE.logoIntensity = undefined;
            APP_STATE.shakePhaseX = undefined;
            APP_STATE.shakePhaseY = undefined;
            APP_STATE.dronePhaseX = undefined;
            APP_STATE.dronePhaseY = undefined;
            APP_STATE.dronePhaseZoom = undefined;
            APP_STATE.dronePhaseSkew = undefined;
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
            APP_STATE.logoAngle = snap.logoAngle;
            APP_STATE.helixAngle = snap.helixAngle;
            APP_STATE.galaxyAngle = snap.galaxyAngle;
            APP_STATE.spectrogramData = snap.spectrogram;
            APP_STATE.bassFloorEMA = snap.bassFloorEMA;
            APP_STATE.bassEnvelope = snap.bassEnvelope;
            APP_STATE.lastBass = snap.lastBass;
            APP_STATE.logoIntensity = snap.logoIntensity;
            APP_STATE.shakePhaseX = snap.shakePhaseX;
            APP_STATE.shakePhaseY = snap.shakePhaseY;
            APP_STATE.dronePhaseX = snap.dronePhaseX;
            APP_STATE.dronePhaseY = snap.dronePhaseY;
            APP_STATE.dronePhaseZoom = snap.dronePhaseZoom;
            APP_STATE.dronePhaseSkew = snap.dronePhaseSkew;
        },

        _showProgressUI() {
            document.getElementById('btn-start-export').style.display = 'none';
            document.getElementById('btn-cancel-export').style.display = 'block';
            document.getElementById('export-progress').classList.add('active');
        },
        _hideProgressUI() {
            document.getElementById('btn-start-export').style.display = 'block';
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
            document.getElementById('progress-status').textContent = 'Processing video...';
            // Create blob and download
            const blob = new Blob(APP_STATE.recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `waveforge_${this.downloadBaseName()}_${Date.now()}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Reset UI
            APP_STATE.exportCanvas = null;
            APP_STATE.exportCtx = null;
            APP_STATE.recordedChunks = [];

            document.getElementById('btn-start-export').style.display = 'block';
            document.getElementById('btn-cancel-export').style.display = 'none';
            document.getElementById('export-progress').classList.remove('active');
            document.getElementById('progress-fill').style.width = '0%';
            document.getElementById('status-text').textContent = 'Ready';

            UI.showToast('Video exported successfully!', 'success');
            this.hideModal();
        },

        formatTime(seconds) {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        },

        renderFrame(ctx, width, height, data, isBeat) {
            const mod = VIS_MODS[APP_STATE.mode];
            if (!mod) return;

            // Clear with fade (modes with their own background skip this)
            if (!mod.ownBackground) {
                ctx.fillStyle = CONFIG.highContrast ? '#000000' : 'rgba(5, 5, 5, 0.2)';
                ctx.fillRect(0, 0, width, height);
            }

            const renderFn = mod.renderExport || mod.render;
            renderFn(viz, ctx, width, height, width / 2, height / 2, data, isBeat);

            // Optional branding badge drawn only on exports (fast + recorded)
            if (CONFIG.watermark) {
                const fs = Math.max(13, Math.round(height * 0.022));
                ctx.save();
                ctx.font = `600 ${fs}px Inter, -apple-system, 'Segoe UI', sans-serif`;
                ctx.textBaseline = 'bottom';
                ctx.textAlign = 'right';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                ctx.shadowBlur = 6;
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

        // Exposed to mode renderers
        get config() { return CONFIG; }
        get state() { return APP_STATE; }
        get palette() { return PALETTES[CONFIG.palette]; }
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
            const p = PALETTES[CONFIG.palette];
            return p[index % p.length];
        }

        getGradient(ctx, h) {
            const grad = ctx.createLinearGradient(0, h, 0, 0);
            const p = PALETTES[CONFIG.palette];
            p.forEach((color, i) => {
                grad.addColorStop(i / (p.length - 1), color);
            });
            return grad;
        }

        loop() {
            requestAnimationFrame(() => this.loop());

            // FPS Calculation
            const now = performance.now();
            const delta = now - APP_STATE.lastTime;
            APP_STATE.frames++;

            if (delta >= 1000) {
                APP_STATE.fps = Math.round((APP_STATE.frames * 1000) / delta);
                APP_STATE.frames = 0;
                APP_STATE.lastTime = now;
                if (CONFIG.showFps) {
                    document.getElementById('fps-display').textContent = `${APP_STATE.fps} FPS`;
                }
            }

            const data = audio.getAnalysis();
            const isBeat = BeatDetector.update(data.freq);

            // Render to main canvas
            this.render(this.ctx, this.width, this.height, this.cx, this.cy, data, isBeat);

            // Render to export canvas if recording
            if (APP_STATE.isRecording && APP_STATE.exportCtx) {
                const expW = APP_STATE.exportCanvas.width;
                const expH = APP_STATE.exportCanvas.height;
                Exporter.renderFrame(APP_STATE.exportCtx, expW, expH, data, isBeat);
            }
        }

        render(ctx, w, h, cx, cy, data, isBeat) {
            const mod = VIS_MODS[APP_STATE.mode];
            if (!mod) {
                if (!this._warned) {
                    this._warned = true;
                    console.warn('Visualizer mode ' + APP_STATE.mode + ' is not registered');
                }
                return;
            }

            // Background fade (modes with their own background skip this)
            if (!mod.ownBackground) {
                ctx.fillStyle = CONFIG.highContrast ? '#000000' : 'rgba(5, 5, 5, 0.2)';
                ctx.fillRect(0, 0, w, h);
            }

            ctx.lineWidth = 2;
            ctx.lineCap = 'round';

            mod.render(this, ctx, w, h, cx, cy, data, isBeat);
        }
    }

    // ============================================
    // UI CONTROLLER
    // ============================================

    const UI = {
        settingsOpen: false,

        init() {
            this.cacheElements();
            this.buildModeGrid();
            this.buildExportModeOptions();
            this.bindEvents();
            this.setupDragDrop();
            this.setupKeyboard();
            this.setupSettings();
            this.applyConfigToUI();
            this.updateModeDisplay();
            this.updateModeCards();
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
                shortcutsModal: document.getElementById('shortcuts-modal'),
                uiLayer: document.getElementById('ui-layer'),
                modeName: document.getElementById('mode-name'),
                toastContainer: document.getElementById('toast-container')
            };
        },

        buildModeGrid() {
            const grid = document.getElementById('mode-grid');
            if (!grid) return;
            grid.innerHTML = '';
            Object.keys(VIS_MODS).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
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
                    this.showToast(mod.name, 'info');
                    setTimeout(() => this.closeModeSelector(), 260);
                };
                card.onkeydown = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        card.click();
                    }
                };
                grid.appendChild(card);
            });
        },

        buildExportModeOptions() {
            const select = document.getElementById('export-mode');
            if (!select) return;
            select.innerHTML = '';
            const current = document.createElement('option');
            current.value = 'current';
            current.textContent = 'Current Mode';
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
            this.els.fileInput.onchange = (e) => this.handleFile(e.target.files[0]);
            this.els.playBtn.onclick = () => audio.togglePlay();
            document.getElementById('btn-stop').onclick = () => audio.stop();
            document.getElementById('btn-mic').onclick = () => audio.enableMic();

            document.getElementById('btn-mode').onclick = () => {
                this.openModeSelector();
            };

            document.getElementById('btn-close-mode-selector').onclick = () => {
                this.closeModeSelector();
            };

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

            // Keyboard shortcuts modal
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

            // Auto-hide UI while playing — mouse only. Touch devices reveal the
            // UI on tap and never auto-hide it (previously impossible to restore).
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
                }, 3000);
            });
            document.addEventListener('pointerdown', revealUI);
            document.addEventListener('touchstart', revealUI, { passive: true });

            // Click on settings overlay to close
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

        setupShare() {
            const SHARE_URL = 'https://progameryt-op.github.io/WaveForge/';
            const SHARE_TITLE = 'WaveForge — free music visualizer with 4K video export';
            const embed = (str) => encodeURIComponent(str);

            const openShare = () => {
                if (navigator.share) {
                    navigator.share({ title: SHARE_TITLE, url: SHARE_URL })
                        .catch(() => {});
                    return;
                }
                const networks = {
                    x: `https://twitter.com/intent/tweet?text=${embed(SHARE_TITLE)}&url=${embed(SHARE_URL)}`,
                    reddit: `https://www.reddit.com/submit?url=${embed(SHARE_URL)}&title=${embed(SHARE_TITLE)}`,
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${embed(SHARE_URL)}`
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
                const done = () => this.showToast('Link copied — thanks for sharing!', 'success');
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(SHARE_URL).then(done).catch(() => {
                        this._fallbackCopy(SHARE_URL);
                        done();
                    });
                } else {
                    this._fallbackCopy(SHARE_URL);
                    done();
                }
            };
        },

        _fallbackCopy(text) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(ta);
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
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

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
                    case 'KeyF':
                        document.getElementById('btn-fullscreen').click();
                        break;
                    case 'ArrowRight':
                        audio.audioElement.currentTime = Math.min(
                            audio.audioElement.currentTime + 5,
                            audio.audioElement.duration
                        );
                        break;
                    case 'ArrowLeft':
                        audio.audioElement.currentTime = Math.max(
                            audio.audioElement.currentTime - 5,
                            0
                        );
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        const volUp = document.getElementById('vol-slider');
                        volUp.value = Math.min(parseFloat(volUp.value) + 0.1, 1);
                        audio.updateSettings();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        const volDown = document.getElementById('vol-slider');
                        volDown.value = Math.max(parseFloat(volDown.value) - 0.1, 0);
                        audio.updateSettings();
                        break;
                    case 'Escape':
                        this.toggleSettings(false);
                        Exporter.hideModal();
                        this.closeModeSelector();
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
                this.showToast('Preset exported!', 'success');
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
                    this.showToast('Screenshot failed on this browser', 'error');
                }
            };

            // Logo Viz settings
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
                        this.showToast('Background loaded!', 'success');
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
                        this.showToast('Logo loaded!', 'success');
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

        // Push hydrated CONFIG values into the settings controls
        applyConfigToUI() {
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.value = val;
            };
            setVal('set-smoothing', CONFIG.smoothing);
            setVal('set-sensitivity', CONFIG.sensitivity);
            setVal('set-fft', CONFIG.fftSize);
            setVal('set-palette', CONFIG.palette);
            setVal('set-beat-thresh', CONFIG.beatThreshold);
            setVal('set-bloom', CONFIG.bloomIntensity);
            setVal('set-wave-color', CONFIG.waveColor);
            setVal('set-shake', CONFIG.logoShakeIntensity);
            setVal('set-ray-count', CONFIG.logoRayCount);
            setVal('set-line-thick', CONFIG.logoLineThickness);
            setVal('set-glow-size', CONFIG.logoGlowSize);
            document.getElementById('set-beat-enabled').checked = CONFIG.beatEnabled;
            document.getElementById('set-mirror').checked = CONFIG.mirror;
            document.getElementById('set-watermark').checked = CONFIG.watermark;
            document.getElementById('set-hc').checked = CONFIG.highContrast;
            document.getElementById('set-show-fps').checked = CONFIG.showFps;
            document.getElementById('set-logo-particles').checked = CONFIG.logoParticles;
            document.getElementById('set-logo-rotate').checked = CONFIG.logoRotateRing;

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
                audio.playFile(URL.createObjectURL(file));
                document.getElementById('status-text').textContent = file.name.substring(0, 20) + (file.name.length > 20 ? '...' : '');
            } else {
                this.showToast('Unsupported file type', 'error');
            }
        },

        toggleSettings(show) {
            this.settingsOpen = show;
            this.els.settingsModal.classList.toggle('open', show);
        },

        updatePlayButton() {
            this.els.playIcon.textContent = APP_STATE.isPlaying ? '⏸' : '▶';
            this.els.playBtn.classList.toggle('active', APP_STATE.isPlaying);
            document.getElementById('status-text').textContent = APP_STATE.isPlaying ? 'Playing' : 'Paused';
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
            document.querySelectorAll('.mode-card').forEach(card => {
                const modeNum = parseInt(card.dataset.mode);
                card.classList.toggle('active', modeNum === APP_STATE.mode);
            });
        },

        updateModeDisplay() {
            const mod = VIS_MODS[APP_STATE.mode];
            this.els.modeName.textContent = mod ? mod.name : 'Unknown';
            const logoSettings = document.getElementById('logo-viz-settings');
            if (logoSettings) logoSettings.classList.toggle('hidden', APP_STATE.mode !== 8);
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

        console.log('%c🎵 WaveForge v2.0.0', 'color: #00f2ff; font-size: 20px; font-weight: bold;');
        console.log('%cProfessional Music Visualizer', 'color: #ff0099; font-size: 12px;');
    });

    // Handle visibility change to pause/resume
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && APP_STATE.isPlaying && !APP_STATE.isRecording) {
            // Optionally pause when tab is hidden
        }
    });

    // Service Worker Registration (for PWA/offline support)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }
})();