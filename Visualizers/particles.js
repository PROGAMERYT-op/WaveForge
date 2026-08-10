/*
 * WaveForge — Particles mode (mode 3)
 * Beat-reactive floating particle field.
 */
(function (registry) {
    'use strict';

    registry[3] = {
        name: 'Particles',
        icon: '✨',
        desc: 'Beat-reactive floating particle field.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            ctx.globalCompositeOperation = 'lighter';

            // Bass energy for speed
            let bass = 0;
            for (let i = 0; i < 25; i++) bass += freqData[i];
            bass /= 25;
            const speed = (bass / 255) * 6 + 0.5;

            const pList = engine.palette;

            engine.particles.forEach((p, idx) => {
                p.x += p.vx * (1 + speed);
                p.y += p.vy * (1 + speed);

                // Wrap around
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                const freqIdx = Math.floor((idx / engine.particles.length) * freqData.length * 0.5);
                const r = p.size * (0.5 + (freqData[freqIdx] / 255) * engine.config.sensitivity * 2.5);

                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(r, 1), 0, Math.PI * 2);
                ctx.fillStyle = pList[p.color % pList.length];

                if (isBeat && idx % 4 === 0) {
                    ctx.shadowBlur = 25;
                    ctx.shadowColor = ctx.fillStyle;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
            });

            // Beat flash
            if (isBeat) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
                ctx.fillRect(0, 0, w, h);
            }

            ctx.globalCompositeOperation = 'source-over';
            ctx.shadowBlur = 0;
        },

        // Export variant: particles keep moving (fixed: previously static)
        renderExport(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            ctx.globalCompositeOperation = 'lighter';

            let bass = 0;
            for (let i = 0; i < 25; i++) bass += freqData[i];
            bass /= 25;
            const speed = (bass / 255) * 6 + 0.5;

            const pList = engine.palette;
            const scaleX = w / engine.width;
            const scaleY = h / engine.height;
            const minScale = Math.min(scaleX, scaleY);

            engine.particles.forEach((p, idx) => {
                p.x += p.vx * (1 + speed);
                p.y += p.vy * (1 + speed);

                // Wrap around in the engine's CSS-pixel space
                if (p.x < 0) p.x = engine.width;
                if (p.x > engine.width) p.x = 0;
                if (p.y < 0) p.y = engine.height;
                if (p.y > engine.height) p.y = 0;

                const px = p.x * scaleX;
                const py = p.y * scaleY;

                const freqIdx = Math.floor((idx / engine.particles.length) * freqData.length * 0.5);
                const r = p.size * (0.5 + (freqData[freqIdx] / 255) * engine.config.sensitivity * 2.5) * minScale;

                ctx.beginPath();
                ctx.arc(px, py, Math.max(r, 1), 0, Math.PI * 2);
                ctx.fillStyle = pList[p.color % pList.length];

                if (isBeat && idx % 4 === 0) {
                    ctx.shadowBlur = 25 * minScale;
                    ctx.shadowColor = ctx.fillStyle;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
            });

            if (isBeat) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
                ctx.fillRect(0, 0, w, h);
            }

            ctx.globalCompositeOperation = 'source-over';
            ctx.shadowBlur = 0;
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});