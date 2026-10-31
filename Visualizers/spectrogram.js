/*
 * WaveForge — Acoustic Waterfall Spectrogram mode (mode 4)
 * Palette-aware scrolling frequency heatmap with a live glowing crest analyzer.
 */
(function (registry) {
    'use strict';

    const MAX_HISTORY = 180;

    function ensureHistory(state) {
        if (!Array.isArray(state.spectrogramData)) state.spectrogramData = [];
        return state.spectrogramData;
    }

    registry[4] = {
        name: 'Spectrogram',
        icon: '🔬',
        desc: 'Thermal frequency waterfall with live harmonic crest analyzer.',
        ownBackground: true,

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const history = ensureHistory(engine.state);
            const sens = engine.config.sensitivity;

            const binsToKeep = Math.min(96, Math.floor(freqData.length * 0.5));
            const slice = new Uint8Array(binsToKeep);
            for (let i = 0; i < binsToKeep; i++) {
                slice[i] = Math.min(255, freqData[i] * Math.min(1.6, sens * 0.85));
            }
            history.push(slice);
            if (history.length > MAX_HISTORY) history.shift();

            ctx.fillStyle = '#05070f';
            ctx.fillRect(0, 0, w, h);

            const sliceWidth = w / MAX_HISTORY;
            const cellH = (h * 0.82) / binsToKeep;
            const baseY = h * 0.92;

            for (let x = 0; x < history.length; x++) {
                const frame = history[x];
                const xPos = x * sliceWidth;
                const ageAlpha = 0.25 + (x / history.length) * 0.75;

                for (let y = 0; y < binsToKeep; y++) {
                    const v = frame[y] / 255;
                    if (v > 0.06) {
                        const hue = (260 - v * 220 + (engine.config.hueCycle ? engine.nowSec() * 20 : 0)) % 360;
                        const light = 15 + v * 52;
                        ctx.fillStyle = `hsla(${hue}, 95%, ${light}%, ${v * ageAlpha})`;
                        ctx.fillRect(xPos, baseY - (y + 1) * cellH, sliceWidth + 0.9, cellH + 0.9);
                    }
                }
            }

            // Live glowing frequency crest along the bottom-top overlay
            ctx.save();
            ctx.beginPath();
            for (let i = 0; i < binsToKeep; i++) {
                const px = (i / (binsToKeep - 1)) * w;
                const py = baseY - (slice[i] / 255) * (h * 0.45);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = engine.getColor(0);
            ctx.lineWidth = isBeat ? 3.2 : 2;
            ctx.shadowBlur = 16;
            ctx.shadowColor = engine.getColor(0);
            ctx.stroke();
            ctx.restore();
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
