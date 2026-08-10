/*
 * WaveForge — Logo Visualizer mode (mode 8)
 * Upload your logo & background. Beat shake, radial rays, particles.
 *
 * Handles its own background (drone camera + shake), so it marks
 * ownBackground = true and the engine skips the fade-fill.
 */
(function (registry) {
    'use strict';

    registry[8] = {
        name: 'Logo Visualizer',
        icon: '🎬',
        desc: 'Upload your logo & background. Beat shake, radial rays, particles.',
        newBadge: true,
        ownBackground: true,

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const state = engine.state;
            const config = engine.config;
            const waveColor = config.waveColor || '#00ff88';

            const freqData = data.freq;

            // Compute bass energy
            let bass = 0;
            const bassRange = Math.min(24, freqData.length);
            for (let i = 0; i < bassRange; i++) bass += freqData[i];
            bass = bass / bassRange / 255;

            // Compute mid energy for particles
            let mid = 0;
            const midStart = Math.floor(freqData.length * 0.1);
            const midEnd = Math.floor(freqData.length * 0.35);
            for (let i = midStart; i < midEnd; i++) mid += freqData[i];
            mid = mid / (midEnd - midStart) / 255;

            // Compute treble energy for overall intensity
            let treble = 0;
            const trebStart = Math.floor(freqData.length * 0.35);
            const trebEnd = freqData.length;
            for (let i = trebStart; i < trebEnd; i++) treble += freqData[i];
            treble = treble / (trebEnd - trebStart) / 255;

            // Time reference (seconds) — switches to export timeline during fast export
            const t = engine.nowSec();
            const dt = state.lastLogoT ? Math.min(Math.abs(t - state.lastLogoT), 0.1) : 0.016;
            state.lastLogoT = t;

            // ---------- Audio-reactive intensity (drives animation speed) ----------
            const rawIntensity = Math.min(1, bass * 0.55 + mid * 0.3 + treble * 0.25);
            if (state.logoIntensity === undefined) state.logoIntensity = 0;
            const intensitySmoothing = 1 - Math.pow(0.5, dt / 0.18); // ~180ms half-life
            state.logoIntensity += (rawIntensity - state.logoIntensity) * intensitySmoothing;
            const intensity = state.logoIntensity;

            // ---------- Robust beat-spike detector (works for entire track) ----------
            if (state.bassFloorEMA === undefined) state.bassFloorEMA = bass;
            state.bassFloorEMA += (bass - state.bassFloorEMA) * (1 - Math.pow(0.5, dt / 6.0));
            if (state.bassEnvelope === undefined) state.bassEnvelope = bass;
            if (bass > state.bassEnvelope) {
                state.bassEnvelope = bass;
            } else {
                state.bassEnvelope *= Math.pow(0.5, dt / 0.35);
            }
            if (state.lastBass === undefined) state.lastBass = bass;
            const bassDelta = Math.max(0, bass - state.lastBass);
            state.lastBass = bass;

            const aboveFloor = Math.max(0, bass - state.bassFloorEMA - 0.05);
            const flux = bassDelta * 2.2;
            const bassSpike = Math.max(aboveFloor * 0.6, flux);

            if (bassSpike > 0.035 && config.logoShakeIntensity > 0) {
                state.shakeTrauma = Math.min(1.0, state.shakeTrauma + bassSpike * 4.0);
            }
            state.shakeTrauma = Math.max(0, state.shakeTrauma * Math.pow(0.5, dt / 0.45));
            const trauma2 = state.shakeTrauma * state.shakeTrauma;
            const continuousShake = bass * bass * config.logoShakeIntensity * 0.18;
            const totalShake = trauma2 * config.logoShakeIntensity + continuousShake;

            const shakeFreqMul = 1 + intensity * 0.6;
            if (state.shakePhaseX === undefined) { state.shakePhaseX = 0; state.shakePhaseY = 2.3; }
            state.shakePhaseX += dt * 9.7 * shakeFreqMul;
            state.shakePhaseY += dt * 8.1 * shakeFreqMul;
            state.shakeX = Math.sin(state.shakePhaseX) * totalShake;
            state.shakeY = Math.sin(state.shakePhaseY) * totalShake * 0.55;

            // ---------- Drone camera with intensity-driven speed ----------
            if (state.dronePhaseX === undefined) {
                state.dronePhaseX = 0;
                state.dronePhaseY = 0;
                state.dronePhaseZoom = 0;
                state.dronePhaseSkew = 0;
            }
            const droneSpeed = 1 + intensity * 1.4;
            state.dronePhaseX    += dt * 0.09 * droneSpeed;
            state.dronePhaseY    += dt * 0.07 * droneSpeed;
            state.dronePhaseZoom += dt * 0.13 * (1 + intensity * 1.6);
            state.dronePhaseSkew += dt * 0.11 * droneSpeed;

            const zoomAmp = 0.022 + intensity * 0.018;
            const droneZoom = 1.0 + zoomAmp * Math.sin(state.dronePhaseZoom) + bass * (0.012 + intensity * 0.018);
            const panAmpX = w * (0.018 + intensity * 0.014);
            const panAmpY = h * (0.010 + intensity * 0.012);
            const dronePanX = Math.sin(state.dronePhaseX) * panAmpX;
            const dronePanY = Math.cos(state.dronePhaseY) * panAmpY;
            const droneSkewX = Math.sin(state.dronePhaseSkew) * (0.012 + intensity * 0.012);

            // Clear background
            ctx.fillStyle = '#050510';
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            // Apply drone transform first (outermost), then shake on top
            ctx.translate(cx + dronePanX + state.shakeX, cy + dronePanY + state.shakeY);
            ctx.scale(droneZoom, droneZoom);
            ctx.transform(1, 0, droneSkewX, 1, 0, 0);
            ctx.translate(-cx, -cy);

            // Draw background image
            if (state.bgImg) {
                const scaleX = w / state.bgImg.width;
                const scaleY = h / state.bgImg.height;
                const scale = Math.max(scaleX, scaleY);
                const bw = state.bgImg.width * scale;
                const bh = state.bgImg.height * scale;
                ctx.globalAlpha = 0.75;
                ctx.drawImage(state.bgImg, (w - bw) / 2, (h - bh) / 2, bw, bh);
                ctx.globalAlpha = 1;
                // Dark vignette overlay
                const vignette = ctx.createRadialGradient(cx, cy, w * 0.15, cx, cy, w * 0.7);
                vignette.addColorStop(0, 'rgba(0,0,0,0.1)');
                vignette.addColorStop(1, 'rgba(0,0,0,0.72)');
                ctx.fillStyle = vignette;
                ctx.fillRect(0, 0, w, h);
            }

            const logoRadius = Math.min(w, h) * 0.165;
            const numBars = config.logoRayCount;
            const angleStep = (Math.PI * 2) / numBars;
            const innerRadius = logoRadius + 12;
            const maxBarLen = logoRadius * 1.4;
            const lineThick = config.logoLineThickness;
            const glowSize = config.logoGlowSize;

            // Rotating offset for ring animation — speeds up with intensity
            if (config.logoRotateRing) {
                const ringSpeed = (isBeat ? 0.04 : 0.006) * (1 + intensity * 3.5);
                state.logoAngle += ringSpeed;
            }

            // Particle motion multiplier — both bass kicks AND overall intensity
            const particleSpeed = 1 + bass * 4 + intensity * 2.5;

            // Draw particles beneath
            if (config.logoParticles) {
                ctx.globalCompositeOperation = 'lighter';
                engine.particles.forEach((p, pIdx) => {
                    p.x += p.vx * particleSpeed;
                    p.y += p.vy * particleSpeed;
                    if (p.x < 0) p.x = w;
                    if (p.x > w) p.x = 0;
                    if (p.y < 0) p.y = h;
                    if (p.y > h) p.y = 0;

                    const freqIdx = Math.floor((pIdx / engine.particles.length) * freqData.length * 0.5);
                    const freqVal = freqData[freqIdx] / 255;
                    const r = Math.max(p.size * (0.4 + freqVal * config.sensitivity * 1.8), 0.5);

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                    ctx.fillStyle = waveColor;
                    ctx.globalAlpha = 0.15 + freqVal * 0.45 + intensity * 0.15;
                    ctx.fill();
                });
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = 'source-over';
            }

            // Translate to center for radial drawing
            ctx.save();
            ctx.translate(cx, cy);

            // Outer diffuse glow ring
            const glowGrad = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, innerRadius + maxBarLen * 0.7);
            const hexToRgb = (hex) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `${r},${g},${b}`;
            };
            const rgb = hexToRgb(waveColor.length === 7 ? waveColor : '#00ff88');
            glowGrad.addColorStop(0, `rgba(${rgb},${0.15 + bass * 0.2 + intensity * 0.18})`);
            glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(0, 0, innerRadius + maxBarLen * 0.7, 0, Math.PI * 2);
            ctx.fill();

            // Draw radial audio bars
            ctx.shadowBlur = glowSize;
            ctx.shadowColor = waveColor;
            ctx.lineCap = 'round';

            for (let i = 0; i < numBars; i++) {
                const freqIdx = Math.floor((i / numBars) * freqData.length * 0.55);
                const val = (freqData[freqIdx] / 255) * config.sensitivity;
                const barLen = val * maxBarLen;
                const angle = i * angleStep + state.logoAngle - Math.PI / 2;

                const x1 = Math.cos(angle) * innerRadius;
                const y1 = Math.sin(angle) * innerRadius;
                const x2 = Math.cos(angle) * (innerRadius + barLen);
                const y2 = Math.sin(angle) * (innerRadius + barLen);

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = waveColor;
                ctx.lineWidth = lineThick + (isBeat ? 1.5 : 0);
                ctx.globalAlpha = 0.55 + val * 0.45;
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            // Pulsing glow ring
            const beatPulse = isBeat ? 1.06 + bass * 0.08 : 1.0 + bass * 0.04;
            ctx.beginPath();
            ctx.arc(0, 0, logoRadius * beatPulse, 0, Math.PI * 2);
            ctx.strokeStyle = waveColor;
            ctx.lineWidth = isBeat ? 3.5 : 2;
            ctx.shadowBlur = isBeat ? glowSize * 1.5 : glowSize * 0.6;
            ctx.shadowColor = waveColor;
            ctx.globalAlpha = 0.85;
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            // Second inner ring
            ctx.beginPath();
            ctx.arc(0, 0, logoRadius * 0.82, 0, Math.PI * 2);
            ctx.strokeStyle = waveColor;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.35 + mid * 0.35;
            ctx.stroke();
            ctx.globalAlpha = 1;

            // Clip circle for logo image
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, logoRadius - 2, 0, Math.PI * 2);
            ctx.clip();

            if (state.logoImg) {
                const s = Math.max(
                    (logoRadius * 2) / state.logoImg.width,
                    (logoRadius * 2) / state.logoImg.height
                );
                const lw = state.logoImg.width * s;
                const lh = state.logoImg.height * s;
                ctx.drawImage(state.logoImg, -lw / 2, -lh / 2, lw, lh);
            } else {
                // Default dark circle with "W" placeholder
                const innerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, logoRadius);
                innerGrad.addColorStop(0, '#1a1a2e');
                innerGrad.addColorStop(1, '#06060f');
                ctx.fillStyle = innerGrad;
                ctx.fillRect(-logoRadius, -logoRadius, logoRadius * 2, logoRadius * 2);

                ctx.fillStyle = waveColor;
                ctx.shadowBlur = 18;
                ctx.shadowColor = waveColor;
                ctx.font = `bold ${Math.round(logoRadius * 0.62)}px 'Space Grotesk', sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('W', 0, 0);
                ctx.shadowBlur = 0;
            }
            ctx.restore();

            ctx.restore();
            ctx.restore();
        }
    };
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});