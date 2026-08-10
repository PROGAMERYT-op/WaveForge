
        /* ---------- Theme toggle ---------- */
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem('wf-theme', next); } catch (e) {}
        });

        /* ---------- Mobile menu ---------- */
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileMenu = document.getElementById('mobileMenu');
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

        /* ---------- Animated preview bars ---------- */
        const bars = document.getElementById('previewBars');
        const isMobile = window.matchMedia('(max-width: 640px)').matches;
        const count = isMobile ? 32 : 56;
        for (let i = 0; i < count; i++) {
            const b = document.createElement('div');
            b.className = 'pbar';
            const min = 12 + Math.random() * 28;
            const max = 60 + Math.random() * 200;
            b.style.setProperty('--min', min + 'px');
            b.style.setProperty('--max', max + 'px');
            b.style.height = min + 'px';
            b.style.animationDelay = (Math.random() * 1.2) + 's';
            b.style.animationDuration = (0.6 + Math.random() * 0.8) + 's';
            bars.appendChild(b);
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
        // Safety net: reveal anything still hidden after 500ms
        setTimeout(() => {
            document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
        }, 500);

        /* ---------- Footer year ---------- */
        document.getElementById('year').textContent = new Date().getFullYear();