/*
 * WaveForge — Cyber Tunnel mode (mode 9)
 * 3D neon geometric wireframe tunnel flying forward at beat-reactive speeds.
 */
(function (registry) {
    'use strict';

    registry[9] = {
        name: 'Cyber Tunnel',
        icon: '🌀',
        desc: '3D neon polygon tunnel flying at beat-reactive warp speed.',
        newBadge: true,

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const waveData = data.wave;
            const t = engine.nowSec();
            const sens = engine.config.sensitivity;

            let bass = 0;
            for (let i = 0; i < 20; i++) bass += freqData[i];
            bass = (bass / 20) / 255;

            let mid = 0;
            for (let i = 20; i < 80; i++) mid += freqData[i];
            mid = (mid / 60) / 255;

            const speed = 0.65 + bass * 1.4;
            const rings = 22;
            const sides = 8;
            const maxR = Math.hypot(cx, cy) * 1.15;

            ctx.save();
            ctx.translate(cx, cy);

            // Subtle camera sway tied to time and mid energy
            const swayX = Math.sin(t * 1.3) * w * 0.03 * (1 + mid);
            const swayY = Math.cos(t * 0.9) * h * 0.03 * (1 + mid);

            // Draw radial warp spokes from vanishing point
            ctx.lineWidth = 1.2;
            for (let s = 0; s < sides * 2; s++) {
                const ang = (s / (sides * 2)) * Math.PI * 2 + t * 0.18;
                const fVal = (freqData[(s * 6) % freqData.length] / 255) * sens;
                ctx.strokeStyle = engine.getColor(s % engine.palette.length);
                ctx.globalAlpha = 0.15 + Math.min(0.55, fVal * 0.35);
                ctx.beginPath();
                ctx.moveTo(swayX, swayY);
                ctx.lineTo(Math.cos(ang) * maxR, Math.sin(ang) * maxR);
                ctx.stroke();
            }

            // Draw flying depth rings from back to front
            for (let i = 0; i < rings; i++) {
                const depth = ((i / rings) + (t * speed * 0.35)) % 1;
                // Exponential perspective projection
                const persp = Math.pow(depth, 2.35);
                const r = Math.max(4, persp * maxR);
                const fIdx = Math.floor((1 - depth) * freqData.length * 0.45);
                const fVal = (freqData[fIdx] / 255) * sens;

                const offsetX = swayX * (1 - persp);
                const offsetY = swayY * (1 - persp);
                const rot = t * 0.25 + (1 - depth) * 1.4 + (isBeat ? 0.04 : 0);

                ctx.beginPath();
                for (let s = 0; s <= sides; s++) {
                    const a = (s / sides) * Math.PI * 2 + rot;
                    const binIdx = (s * 8 + i * 3) % Math.min(128, freqData.length);
                    const binBoost = 1 + (freqData[binIdx] / 255) * 0.28 * sens;
                    const px = offsetX + Math.cos(a) * r * binBoost;
                    const py = offsetY + Math.sin(a) * r * binBoost;
                    if (s === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();

                const color = engine.getColor(i % engine.palette.length);
                ctx.strokeStyle = color;
                ctx.lineWidth = Math.max(1, persp * (3.5 + fVal * 2.5));
                ctx.globalAlpha = Math.min(1, persp * (0.55 + fVal * 0.6));
                if (isBeat && i > rings - 6) {
                    ctx.shadowBlur = 22;
                    ctx.shadowColor = color;
                } else {
                    ctx.shadowBlur = 0;
                }
                ctx.stroke();
            }

            // Center core waveform ring
            const coreR = Math.min(cx, cy) * (0.09 + bass * 0.08);
            ctx.beginPath();
            const step = Math.max(1, Math.floor(waveData.length / 64));
            for (let i = 0; i < 64; i++) {
                const a = (i / 64) * Math.PI * 2;
                const wv = (waveData[i * step] - 128) / 128;
                const rad = coreR + wv * coreR * 0.65 * sens;
                const px = swayX + Math.cos(a) * rad;
                const py = swayY + Math.sin(a) * rad;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = isBeat ? 3.5 : 2;
            ctx.globalAlpha = 0.9;
            ctx.shadowBlur = 18;
            ctx.shadowColor = engine.getColor(0);
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            ctx.restore();
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
