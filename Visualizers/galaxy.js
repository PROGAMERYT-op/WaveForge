/*
 * WaveForge — Galaxy mode (mode 7)
 * Spiral galaxy arms with star particles.
 */
(function (registry) {
    'use strict';

    registry[7] = {
        name: 'Galaxy',
        icon: '🌌',
        desc: 'Spiral galaxy arms with star particles.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            engine.state.galaxyAngle += isBeat ? 0.025 : 0.008;

            const arms = 4;
            const pointsPerArm = 120;
            const maxRadius = Math.min(cx, cy) * 0.85;

            ctx.save();
            ctx.translate(cx, cy);

            // Center glow
            const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius * 0.3);
            centerGrad.addColorStop(0, engine.getColor(0) + '44');
            centerGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = centerGrad;
            ctx.beginPath();
            ctx.arc(0, 0, maxRadius * 0.3, 0, Math.PI * 2);
            ctx.fill();

            for (let arm = 0; arm < arms; arm++) {
                const armOffset = (arm / arms) * Math.PI * 2;

                for (let i = 0; i < pointsPerArm; i++) {
                    const progress = i / pointsPerArm;
                    const freqIdx = Math.floor(progress * freqData.length * 0.5);
                    const freqVal = freqData[freqIdx] / 255;

                    const radius = progress * maxRadius;
                    const spiralAngle = progress * Math.PI * 3 + armOffset + engine.state.galaxyAngle;

                    // Add some randomness for natural look
                    const jitter = (Math.sin(i * 0.5 + engine.state.galaxyAngle * 2) * 0.1);

                    const x = Math.cos(spiralAngle + jitter) * radius;
                    const y = Math.sin(spiralAngle + jitter) * radius * 0.6; // Elliptical

                    const size = (1 + freqVal * engine.config.sensitivity * 3) * (1 - progress * 0.5);
                    const alpha = (1 - progress * 0.7) * (0.3 + freqVal * 0.7);

                    ctx.beginPath();
                    ctx.arc(x, y, Math.max(size, 0.5), 0, Math.PI * 2);
                    ctx.fillStyle = engine.getColor(arm % engine.palette.length);
                    ctx.globalAlpha = alpha;

                    if (isBeat && i % 8 === 0) {
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = ctx.fillStyle;
                    } else {
                        ctx.shadowBlur = 0;
                    }

                    ctx.fill();
                }
            }

            ctx.globalAlpha = 1;
            ctx.restore();
            ctx.shadowBlur = 0;
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});