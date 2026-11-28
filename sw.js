/* WaveForge Service Worker v10.4.0 */
const CACHE_VERSION = 'waveforge-v10.4.0';
const MUXER_CACHE = 'waveforge-muxers-v1';
const PRECACHE = [
    './',
    'index.html',
    'visualizer.html',
    'privacy.html',
    'terms.html',
    'assets/manifest.json',
    'assets/css/app.css?v=10.4.0',
    'assets/css/landing.css?v=10.4.0',
    'assets/css/legal.css?v=10.4.0',
    'assets/js/ads.js?v=10.4.0',
    'assets/js/webgl-fx.js?v=10.4.0',
    'assets/js/app.js?v=10.4.0',
    'assets/js/landing.js?v=10.4.0',
    'assets/js/legal.js?v=10.4.0',
    'Visualizers/bars.js?v=10.4.0',
    'Visualizers/wave.js?v=10.4.0',
    'Visualizers/radial.js?v=10.4.0',
    'Visualizers/particles.js?v=10.4.0',
    'Visualizers/logo.js?v=10.4.0',
    'Visualizers/tunnel.js?v=10.4.0',
    'Visualizers/trapnation.js?v=10.4.0',
    'Visualizers/synthwave.js?v=10.4.0',
    'Visualizers/phonk.js?v=10.4.0',
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
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION && k !== MUXER_CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    if (req.headers.has('range')) return;

    const url = new URL(req.url);

    // Cache WebCodecs muxer libraries from jsDelivr so installed PWAs can export offline
    if (url.hostname === 'cdn.jsdelivr.net' && /mp4-muxer|webm-muxer/i.test(url.pathname)) {
        event.respondWith(
            caches.open(MUXER_CACHE).then((cache) =>
                cache.match(req).then((hit) => {
                    if (hit) return hit;
                    return fetch(req).then((resp) => {
                        if (resp && resp.ok) cache.put(req, resp.clone()).catch(() => {});
                        return resp;
                    }).catch(() => hit || new Response('', { status: 503 }));
                })
            )
        );
        return;
    }

    if (url.origin !== self.location.origin) return;

    const isNavigate = req.mode === 'navigate';
    const isCodeOrHtml = isNavigate || /\.(html|css|js)$/i.test(url.pathname);

    if (isCodeOrHtml) {
        event.respondWith(
            fetch(req, { cache: 'no-cache' })
                .then((resp) => {
                    if (resp && resp.ok) {
                        const copy = resp.clone();
                        caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
                    }
                    return resp;
                })
                .catch(() =>
                    caches.match(req, { ignoreSearch: true }).then((hit) => {
                        if (hit) return hit;
                        if (isNavigate) {
                            if (url.pathname.endsWith('visualizer.html')) {
                                return caches.match('visualizer.html', { ignoreSearch: true }) || caches.match('index.html', { ignoreSearch: true });
                            }
                            return caches.match('index.html', { ignoreSearch: true });
                        }
                        return new Response('', { status: 503, statusText: 'Offline' });
                    })
                )
        );
        return;
    }

    event.respondWith(
        caches.match(req, { ignoreSearch: true }).then((hit) => {
            const network = fetch(req).then((resp) => {
                if (resp && resp.ok && resp.type === 'basic') {
                    const copy = resp.clone();
                    caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
                }
                return resp;
            }).catch(() => hit);
            return hit || network;
        })
    );
});
