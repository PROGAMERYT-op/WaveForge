/*
 * WaveForge — Waveform mode (mode 1)
 * Live oscilloscope waveform display.
 */
(function (registry) {
    'use strict';

    registry[1] = {
        name: 'Waveform',
        icon: '〰️',
        desc: 'Live oscilloscope waveform display.',

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const waveData = data.wave;
            ctx.beginPath();
            const sliceWidth = w / waveData.length;
            let x = 0;

            ctx.strokeStyle = engine.getColor(0);
            ctx.shadowBlur = isBeat ? 25 : 8;
            ctx.shadowColor = engine.getColor(1);
            ctx.lineWidth = isBeat ? 4 : 2;

            for (let i = 0; i < waveData.length; i++) {
                const v = waveData[i] / 128.0;
                const y = cy + (v - 1) * (h / 2) * engine.config.sensitivity;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                x += sliceWidth;
            }
            ctx.stroke();

            // Mirror effect
            if (engine.config.mirror) {
                ctx.save();
                ctx.scale(1, -1);
                ctx.translate(0, -h);
                ctx.globalAlpha = 0.3;
                ctx.stroke();
                ctx.restore();
            }

            ctx.shadowBlur = 0;
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});