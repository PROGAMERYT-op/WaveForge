/*
 * WaveForge — Radial EQ mode (mode 2)
 * Circular frequency bars radiating outward.
 */
(function (registry) {
    'use strict';

    registry[2] = {
        name: 'Radial EQ',
        icon: '🎯',
        desc: 'Circular frequency bars radiating outward.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const radius = Math.min(cx, cy) * 0.25;
            const bars = 120;
            const step = Math.floor(freqData.length / bars);
            const angleStep = (Math.PI * 2) / bars;
            const kick = isBeat ? 1.12 : 1.0;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(kick, kick);

            // Inner glow circle
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
            gradient.addColorStop(0, engine.getColor(0) + '33');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();

            for (let i = 0; i < bars; i++) {
                const val = freqData[i * step];
                const barH = (val / 255) * (Math.min(cx, cy) * 0.45) * engine.config.sensitivity;

                ctx.save();
                ctx.rotate(i * angleStep);

                const grad = ctx.createLinearGradient(0, radius, 0, radius + barH);
                grad.addColorStop(0, engine.getColor(0));
                grad.addColorStop(1, engine.getColor(1));
                ctx.fillStyle = grad;

                ctx.fillRect(-2, radius, 4, barH);

                // Reflection
                ctx.fillStyle = engine.getColor(i % engine.palette.length) + '22';
                ctx.fillRect(-2, radius - 5, 4, -barH * 0.15);

                ctx.restore();
            }
            ctx.restore();
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});