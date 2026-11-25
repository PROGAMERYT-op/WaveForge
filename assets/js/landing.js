(function () {
    'use strict';

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('wf-theme', next); } catch (e) {}
        });
    }

    // Fixed Mobile Drawer Menu + Backdrop + Escape
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileBackdrop = document.getElementById('mobileBackdrop');

    function setMobileMenu(open) {
        if (!mobileToggle || !mobileMenu) return;
        mobileMenu.classList.toggle('open', open);
        mobileToggle.classList.toggle('open', open);
        mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
        if (mobileBackdrop) {
            mobileBackdrop.classList.toggle('open', open);
            mobileBackdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
        }
        document.body.classList.toggle('menu-open', open);
    }

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            setMobileMenu(!mobileMenu.classList.contains('open'));
        });
        mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMobileMenu(false)));
        if (mobileBackdrop) mobileBackdrop.addEventListener('click', () => setMobileMenu(false));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                setMobileMenu(false);
                mobileToggle.focus();
            }
        });
    }

    // Scroll Progress Bar, Back-to-Top & Active Nav Link Highlight
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');
    const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

    function onScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        if (scrollProgress) {
            scrollProgress.style.width = Math.min(100, (scrollTop / maxScroll) * 100) + '%';
        }
        if (backToTop) {
            backToTop.classList.toggle('visible', scrollTop > 420);
        }
        let activeId = '';
        for (const sec of sections) {
            const top = sec.getBoundingClientRect().top;
            if (top <= 140) activeId = sec.id;
        }
        navLinks.forEach(a => {
            a.classList.toggle('active-link', a.getAttribute('href') === '#' + activeId);
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Smooth Scroll-Reveal Observer with Safety Fallback
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length > 0) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -16px 0px' });
        revealEls.forEach((el) => io.observe(el));
        // Safety fallback so elements never stay hidden on deep-link jumps
        setTimeout(() => {
            revealEls.forEach((el) => {
                const r = el.getBoundingClientRect();
                if (r.top < window.innerHeight + 120) el.classList.add('in-view');
            });
        }, 700);
    } else {
        revealEls.forEach((el) => el.classList.add('in-view'));
    }

    // Mode Category Filter on Landing Page
    const filterBtns = document.querySelectorAll('.mode-filter-btn');
    const modeCards = document.querySelectorAll('.mode-showcase-card');
    if (filterBtns.length && modeCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.filter;
                filterBtns.forEach(b => {
                    b.classList.toggle('active', b === btn);
                    b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
                });
                modeCards.forEach(card => {
                    const cardCat = card.dataset.category || 'all';
                    const show = cat === 'all' || cardCat === cat;
                    card.classList.toggle('filtered-out', !show);
                    if (show) card.classList.add('in-view');
                });
            });
        });
    }

    // Interactive Preview Canvas (pauses when off-screen or tab hidden to save battery)
    let demoAudio = null;
    let demoCtx = null;
    let demoAnalyser = null;
    let demoFreqData = null;

    const canvas = document.getElementById('heroPreviewCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let previewMode = 'ring';
        let previewPalette = 'synthwave';
        let logicalW = 1120;
        let logicalH = 340;
        let canvasVisible = true;
        let rafId = null;

        function resizePreviewCanvas() {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            logicalW = Math.max(280, Math.round(rect.width || 1120));
            logicalH = Math.max(180, Math.round(rect.height || 340));
            canvas.width = Math.round(logicalW * dpr);
            canvas.height = Math.round(logicalH * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        resizePreviewCanvas();
        window.addEventListener('resize', resizePreviewCanvas);

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
            if (!canvasVisible || document.hidden) {
                rafId = null;
                return;
            }
            rafId = requestAnimationFrame(renderPreview);
            const w = logicalW;
            const h = logicalH;
            const cx = w / 2;
            const cy = h / 2;
            const t = performance.now() * 0.001;
            const pal = PALETTES[previewPalette] || PALETTES.synthwave;

            let liveBass = 0;
            let hasLiveAudio = false;
            if (demoAnalyser && demoFreqData && demoAudio && !demoAudio.paused) {
                demoAnalyser.getByteFrequencyData(demoFreqData);
                hasLiveAudio = true;
                for (let i = 0; i < 16; i++) liveBass += demoFreqData[i];
                liveBass = (liveBass / 16) / 255;
            }

            const beat = hasLiveAudio
                ? Math.min(1.2, Math.pow(liveBass, 1.5) * 1.35)
                : Math.pow(Math.max(0, Math.sin(t * 4.2)), 6);

            ctx.fillStyle = 'rgba(5, 7, 17, 0.32)';
            ctx.fillRect(0, 0, w, h);

            if (previewMode === 'ring') {
                const baseR = Math.min(cx, cy) * (0.42 + beat * 0.08);
                ctx.save();
                ctx.translate(cx, cy);

                ctx.strokeStyle = '#ffffff';
                for (let s = 0; s < 24; s++) {
                    const a = (s / 24) * Math.PI * 2 + t * 0.2;
                    const d = ((t * (0.8 + beat * 0.5) + s * 0.17) % 1) * cx * 0.9;
                    if (d > baseR) {
                        ctx.globalAlpha = 0.45;
                        ctx.beginPath();
                        ctx.moveTo(Math.cos(a) * d, Math.sin(a) * d);
                        ctx.lineTo(Math.cos(a) * (d + 12), Math.sin(a) * (d + 12));
                        ctx.stroke();
                    }
                }
                ctx.globalAlpha = 1;

                for (let layer = 0; layer < 2; layer++) {
                    ctx.beginPath();
                    const pts = 96;
                    for (let i = 0; i <= pts; i++) {
                        const a = (i / pts) * Math.PI * 2 - Math.PI / 2;
                        const symIdx = i <= pts / 2 ? i : pts - i;
                        const binVal = hasLiveAudio ? (demoFreqData[Math.min(demoFreqData.length - 1, symIdx)] / 255) : 0;
                        const wave = Math.sin(a * 6 + t * 4 + layer) * Math.cos(a * 3 - t * 3);
                        const horn = Math.max(0, Math.cos(a)) * 24 * (0.45 + beat + binVal * 0.5);
                        const r = baseR + (Math.abs(wave) * 26 + binVal * 22) * (1 + beat * 0.6) + horn + layer * 6;
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
                const count = Math.min(54, Math.max(24, Math.floor(w / 18)));
                const bw = Math.max(2, (w / 2) / count - 3);
                const grad = ctx.createLinearGradient(0, h, 0, 0);
                grad.addColorStop(0, pal[0]);
                grad.addColorStop(1, pal[1]);
                ctx.fillStyle = grad;

                for (let i = 0; i < count; i++) {
                    let env;
                    if (hasLiveAudio) {
                        const fIdx = Math.floor((i / count) * (demoFreqData.length * 0.65));
                        env = Math.max(0.08, (demoFreqData[fIdx] / 255) * 0.95);
                    } else {
                        const n = Math.sin(t * 3.2 + i * 0.3) * 0.5 + 0.5;
                        env = Math.max(0.1, (1 - i / count) * (0.45 + n * 0.55) + beat * 0.28 * (1 - i / count));
                    }
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
                    const depth = ((i / rings) + t * (0.35 + beat * 0.15)) % 1;
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
                const horY = h * 0.55;
                const sunR = h * (0.23 + beat * 0.035);
                const sunGrad = ctx.createLinearGradient(cx, horY - sunR * 1.25, cx, horY + sunR * 0.2);
                sunGrad.addColorStop(0, pal[2] || pal[0]);
                sunGrad.addColorStop(1, pal[0]);
                ctx.fillStyle = sunGrad;
                ctx.beginPath();
                ctx.arc(cx, horY - sunR * 0.22, sunR, 0, Math.PI * 2);
                ctx.fill();

                // Retro sun scanline slices
                ctx.fillStyle = '#060914';
                for (let s = 0; s < 5; s++) {
                    const sy = horY - sunR * 0.12 - s * (sunR * 0.14);
                    ctx.fillRect(cx - sunR - 2, sy, sunR * 2 + 4, 2 + s * 0.7);
                }

                // Ground plane
                ctx.fillStyle = '#060914';
                ctx.fillRect(0, horY, w, h - horY);
                ctx.strokeStyle = pal[1];
                ctx.lineWidth = 1.2;

                // Perspective vertical lines
                for (let i = -14; i <= 14; i++) {
                    ctx.beginPath();
                    ctx.moveTo(cx + i * 18, horY);
                    ctx.lineTo(cx + i * 120, h);
                    ctx.stroke();
                }

                // Animated horizontal perspective grid lines
                const speed = (t * (0.7 + beat * 0.2)) % 1;
                for (let r = 0; r < 10; r++) {
                    const p = Math.pow((r + speed) / 10, 2.1);
                    const gy = horY + p * (h - horY);
                    ctx.globalAlpha = 0.25 + p * 0.75;
                    ctx.beginPath();
                    ctx.moveTo(0, gy);
                    ctx.lineTo(w, gy);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
            }
        }

        function startPreviewLoop() {
            if (!rafId && canvasVisible && !document.hidden) {
                rafId = requestAnimationFrame(renderPreview);
            }
        }

        if ('IntersectionObserver' in window) {
            const canvasObs = new IntersectionObserver((entries) => {
                canvasVisible = entries[0].isIntersecting;
                if (canvasVisible) startPreviewLoop();
            }, { threshold: 0.02 });
            canvasObs.observe(canvas);
        }
        document.addEventListener('visibilitychange', startPreviewLoop);
        startPreviewLoop();
    }

    // Built-in Demo Audio Toggle
    const previewAudioBtn = document.getElementById('previewAudioBtn');
    if (previewAudioBtn) {
        previewAudioBtn.addEventListener('click', () => {
            if (!demoAudio) {
                demoAudio = new Audio('assets/audio/demo-track.wav');
                demoAudio.loop = true;
                demoAudio.volume = 0.75;
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (AudioContext) {
                        demoCtx = new AudioContext();
                        demoAnalyser = demoCtx.createAnalyser();
                        demoAnalyser.fftSize = 256;
                        demoAnalyser.smoothingTimeConstant = 0.82;
                        demoFreqData = new Uint8Array(demoAnalyser.frequencyBinCount);
                        const src = demoCtx.createMediaElementSource(demoAudio);
                        src.connect(demoAnalyser);
                        demoAnalyser.connect(demoCtx.destination);
                    }
                } catch (e) {}
            }
            if (demoCtx && demoCtx.state === 'suspended') {
                demoCtx.resume().catch(() => {});
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

    // Smooth FAQ Accordion
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
