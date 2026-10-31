/*
 * WaveForge — 3D Quantum Double Helix mode (mode 6)
 * Depth-sorted 3D molecular double helix with glowing base-pair rungs and perspective spheres.
 */
(function (registry) {
    'use strict';

    registry[6] = {
        name: 'DNA Helix',
        icon: '🧬',
        desc: '3D depth-sorted double helix with luminous harmonic base-pairs.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const sens = engine.config.sensitivity;

            let bass = 0;
            for (let i = 0; i < 16; i++) bass += freqData[i];
            bass = (bass / 16) / 255;

            engine.state.helixAngle = (engine.state.helixAngle || 0) + (0.025 + bass * 0.055);
            const phase = engine.state.helixAngle;

            const pairs = 46;
            const amplitude = Math.min(cx, cy) * (0.38 + bass * 0.08);
            const spacing = h / pairs;

            ctx.save();
            ctx.translate(cx, 0);

            for (let i = 0; i < pairs; i++) {
                const freqIdx = Math.floor((i / pairs) * freqData.length * 0.5);
                const freqVal = (freqData[freqIdx] / 255) * sens;
                const y = (i + 0.5) * spacing;
                const ang = phase + i * 0.19;

                const sinA = Math.sin(ang);
                const cosA = Math.cos(ang); // z-depth (-1 to +1)
                const r = amplitude * (0.45 + freqVal * 0.55);

                const x1 = sinA * r;
                const z1 = cosA;
                const x2 = -sinA * r;
                const z2 = -cosA;

                // Base-pair connecting rung
                ctx.beginPath();
                ctx.moveTo(x1, y);
                ctx.lineTo(x2, y);
                ctx.strokeStyle = engine.getColor(2 % engine.palette.length) + '55';
                ctx.lineWidth = 1.5 + freqVal * 1.5;
                ctx.stroke();

                // Depth-sort nucleotides so back sphere draws before front sphere
                const nodes = [
                    { x: x1, z: z1, col: engine.getColor(0) },
                    { x: x2, z: z2, col: engine.getColor(1) }
                ].sort((a, b) => a.z - b.z);

                nodes.forEach((n) => {
                    const depthScale = 0.65 + (n.z + 1) * 0.35;
                    const rad = Math.max(2.5, (4 + freqVal * 7) * depthScale);
                    ctx.beginPath();
                    ctx.arc(n.x, y, rad, 0, Math.PI * 2);
                    ctx.fillStyle = n.col;
                    ctx.globalAlpha = 0.45 + (n.z + 1) * 0.27;
                    if (isBeat && n.z > 0.3) {
                        ctx.shadowBlur = 16;
                        ctx.shadowColor = n.col;
                    } else {
                        ctx.shadowBlur = 0;
                    }
                    ctx.fill();
                });
            }

            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.restore();
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
