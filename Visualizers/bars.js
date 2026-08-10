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

            ctx.fillStyle = engine.getGradient(ctx, h);

            const len = freqData.length / 1.5;
            for (let i = 0; i < len; i++) {
                const barHeight = (freqData[i] * sens / 255) * h * 0.75;
                ctx.fillRect(cx + x, cy - barHeight / 2, barWidth, barHeight);
                if (x !== 0) ctx.fillRect(cx - x - barWidth, cy - barHeight / 2, barWidth, barHeight);
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