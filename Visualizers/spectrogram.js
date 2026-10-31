/*
 * WaveForge — Acoustic Waterfall Spectrogram mode (mode 4)
 * Pure scrolling frequency-over-time thermal heatmap (no wave line overlay).
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
        desc: 'Scrolling frequency-over-time thermal acoustic heatmap.',
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
            const cellH = h / binsToKeep;

            for (let x = 0; x < history.length; x++) {
                const frame = history[x];
                const xPos = x * sliceWidth;
                const ageAlpha = 0.25 + (x / history.length) * 0.75;

                for (let y = 0; y < binsToKeep; y++) {
                    const v = frame[y] / 255;
                    if (v > 0.05) {
                        const hue = (250 - v * 230 + (engine.config.hueCycle ? engine.nowSec() * 20 : 0)) % 360;
                        const light = 14 + v * 52;
                        ctx.fillStyle = `hsla(${hue}, 95%, ${light}%, ${v * ageAlpha})`;
                        ctx.fillRect(xPos, h - (y + 1) * cellH, sliceWidth + 0.9, cellH + 0.9);
                    }
                }
            }
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
