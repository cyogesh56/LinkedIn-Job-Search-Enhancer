// content.js — Job Search Enhancer
// Language detection delegates to languageKeywords.js (loaded first via manifest)

(function () {
    'use strict';

    // Language code → display name + flag (matches LANGUAGE_DATA keys in languageKeywords.js)
    const LANGUAGES = [
        { code: 'de', name: 'German', flag: '🇩🇪' },
        { code: 'fr', name: 'French', flag: '🇫🇷' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' },
        { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
        { code: 'it', name: 'Italian', flag: '🇮🇹' },
        { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
        { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
    ];

    // ─── Core Detection Logic ───────────────────────────────────────────────────

    // ─── Settings ───────────────────────────────────────────────────────────────
    let settings = {
        languageDetectionEnabled: false,
        hidePromoted: false,
        hideReposted: false,
    };

    let currentUrl = window.location.href;

    // ─── Boot ───────────────────────────────────────────────────────────────────
    loadSettings().then(() => {
        applyCardFilters();
        checkCacheAndScan();
    });

    // Watch for URL changes after any click (LinkedIn SPA navigation)
    document.addEventListener('click', () => {
        setTimeout(() => {
            const newUrl = window.location.href;
            if (newUrl !== currentUrl) {
                currentUrl = newUrl;
                loadSettings().then(() => {
                    applyCardFilters();
                    checkCacheAndScan();
                });
            }
        }, 500);
    });

    // Re-apply when settings change from popup
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'SETTINGS_UPDATED') {
            loadSettings().then(() => {
                applyCardFilters();
                removeBadge();
                currentUrl = '';
                currentUrl = window.location.href;
                checkCacheAndScan();
            });
        }
    });

    function loadSettings() {
        return new Promise((resolve) => {
            chrome.storage.local.get(
                { languageDetectionEnabled: false, hidePromoted: false, hideReposted: false },
                (items) => { settings = items; resolve(); }
            );
        });
    }

    // ─── Language Badge ─────────────────────────────────────────────────────────
    // Bump this whenever detection logic changes to invalidate stale cached results.
    const CACHE_VERSION = 3;

    async function checkCacheAndScan() {
        if (!settings.languageDetectionEnabled) { removeBadge(); return; }
        if (!currentUrl || !currentUrl.includes('/jobs/')) {
            removeBadge(); return;
        }

        const jobUrl = currentUrl;

        try {
            const store = await chrome.storage.local.get(['jseScannedJobs']);
            const cache = (store.jseScannedJobs || {})[jobUrl];
            const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;

            // Only use cache if version matches AND detected is non-null
            // (null results are re-scanned every time — cheap and avoids stale misses)
            if (cache &&
                cache.timestamp > cutoff &&
                cache.v === CACHE_VERSION &&
                cache.detected !== null &&
                cache.detected !== undefined) {
                displayBadge(cache.detected);
                return;
            }
        } catch (_) { /* proceed to scan */ }

        scanJob(jobUrl);
    }

    async function scanJob(jobUrl) {
        const text = await waitForDescription();
        if (!text) { removeBadge(); return; }

        // Pass 1: Exact keyword matching — highest confidence (1.0 / 0.8 / 0.5)
        // e.g. "deutsch erforderlich", "fluent german", "german c1"
        const found = [];
        for (const lang of LANGUAGES) {
            const result = checkLanguageRequirement(text, lang.code);
            if (result.status === 'required' || result.status === 'fluent' || result.status === 'optional') {
                found.push({
                    name: lang.name,
                    flag: lang.flag,
                    status: result.status === 'optional' ? 'optional' : 'required',
                    confidence: result.confidence,
                    reason: result.reason,
                });
            }
        }

        // Pass 2: Proximity matching — medium confidence (0.75 / 0.55)
        // Catches "fluent in English and German", "sehr gute Sprachkompetenz in Deutsch",
        // i.e. language name near a signal word but not an exact keyword phrase.
        for (const lang of LANGUAGES) {
            const alreadyFound = found.some(f => f.name === lang.name);
            if (alreadyFound) continue; // exact match already found, skip
            const result = checkLanguageProximity(text, lang.code);
            if (result.status === 'required' || result.status === 'optional') {
                found.push({
                    name: lang.name,
                    flag: lang.flag,
                    status: result.status,
                    confidence: result.confidence,
                    reason: result.reason,
                });
            }
        }

        // Pass 3: Document language detection — fallback (0.7)
        // If the description is written entirely in a non-English language but
        // contains no explicit language requirement wording at all.
        const docLangCode = detectDocumentLanguage(text);
        if (docLangCode) {
            const lang = LANGUAGES.find(l => l.code === docLangCode);
            const alreadyFound = found.some(f => f.name === lang?.name);
            if (lang && !alreadyFound) {
                found.push({
                    name: lang.name,
                    flag: lang.flag,
                    status: 'required',
                    confidence: 0.7,
                    reason: 'job description is written in this language',
                });
            }
        }

        // Sort: highest confidence first, then required before optional
        found.sort((a, b) =>
            (b.confidence - a.confidence) || (a.status === 'required' ? -1 : 1)
        );

        const detected = found.length > 0 ? found : null;
        displayBadge(detected);
        cacheResult(detected, jobUrl);
    }

    function waitForDescription(timeoutMs = 6000) {
        return new Promise((resolve) => {
            const selectors = [
                '#job-details',
                '.jobs-description-content__text',
                '.jobs-description-content__text--stretch',
                '.jobs-description__content',
                '.jobs-box__html-content',
                '.description__text',
                '[class*="jobs-description-content"]',
                '[class*="jobs-description"]',
            ];

            function tryFind() {
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el && el.innerText.trim().length > 100) return el.innerText.trim();
                }
                return null;
            }

            const immediate = tryFind();
            if (immediate) { resolve(immediate); return; }

            const start = Date.now();
            const interval = setInterval(() => {
                const text = tryFind();
                if (text) { clearInterval(interval); resolve(text); return; }
                if (Date.now() - start > timeoutMs) { clearInterval(interval); resolve(null); }
            }, 300);
        });
    }

    // detected: null (nothing found) | Array of { name, flag, status, confidence, reason }
    function displayBadge(detected) {
        removeBadge();

        const badge = document.createElement('div');
        badge.id = 'jse-lang-badge';

        if (!detected || detected.length === 0) {
            badge.className = 'jse-lang-badge not-required';
            badge.textContent = '✅ No Language Requirement';
        } else {
            // Show up to 2 languages to keep it compact
            const label = detected.slice(0, 2)
                .map(({ name, flag, status }) =>
                    `${flag} ${name} ${status === 'required' ? 'Required' : 'Preferred'}`)
                .join(' · ');
            const hasRequired = detected.some(d => d.status === 'required');
            badge.className = `jse-lang-badge ${hasRequired ? 'required' : 'optional'}`;
            badge.textContent = label;
        }

        const injected = injectBadgeInPanel(badge);
        if (!injected) {
            badge.classList.add('jse-lang-badge--fixed');
            document.body.appendChild(badge);
        }
    }

    // Insert badge AFTER the job-title container div so it sits between
    // the title block and the location/info block (between the two divs
    // the user identified in the LinkedIn DOM).
    function injectBadgeInPanel(badge) {
        // Primary targets: the title-wrapper div itself (insert after = between title & location)
        const containerSelectors = [
            '.job-details-jobs-unified-top-card__job-title',
            '[class*="unified-top-card__job-title"]',
            '.jobs-unified-top-card__job-title',
        ];
        for (const sel of containerSelectors) {
            const el = document.querySelector(sel);
            if (el && document.contains(el)) {
                el.insertAdjacentElement('afterend', badge);
                return true;
            }
        }

        // Fallback: find h1 and insert after its parent if possible, otherwise after h1
        const h1Selectors = [
            '.job-details-jobs-unified-top-card__job-title h1',
            '.jobs-unified-top-card h1',
            '.scaffold-layout__detail h1',
            '[class*="job-details"] h1',
            '[class*="unified-top-card"] h1',
        ];
        for (const sel of h1Selectors) {
            const h1 = document.querySelector(sel);
            if (h1 && document.contains(h1)) {
                const parent = h1.closest('[class*="top-card"]') || h1.parentElement;
                parent.insertAdjacentElement('afterend', badge);
                return true;
            }
        }

        return false;
    }

    function removeBadge() {
        const el = document.getElementById('jse-lang-badge');
        if (el) el.remove();
    }

    async function cacheResult(detected, jobUrl) {
        // Don't cache null — re-scan is cheap and prevents stale false negatives
        if (!detected) return;
        try {
            const store = await chrome.storage.local.get(['jseScannedJobs']);
            const jobs = store.jseScannedJobs || {};
            jobs[jobUrl] = { detected, v: CACHE_VERSION, timestamp: Date.now() };

            // Prune entries older than 30 days
            const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
            for (const url in jobs) {
                if (jobs[url].timestamp < cutoff) delete jobs[url];
            }
            await chrome.storage.local.set({ jseScannedJobs: jobs });
        } catch (_) { /* non-critical */ }
    }

    // ─── Hide Promoted / Reposted ───────────────────────────────────────────────
    function applyCardFilters() {
        if (!settings.hidePromoted && !settings.hideReposted) return;

        // Collect cards from ALL selectors (LinkedIn uses different structures depending
        // on page variant). Use a Set to avoid processing the same element twice.
        const seen = new Set();
        const cards = [];
        const selectors = [
            // div-based cards (the class names the user observed)
            "div[class*='job-card-container'][class*='job-card-list']",
            "div[class*='job-card-container--clickable']",
            // li-based cards (older LinkedIn layout)
            'li[data-occludable-job-id]',
            'li[data-job-id]',
            'li.jobs-search-results__list-item',
            "li[class*='jobs-search-results__list-item']",
        ];
        for (const sel of selectors) {
            for (const el of document.querySelectorAll(sel)) {
                if (!seen.has(el)) { seen.add(el); cards.push(el); }
            }
        }

        cards.forEach((card) => {
            if (card.getAttribute('data-jse-hidden')) return;
            if (settings.hidePromoted && isPromoted(card)) { hideCard(card, 'promoted'); return; }
            if (settings.hideReposted && isReposted(card)) { hideCard(card, 'reposted'); }
        });
    }


    function isPromoted(card) {
        // 1. Card-level & link aria-labels (LinkedIn often puts "Promoted" here)
        if (/\bpromoted\b/i.test(card.getAttribute('aria-label') || '')) return true;
        for (const a of card.querySelectorAll('a[aria-label]')) {
            if (/\bpromoted\b/i.test(a.getAttribute('aria-label') || '')) return true;
        }

        // 2. Any element whose class name contains 'promoted' (catches future class renames)
        if (card.querySelector('[class*="promoted"]')) return true;

        // 3. Known structural selectors — broadened to word-boundary match
        const sels = [
            "[class*='job-card-container__footer-job-state']",
            "[class*='job-card-list__footer-wrapper'] li",
            "[class*='job-card-list__footer-wrapper'] span",
            "[class*='artdeco-entity-lockup__caption']",
            "[class*='job-card__promoted-badge']",
            "[class*='premium-label']",
            "[class*='job-card-list__insight']",
            "[class*='job-card-container__apply-method']",
            "[class*='job-card-list__footer']",
        ];
        for (const sel of sels) {
            for (const el of card.querySelectorAll(sel)) {
                if (/\bpromoted\b/i.test(el.textContent)) return true;
            }
        }

        // 4. Scan every leaf text node — catches completely unknown selectors
        for (const el of card.querySelectorAll('li, span, p, strong, em, div')) {
            // Only check elements with no child elements (leaf nodes) to avoid false positives
            if (el.children.length === 0 && /^promoted$/i.test(el.textContent.trim())) return true;
        }

        return false;
    }

    function isReposted(card) {
        // 1. Card-level & link aria-labels
        if (/\breposted\b/i.test(card.getAttribute('aria-label') || '')) return true;
        for (const a of card.querySelectorAll('a[aria-label]')) {
            if (/\breposted\b/i.test(a.getAttribute('aria-label') || '')) return true;
        }

        // 2. Any element whose class name contains 'repost'
        if (card.querySelector('[class*="repost"]')) return true;

        // 3. Known structural selectors
        const sels = [
            "[class*='job-card-container__footer-job-state']",
            "[class*='job-card-list__footer-wrapper'] li",
            "[class*='job-card-list__footer-wrapper'] span",
            "[class*='artdeco-entity-lockup__caption']",
            "[class*='job-card-list__insight']",
            "[class*='job-card-list__footer']",
        ];
        for (const sel of sels) {
            for (const el of card.querySelectorAll(sel)) {
                if (/\breposted\b/i.test(el.textContent)) return true;
            }
        }

        // 4. Scan leaf text nodes
        for (const el of card.querySelectorAll('li, span, p, strong, em, div')) {
            if (el.children.length === 0 && /^reposted$/i.test(el.textContent.trim())) return true;
        }

        return false;
    }

    function hideCard(card, reason) {
        card.style.transition = 'opacity 0.4s ease, max-height 0.4s ease';
        card.style.opacity = '0';
        card.style.maxHeight = card.offsetHeight + 'px';
        setTimeout(() => {
            card.style.maxHeight = '0';
            card.style.overflow = 'hidden';
            card.style.marginBottom = '0';
            card.style.paddingBottom = '0';
            card.setAttribute('data-jse-hidden', reason);
        }, 400);
    }

    // MutationObserver for infinite scroll — card filters only, never language scan
    let _debounce = null;
    const _observer = new MutationObserver(() => {
        clearTimeout(_debounce);
        _debounce = setTimeout(applyCardFilters, 400);
    });
    _observer.observe(document.body, { childList: true, subtree: true });

})();
