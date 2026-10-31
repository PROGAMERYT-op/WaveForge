/* WaveForge Service Worker v5.1.0 — offline support for GitHub Pages hosting. */
const CACHE_VERSION = 'waveforge-v5.1.0';
const PRECACHE = [
    './',
    'index.html',
    'visualizer.html',
    'privacy.html',
    'terms.html',
    'assets/manifest.json',
    'assets/css/app.css?v=5.1.0',
    'assets/css/landing.css?v=5.1.0',
    'assets/css/legal.css',
    'assets/js/ads.js?v=5.1.0',
    'assets/js/app.js?v=5.1.0',
    'assets/js/landing.js?v=5.1.0',
    'assets/js/legal.js',
    'Visualizers/bars.js?v=5.1.0',
    'Visualizers/wave.js?v=5.1.0',
    'Visualizers/radial.js?v=5.1.0',
    'Visualizers/particles.js?v=5.1.0',
    'Visualizers/spectrogram.js?v=5.1.0',
    'Visualizers/3dbars.js?v=5.1.0',
    'Visualizers/dna.js?v=5.1.0',
    'Visualizers/galaxy.js?v=5.1.0',
    'Visualizers/logo.js?v=5.1.0',
    'Visualizers/tunnel.js?v=5.1.0',
    'Visualizers/trapnation.js?v=5.1.0',
    'Visualizers/synthwave.js?v=5.1.0',
    'assets/audio/demo-track.wav',
    'assets/img/favicon.svg',
    'assets/img/icon-192.png',
    'assets/img/icon-512.png',
    'assets/img/icon-maskable-512.png',
    'assets/img/apple-touch-icon.png',
    'assets/img/logo.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => Promise.all(PRECACHE.map((url) => cache.add(new Request(url, { cache: 'reload' })).catch(() => {}))))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
    if (req.headers.has('range')) return;

    const url = new URL(req.url);
    const isCodeOrHtml = req.mode === 'navigate' || /\.(html|css|js)$/i.test(url.pathname);

    if (isCodeOrHtml) {
        event.respondWith(
            fetch(req, { cache: 'no-cache' })
                .then((resp) => {
                    if (resp && resp.ok) {
                        const copy = resp.clone();
                        caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
                    }
                    return resp;
                })
                .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html')))
        );
        return;
    }

    event.respondWith(
        caches.match(req, { ignoreSearch: true }).then((hit) => {
            const network = fetch(req).then((resp) => {
                if (resp && resp.ok && resp.type === 'basic') {
                    const copy = resp.clone();
                    caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
                }
                return resp;
            }).catch(() => hit);
            return hit || network;
        })
    );
});
