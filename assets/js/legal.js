(function () {
    'use strict';
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme') || 'dark';
            const nxt = cur === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nxt);
            try { localStorage.setItem('wf-theme', nxt); } catch (e) {}
        });
    }
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        const onScroll = () => backToTop.classList.toggle('visible', (window.scrollY || 0) > 360);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
})();