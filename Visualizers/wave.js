/*
 * WaveForge — Multi-Harmonic Neon Ribbon Waveform mode (mode 1)
 * 4-layer additive neon oscilloscope ribbons with smooth spline interpolation and aurora fill.
 */
(function (registry) {
    'use strict';

    registry[1] = {
        name: 'Waveform',
        icon: '〰️',
        desc: 'Multi-harmonic neon ribbon oscilloscope with aurora gradient fill.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const waveData = data.wave;
            const freqData = data.freq;
            const t = engine.nowSec();
            const sens = engine.config.sensitivity;

            let bass = 0;
            for (let i = 0; i < 16; i++) bass += freqData[i];
            bass = (bass / 16) / 255;

            const pointsCount = 96;
            const step = Math.floor(waveData.length / pointsCount);

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            // Render 4 harmonic ribbon layers
            const layers = [
                { phase: 0, ampMul: 1.0, width: isBeat ? 4.2 : 3.0, alpha: 0.95, colorIdx: 0, fill: true },
                { phase: 0.8, ampMul: 0.72, width: 2.2, alpha: 0.65, colorIdx: 1, fill: false },
                { phase: -1.1, ampMul: 0.52, width: 1.6, alpha: 0.45, colorIdx: 2, fill: false },
                { phase: 2.1, ampMul: 0.35, width: 1.2, alpha: 0.3, colorIdx: 3, fill: false }
            ];

            layers.forEach((layer) => {
                const col = engine.getColor(layer.colorIdx);
                const pts = [];

                for (let i = 0; i <= pointsCount; i++) {
                    const normX = i / pointsCount;
                    const x = normX * w;
                    // Sine window tapers wave smoothly at left/right screen edges
                    const windowEnv = Math.sin(normX * Math.PI);
                    const sampleIdx = Math.min(waveData.length - 1, i * step);
                    const rawSample = (waveData[sampleIdx] - 128) / 128.0;
                    const carrier = Math.sin(normX * 8 + t * 2.5 + layer.phase) * 0.08 * (1 + bass);
                    const yOffset = (rawSample * layer.ampMul * sens + carrier) * (h * 0.38) * windowEnv;
                    pts.push({ x, y: cy + yOffset });
                }

                // Draw smooth quadratic spline
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                for (let i = 1; i < pts.length - 1; i++) {
                    const xc = (pts[i].x + pts[i + 1].x) / 2;
                    const yc = (pts[i].y + pts[i + 1].y) / 2;
                    ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
                }
                ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);

                ctx.strokeStyle = col;
                ctx.lineWidth = layer.width;
                ctx.globalAlpha = layer.alpha;
                ctx.shadowBlur = isBeat ? 24 : 12;
                ctx.shadowColor = col;
                ctx.stroke();

                // Soft aurora fill under primary wave
                if (layer.fill) {
                    ctx.lineTo(w, cy);
                    ctx.lineTo(0, cy);
                    ctx.closePath();
                    const fillGrad = ctx.createLinearGradient(0, cy - h * 0.3, 0, cy + h * 0.3);
                    fillGrad.addColorStop(0, col + '33');
                    fillGrad.addColorStop(0.5, engine.getColor(1) + '11');
                    fillGrad.addColorStop(1, col + '33');
                    ctx.fillStyle = fillGrad;
                    ctx.shadowBlur = 0;
                    ctx.fill();
                }
            });

            // Mirror effect if enabled
            if (engine.config.mirror) {
                ctx.save();
                ctx.translate(0, h);
                ctx.scale(1, -1);
                ctx.globalAlpha = 0.28;
                ctx.beginPath();
                for (let i = 0; i <= pointsCount; i++) {
                    const normX = i / pointsCount;
                    const sampleIdx = Math.min(waveData.length - 1, i * step);
                    const raw = (waveData[sampleIdx] - 128) / 128.0;
                    const y = cy + raw * sens * (h * 0.32) * Math.sin(normX * Math.PI);
                    if (i === 0) ctx.moveTo(normX * w, y);
                    else ctx.lineTo(normX * w, y);
                }
                ctx.strokeStyle = engine.getColor(1);
                ctx.lineWidth = 1.8;
                ctx.stroke();
                ctx.restore();
            }

            ctx.restore();
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
