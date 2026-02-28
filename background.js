// background.js — Job Search Enhancer Service Worker
// Adapted from: github.com/dannyydj/german-language-requirement-checker
// Extended for multi-language support + dynamic model selection

"use strict";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com";
const GEMINI_API_VERSION = "v1beta"; // used for ListModels
const GEMINI_CONTENT_VERSION = "v1";     // used for generateContent (more stable)

// Most reliable models first — free tier widely supports gemini-1.5-flash.
// Newer 2.0 models are last; they often 404 on free keys, wasting quota.
const MODEL_PREFERENCE = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-pro",
    "gemini-pro",
];

// Cache the first model+version combo that actually succeeds.
// This means every subsequent job click uses exactly 1 API request.
let _workingModel = null; // e.g. "gemini-1.5-flash"
let _workingVersion = null; // e.g. "v1"

// ─── Rate limiter (max 10 requests / minute) ──────────────────────────────────
const rateLimiter = {
    requests: [],
    maxRequests: 10,
    timeWindow: 60000,
    canMakeRequest() {
        const now = Date.now();
        this.requests = this.requests.filter(t => now - t < this.timeWindow);
        if (this.requests.length < this.maxRequests) {
            this.requests.push(now);
            return true;
        }
        return false;
    }
};

// ─── Message Listener ─────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "ANALYZE_LANGUAGE") {
        if (!rateLimiter.canMakeRequest()) {
            sendResponse({ success: false, reason: "rate_limited", message: "Rate limit reached. Please wait a moment." });
            return false;
        }
        analyzeWithGemini(message.jobDescription, message.targetLanguage)
            .then(result => {
                try { sendResponse(result); } catch (e) { /* channel closed */ }
            })
            .catch(err => {
                console.error("Job Search Enhancer: Analysis error:", err);
                try { sendResponse({ success: false, message: err.message }); } catch (e) { /* channel closed */ }
            });
        return true; // keep channel open for async response
    }
    return false;
});

// ─── Rate Limit Backoff ────────────────────────────────────────────────────────
// When a 429 is received, stop all API calls for 60s rather than hammering the API.
let _rateLimitedUntil = 0;

