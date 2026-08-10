/*
 * WaveForge — DNA Helix mode (mode 6)
 * Rotating double helix strand visualization.
 */
(function (registry) {
    'use strict';

    registry[6] = {
        name: 'DNA Helix',
        icon: '🧬',
        desc: 'Rotating double helix strand visualization.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            engine.state.helixAngle += isBeat ? 0.08 : 0.03;

            const points = 80;
            const amplitude = Math.min(cx, cy) * 0.35;
            const spacing = h / points;
            const phase = engine.state.helixAngle;

            ctx.save();
            ctx.translate(cx, 0);

            for (let i = 0; i < points; i++) {
                const freqIdx = Math.floor((i / points) * freqData.length * 0.5);
                const freqVal = freqData[freqIdx] / 255;
                const y = i * spacing;

                const x1 = Math.sin(phase + i * 0.15) * amplitude * (0.5 + freqVal * engine.config.sensitivity);
                const x2 = Math.sin(phase + i * 0.15 + Math.PI) * amplitude * (0.5 + freqVal * engine.config.sensitivity);

                const size = 4 + freqVal * 12;

                // Strand 1
                ctx.beginPath();
                ctx.arc(x1, y, size, 0, Math.PI * 2);
                ctx.fillStyle = engine.getColor(0);
                ctx.shadowBlur = isBeat ? 20 : 5;
                ctx.shadowColor = engine.getColor(0);
                ctx.fill();

                // Strand 2
                ctx.beginPath();
                ctx.arc(x2, y, size, 0, Math.PI * 2);
                ctx.fillStyle = engine.getColor(1);
                ctx.shadowColor = engine.getColor(1);
                ctx.fill();

                // Connecting line (base pair)
                if (i % 4 === 0) {
                    ctx.beginPath();
                    ctx.moveTo(x1, y);
                    ctx.lineTo(x2, y);
                    ctx.strokeStyle = engine.getColor(2) + '66';
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 0;
                    ctx.stroke();
                }
            }

            ctx.restore();
            ctx.shadowBlur = 0;
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});