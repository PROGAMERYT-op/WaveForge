/*
 * WaveForge — Synthwave Sunset mode (mode 11)
 * Retro 80s Outrun laser grid, pulsing segmented sun, and audio-reactive mountain horizon.
 */
(function (registry) {
    'use strict';

    registry[11] = {
        name: 'Synthwave Grid',
        icon: '🌆',
        desc: 'Retro 80s Outrun perspective laser grid, reactive mountains, and pulsing sun.',
        newBadge: true,
        ownBackground: true,

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const t = engine.nowSec();
            const sens = engine.config.sensitivity;

            let bass = 0;
            for (let i = 0; i < 20; i++) bass += freqData[i];
            bass = (bass / 20) / 255;

            const horizonY = h * 0.56;

            // 1. Sky gradient
            const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
            skyGrad.addColorStop(0, '#050214');
            skyGrad.addColorStop(0.55, '#190836');
            skyGrad.addColorStop(1, engine.getColor(1) + '66');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, w, horizonY);

            // 2. Retro segmented pulsing sun
            const sunR = Math.min(w, h) * (0.18 + bass * 0.035);
            const sunY = horizonY - sunR * 0.35;
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, sunY, sunR, 0, Math.PI * 2);
            ctx.clip();

            const sunGrad = ctx.createLinearGradient(cx, sunY - sunR, cx, sunY + sunR);
            sunGrad.addColorStop(0, '#ffbe0b');
            sunGrad.addColorStop(0.5, '#ff006e');
            sunGrad.addColorStop(1, '#8338ec');
            ctx.fillStyle = sunGrad;
            ctx.fillRect(cx - sunR, sunY - sunR, sunR * 2, sunR * 2);

            // Horizontal scanline cutouts on lower half of sun
            ctx.fillStyle = '#120529';
            for (let slice = 0; slice < 7; slice++) {
                const sy = sunY + (slice / 7) * sunR;
                const sh = 2 + slice * 1.8;
                ctx.fillRect(cx - sunR, sy, sunR * 2, sh);
            }
            ctx.restore();

            // 3. Audio-reactive mountain range along the horizon
            ctx.beginPath();
            ctx.moveTo(0, horizonY);
            const peaks = 64;
            for (let i = 0; i <= peaks; i++) {
                const px = (i / peaks) * w;
                const distCenter = Math.abs((i / peaks) - 0.5) * 2;
                const fIdx = Math.floor(distCenter * freqData.length * 0.35);
                const fVal = (freqData[fIdx] / 255) * sens;
                const mountainH = (fVal * h * 0.22) * (0.35 + distCenter * 0.85);
                ctx.lineTo(px, horizonY - mountainH);
            }
            ctx.lineTo(w, horizonY);
            ctx.closePath();
            ctx.fillStyle = '#090318';
            ctx.fill();
            ctx.strokeStyle = engine.getColor(0);
            ctx.lineWidth = isBeat ? 3 : 1.8;
            ctx.shadowBlur = 14;
            ctx.shadowColor = engine.getColor(0);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // 4. Ground perspective plane
            const groundGrad = ctx.createLinearGradient(0, horizonY, 0, h);
            groundGrad.addColorStop(0, '#14052b');
            groundGrad.addColorStop(1, '#04010a');
            ctx.fillStyle = groundGrad;
            ctx.fillRect(0, horizonY, w, h - horizonY);

            // 5. Perspective vertical grid lines
            const gridColor = engine.getColor(0);
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1.3;
            const vLines = 24;
            for (let i = -vLines; i <= vLines; i++) {
                const topX = cx + i * (w * 0.015);
                const botX = cx + i * (w * 0.14);
                ctx.globalAlpha = Math.max(0.12, 0.7 - Math.abs(i) / (vLines * 1.2));
                ctx.beginPath();
                ctx.moveTo(topX, horizonY);
                ctx.lineTo(botX, h);
                ctx.stroke();
            }

            // 6. Scrolling horizontal perspective grid bars
            const hLines = 16;
            const scroll = (t * (0.8 + bass * 1.4)) % 1;
            for (let j = 0; j < hLines; j++) {
                const p = (j + scroll) / hLines;
                const y = horizonY + Math.pow(p, 2.2) * (h - horizonY);
                ctx.globalAlpha = Math.min(0.85, p * (0.5 + bass * 0.6));
                ctx.lineWidth = 1 + p * 1.8;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
