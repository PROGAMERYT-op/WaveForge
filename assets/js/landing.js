(function () {
    'use strict';

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('wf-theme', next); } catch (e) {}
        });
    }

    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const open = mobileMenu.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
        });
        mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        }));
    }

    const canvas = document.getElementById('heroPreviewCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let previewMode = 'ring';
        let previewPalette = 'synthwave';

        const PALETTES = {
            synthwave: ['#a855f7', '#00f5d4', '#ff2a85', '#ffffff'],
            cyberpunk: ['#00f2ff', '#ff0099', '#ffffff', '#7b2dff'],
            fire: ['#ff0055', '#ff6600', '#ffaa00', '#ffffff'],
            matrix: ['#00ff88', '#00c4ff', '#66ffaa', '#ffffff']
        };

        document.querySelectorAll('[data-p-mode]').forEach((btn) => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-p-mode]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                previewMode = btn.getAttribute('data-p-mode');
            });
        });

        document.querySelectorAll('[data-p-pal]').forEach((btn) => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-p-pal]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                previewPalette = btn.getAttribute('data-p-pal');
            });
        });

        function renderPreview() {
            requestAnimationFrame(renderPreview);
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;
            const t = performance.now() * 0.001;
            const pal = PALETTES[previewPalette] || PALETTES.synthwave;
            const beat = Math.pow(Math.max(0, Math.sin(t * 4.2)), 6);

            ctx.fillStyle = 'rgba(5, 7, 17, 0.32)';
            ctx.fillRect(0, 0, w, h);

            if (previewMode === 'ring') {
                const baseR = Math.min(cx, cy) * (0.42 + beat * 0.08);
                ctx.save();
                ctx.translate(cx, cy);

                // Radial sparks
                ctx.strokeStyle = '#ffffff';
                for (let s = 0; s < 24; s++) {
                    const a = (s / 24) * Math.PI * 2 + t * 0.2;
                    const d = ((t * 0.8 + s * 0.17) % 1) * cx * 0.9;
                    if (d > baseR) {
                        ctx.globalAlpha = 0.45;
                        ctx.beginPath();
                        ctx.moveTo(Math.cos(a) * d, Math.sin(a) * d);
                        ctx.lineTo(Math.cos(a) * (d + 12), Math.sin(a) * (d + 12));
                        ctx.stroke();
                    }
                }
                ctx.globalAlpha = 1;

                // Symmetrical Phonk liquid plasma ring
                for (let layer = 0; layer < 2; layer++) {
                    ctx.beginPath();
                    const pts = 96;
                    for (let i = 0; i <= pts; i++) {
                        const a = (i / pts) * Math.PI * 2 - Math.PI / 2;
                        const wave = Math.sin(a * 6 + t * 4 + layer) * Math.cos(a * 3 - t * 3);
                        const horn = Math.max(0, Math.cos(a)) * 28 * (0.5 + beat);
                        const r = baseR + Math.abs(wave) * 32 * (1 + beat * 0.7) + horn + layer * 8;
                        const px = Math.cos(a) * r;
                        const py = Math.sin(a) * r;
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.strokeStyle = layer === 0 ? pal[0] : '#ffffff';
                    ctx.lineWidth = layer === 0 ? 7 : 2.5;
                    ctx.shadowBlur = layer === 0 ? 24 : 10;
                    ctx.shadowColor = pal[0];
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.arc(0, 0, baseR * 0.92, 0, Math.PI * 2);
                ctx.fillStyle = '#06040e';
                ctx.fill();
                ctx.restore();
            } else if (previewMode === 'bars') {
                const count = 54;
                const bw = (w / 2) / count - 3;
                const grad = ctx.createLinearGradient(0, h, 0, 0);
                grad.addColorStop(0, pal[0]);
                grad.addColorStop(1, pal[1]);
                ctx.fillStyle = grad;

                for (let i = 0; i < count; i++) {
                    const n = Math.sin(t * 3.2 + i * 0.3) * 0.5 + 0.5;
                    const env = Math.max(0.1, (1 - i / count) * (0.45 + n * 0.55) + beat * 0.28 * (1 - i / count));
                    const bh = env * h * 0.74;
                    const xOff = i * (bw + 3);
                    ctx.fillRect(cx + xOff, cy - bh / 2, bw, bh);
                    ctx.fillRect(cx - xOff - bw, cy - bh / 2, bw, bh);
                }
            } else if (previewMode === 'tunnel') {
                ctx.save();
                ctx.translate(cx, cy);
                const rings = 14;
                const maxR = Math.hypot(cx, cy);
                for (let i = 0; i < rings; i++) {
                    const depth = ((i / rings) + t * 0.35) % 1;
                    const persp = Math.pow(depth, 2.2);
                    const r = Math.max(4, persp * maxR);
                    ctx.beginPath();
                    for (let s = 0; s <= 8; s++) {
                        const a = (s / 8) * Math.PI * 2 + t * 0.3 + depth;
                        const px = Math.cos(a) * r;
                        const py = Math.sin(a) * r;
                        if (s === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.strokeStyle = pal[i % pal.length];
                    ctx.lineWidth = 1 + persp * 3;
                    ctx.globalAlpha = persp;
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
                ctx.restore();
            } else if (previewMode === 'synth') {
                const horY = h * 0.56;
                const sunR = h * (0.22 + beat * 0.03);
                ctx.fillStyle = pal[0];
                ctx.beginPath();
                ctx.arc(cx, horY - sunR * 0.25, sunR, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#060914';
                ctx.fillRect(0, horY, w, h - horY);
                ctx.strokeStyle = pal[1];
                for (let i = -14; i <= 14; i++) {
                    ctx.beginPath();
                    ctx.moveTo(cx + i * 18, horY);
                    ctx.lineTo(cx + i * 120, h);
                    ctx.stroke();
                }
            }
        }
        renderPreview();
    }

    const previewAudioBtn = document.getElementById('previewAudioBtn');
    let demoAudio = null;
    if (previewAudioBtn) {
        previewAudioBtn.addEventListener('click', () => {
            if (!demoAudio) {
                demoAudio = new Audio('assets/audio/demo-track.wav');
                demoAudio.loop = true;
                demoAudio.volume = 0.75;
            }
            if (demoAudio.paused) {
                demoAudio.play().then(() => {
                    previewAudioBtn.classList.add('playing');
                    previewAudioBtn.innerHTML = '<span>⏸ Pause Demo Audio</span>';
                }).catch(() => {});
            } else {
                demoAudio.pause();
                previewAudioBtn.classList.remove('playing');
                previewAudioBtn.innerHTML = '<span>🔊 Play Demo Audio</span>';
            }
        });
    }

    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const open = item.classList.toggle('open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    });

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
