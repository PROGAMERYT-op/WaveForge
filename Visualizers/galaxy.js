/*
 * WaveForge — Supermassive Spiral Nebula & Quasar mode (mode 7)
 */
(function (registry) {
    'use strict';

    registry[7] = {
        name: 'Galaxy',
        icon: '🌌',
        desc: '5-arm logarithmic spiral galaxy with blazing quasar accretion core.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const freqData = data.freq;
            const sens = engine.config.sensitivity;
            const state = engine.state;
            const t = engine.nowSec();
            const dt = state.lastGalT ? Math.min(Math.abs(t - state.lastGalT), 0.1) : 0.016;
            state.lastGalT = t;
            const effectiveMinDim = engine.getActiveMinDim ? engine.getActiveMinDim(w, h) : Math.min(w, h);
            const resScale = Math.max(0.6, effectiveMinDim / 500);

            let bass = 0;
            for (let i = 0; i < 18; i++) bass += freqData[i];
            bass = (bass / 18) / 255;

            state.galaxyAngle = (state.galaxyAngle || 0) + (0.008 + bass * 0.028) * (dt * 60);

            const arms = 5;
            const pointsPerArm = 110;
            const maxRadius = (effectiveMinDim / 2) * (0.88 + bass * 0.08);

            ctx.save();
            ctx.translate(cx, cy);
            ctx.globalCompositeOperation = 'lighter';

            const coreR = maxRadius * (0.28 + bass * 0.14);
            const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, coreR);
            coreGrad.addColorStop(0, '#ffffff');
            coreGrad.addColorStop(0.25, engine.getColor(0) + 'aa');
            coreGrad.addColorStop(0.65, engine.getColor(1) + '33');
            coreGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = coreGrad;
            ctx.beginPath();
            ctx.arc(0, 0, coreR, 0, Math.PI * 2);
            ctx.fill();

            for (let arm = 0; arm < arms; arm++) {
                const armOffset = (arm / arms) * Math.PI * 2;
                const col = engine.getColor(arm % engine.palette.length);

                for (let i = 0; i < pointsPerArm; i++) {
                    const progress = i / pointsPerArm;
                    const freqIdx = Math.floor(progress * freqData.length * 0.55);
                    const freqVal = (freqData[freqIdx] / 255) * sens;

                    const radius = Math.pow(progress, 0.85) * maxRadius;
                    const spiralAngle = progress * Math.PI * 3.4 + armOffset + state.galaxyAngle;
                    const spread = (Math.sin(i * 1.7 + arm) * 0.14) * (0.4 + progress);

                    const x = Math.cos(spiralAngle + spread) * radius;
                    const y = Math.sin(spiralAngle + spread) * radius * 0.62;

                    const size = Math.max(0.8 * resScale, (1.2 + freqVal * 3.4) * (1.1 - progress * 0.55) * resScale);
                    const alpha = Math.min(1, (1 - progress * 0.65) * (0.35 + freqVal * 0.65));

                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fillStyle = col;
                    ctx.globalAlpha = alpha;
                    ctx.fill();
                }
            }

            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
            ctx.restore();
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
