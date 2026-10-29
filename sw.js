/* WaveForge Service Worker — offline support for GitHub Pages hosting.
 *
 * Bump CACHE_VERSION to invalidate the old cache after a deploy.
 */
const CACHE_VERSION = 'waveforge-v3.0.0';
const PRECACHE = [
    './',
    'index.html',
    'visualizer.html',
    'privacy.html',
    'terms.html',
    'assets/manifest.json',
    'assets/css/app.css',
    'assets/css/landing.css',
    'assets/css/legal.css',
    'assets/js/ads.js',
    'assets/js/app.js',
    'assets/js/landing.js',
    'assets/js/legal.js',
    'Visualizers/bars.js',
    'Visualizers/wave.js',
    'Visualizers/radial.js',
    'Visualizers/particles.js',
    'Visualizers/spectrogram.js',
    'Visualizers/3dbars.js',
    'Visualizers/dna.js',
    'Visualizers/galaxy.js',
    'Visualizers/logo.js',
    'Visualizers/tunnel.js',
    'Visualizers/trapnation.js',
    'Visualizers/synthwave.js',
    'assets/audio/demo-track.wav',
    'assets/img/favicon.svg',
    'assets/img/icon-192.png',
    'assets/img/icon-512.png',
    'assets/img/icon-maskable-512.png',
    'assets/img/apple-touch-icon.png',
    'assets/img/logo.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => {}))))
            .then(() => self.skipWaiting())
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

    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then((resp) => {
                    const copy = resp.clone();
                    caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
                    return resp;
                })
                .catch(() => caches.match(req).then((hit) => hit || caches.match('index.html')))
        );
        return;
    }

    event.respondWith(
        caches.match(req).then((hit) => {
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