// ─── Main Analysis Function ────────────────────────────────────────────────────
async function analyzeWithGemini(jobDescription, targetLanguage) {
    // 1. Get API key
    const storage = await chrome.storage.local.get({ apiKey: "", targetLanguage: "none" });
    const apiKey = (storage.apiKey || "").trim();

    if (!apiKey) {
        return { success: false, reason: "no_api_key", message: "No Gemini API key set. Open the extension popup to add your key." };
    }

    const language = targetLanguage || storage.targetLanguage;
    if (!language || language === "none") {
        return { success: false, reason: "disabled" };
    }

    // Check if we are in a rate-limit backoff window
    if (Date.now() < _rateLimitedUntil) {
        const secsLeft = Math.ceil((_rateLimitedUntil - Date.now()) / 1000);
        return { success: false, reason: "rate_limited", message: `Rate limited by Gemini. Please wait ${secsLeft}s before clicking another job.` };
    }

    // 2. Truncate description
    const text = jobDescription.length > 5000 ? jobDescription.substring(0, 5000) + "..." : jobDescription;

    // 3. Build prompt
    const prompt = `Analyze this job posting and determine if ${language} language skills are required.

Job Posting:
${text}

Instructions:
- "required": ${language} is explicitly required/mandatory/essential
- "optional": ${language} is mentioned as a plus, preferred, or an advantage
- "none": ${language} is not mentioned at all

Respond ONLY with one of these three exact JSON objects — no other text:
{"status":"required"}
{"status":"optional"}
{"status":"none"}`;

    // 4. Try models — use cached working model first to avoid wasting quota on 404s.
    // First run: discovers which model/version works and caches it.
    // All subsequent clicks: goes straight to the cached model (1 API call total).
    const versions = [GEMINI_CONTENT_VERSION, GEMINI_API_VERSION]; // v1 first, then v1beta
    const body = JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 100 },
    });

    async function tryOne(version, model) {
        const apiUrl = `${GEMINI_API_BASE}/${version}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        let response;
        try {
            response = await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body });
        } catch (networkErr) {
            console.warn(`Job Search Enhancer: Network error for ${version}/${model}:`, networkErr.message);
            return null; // treat as unavailable
        }
        if (response.status === 401 || response.status === 403) {
            return { success: false, reason: "invalid_api_key", message: "Invalid API key. Please check your key in the extension popup." };
        }
        if (response.status === 429) {
            _rateLimitedUntil = Date.now() + 60_000;
            return { success: false, reason: "rate_limited", message: "Gemini rate limit reached. Pausing for 60 seconds — please wait." };
        }
        if (response.status === 404 || !response.ok) {
            console.log(`Job Search Enhancer: ${version}/${model} unavailable (${response.status})`);
            return null; // skip
        }
        // Success
        console.log(`Job Search Enhancer: Using ${version}/${model}`);
        _workingModel = model;
        _workingVersion = version;
        const data = await response.json();
        return parseGeminiResponse(data);
    }

    // If we already found a working model, try it first (saves discovery requests)
    if (_workingModel && _workingVersion) {
        const cached = await tryOne(_workingVersion, _workingModel);
        if (cached !== null) return cached; // worked (or hard error like auth/rate-limit)
        // Cached model is now 404 — clear and fall through to full scan
        console.log("Job Search Enhancer: Cached model no longer available, re-discovering…");
        _workingModel = null;
        _workingVersion = null;
    }

    // Full scan: try every model across both versions
    for (const version of versions) {
        for (const model of MODEL_PREFERENCE) {
            const result = await tryOne(version, model);
            if (result !== null) return result;
        }
    }

    return { success: false, message: "No working Gemini model found for your API key. Please check your key or try again later." };
}


// ─── Parse Gemini Response ────────────────────────────────────────────────────
function parseGeminiResponse(data) {
    try {
        if (!data.candidates || !data.candidates[0]) {
            const blockReason = data?.promptFeedback?.blockReason;
            if (blockReason) {
                console.warn("Job Search Enhancer: Prompt blocked:", blockReason);
                return { success: true, status: "none" }; // blocked ≠ language required
            }
            return { success: false, message: "Gemini returned an empty response" };
        }

        const finishReason = data.candidates[0].finishReason;
        if (finishReason && finishReason !== "STOP") {
            console.warn("Job Search Enhancer: Unexpected finish reason:", finishReason);
            return { success: true, status: "none" };
        }

        const rawText = data.candidates[0].content?.parts?.[0]?.text || "";

        // Strip markdown fences and whitespace
        let cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

        // Extract JSON object if wrapped in other text
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) cleaned = match[0];

        const parsed = JSON.parse(cleaned);

        if (["required", "optional", "none"].includes(parsed.status)) {
            return { success: true, status: parsed.status };
        }

        return { success: false, message: "Unexpected status in Gemini response: " + parsed.status };

    } catch (err) {
        console.error("Job Search Enhancer: Failed to parse Gemini response:", err);
        return { success: false, message: "Could not parse Gemini response: " + err.message };
    }
}

// ─── Dynamic Model Selection ──────────────────────────────────────────────────
let _selectedModel = null;
let _modelFetchPromise = null;

async function selectBestModel(apiKey) {
    if (_selectedModel) return _selectedModel;
    if (_modelFetchPromise) return _modelFetchPromise;

    _modelFetchPromise = (async () => {
        try {
            const url = `${GEMINI_API_BASE}/${GEMINI_API_VERSION}/models?key=${apiKey}&pageSize=50`;
            const res = await fetch(url);
            if (!res.ok) { _selectedModel = MODEL_PREFERENCE[0]; return _selectedModel; }

            const data = await res.json();
            const models = (data.models || [])
                .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.replace("models/", ""));

            for (const pref of MODEL_PREFERENCE) {
                if (models.includes(pref)) { _selectedModel = pref; return _selectedModel; }
            }

            _selectedModel = models[0] || MODEL_PREFERENCE[0];
            return _selectedModel;
        } catch {
            _selectedModel = MODEL_PREFERENCE[0];
            return _selectedModel;
        } finally {
            _modelFetchPromise = null;
        }
    })();

    return _modelFetchPromise;
}

function getNextModel(failedModel) {
    const idx = MODEL_PREFERENCE.indexOf(failedModel);
    return MODEL_PREFERENCE[idx + 1] || MODEL_PREFERENCE[0];
}

async function analyzeWithGeminiModel(apiKey, language, text, model) {
    // Direct call with a specific model (used for 404 fallback)
    const prompt = `Analyze this job posting. Does it require ${language} language skills?
Job Posting: ${text}
Respond ONLY with one of: {"status":"required"} {"status":"optional"} {"status":"none"}`;

    const apiUrl = `${GEMINI_API_BASE}/${GEMINI_CONTENT_VERSION}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.1, maxOutputTokens: 100 } }),
        });
        if (!res.ok) return { success: false, message: `Model ${model} also failed (${res.status})` };
        const data = await res.json();
        return parseGeminiResponse(data);
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// Open options page on first install
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.runtime.openOptionsPage?.();
    }
});
