/*
 * WaveForge — 3D Bars mode (mode 5)
 * Perspective frequency bars with depth.
 */
(function (registry) {
    'use strict';

    registry[5] = {
        name: '3D Bars',
        icon: '🧱',
        desc: 'Perspective frequency bars with depth.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const bars = 64;
            const step = Math.floor(freqData.length / bars);
            const barWidth = w / bars * 0.6;
            const maxHeight = h * 0.5;
            const depth = 150;
            const kick = isBeat ? 1.1 : 1.0;

            ctx.save();
            ctx.translate(cx, cy + 50);

            for (let i = 0; i < bars; i++) {
                const val = freqData[i * step] / 255;
                const barH = val * maxHeight * engine.config.sensitivity * kick;

                const x = (i - bars / 2) * (barWidth + 4);
                const y = -barH / 2;

                // 3D effect - back face
                ctx.fillStyle = engine.getColor(2) + '44';
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + depth * 0.3, y - depth * 0.2);
                ctx.lineTo(x + barWidth + depth * 0.3, y - depth * 0.2);
                ctx.lineTo(x + barWidth, y);
                ctx.closePath();
                ctx.fill();

                // Side face
                ctx.fillStyle = engine.getColor(1) + '88';
                ctx.beginPath();
                ctx.moveTo(x + barWidth, y);
                ctx.lineTo(x + barWidth + depth * 0.3, y - depth * 0.2);
                ctx.lineTo(x + barWidth + depth * 0.3, y + barH - depth * 0.2);
                ctx.lineTo(x + barWidth, y + barH);
                ctx.closePath();
                ctx.fill();

                // Front face
                const grad = ctx.createLinearGradient(x, y + barH, x, y);
                grad.addColorStop(0, engine.getColor(0));
                grad.addColorStop(1, engine.getColor(1));
                ctx.fillStyle = grad;
                ctx.fillRect(x, y, barWidth, barH);
            }

            ctx.restore();
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});