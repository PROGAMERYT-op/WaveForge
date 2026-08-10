
        document.getElementById('themeToggle').addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme') || 'light';
            const nxt = cur === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nxt);
            try { localStorage.setItem('wf-theme', nxt); } catch (e) {}
        });
        document.getElementById('year').textContent = new Date().getFullYear();
    