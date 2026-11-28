/**
 * WaveForge Studio v10.5 — Synced Lyrics & Client-Side AI Auto-Lyrics Engine
 * Supports:
 *  1) Automatic AI vocal transcription via Transformers.js (Whisper Tiny, loaded on-demand)
 *  2) .LRC and .SRT file import & live editable timestamp text
 *  3) Tap-to-Sync & Auto-Spread for plain pasted lyrics
 *  4) Beat-synced karaoke/subtitle canvas rendering (live preview + 4K offline export)
 */
(function (global) {
    'use strict';

    const state = {
        lines: [],         // [{ start: sec, end: sec, text: string }]
        rawText: '',
        isTranscribing: false,
        _pipeline: null
    };

    function formatLrcTime(sec) {
        const s = Math.max(0, Number(sec) || 0);
        const m = Math.floor(s / 60);
        const rem = s % 60;
        const whole = Math.floor(rem);
        const cs = Math.floor((rem - whole) * 100);
        return `${String(m).padStart(2, '0')}:${String(whole).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
    }

    function parseSrtTimestamp(ts) {
        const m = ts.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
        if (!m) return 0;
        return parseInt(m[1], 10) * 3600 + parseInt(m[2], 10) * 60 + parseInt(m[3], 10) + parseInt(m[4].padEnd(3, '0').slice(0, 3), 10) / 1000;
    }

    function parseLyricsText(text, fallbackDuration = 0) {
        const raw = String(text || '').replace(/\r\n/g, '\n').trim();
        state.rawText = raw;
        if (!raw) {
            state.lines = [];
            return state.lines;
        }

        // 1. Detect SRT format (00:00:01,000 --> 00:00:04,500)
        if (/-->/.test(raw)) {
            const blocks = raw.split(/\n\s*\n/);
            const parsed = [];
            for (const block of blocks) {
                const rows = block.split('\n').map(r => r.trim()).filter(Boolean);
                const timeRowIdx = rows.findIndex(r => r.includes('-->'));
                if (timeRowIdx === -1) continue;
                const [a, b] = rows[timeRowIdx].split('-->');
                const start = parseSrtTimestamp(a);
                const end = parseSrtTimestamp(b);
                const txt = rows.slice(timeRowIdx + 1).join(' ').replace(/<[^>]+>/g, '').trim();
                if (txt) parsed.push({ start, end: Math.max(start + 0.5, end), text: txt });
            }
            parsed.sort((a, b) => a.start - b.start);
            state.lines = parsed;
            return state.lines;
        }

        // 2. Detect LRC format ([mm:ss.xx] text)
        const lrcLines = [];
        const lrcRe = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;
        for (const row of raw.split('\n')) {
            const matches = Array.from(row.matchAll(lrcRe));
            if (!matches.length) continue;
            const txt = row.replace(lrcRe, '').trim();
            if (!txt) continue;
            for (const m of matches) {
                const min = parseInt(m[1], 10);
                const sec = parseInt(m[2], 10);
                const frac = m[3] ? parseInt(m[3].padEnd(3, '0').slice(0, 3), 10) / 1000 : 0;
                lrcLines.push({ start: min * 60 + sec + frac, end: 0, text: txt });
            }
        }

        if (lrcLines.length > 0) {
            lrcLines.sort((a, b) => a.start - b.start);
            for (let i = 0; i < lrcLines.length; i++) {
                const nextStart = i + 1 < lrcLines.length ? lrcLines[i + 1].start : lrcLines[i].start + 4.0;
                lrcLines[i].end = Math.max(lrcLines[i].start + 0.4, Math.min(nextStart, lrcLines[i].start + 6.0));
            }
            state.lines = lrcLines;
            return state.lines;
        }

        // 3. Plain untimed lyrics -> spread evenly across track duration
        const plain = raw.split('\n').map(r => r.trim()).filter(Boolean);
        const dur = fallbackDuration > 2 ? fallbackDuration : plain.length * 3.5;
        const step = dur / Math.max(1, plain.length);
        state.lines = plain.map((txt, idx) => ({
            start: idx * step,
            end: (idx + 1) * step,
            text: txt
        }));
        return state.lines;
    }

    function toLrcString(lines = state.lines) {
        return lines.map(l => `[${formatLrcTime(l.start)}] ${l.text}`).join('\n');
    }

    function getActiveIndex(timeSec) {
        const lines = state.lines;
        if (!lines.length) return -1;
        let idx = -1;
        for (let i = 0; i < lines.length; i++) {
            if (timeSec >= lines[i].start && timeSec <= lines[i].end + 0.15) {
                idx = i;
            } else if (lines[i].start > timeSec) {
                break;
            }
        }
        return idx;
    }

    // Downsample AudioBuffer to 16 kHz mono Float32Array for Whisper
    function resampleTo16kMono(audioBuffer) {
        const targetSr = 16000;
        const srcSr = audioBuffer.sampleRate;
        const ch0 = audioBuffer.getChannelData(0);
        const ch1 = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : null;
        const srcLen = audioBuffer.length;
        const outLen = Math.max(1, Math.floor(srcLen * (targetSr / srcSr)));
        const out = new Float32Array(outLen);
        const ratio = srcSr / targetSr;
        for (let i = 0; i < outLen; i++) {
            const pos = i * ratio;
            const i0 = Math.floor(pos);
            const i1 = Math.min(srcLen - 1, i0 + 1);
            const frac = pos - i0;
            const s0 = ch1 ? (ch0[i0] + ch1[i0]) * 0.5 : ch0[i0];
            const s1 = ch1 ? (ch0[i1] + ch1[i1]) * 0.5 : ch0[i1];
            out[i] = s0 + (s1 - s0) * frac;
        }
        return out;
    }

    async function autoTranscribe(audioBuffer, onProgress) {
        if (!audioBuffer) throw new Error('Load an audio track first');
        if (state.isTranscribing) throw new Error('Transcription already running');
        state.isTranscribing = true;

        try {
            if (onProgress) onProgress('Loading browser AI model (first run downloads ~40MB)…', 10);

            // Dynamic ESM import so normal studio page load has 0 KB overhead
            let transformers;
            try {
                transformers = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0');
            } catch (e) {
                throw new Error('Could not load AI engine (check internet connection or upload an .LRC/.SRT file).');
            }

            if (transformers.env) {
                transformers.env.allowLocalModels = false;
                transformers.env.useBrowserCache = true;
            }

            if (!state._pipeline) {
                state._pipeline = await transformers.pipeline(
                    'automatic-speech-recognition',
                    'Xenova/whisper-tiny',
                    {
                        dtype: 'q8',
                        progress_callback: (p) => {
                            if (p && typeof p.progress === 'number' && onProgress) {
                                onProgress(`Downloading Whisper AI… ${Math.round(p.progress)}%`, 10 + p.progress * 0.55);
                            }
                        }
                    }
                );
            }

            if (onProgress) onProgress('Resampling audio to 16 kHz…', 68);
            const pcm16k = resampleTo16kMono(audioBuffer);

            if (onProgress) onProgress('Transcribing vocals & timestamps…', 75);
            const result = await state._pipeline(pcm16k, {
                chunk_length_s: 25,
                stride_length_s: 4,
                return_timestamps: true
            });

            const chunks = (result && Array.isArray(result.chunks)) ? result.chunks : [];
            const lines = [];
            for (const ch of chunks) {
                const txt = String(ch.text || '').trim();
                if (!txt || /^\[.*\]$/.test(txt)) continue;
                const ts = Array.isArray(ch.timestamp) ? ch.timestamp : [0, 3];
                const start = Math.max(0, Number(ts[0]) || 0);
                const end = Math.max(start + 0.6, Number(ts[1]) || (start + 3.0));
                lines.push({ start, end, text: txt });
            }

            if (!lines.length && result && result.text && result.text.trim()) {
                parseLyricsText(result.text.trim(), audioBuffer.duration);
            } else {
                state.lines = lines;
                state.rawText = toLrcString(lines);
            }

            if (onProgress) onProgress(`Done — ${state.lines.length} lyric lines synced`, 100);
            return { lines: state.lines, lrc: state.rawText };
        } finally {
            state.isTranscribing = false;
        }
    }

    function wrapText(ctx, text, maxWidth) {
        const words = text.split(/\s+/);
        const rows = [];
        let cur = '';
        for (const w of words) {
            const test = cur ? cur + ' ' + w : w;
            if (ctx.measureText(test).width > maxWidth && cur) {
                rows.push(cur);
                cur = w;
            } else {
                cur = test;
            }
        }
        if (cur) rows.push(cur);
        return rows.slice(0, 3);
    }

    function renderOnCanvas(ctx, bounds, timeSec, opts) {
        if (!state.lines.length || !opts || opts.style === 'off') return;
        const idx = getActiveIndex(timeSec);
        if (idx === -1) return;

        const active = state.lines[idx];
        const next = idx + 1 < state.lines.length ? state.lines[idx + 1] : null;
        const minDim = Math.min(bounds.fw, bounds.fh);
        const fontFace = opts.font || 'Plus Jakarta Sans';
        const accent = opts.accent || '#6366f1';
        const style = opts.style || 'karaoke';

        const elapsed = Math.max(0, timeSec - active.start);
        const dur = Math.max(0.4, active.end - active.start);
        const fadeIn = Math.min(1, elapsed / 0.18);
        const fadeOut = Math.min(1, Math.max(0, (active.end - timeSec + 0.15) / 0.22));
        const alpha = Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
        if (alpha <= 0.01) return;

        const baseSize = Math.max(16, Math.round(minDim * (style === 'kinetic' ? 0.056 : 0.044)));
        const maxW = bounds.fw * 0.84;
        const cx = bounds.fx + bounds.fw / 2;
        const cy = style === 'kinetic'
            ? bounds.fy + bounds.fh * 0.50
            : bounds.fy + bounds.fh * 0.72;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const popScale = (opts.beatPulse && opts.isBeat) ? 1.04 : (0.97 + fadeIn * 0.03);
        ctx.translate(cx, cy + (1 - fadeIn) * 8);
        ctx.scale(popScale, popScale);

        const weight = (fontFace === 'Anton' || fontFace === 'Bebas Neue' || fontFace === 'New Rocker') ? '400' : '700';
        ctx.font = `${weight} ${baseSize}px '${fontFace}', 'Inter', sans-serif`;
        const rows = wrapText(ctx, active.text, maxW);
        const lineH = baseSize * 1.24;
        const totalH = rows.length * lineH;

        if (style === 'subtitle') {
            const padX = Math.round(baseSize * 0.6);
            const padY = Math.round(baseSize * 0.35);
            const widest = Math.max(...rows.map(r => ctx.measureText(r).width));
            ctx.fillStyle = 'rgba(9, 9, 11, 0.72)';
            const rx = -widest / 2 - padX;
            const ry = -totalH / 2 - padY;
            const rw = widest + padX * 2;
            const rh = totalH + padY * 2;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(rx, ry, rw, rh, 10);
            else ctx.rect(rx, ry, rw, rh);
            ctx.fill();
        }

        if (style === 'karaoke' || style === 'kinetic') {
            ctx.shadowColor = accent;
            ctx.shadowBlur = style === 'kinetic' ? 22 : 14;
        } else {
            ctx.shadowColor = 'rgba(0,0,0,0.85)';
            ctx.shadowBlur = 8;
        }
        ctx.fillStyle = '#ffffff';

        rows.forEach((row, rIdx) => {
            const y = -totalH / 2 + (rIdx + 0.5) * lineH;
            ctx.fillText(row, 0, y);
        });

        // Subtle preview of next lyric line in karaoke mode
        if (style === 'karaoke' && next && (next.start - timeSec) < 5.0) {
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.globalAlpha = alpha * 0.42;
            ctx.font = `500 ${Math.round(baseSize * 0.64)}px 'Inter', sans-serif`;
            ctx.fillStyle = '#e4e4e7';
            const nextTxt = next.text.length > 48 ? next.text.slice(0, 46) + '…' : next.text;
            ctx.fillText(nextTxt, 0, totalH / 2 + baseSize * 0.78);
        }

        ctx.restore();
    }

    global.WaveForgeLyrics = {
        get lines() { return state.lines; },
        get rawText() { return state.rawText; },
        get isTranscribing() { return state.isTranscribing; },
        parseLyricsText,
        toLrcString,
        formatLrcTime,
        getActiveIndex,
        autoTranscribe,
        renderOnCanvas,
        clear() {
            state.lines = [];
            state.rawText = '';
        }
    };
})(window);
