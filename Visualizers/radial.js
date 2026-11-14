/*
 * WaveForge — 360° Cybernetic Reactor EQ mode (mode 2)
 */
(function (registry) {
    'use strict';

    registry[2] = {
        name: 'Radial EQ',
        icon: '🎯',
        desc: '360° cybernetic reactor with rotating HUD rings & peak-hold crystals.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const t = engine.nowSec();
            const sens = engine.config.sensitivity;

            let bass = 0;
            for (let i = 0; i < 18; i++) bass += freqData[i];
            bass = (bass / 18) / 255;

            const minDim = Math.min(cx, cy);
            const radius = minDim * (0.28 + bass * 0.06);
            const bars = 120;
            const angleStep = (Math.PI * 2) / bars;

            const peaks = engine.state.peaks || (engine.state.peaks = {});
            if (!peaks.radial || peaks.radial.length !== bars) peaks.radial = new Float32Array(bars);
            if (peaks.radialT === undefined) peaks.radialT = t;
            const dt = Math.min(0.1, Math.max(0.001, t - peaks.radialT));
            peaks.radialT = t;
            const fall = minDim * 0.45 * dt;

            ctx.save();
            ctx.translate(cx, cy);

            const glow = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius * 2.4);
            glow.addColorStop(0, engine.getColor(0) + '44');
            glow.addColorStop(0.5, engine.getColor(1) + '16');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, radius * 2.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.save();
            ctx.rotate(-t * 0.45);
            ctx.strokeStyle = engine.getColor(1) + '66';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let s = 0; s <= 6; s++) {
                const a = (s / 6) * Math.PI * 2;
                const r = radius * (0.62 + bass * 0.15);
                if (s === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
                else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.rotate(t * 0.25);
            ctx.strokeStyle = engine.getColor(0) + '88';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 8]);
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.86, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();

            for (let i = 0; i < bars; i++) {
                const half = bars / 2;
                const mirrorIdx = i <= half ? i : bars - i;
                const fIdx = Math.floor((mirrorIdx / half) * (freqData.length * 0.65));
                const val = freqData[fIdx] / 255;
                const barH = Math.max(3, val * (minDim * 0.5) * sens);

                ctx.save();
                ctx.rotate(i * angleStep + t * 0.12);

                const grad = ctx.createLinearGradient(0, radius, 0, radius + barH);
                grad.addColorStop(0, engine.getColor(0));
                grad.addColorStop(1, engine.getColor(1));
                ctx.fillStyle = grad;
                ctx.fillRect(-1.8, radius, 3.6, barH);

                ctx.fillStyle = engine.getColor(2 % engine.palette.length) + '38';
                ctx.fillRect(-1.4, radius - 4, 2.8, -barH * 0.22);

                const pk = Math.max(barH, peaks.radial[i] - fall);
                peaks.radial[i] = pk;
                if (pk > barH + 4) {
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(0, radius + pk + 4, 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }

            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.strokeStyle = '#ffffff';
            ctx.globalAlpha = 0.7;
            ctx.lineWidth = isBeat ? 3 : 1.8;
            ctx.stroke();

            ctx.restore();
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
