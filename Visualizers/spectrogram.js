/*
 * WaveForge — Spectrogram mode (mode 4)
 * Scrolling frequency-over-time heatmap.
 *
 * History lives in APP_STATE.spectrogramData so the export pipeline can
 * snapshot/reset it cleanly (fixed: previously leaked across exports).
 */
(function (registry) {
    'use strict';

    const MAX_HISTORY = 200;

    function ensureHistory(state) {
        if (!Array.isArray(state.spectrogramData)) state.spectrogramData = [];
        return state.spectrogramData;
    }

    registry[4] = {
        name: 'Spectrogram',
        icon: '🔬',
        desc: 'Scrolling frequency over time heatmap.',
        ownBackground: true,

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const history = ensureHistory(engine.state);

            // Add current frame to history
            const slice = new Uint8Array(freqData.length);
            slice.set(freqData);
            history.push(slice);
            if (history.length > MAX_HISTORY) history.shift();

            // Clear
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);

            const sliceWidth = w / MAX_HISTORY;
            const barHeight = h / (freqData.length * 0.4);

            for (let x = 0; x < history.length; x++) {
                const frame = history[x];
                const xPos = x * sliceWidth;

                for (let y = 0; y < frame.length * 0.4; y++) {
                    const value = frame[y];
                    const intensity = value / 255;

                    if (intensity > 0.05) {
                        const hue = (1 - intensity) * 240; // Blue to red
                        ctx.fillStyle = `hsla(${hue}, 100%, ${intensity * 60}%, ${intensity})`;
                        ctx.fillRect(xPos, h - (y * barHeight) - barHeight, sliceWidth + 1, barHeight + 1);
                    }
                }
            }
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});