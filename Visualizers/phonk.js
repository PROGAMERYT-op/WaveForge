/*
 * WaveForge — Hardtekk / Phonk Viral Edit Mode (mode 12)
 * Features:
 *  - Pre-drop AirPods / Volume Capsule charge-up intro (0s - 3.5s configurable)
 *  - Symmetrical liquid neon plasma ring with blazing white core & horn peaks
 *  - Inner triangular bass teeth & radial hyperspace streak sparks
 *  - Hardtekk kick-drum zoom-blur echo & procedural dark anime/mage/cyber silhouettes
 *  - Resolution-independent scaling (720p / 1080p / 1440p / 4K export parity)
 */
(function (registry) {
    'use strict';

    // Procedural dark background artwork generator when user hasn't uploaded a custom bgImg
    function drawProceduralBackdrop(ctx, w, h, cx, cy, theme, color, bass, isBeat, t) {
        if (theme === 'none') {
            const minimalGrad = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.04, cx, cy, Math.max(w, h) * 0.75);
            minimalGrad.addColorStop(0, color + (isBeat ? '38' : '22'));
            minimalGrad.addColorStop(0.55, '#050510');
            minimalGrad.addColorStop(1, '#020206');
            ctx.fillStyle = minimalGrad;
            ctx.fillRect(0, 0, w, h);
            return;
        }

        // Deep dark atmospheric radial glow
        const bgGrad = ctx.createRadialGradient(cx, cy * 0.82, Math.min(w, h) * 0.05, cx, cy, Math.max(w, h) * 0.78);
        bgGrad.addColorStop(0, color + (isBeat ? '55' : '3d'));
        bgGrad.addColorStop(0.48, color + '18');
        bgGrad.addColorStop(1, '#020208');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        const s = Math.min(w, h);

        if (theme === 'cyber') {
            // Neon Cyber Horizon Grid backdrop
            const horY = cy + s * 0.12;
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = Math.max(1, s * 0.0025);
            for (let i = -12; i <= 12; i++) {
                ctx.globalAlpha = Math.max(0.08, 0.38 - Math.abs(i) * 0.025);
                ctx.beginPath();
                ctx.moveTo(cx + i * s * 0.02, horY);
                ctx.lineTo(cx + i * s * 0.18, h);
                ctx.stroke();
            }
            const scroll = ((t || 0) * (0.6 + bass * 1.2)) % 1;
            for (let j = 0; j < 10; j++) {
                const p = (j + scroll) / 10;
                const y = horY + Math.pow(p, 2.1) * (h - horY);
                ctx.globalAlpha = p * (0.35 + bass * 0.35);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
            ctx.restore();
            return;
        }

        ctx.save();
        ctx.translate(cx, cy * 0.78);

        // Arcane sacred halo circle behind figure
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.16 + bass * 0.18;
        ctx.lineWidth = Math.max(1.5, s * 0.004);
        ctx.beginPath();
        ctx.arc(0, -s * 0.12, s * 0.34, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -s * 0.12, s * 0.28, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair / rune spokes on arcane halo
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2 + (t || 0) * 0.08;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * s * 0.26, -s * 0.12 + Math.sin(a) * s * 0.26);
            ctx.lineTo(Math.cos(a) * s * 0.36, -s * 0.12 + Math.sin(a) * s * 0.36);
            ctx.stroke();
        }

        // Staff on left side (for mage/samurai vibe)
        if (theme !== 'drift') {
            ctx.strokeStyle = '#05050f';
            ctx.lineWidth = Math.max(4, s * 0.014);
            ctx.globalAlpha = 0.88;
            ctx.beginPath();
            ctx.moveTo(-s * 0.24, -s * 0.38);
            ctx.lineTo(-s * 0.20, s * 0.55);
            ctx.stroke();

            // Glowing staff finial
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.45 + bass * 0.4;
            ctx.beginPath();
            ctx.arc(-s * 0.24, -s * 0.38, s * 0.045, 0, Math.PI * 2);
            ctx.fill();
        }

        // Dark hooded cloak / shoulders silhouette
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = '#04030a';
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.36); // Top of hood
        ctx.quadraticCurveTo(s * 0.11, -s * 0.32, s * 0.12, -s * 0.16);
        ctx.quadraticCurveTo(s * 0.28, -s * 0.08, s * 0.38, s * 0.52);
        ctx.lineTo(-s * 0.38, s * 0.52);
        ctx.quadraticCurveTo(-s * 0.28, -s * 0.08, -s * 0.12, -s * 0.16);
        ctx.quadraticCurveTo(-s * 0.11, -s * 0.32, 0, -s * 0.36);
        ctx.closePath();
        ctx.fill();

        // Subtle rim-light on hood and shoulders
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.35 + bass * 0.35;
        ctx.lineWidth = Math.max(1.5, s * 0.004);
        ctx.stroke();

        // Glowing eyes inside the hood
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = Math.round(14 * (s / 500));
        ctx.shadowColor = color;
        ctx.globalAlpha = 0.85 + bass * 0.15;
        // Left eye slit
        ctx.beginPath();
        ctx.moveTo(-s * 0.042, -s * 0.22);
        ctx.lineTo(-s * 0.015, -s * 0.212);
        ctx.lineTo(-s * 0.032, -s * 0.205);
        ctx.closePath();
        ctx.fill();
        // Right eye slit
        ctx.beginPath();
        ctx.moveTo(s * 0.042, -s * 0.22);
        ctx.lineTo(s * 0.015, -s * 0.212);
        ctx.lineTo(s * 0.032, -s * 0.205);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    // Pre-Drop Headphone / AirPods Volume Charge-Up Intro (00:00 - 00:03.5)
    function renderHeadphoneIntro(ctx, w, h, cx, cy, progress, waveColor, bass, resScale) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);

        const s = Math.min(w, h);
        const pillW = s * 0.19;
        const pillH = s * 0.44;
        const pillX = cx - pillW / 2;
        const pillY = cy - pillH / 2;
        const radius = pillW * 0.36;

        // Deterministic / smooth camera jitter as volume approaches 100%
        const shake = Math.pow(progress, 3) * 6 * resScale;
        const jx = Math.sin(progress * 95) * shake;
        const jy = Math.cos(progress * 83) * shake;

        ctx.save();
        ctx.translate(jx, jy);

        // Ambient blue/violet bloom behind the volume capsule
        const bloom = ctx.createRadialGradient(cx, cy + pillH * (0.25 - progress * 0.4), pillW * 0.1, cx, cy, pillH * 0.95);
        bloom.addColorStop(0, waveColor + '66');
        bloom.addColorStop(0.45, '#3b82f633');
        bloom.addColorStop(1, 'transparent');
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, w, h);

        // 1. Dark outer rounded volume track
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(pillX, pillY, pillW, pillH, radius);
        } else {
            ctx.rect(pillX, pillY, pillW, pillH);
        }
        ctx.fillStyle = '#0c1022';
        ctx.fill();
        ctx.clip();

        // 2. Glowing white/neon rising fill bar inside the capsule
        const fillRatio = Math.min(1, 0.18 + progress * 0.82);
        const fillH = pillH * fillRatio;
        const fillY = pillY + pillH - fillH;

        ctx.shadowBlur = Math.round(30 * resScale);
        ctx.shadowColor = '#60a5fa';
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(pillX, fillY, pillW, fillH);
        ctx.restore();

        // Subtle outer border on volume capsule
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(pillX, pillY, pillW, pillH, radius);
        } else {
            ctx.rect(pillX, pillY, pillW, pillH);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = Math.max(1.5, 2 * resScale);
        ctx.stroke();
        ctx.restore();

        // 3. Left & Right Wireless Earbuds (AirPods silhouette) drifting outward
        const spreadX = pillW * (0.85 + Math.pow(progress, 2.2) * 0.95);
        const budScale = s * 0.0011;

        const drawEarbud = (x, y, flipX) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(flipX ? -budScale : budScale, budScale);
            ctx.fillStyle = '#f8fafc';
            ctx.shadowBlur = Math.round(18 * resScale);
            ctx.shadowColor = '#60a5fa';

            // Stem
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(-8, 0, 14, 58, 7);
            else ctx.rect(-8, 0, 14, 58);
            ctx.fill();

            // Earbud head
            ctx.beginPath();
            ctx.ellipse(10, -6, 24, 19, 0.15, 0, Math.PI * 2);
            ctx.fill();

            // Dark speaker mesh cutout
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#05070f';
            ctx.beginPath();
            ctx.ellipse(18, -6, 4, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(-3, 18, 4, 14);
            ctx.restore();
        };

        const leftBudY = cy - pillH * 0.08 + Math.sin(progress * Math.PI * 2) * (s * 0.04);
        const rightBudY = cy + pillH * 0.06 - Math.sin(progress * Math.PI * 2) * (s * 0.04);
        drawEarbud(cx - spreadX, leftBudY, false);
        drawEarbud(cx + spreadX, rightBudY, true);

        // 4. Grunge dust / static specks around the volume pill
        ctx.fillStyle = '#e2e8f0';
        for (let i = 0; i < 28; i++) {
            const seed = (i * 97.3) % 1;
            const ang = i * 2.4 + progress * 3;
            const dist = pillW * (0.55 + seed * 1.15);
            const sx = cx + Math.cos(ang) * dist;
            const sy = cy + Math.sin(ang * 1.3) * (pillH * 0.58);
            const sz = (1.2 + (i % 3) * 1.3) * resScale;
            ctx.globalAlpha = 0.25 + (seed * 0.6) * progress;
            ctx.fillRect(sx, sy, sz, sz);
        }

        ctx.globalAlpha = 1;
        ctx.restore();
    }

    registry[12] = {
        name: 'Hardtekk Phonk',
        icon: '😈',
        desc: 'Viral TikTok Phonk/Hardtekk liquid neon ring, AirPods intro & bass zoom-blur.',
        newBadge: true,
        ownBackground: true,

        render(engine, ctx, w, h, cx, cy, data, isBeat) {
            const state = engine.state;
            const config = engine.config;
            const waveColor = config.waveColor || '#a855f7';
            const freqData = data.freq;
            const t = engine.nowSec();

            // Active frame dimension so 9:16 preview on desktop matches 9:16 export proportions
            const effectiveMinDim = engine.getActiveMinDim ? engine.getActiveMinDim(w, h) : Math.min(w, h);
            const resScale = Math.max(0.55, effectiveMinDim / 480);
            const bloomMul = (typeof config.bloomIntensity === 'number' ? config.bloomIntensity : 60) / 60;

            // Check if Pre-Drop Headphone Volume Intro is enabled and active
            const introDur = typeof config.phonkIntroDuration === 'number' ? config.phonkIntroDuration : 0;
            const songTime = getTrackSongTime(engine, introDur);
            if (config.phonkIntroEnabled && introDur > 0 && songTime >= 0 && songTime < introDur) {
                let bassNow = 0;
                for (let i = 0; i < 16; i++) bassNow += freqData[i];
                bassNow = (bassNow / 16) / 255;
                renderHeadphoneIntro(ctx, w, h, cx, cy, songTime / introDur, waveColor, bassNow, resScale);
                return;
            }

            // Compute sub-bass and mid energy
            let bass = 0;
            const bassRange = Math.min(20, freqData.length);
            for (let i = 0; i < bassRange; i++) bass += freqData[i];
            bass = (bass / bassRange) / 255;

            let mid = 0;
            const midEnd = Math.min(80, freqData.length);
            for (let i = 20; i < midEnd; i++) mid += freqData[i];
            mid = midEnd > 20 ? (mid / (midEnd - 20)) / 255 : 0;

            // Subtle idle breathing pulse when audio is not playing yet
            const isIdle = !state.isPlaying && state.exportTime === null;
            if (isIdle && bass < 0.02) {
                bass = 0.08 + Math.pow(Math.max(0, Math.sin(t * 3.2)), 4) * 0.14;
            }

            const dt = state.lastPhonkT ? Math.min(Math.abs(t - state.lastPhonkT), 0.1) : 0.016;
            state.lastPhonkT = t;

            // Smooth kick-drum impact envelope — driven by Predictive Lookahead Choreographer when available
            if (state.phonkKickEnv === undefined) state.phonkKickEnv = 0;
            if (state.hasPredictiveMap && state.isPlaying) {
                const predKick = Math.min(1.15, (state.predShake || 0) * 1.15 + (state.predFlash || 0) * 0.45);
                state.phonkKickEnv = Math.max(predKick, state.phonkKickEnv * Math.pow(0.5, dt / 0.10));
            } else if (isBeat || bass > 0.62) {
                state.phonkKickEnv = Math.min(1, Math.max(state.phonkKickEnv, bass * 1.25));
            } else {
                state.phonkKickEnv *= Math.pow(0.5, dt / 0.12);
            }
            const kickEnv = Math.min(1.15, state.phonkKickEnv);
            const buildupTension = (state.hasPredictiveMap && state.isPlaying) ? (state.predBuildup || 0) : 0;

            // Optional Orbital Ring Rotation (shared with Logo & Phonk settings)
            if (config.logoRotateRing) {
                state.logoAngle = (state.logoAngle || 0) + dt * (0.45 + bass * 1.6 + kickEnv * 1.2);
            } else {
                state.logoAngle = 0;
            }
            const rotOffset = state.logoAngle || 0;

            // Directional camera shake + kick zoom punch (scaled by resolution!)
            const shakeSetting = typeof config.logoShakeIntensity === 'number' ? config.logoShakeIntensity : 16;
            const shakeAmp = shakeSetting * kickEnv * kickEnv * 1.35 * resScale;
            const shakeX = Math.sin(t * 42) * shakeAmp;
            const shakeY = Math.cos(t * 37) * shakeAmp * 0.7;
            const zoomPunch = 1.0 + kickEnv * 0.105 + buildupTension * 0.045 + Math.sin(t * 1.4) * 0.015;

            ctx.fillStyle = '#020208';
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.translate(cx + shakeX, cy + shakeY);
            ctx.scale(zoomPunch, zoomPunch);
            ctx.translate(-cx, -cy);

            // 1. Background Artwork (Uploaded MP4 Video Loop OR Image OR Procedural Backdrop)
            const bgMedia = (state.bgVideo && state.bgVideo.readyState >= 2 && state.bgVideo.videoWidth > 0)
                ? state.bgVideo
                : state.bgImg;
            if (bgMedia) {
                const mw = bgMedia.videoWidth || bgMedia.width || 1;
                const mh = bgMedia.videoHeight || bgMedia.height || 1;
                const scale = Math.max(w / mw, h / mh);
                const bw = mw * scale;
                const bh = mh * scale;
                const baseOp = ((typeof config.bgOpacity === 'number' ? config.bgOpacity : 80) / 100);
                ctx.globalAlpha = Math.min(1, baseOp * (0.88 + kickEnv * 0.18));
                ctx.drawImage(bgMedia, (w - bw) / 2, (h - bh) / 2, bw, bh);
                ctx.globalAlpha = 1;

                // Color tint + dark vignette over uploaded background
                const vig = ctx.createRadialGradient(cx, cy, effectiveMinDim * 0.12, cx, cy, Math.max(w, h) * 0.68);
                vig.addColorStop(0, waveColor + '22');
                vig.addColorStop(1, 'rgba(2, 2, 10, 0.82)');
                ctx.fillStyle = vig;
                ctx.fillRect(0, 0, w, h);
            } else {
                drawProceduralBackdrop(ctx, w, h, cx, cy, config.phonkBgTheme || 'mage', waveColor, bass, isBeat, t);
            }

            // 2. Radial Hyperspace Streak Sparks (shooting outward from center)
            if (config.logoParticles !== false) {
                if (!state.phonkSparks || state.phonkSparks.length !== 90) {
                    state.phonkSparks = [];
                    for (let i = 0; i < 90; i++) {
                        state.phonkSparks.push({
                            angle: Math.random() * Math.PI * 2,
                            dist: Math.random(),
                            speed: 0.22 + Math.random() * 0.45,
                            len: 6 + Math.random() * 14
                        });
                    }
                }
                const maxSparkDist = Math.hypot(cx, cy);
                const minSparkDist = effectiveMinDim * 0.14;
                const sparkSpeedMul = 0.45 + bass * 2.6 + kickEnv * 1.8;

                ctx.save();
                ctx.translate(cx, cy);
                ctx.strokeStyle = '#ffffff';
                ctx.lineCap = 'round';

                for (let i = 0; i < state.phonkSparks.length; i++) {
                    const sp = state.phonkSparks[i];
                    sp.dist += sp.speed * sparkSpeedMul * dt;
                    if (sp.dist > 1) {
                        sp.dist = 0.05 + Math.random() * 0.12;
                        sp.angle = Math.random() * Math.PI * 2;
                    }
                    const r1 = minSparkDist + sp.dist * (maxSparkDist - minSparkDist);
                    const streakLen = sp.len * resScale * (0.6 + sp.dist * 1.4 + kickEnv * 1.5);
                    const r2 = r1 + streakLen;
                    const ca = Math.cos(sp.angle);
                    const sa = Math.sin(sp.angle);

                    ctx.globalAlpha = Math.min(0.9, sp.dist * (0.55 + bass * 0.45));
                    ctx.lineWidth = (1.2 + sp.dist * 1.4) * resScale;
                    ctx.beginPath();
                    ctx.moveTo(ca * r1, sa * r1);
                    ctx.lineTo(ca * r2, sa * r2);
                    ctx.stroke();
                }
                ctx.restore();
            }

            // 3. Liquid Neon Plasma Ring + Hardtekk Zoom-Blur Echo Layers
            const baseR = effectiveMinDim * 0.185;
            const sens = config.sensitivity;
            const thickMul = (typeof config.logoLineThickness === 'number' ? config.logoLineThickness : 2) / 2;
            const baseGlow = (typeof config.logoGlowSize === 'number' ? config.logoGlowSize : 40) * resScale * Math.max(0.25, bloomMul);

            ctx.save();
            ctx.translate(cx, cy);

            // Build mirror-symmetrical liquid wave points around circle
            const rawRayCount = typeof config.logoRayCount === 'number' ? config.logoRayCount : 128;
            const ptsCount = Math.max(32, Math.min(128, Math.round(rawRayCount / 2 / 2) * 2));
            const halfPts = ptsCount / 2;
            const buildRingPoints = (scaleMul, phaseShift) => {
                const arr = [];
                for (let i = 0; i < ptsCount; i++) {
                    const symIdx = i <= halfPts ? i : ptsCount - i;
                    const norm = symIdx / halfPts;

                    const binIdx = Math.floor(norm * (freqData.length * 0.36));
                    let rawVal = (freqData[binIdx] / 255) * sens;
                    if (isIdle && rawVal < 0.05) {
                        rawVal = (0.12 + 0.08 * Math.sin(norm * Math.PI * 4 + t * 3)) * sens * 0.5;
                    }

                    const hornBoost = norm < 0.28
                        ? Math.sin((norm / 0.28) * Math.PI) * (0.55 + bass * 1.15)
                        : Math.sin(norm * Math.PI * 3 + t * 4 + phaseShift) * 0.18;

                    const displacement = Math.max(0, (rawVal * 0.58 + hornBoost * rawVal * 0.65) * baseR * scaleMul);
                    const angle = (i / ptsCount) * Math.PI * 2 - Math.PI / 2 + rotOffset;
                    const r = baseR * scaleMul + displacement;
                    arr.push({
                        x: Math.cos(angle) * r,
                        y: Math.sin(angle) * r,
                        r,
                        angle,
                        val: rawVal
                    });
                }
                return arr;
            };

            const drawSmoothClosedLoop = (pts) => {
                const len = pts.length;
                ctx.beginPath();
                const startMidX = (pts[len - 1].x + pts[0].x) / 2;
                const startMidY = (pts[len - 1].y + pts[0].y) / 2;
                ctx.moveTo(startMidX, startMidY);
                for (let i = 0; i < len; i++) {
                    const curr = pts[i];
                    const next = pts[(i + 1) % len];
                    const midX = (curr.x + next.x) / 2;
                    const midY = (curr.y + next.y) / 2;
                    ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
                }
                ctx.closePath();
            };

            // 3A. Hardtekk Kick-Drum Zoom-Blur Ghost Echoes
            const echoCount = kickEnv > 0.22 ? 3 : 1;
            for (let e = echoCount; e >= 1; e--) {
                const echoScale = 1 + (e / echoCount) * kickEnv * 0.24;
                const echoPts = buildRingPoints(echoScale, e * 0.4);
                drawSmoothClosedLoop(echoPts);
                ctx.strokeStyle = waveColor;
                ctx.lineWidth = (4 + kickEnv * 5) * (1 - e * 0.2) * resScale * thickMul;
                ctx.globalAlpha = (0.18 + kickEnv * 0.22) / e;
                ctx.stroke();
            }

            // 3B. Secondary Outer Harmonic Plasma Wave
            const outerPts = buildRingPoints(1.06, 1.3);
            drawSmoothClosedLoop(outerPts);
            ctx.strokeStyle = waveColor;
            ctx.lineWidth = 5.5 * resScale * thickMul;
            ctx.globalAlpha = 0.65;
            ctx.shadowBlur = baseGlow;
            ctx.shadowColor = waveColor;
            ctx.stroke();

            // 3C. Primary Liquid Plasma Wave (Thick Neon Outer + Blazing White Inner Core)
            const mainPts = buildRingPoints(1.0, 0);
            drawSmoothClosedLoop(mainPts);
            ctx.strokeStyle = waveColor;
            ctx.lineWidth = (8.5 + bass * 4) * resScale * thickMul;
            ctx.globalAlpha = 0.95;
            ctx.shadowBlur = baseGlow * 1.2;
            ctx.shadowColor = waveColor;
            ctx.stroke();

            // Blazing white inner core stroke
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = (2.8 + bass * 1.5) * resScale * Math.max(0.75, thickMul * 0.85);
            ctx.globalAlpha = 0.98;
            ctx.shadowBlur = 12 * resScale * Math.max(0.3, bloomMul);
            ctx.shadowColor = '#ffffff';
            ctx.stroke();

            // 3D. Inner Triangular Bass Spikes (pointing outward along the ring perimeter)
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 10 * resScale * Math.max(0.3, bloomMul);
            ctx.shadowColor = waveColor;
            const teethCount = 12;
            for (let k = 0; k < teethCount; k++) {
                const a = (k / teethCount) * Math.PI * 2 + t * 0.3 + rotOffset;
                const fVal = (freqData[(k * 5) % Math.max(1, Math.min(60, freqData.length))] / 255) * sens;
                if (fVal < 0.35) continue;
                const toothBaseR = baseR * 0.98;
                const toothTipR = toothBaseR + (8 + fVal * 14) * resScale;
                const spread = 0.045;
                ctx.beginPath();
                ctx.moveTo(Math.cos(a - spread) * toothBaseR, Math.sin(a - spread) * toothBaseR);
                ctx.lineTo(Math.cos(a) * toothTipR, Math.sin(a) * toothTipR);
                ctx.lineTo(Math.cos(a + spread) * toothBaseR, Math.sin(a + spread) * toothBaseR);
                ctx.closePath();
                ctx.globalAlpha = Math.min(0.95, fVal * 0.75);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;

            // 4. Center Circular Emblem / Logo Disc
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, baseR * 0.94, 0, Math.PI * 2);
            ctx.clip();

            if (state.logoImg) {
                const s = Math.max(
                    (baseR * 1.9) / state.logoImg.width,
                    (baseR * 1.9) / state.logoImg.height
                );
                const lw = state.logoImg.width * s;
                const lh = state.logoImg.height * s;
                ctx.drawImage(state.logoImg, -lw / 2, -lh / 2, lw, lh);
            } else {
                // Dark glossy emblem with Crown + Monogram
                const discGrad = ctx.createRadialGradient(0, -baseR * 0.2, baseR * 0.05, 0, 0, baseR);
                discGrad.addColorStop(0, '#160d2e');
                discGrad.addColorStop(0.7, '#06040e');
                discGrad.addColorStop(1, '#020106');
                ctx.fillStyle = discGrad;
                ctx.fillRect(-baseR, -baseR, baseR * 2, baseR * 2);

                // Subtle neon slash flash inside disc on beat
                ctx.fillStyle = waveColor;
                ctx.globalAlpha = 0.25 + kickEnv * 0.45;
                ctx.beginPath();
                ctx.arc(0, baseR * 0.15, baseR * (0.42 + kickEnv * 0.18), 0, Math.PI * 2);
                ctx.fill();

                // Crown + Shield Crest icon in center
                ctx.globalAlpha = 0.92;
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 16 * resScale;
                ctx.shadowColor = waveColor;
                const cr = baseR * 0.34;
                // Crown above shield
                ctx.beginPath();
                ctx.moveTo(-cr * 0.75, -cr * 0.45);
                ctx.lineTo(-cr * 0.9, -cr * 0.95);
                ctx.lineTo(-cr * 0.35, -cr * 0.65);
                ctx.lineTo(0, -cr * 1.05);
                ctx.lineTo(cr * 0.35, -cr * 0.65);
                ctx.lineTo(cr * 0.9, -cr * 0.95);
                ctx.lineTo(cr * 0.75, -cr * 0.45);
                ctx.closePath();
                ctx.fill();

                // Geometric monogram bars
                ctx.fillRect(-cr * 0.7, -cr * 0.28, cr * 0.6, cr * 1.15);
                ctx.fillRect(cr * 0.1, -cr * 0.28, cr * 0.6, cr * 0.85);
                ctx.fillStyle = '#070410';
                ctx.shadowBlur = 0;
                ctx.fillRect(-cr * 0.48, -cr * 0.06, cr * 0.22, cr * 0.35);
                ctx.fillRect(cr * 0.3, -cr * 0.06, cr * 0.22, cr * 0.35);
            }
            ctx.restore();

            // Crisp neon inner rim ring around the logo disc
            ctx.beginPath();
            ctx.arc(0, 0, baseR * 0.94, 0, Math.PI * 2);
            ctx.strokeStyle = waveColor;
            ctx.lineWidth = 2.5 * resScale;
            ctx.globalAlpha = 0.85;
            ctx.stroke();

            ctx.restore();
            ctx.restore();
        }
    };

    function getTrackSongTime(engine, introDur) {
        if (engine.state && engine.state.exportTime !== null && engine.state.exportTime !== undefined) {
            return engine.state.exportTime;
        }
        const el = window.__wfAudioElement;
        if (el && el.src && el.src !== window.location.href) {
            // When audio is loaded, always use its true playhead position (even when paused)
            return el.currentTime || 0;
        }
        // When no track is loaded yet (initial studio idle state), show the main Phonk ring rather than the black intro screen
        return (introDur || 3.5) + 1;
    }
})(window.WaveForgeVisualizers = window.WaveForgeVisualizers || {});
