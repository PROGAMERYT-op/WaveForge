/*
 * WaveForge — Bar Spectrum mode (mode 0)
 * Classic mirrored frequency bars with glow.
 *
 * Registry contract (see Visualizers/README):
 *   name, icon, desc, render(engine, ctx, w, h, cx, cy, data, isBeat)
 *   Optional: renderExport() — falls back to render() when absent.
 */
(function (registry) {
    'use strict';

    registry[0] = {
        name: 'Bar Spectrum',
        icon: '📊',
        desc: 'Classic mirrored frequency bars with glow.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const barWidth = (w / freqData.length) * 2.5;
            let x = 0;
            const scale = isBeat ? 1.08 : 1.0;
            const sens = engine.config.sensitivity * scale;
            const grad = engine.getGradient(ctx, h);

            ctx.fillStyle = grad;

            const len = Math.ceil(freqData.length / 1.5);

            // Peak-hold caps: store per-bar peaks in shared state, fall over time
            const peaks = engine.state.peaks || (engine.state.peaks = {});
            if (!peaks.bars || peaks.bars.length !== len) peaks.bars = new Float32Array(len);
            const t = engine.nowSec();
            if (peaks.barsT === undefined) peaks.barsT = t;
            const dt = Math.min(0.1, Math.max(0, t - peaks.barsT));
            peaks.barsT = t;
            const fall = h * 0.35 * dt; // pixels per second, frame-rate independent
            const capH = Math.max(2, h * 0.006);

            for (let i = 0; i < len; i++) {
                const barHeight = (freqData[i] * sens / 255) * h * 0.75;
                ctx.fillRect(cx + x, cy - barHeight / 2, barWidth, barHeight);
                if (x !== 0) ctx.fillRect(cx - x - barWidth, cy - barHeight / 2, barWidth, barHeight);

                // Peak-hold cap (drawn on both mirrored sides)
                const peak = Math.max(barHeight, peaks.bars[i] - fall);
                peaks.bars[i] = peak;
                if (peak > barHeight + capH * 0.5) {
                    const topY = cy - peak / 2 - capH;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
                    ctx.fillRect(cx + x, topY, barWidth, capH);
                    if (x !== 0) ctx.fillRect(cx - x - barWidth, topY, barWidth, capH);
                    ctx.fillStyle = grad;
                }

                x += barWidth + 1;
                if (x > cx) break;
            }

            // Beat flash
            if (isBeat) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.fillRect(0, 0, w, h);
            }
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});