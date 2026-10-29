/*
 * WaveForge — Bass Nation Ring mode (mode 10)
 * Multi-layered harmonic bass ring with shockwaves, dual mirrored spectrum, and floating embers.
 */
(function (registry) {
    'use strict';

    registry[10] = {
        name: 'Bass Nation',
        icon: '🔥',
        desc: 'Dual harmonic bass rings with beat shockwaves and glowing embers.',
        newBadge: true,

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const t = engine.nowSec();
            const sens = engine.config.sensitivity;
            const state = engine.state;

            let bass = 0;
            for (let i = 0; i < 18; i++) bass += freqData[i];
            bass = (bass / 18) / 255;

            let mid = 0;
            for (let i = 18; i < 90; i++) mid += freqData[i];
            mid = (mid / 72) / 255;

            // Maintain shockwave rings on beats
            if (!state.shockwaves) state.shockwaves = [];
            if (isBeat && state.shockwaves.length < 6) {
                state.shockwaves.push({ r: 1, alpha: 0.85, color: engine.getColor(Math.floor(t * 2) % engine.palette.length) });
            }

            const baseR = Math.min(cx, cy) * (0.26 + bass * 0.14 * Math.min(sens, 2.2));
            const jitterX = isBeat ? (Math.random() - 0.5) * 8 * bass : 0;
            const jitterY = isBeat ? (Math.random() - 0.5) * 8 * bass : 0;

            ctx.save();
            ctx.translate(cx + jitterX, cy + jitterY);

            // Background radial aura
            const aura = ctx.createRadialGradient(0, 0, baseR * 0.4, 0, 0, baseR * 2.5);
            aura.addColorStop(0, engine.getColor(0) + '44');
            aura.addColorStop(0.5, engine.getColor(1) + '18');
            aura.addColorStop(1, 'transparent');
            ctx.fillStyle = aura;
            ctx.beginPath();
            ctx.arc(0, 0, baseR * 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Render expanding beat shockwaves
            for (let i = state.shockwaves.length - 1; i >= 0; i--) {
                const sw = state.shockwaves[i];
                sw.r += (4.5 + bass * 8);
                sw.alpha *= 0.94;
                if (sw.alpha <= 0.03) {
                    state.shockwaves.splice(i, 1);
                    continue;
                }
                ctx.beginPath();
                ctx.arc(0, 0, baseR + sw.r, 0, Math.PI * 2);
                ctx.strokeStyle = sw.color;
                ctx.lineWidth = 2.5;
                ctx.globalAlpha = sw.alpha;
                ctx.stroke();
            }
            ctx.globalAlpha = 1;

            // Draw 3 layered harmonic smooth spectrum waves around the circle
            const points = 128;
            const layers = [
                { mul: 1.0, colorIdx: 0, alpha: 0.9, fill: false, width: 3.5 },
                { mul: 0.72, colorIdx: 1, alpha: 0.65, fill: false, width: 2.2 },
                { mul: 1.28, colorIdx: 2, alpha: 0.4, fill: false, width: 1.6 }
            ];

            layers.forEach((layer, lIdx) => {
                ctx.beginPath();
                for (let i = 0; i <= points; i++) {
                    // Symmetrical mirrored index around the circle
                    const half = points / 2;
                    const mirrorIdx = i <= half ? i : points - i;
                    const fIdx = Math.floor((mirrorIdx / half) * (freqData.length * 0.45));
                    const val = (freqData[fIdx] / 255) * sens * layer.mul;
                    const angle = (i / points) * Math.PI * 2 - Math.PI / 2 + lIdx * 0.03;
                    const r = baseR + val * (Math.min(cx, cy) * 0.38);
                    const px = Math.cos(angle) * r;
                    const py = Math.sin(angle) * r;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                const col = engine.getColor(layer.colorIdx);
                ctx.strokeStyle = col;
                ctx.lineWidth = layer.width + (isBeat ? 1.2 : 0);
                ctx.globalAlpha = layer.alpha;
                ctx.shadowBlur = isBeat ? 24 : 12;
                ctx.shadowColor = col;
                ctx.stroke();
            });

            // Inner dark disc + pulsing emblem
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(0, 0, baseR * 0.92, 0, Math.PI * 2);
            ctx.fillStyle = '#070913';
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = engine.getColor(0);
            ctx.stroke();

            // Center emblem bars
            const miniBars = 9;
            const totalW = baseR * 0.85;
            const bw = (totalW / miniBars) * 0.58;
            for (let b = 0; b < miniBars; b++) {
                const distFromCenter = Math.abs(b - (miniBars - 1) / 2);
                const bin = Math.floor(distFromCenter * 6);
                const bh = Math.max(8, (freqData[bin] / 255) * baseR * 0.95 * Math.min(sens, 2));
                const bx = (b - (miniBars - 1) / 2) * (totalW / miniBars) - bw / 2;
                ctx.fillStyle = engine.getColor(b % engine.palette.length);
                ctx.fillRect(bx, -bh / 2, bw, bh);
            }

            ctx.restore();
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
