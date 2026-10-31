/*
 * WaveForge — Bar Spectrum Pro mode (mode 0)
 * Clean rounded neon capsule spectrum with glossy floor reflection and peak-hold caps.
 * (No wave line overlay on top of the bars.)
 */
(function (registry) {
    'use strict';

    registry[0] = {
        name: 'Bar Spectrum',
        icon: '📊',
        desc: 'Clean studio capsule analyzer with glossy floor reflection & peak-hold LEDs.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const sens = engine.config.sensitivity * (isBeat ? 1.08 : 1.0);
            const t = engine.nowSec();

            let bass = 0;
            for (let i = 0; i < 16; i++) bass += freqData[i];
            bass = (bass / 16) / 255;

            // Subtle center sub-bass radial aura
            const auraR = Math.min(w, h) * (0.35 + bass * 0.22);
            const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, auraR);
            aura.addColorStop(0, engine.getColor(0) + '28');
            aura.addColorStop(0.5, engine.getColor(1) + '10');
            aura.addColorStop(1, 'transparent');
            ctx.fillStyle = aura;
            ctx.fillRect(0, 0, w, h);

            const numBars = Math.min(72, Math.floor(w / 14));
            const totalHalfW = cx * 0.92;
            const step = totalHalfW / numBars;
            const barW = Math.max(3, step * 0.68);
            const baseY = cy + h * 0.08;
            const maxBarH = h * 0.56;

            const peaks = engine.state.peaks || (engine.state.peaks = {});
            if (!peaks.bars || peaks.bars.length !== numBars) peaks.bars = new Float32Array(numBars);
            if (!peaks.smoothBars || peaks.smoothBars.length !== numBars) peaks.smoothBars = new Float32Array(numBars);
            if (peaks.barsT === undefined) peaks.barsT = t;
            const dt = Math.min(0.1, Math.max(0.001, t - peaks.barsT));
            peaks.barsT = t;
            const fall = h * 0.32 * dt;

            const mainGrad = ctx.createLinearGradient(0, baseY, 0, baseY - maxBarH);
            mainGrad.addColorStop(0, engine.getColor(0));
            mainGrad.addColorStop(0.55, engine.getColor(1));
            mainGrad.addColorStop(1, engine.getColor(2 % engine.palette.length));

            const reflGrad = ctx.createLinearGradient(0, baseY, 0, baseY + maxBarH * 0.42);
            reflGrad.addColorStop(0, engine.getColor(0) + '48');
            reflGrad.addColorStop(1, 'transparent');

            const drawCapsule = (x, y, bw, bh, radius) => {
                if (bh <= 1) return;
                const r = Math.min(radius, bw / 2, bh / 2);
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(x, y, bw, bh, r);
                } else {
                    ctx.rect(x, y, bw, bh);
                }
                ctx.fill();
            };

            for (let i = 0; i < numBars; i++) {
                const fIdx = Math.floor((i / numBars) * (freqData.length * 0.72));
                const rawVal = (freqData[fIdx] / 255) * sens;
                const targetH = Math.min(maxBarH, Math.max(4, rawVal * maxBarH));

                peaks.smoothBars[i] += (targetH - peaks.smoothBars[i]) * Math.min(1, dt * 22);
                const bh = peaks.smoothBars[i];

                const xR = cx + i * step + (step - barW) / 2;
                const xL = cx - (i + 1) * step + (step - barW) / 2;
                const topY = baseY - bh;

                // Upward frequency bars
                ctx.fillStyle = mainGrad;
                drawCapsule(xR, topY, barW, bh, 4);
                drawCapsule(xL, topY, barW, bh, 4);

                // Downward reflection bars
                ctx.fillStyle = reflGrad;
                drawCapsule(xR, baseY + 3, barW, bh * 0.34, 3);
                drawCapsule(xL, baseY + 3, barW, bh * 0.34, 3);

                // Peak-hold cap
                const pk = Math.max(bh, peaks.bars[i] - fall);
                peaks.bars[i] = pk;
                if (pk > bh + 3) {
                    const capY = baseY - pk - 5;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                    ctx.fillRect(xR, capY, barW, 3);
                    ctx.fillRect(xL, capY, barW, 3);
                }
            }
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
