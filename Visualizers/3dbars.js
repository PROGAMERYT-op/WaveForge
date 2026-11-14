/*
 * WaveForge — Isometric 3D Neon Stage mode (mode 5)
 */
(function (registry) {
    'use strict';

    registry[5] = {
        name: '3D Bars',
        icon: '🧱',
        desc: 'Isometric 3D architectural columns with volumetric shading & neon caps.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const sens = engine.config.sensitivity;
            const t = engine.nowSec();

            const bars = 44;
            const step = Math.max(1, Math.floor((freqData.length * 0.65) / bars));
            const totalW = w * 0.78;
            const spacing = totalW / bars;
            const barW = spacing * 0.64;
            const maxH = h * 0.52;
            const isoX = 18;
            const isoY = -12;
            const kick = isBeat ? 1.08 : 1.0;

            ctx.save();
            const swayY = Math.sin(t * 1.2) * 8;
            ctx.translate(cx, cy + h * 0.16 + swayY);

            ctx.strokeStyle = engine.getColor(0) + '44';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-totalW / 2 - 20, 10);
            ctx.lineTo(totalW / 2 + 40, 10);
            ctx.stroke();

            for (let i = 0; i < bars; i++) {
                const val = (freqData[i * step] / 255) * sens * kick;
                const barH = Math.max(6, Math.min(maxH, val * maxH));
                const x = (i - bars / 2) * spacing;
                const y = -barH;

                const frontGrad = ctx.createLinearGradient(x, 0, x, y);
                frontGrad.addColorStop(0, engine.getColor(0));
                frontGrad.addColorStop(1, engine.getColor(1));
                ctx.fillStyle = frontGrad;
                ctx.fillRect(x, y, barW, barH);

                ctx.fillStyle = engine.getColor(1) + '77';
                ctx.beginPath();
                ctx.moveTo(x + barW, y);
                ctx.lineTo(x + barW + isoX, y + isoY);
                ctx.lineTo(x + barW + isoX, isoY);
                ctx.lineTo(x + barW, 0);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 0.75 + Math.min(0.25, val * 0.25);
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + isoX, y + isoY);
                ctx.lineTo(x + barW + isoX, y + isoY);
                ctx.lineTo(x + barW, y);
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            ctx.restore();
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
