(function () {
    'use strict';

    /* ---------- Theme toggle ---------- */
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('wf-theme', next); } catch (e) {}
        });
    }

    /* ---------- Mobile menu ---------- */
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

    /* ---------- Interactive 60 FPS Canvas Studio Showcase ---------- */
    const canvas = document.getElementById('heroPreviewCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let previewMode = 'bars';
        let previewPalette = 'cyberpunk';

        const PALETTES = {
            cyberpunk: ['#00f2ff', '#ff0099', '#ffffff', '#7b2dff'],
            synthwave: ['#ff2a85', '#00f5d4', '#fee440', '#9b5de5'],
            fire: ['#ff2200', '#ff7700', '#ffbb00', '#ffff44'],
            matrix: ['#003311', '#00ff66', '#66ffaa', '#ccffdd']
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
            const pal = PALETTES[previewPalette] || PALETTES.cyberpunk;
            const beat = Math.pow(Math.max(0, Math.sin(t * 4.2)), 6);

            ctx.fillStyle = 'rgba(6, 9, 20, 0.3)';
            ctx.fillRect(0, 0, w, h);

            if (previewMode === 'bars') {
                const count = 54;
                const bw = (w / 2) / count - 3;
                const grad = ctx.createLinearGradient(0, h, 0, 0);
                grad.addColorStop(0, pal[0]);
                grad.addColorStop(0.5, pal[1]);
                grad.addColorStop(1, pal[2]);
                ctx.fillStyle = grad;

                for (let i = 0; i < count; i++) {
                    const n = Math.sin(t * 3.2 + i * 0.3) * 0.5 + 0.5;
                    const m = Math.cos(t * 5.0 - i * 0.17) * 0.5 + 0.5;
                    const env = Math.max(0.1, (1 - i / count) * (0.45 + n * 0.55 * m) + beat * 0.28 * (1 - i / count));
                    const bh = env * h * 0.74;
                    const xOff = i * (bw + 3);
                    ctx.fillRect(cx + xOff, cy - bh / 2, bw, bh);
                    ctx.fillRect(cx - xOff - bw, cy - bh / 2, bw, bh);
                }
            } else if (previewMode === 'ring') {
                const baseR = Math.min(cx, cy) * (0.38 + beat * 0.08);
                ctx.save();
                ctx.translate(cx, cy);
                for (let layer = 0; layer < 3; layer++) {
                    ctx.beginPath();
                    const pts = 110;
                    for (let i = 0; i <= pts; i++) {
                        const a = (i / pts) * Math.PI * 2;
                        const wave = Math.sin(a * 8 + t * 4 + layer) * Math.cos(a * 4 - t * 3);
                        const r = baseR + wave * 34 * (1 + beat * 0.6) + layer * 10;
                        const px = Math.cos(a) * r;
                        const py = Math.sin(a) * r;
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.strokeStyle = pal[layer % pal.length];
                    ctx.lineWidth = 3 - layer * 0.6;
                    ctx.shadowBlur = 16;
                    ctx.shadowColor = pal[layer % pal.length];
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
                ctx.restore();
            } else if (previewMode === 'tunnel') {
                ctx.save();
                ctx.translate(cx, cy);
                const rings = 15;
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
                const sunGrad = ctx.createLinearGradient(cx, horY - sunR * 1.3, cx, horY);
                sunGrad.addColorStop(0, pal[2]);
                sunGrad.addColorStop(1, pal[1]);
                ctx.fillStyle = sunGrad;
                ctx.beginPath();
                ctx.arc(cx, horY - sunR * 0.25, sunR, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#060914';
                ctx.fillRect(0, horY, w, h - horY);
                ctx.strokeStyle = pal[0];
                ctx.lineWidth = 1.4;
                for (let i = -16; i <= 16; i++) {
                    ctx.beginPath();
                    ctx.moveTo(cx + i * 18, horY);
                    ctx.lineTo(cx + i * 120, h);
                    ctx.stroke();
                }
                const scroll = (t * 1.1) % 1;
                for (let j = 0; j < 10; j++) {
                    const p = (j + scroll) / 10;
                    const y = horY + Math.pow(p, 2) * (h - horY);
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }
            }
        }
        renderPreview();
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const open = item.classList.toggle('open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    });

    /* ---------- Reveal on scroll ---------- */
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
    }, 450);

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
