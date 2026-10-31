/*
 * WaveForge — Bar Spectrum Pro mode (mode 0)
 * Rounded neon capsule spectrum, glossy floor reflection, peak-hold LEDs, and harmonic spline.
 */
(function (registry) {
    'use strict';

    registry[0] = {
        name: 'Bar Spectrum',
        icon: '📊',
        desc: 'Studio capsule analyzer with glossy floor reflection & harmonic spline.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const sens = engine.config.sensitivity * (isBeat ? 1.08 : 1.0);
            const t = engine.nowSec();

            // Sub-bass energy for background aura
            let bass = 0;
            for (let i = 0; i < 16; i++) bass += freqData[i];
            bass = (bass / 16) / 255;

            // 1. Center sub-bass radial aura
            const auraR = Math.min(w, h) * (0.35 + bass * 0.25);
            const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, auraR);
            aura.addColorStop(0, engine.getColor(0) + '33');
            aura.addColorStop(0.5, engine.getColor(1) + '14');
            aura.addColorStop(1, 'transparent');
            ctx.fillStyle = aura;
            ctx.fillRect(0, 0, w, h);

            const numBars = Math.min(72, Math.floor(w / 14));
            const totalHalfW = cx * 0.92;
            const step = totalHalfW / numBars;
            const barW = Math.max(3, step * 0.68);
            const baseY = cy + h * 0.08;
            const maxBarH = h * 0.56;

            // Peak-hold state
            const peaks = engine.state.peaks || (engine.state.peaks = {});
            if (!peaks.bars || peaks.bars.length !== numBars) peaks.bars = new Float32Array(numBars);
            if (!peaks.smoothBars || peaks.smoothBars.length !== numBars) peaks.smoothBars = new Float32Array(numBars);
            if (peaks.barsT === undefined) peaks.barsT = t;
            const dt = Math.min(0.1, Math.max(0.001, t - peaks.barsT));
            peaks.barsT = t;
            const fall = h * 0.32 * dt;

            // Vertical main gradient
            const mainGrad = ctx.createLinearGradient(0, baseY, 0, baseY - maxBarH);
            mainGrad.addColorStop(0, engine.getColor(0));
            mainGrad.addColorStop(0.55, engine.getColor(1));
            mainGrad.addColorStop(1, engine.getColor(2 % engine.palette.length));

            // Reflection gradient
            const reflGrad = ctx.createLinearGradient(0, baseY, 0, baseY + maxBarH * 0.45);
            reflGrad.addColorStop(0, engine.getColor(0) + '55');
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

            const splinePointsR = [];
            const splinePointsL = [];

            for (let i = 0; i < numBars; i++) {
                const fIdx = Math.floor((i / numBars) * (freqData.length * 0.72));
                const rawVal = (freqData[fIdx] / 255) * sens;
                const targetH = Math.min(maxBarH, Math.max(4, rawVal * maxBarH));

                // Smooth bar interpolation
                peaks.smoothBars[i] += (targetH - peaks.smoothBars[i]) * Math.min(1, dt * 22);
                const bh = peaks.smoothBars[i];

                const xR = cx + i * step + (step - barW) / 2;
                const xL = cx - (i + 1) * step + (step - barW) / 2;
                const topY = baseY - bh;

                // Main upward capsule bars
                ctx.fillStyle = mainGrad;
                drawCapsule(xR, topY, barW, bh, 4);
                drawCapsule(xL, topY, barW, bh, 4);

                // Glossy downward floor reflection
                ctx.fillStyle = reflGrad;
                drawCapsule(xR, baseY + 3, barW, bh * 0.36, 3);
                drawCapsule(xL, baseY + 3, barW, bh * 0.36, 3);

                // Peak-hold floating LED cap
                const pk = Math.max(bh, peaks.bars[i] - fall);
                peaks.bars[i] = pk;
                if (pk > bh + 3) {
                    const capY = baseY - pk - 5;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(xR, capY, barW, 3);
                    ctx.fillRect(xL, capY, barW, 3);
                }

                splinePointsR.push({ x: xR + barW / 2, y: topY - 8 });
                splinePointsL.push({ x: xL + barW / 2, y: topY - 8 });
            }

            // Draw smooth glowing envelope curve above bars
            const drawSpline = (pts) => {
                if (pts.length < 2) return;
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                for (let i = 1; i < pts.length - 1; i++) {
                    const xc = (pts[i].x + pts[i + 1].x) / 2;
                    const yc = (pts[i].y + pts[i + 1].y) / 2;
                    ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
                }
                ctx.stroke();
            };

            ctx.save();
            ctx.strokeStyle = engine.getColor(2 % engine.palette.length);
            ctx.lineWidth = 2;
            ctx.shadowBlur = isBeat ? 18 : 8;
            ctx.shadowColor = engine.getColor(0);
            ctx.globalAlpha = 0.75;
            drawSpline(splinePointsR);
            drawSpline(splinePointsL);
            ctx.restore();

            // Horizon laser baseline
            ctx.fillStyle = engine.getColor(0);
            ctx.globalAlpha = 0.55 + bass * 0.4;
            ctx.fillRect(cx - totalHalfW, baseY, totalHalfW * 2, 1.5);
            ctx.globalAlpha = 1;
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
