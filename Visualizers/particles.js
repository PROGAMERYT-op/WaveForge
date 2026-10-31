/*
 * WaveForge — Quantum Constellation & Vortex Field mode (mode 3)
 * Reactive particle field with dynamic Plexus neural connections and bass vortex physics.
 */
(function (registry) {
    'use strict';

    function renderConstellation(engine, ctx, w, h, cx, cy, data, isBeat, scaleX, scaleY) {
        const freqData = data.freq;
        let bass = 0;
        for (let i = 0; i < 20; i++) bass += freqData[i];
        bass = (bass / 20) / 255;

        const speed = 0.6 + bass * 5.2;
        const pList = engine.palette;
        const minScale = Math.min(scaleX, scaleY);
        const pts = engine.particles;
        const maxDist = 115 * minScale;
        const maxDistSq = maxDist * maxDist;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Center vortex aura
        const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.min(w, h) * (0.35 + bass * 0.25));
        aura.addColorStop(0, pList[0] + '26');
        aura.addColorStop(0.6, pList[1 % pList.length] + '0c');
        aura.addColorStop(1, 'transparent');
        ctx.fillStyle = aura;
        ctx.fillRect(0, 0, w, h);

        // Update positions & compute screen coords
        const screenCoords = new Array(pts.length);
        for (let idx = 0; idx < pts.length; idx++) {
            const p = pts[idx];
            // Add subtle orbital tangential drift around center
            const dx = p.x - engine.width / 2;
            const dy = p.y - engine.height / 2;
            const dist = Math.max(40, Math.hypot(dx, dy));
            const swirl = (bass * 1.4) / dist;

            p.x += p.vx * speed - dy * swirl;
            p.y += p.vy * speed + dx * swirl;

            if (p.x < 0) p.x = engine.width;
            if (p.x > engine.width) p.x = 0;
            if (p.y < 0) p.y = engine.height;
            if (p.y > engine.height) p.y = 0;

            const sx = p.x * scaleX;
            const sy = p.y * scaleY;
            const freqIdx = Math.floor((idx / pts.length) * freqData.length * 0.55);
            const fVal = (freqData[freqIdx] / 255) * engine.config.sensitivity;
            const r = Math.max(1.2, p.size * (0.55 + fVal * 2.1) * minScale);
            const col = pList[p.color % pList.length];

            screenCoords[idx] = { x: sx, y: sy, r, col, fVal };
        }

        // Draw Plexus constellation filaments between nearby particles
        ctx.lineWidth = Math.max(0.8, 1.1 * minScale);
        for (let i = 0; i < screenCoords.length; i += 2) {
            const a = screenCoords[i];
            for (let j = i + 1; j < screenCoords.length; j += 2) {
                const b = screenCoords[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dSq = dx * dx + dy * dy;
                if (dSq < maxDistSq) {
                    const alpha = (1 - Math.sqrt(dSq) / maxDist) * (0.22 + bass * 0.35);
                    ctx.strokeStyle = a.col;
                    ctx.globalAlpha = alpha;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // Draw luminous nodes
        for (let i = 0; i < screenCoords.length; i++) {
            const sc = screenCoords[i];
            ctx.beginPath();
            ctx.arc(sc.x, sc.y, sc.r, 0, Math.PI * 2);
            ctx.fillStyle = sc.col;
            ctx.globalAlpha = Math.min(1, 0.45 + sc.fVal * 0.55);
            if (isBeat && i % 5 === 0) {
                ctx.shadowBlur = 18 * minScale;
                ctx.shadowColor = sc.col;
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fill();
        }

        ctx.restore();
    }

    registry[3] = {
        name: 'Particles',
        icon: '✨',
        desc: 'Quantum constellation plexus network with bass vortex physics.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            renderConstellation(engine, ctx, w, h, cx, cy, data, isBeat, 1, 1);
        },

        renderExport(engine, ctx, w, h, cx, cy, data, isBeat) {
            const scaleX = w / (engine.width || w);
            const scaleY = h / (engine.height || h);
            renderConstellation(engine, ctx, w, h, cx, cy, data, isBeat, scaleX, scaleY);
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
