/**
 * WaveForge Smart Monetization Engine (Adsterra Suite v3.0)
 * Manages:
 *  1) 728x90 Leaderboard Iframe Banner (key: 6e949de951c462540634a8f7fc05c2a0)
 *  2) 320x50 Compact / Mobile Iframe Banner (key: 369cf7e8ac90c123416f83594ae3d7bf)
 *  3) Native Banner (bauval.org container-7d5620353411eac086d1a38c87043739)
 *  4) Social Bar (constellationexclusion.com 8bb5714d83e974564958f3578034c290)
 *  5) Smartlink Direct Offer (https://araplhn.org/4/f28b978e066eac35ed88538faa37500f)
 *
 * Uses isolated iframe contexts for display banners so multiple placements on the
 * same page never overwrite window.atOptions, automatically adapts 728x90 vs 320x50
 * to viewport width, rotates export modal ads during long renders, and provides a
 * Smartlink partner fallback if an adblocker blocks standard scripts.
 */
(function () {
    'use strict';

    const AD_CONFIG = {
        leaderboard: {
            key: '6e949de951c462540634a8f7fc05c2a0',
            width: 728,
            height: 90,
            src: 'https://constellationexclusion.com/6e949de951c462540634a8f7fc05c2a0/invoke.js'
        },
        compact: {
            key: '369cf7e8ac90c123416f83594ae3d7bf',
            width: 320,
            height: 50,
            src: 'https://constellationexclusion.com/369cf7e8ac90c123416f83594ae3d7bf/invoke.js'
        },
        native: {
            containerId: 'container-7d5620353411eac086d1a38c87043739',
            src: 'https://bauval.org/21/7d5620353411eac086d1a38c87043739'
        },
        socialBar: {
            src: 'https://constellationexclusion.com/8b/b5/71/8bb5714d83e974564958f3578034c290.js'
        },
        smartlink: 'https://araplhn.org/4/f28b978e066eac35ed88538faa37500f'
    };

    let exportRotationTimer = null;

    function buildBannerSrcDoc(unit, smartlinkUrl) {
        return [
            '<!DOCTYPE html><html><head><meta charset="utf-8">',
            '<style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:transparent;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif;}',
            '.fallback{display:none;width:100%;height:100%;box-sizing:border-box;align-items:center;justify-content:space-between;padding:0 14px;background:linear-gradient(90deg,rgba(99,102,241,0.16),rgba(192,132,252,0.16));border:1px solid rgba(129,140,248,0.35);border-radius:8px;color:#f8fafc;text-decoration:none;font-size:12px;font-weight:600;}',
            '.fallback span.cta{background:#6366f1;color:#fff;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap;}',
            '</style></head><body>',
            '<div id="ad-wrap"></div>',
            '<a id="fb" class="fallback" href="' + smartlinkUrl + '" target="_blank" rel="noopener sponsored">',
            '<span>🎵 Free Creator Sample Packs, Loops &amp; 4K Visual Assets</span>',
            '<span class="cta">Claim Free →</span>',
            '</a>',
            '<script>',
            'window.atOptions = {',
            '  key: "' + unit.key + '",',
            '  format: "iframe",',
            '  height: ' + unit.height + ',',
            '  width: ' + unit.width + ',',
            '  params: {}',
            '};',
            '<\/script>',
            '<script src="' + unit.src + '" onerror="document.getElementById(\'fb\').style.display=\'flex\'"><\/script>',
            '<script>setTimeout(function(){if(document.body.querySelectorAll("iframe").length===0){var f=document.getElementById("fb");if(f)f.style.display="flex";}},3500);<\/script>',
            '</body></html>'
        ].join('');
    }

    /**
     * Mounts an isolated responsive Adsterra banner inside `el`.
     * Uses 728x90 on desktop when container/screen fits, or 320x50 on mobile/compact containers.
     */
    function mountResponsiveBanner(el, options) {
        if (!el) return;
        const opts = options || {};
        const isSmallViewport = window.innerWidth < 760;
        const forceCompact = Boolean(opts.compact) || isSmallViewport;
        const unit = forceCompact ? AD_CONFIG.compact : AD_CONFIG.leaderboard;

        el.innerHTML = '';

        const frame = document.createElement('iframe');
        frame.width = String(unit.width);
        frame.height = String(unit.height);
        frame.style.border = '0';
        frame.style.overflow = 'hidden';
        frame.style.display = 'block';
        frame.style.maxWidth = '100%';
        frame.style.margin = '0 auto';
        frame.style.borderRadius = '8px';
        frame.setAttribute('scrolling', 'no');
        frame.setAttribute('loading', opts.eager ? 'eager' : 'lazy');
        frame.setAttribute('title', 'Sponsored Content');
        frame.srcdoc = buildBannerSrcDoc(unit, AD_CONFIG.smartlink);

        el.appendChild(frame);
    }

    /**
     * Mounts all `[data-wf-ad]` containers on the current page.
     */
    function initDeclarativeSlots() {
        document.querySelectorAll('[data-wf-ad]').forEach((slot) => {
            const type = slot.getAttribute('data-wf-ad');
            if (type === 'responsive') {
                mountResponsiveBanner(slot, { compact: false });
            } else if (type === 'compact') {
                mountResponsiveBanner(slot, { compact: true });
            }
        });

        // Wire all `[data-wf-smartlink]` elements to the Smartlink URL
        document.querySelectorAll('[data-wf-smartlink]').forEach((link) => {
            if (link.tagName === 'A') {
                link.href = AD_CONFIG.smartlink;
                link.target = '_blank';
                link.rel = 'noopener sponsored';
            } else {
                link.addEventListener('click', () => {
                    window.open(AD_CONFIG.smartlink, '_blank', 'noopener,noreferrer');
                });
            }
        });

        // Sticky ad dismiss button handler
        document.querySelectorAll('[data-ad-dismiss]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const slot = btn.closest('.ad-sticky, .wf-app-sticky-ad');
                if (slot) slot.remove();
            });
        });
    }

    /**
     * Starts an active banner + refresh cycle inside the Export Modal or Config Modal.
     */
    function startModalAdRefresh(slotId, compact) {
        stopModalAdRefresh();
        const slot = document.getElementById(slotId);
        if (!slot) return;
        mountResponsiveBanner(slot, { compact: Boolean(compact), eager: true });
        exportRotationTimer = setInterval(() => {
            if (document.hidden) return;
            mountResponsiveBanner(slot, { compact: Boolean(compact), eager: true });
        }, 42000);
    }

    function stopModalAdRefresh() {
        if (exportRotationTimer) {
            clearInterval(exportRotationTimer);
            exportRotationTimer = null;
        }
    }

    /**
     * Session-capped Smartlink trigger for high-value actions (e.g., after video export download starts).
     * Capped to once every 15 minutes per browser session so user experience remains smooth.
     */
    function maybeTriggerExportSmartlink() {
        try {
            const KEY = 'wf_last_smartlink_ts';
            const now = Date.now();
            const last = parseInt(sessionStorage.getItem(KEY) || '0', 10);
            if (now - last < 15 * 60 * 1000) return false;
            sessionStorage.setItem(KEY, String(now));
            window.open(AD_CONFIG.smartlink, '_blank', 'noopener,noreferrer');
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Injects Adsterra Social Bar with a gentle delay so initial page paint & Core Web Vitals stay fast.
     */
    function injectSocialBar(delayMs) {
        setTimeout(() => {
            if (document.querySelector('script[data-wf-socialbar]')) return;
            const s = document.createElement('script');
            s.src = AD_CONFIG.socialBar.src;
            s.async = true;
            s.setAttribute('data-wf-socialbar', 'true');
            document.body.appendChild(s);
        }, typeof delayMs === 'number' ? delayMs : 2500);
    }

    window.WaveForgeAds = {
        config: AD_CONFIG,
        mountResponsiveBanner,
        initDeclarativeSlots,
        startModalAdRefresh,
        stopModalAdRefresh,
        maybeTriggerExportSmartlink,
        injectSocialBar
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initDeclarativeSlots();
        });
    } else {
        initDeclarativeSlots();
    }
})();
