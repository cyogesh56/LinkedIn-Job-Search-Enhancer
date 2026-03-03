# LinkedIn-Job-Search-Enhancer
A Firefox/Chrome browser extension that makes LinkedIn job searching smarter by automatically detecting language requirements in job postings and filtering out promoted and reposted jobs.

---

## Features

### 🌍 Automatic Language Detection
Detects whether a job requires a non-English language — without AI, without API keys, with no data leaving your browser, with 95% accuracy.

- **Toggle on/off** from the popup with a single switch
- **Scans all 7 supported languages automatically** — no need to select one
- Uses a **3-pass detection system** for maximum accuracy:
  1. **Exact keyword matching** — e.g. `"deutsch erforderlich"`, `"fluent german"`, `"german c1"`
  2. **Proximity matching** — catches natural phrasing like `"fluent in English and German"` or `"sehr gute Sprachkompetenz in Deutsch"` where the language name and signal word are near each other but not adjacent
  3. **Document language detection** — if the entire job description is written in a non-English language (detected via stopword frequency), that language is flagged as required even with no explicit keywords

**Supported languages:** Dutch 🇳🇱 · Finnish 🇫🇮 · French 🇫🇷 · German 🇩🇪 · Italian 🇮🇹 · Norwegian 🇳🇴 · Spanish 🇪🇸

**Exclusion list** prevents false positives — e.g. `"no German required"` or `"German speaking country"` are ignored.

### 🏷️ Language Badge
A colour-coded badge is injected directly into the LinkedIn job detail panel, between the job title and the location/info row:

| Badge | Meaning |
|---|---|
| 🔴 `🇩🇪 German Required` | Language is explicitly required |
| 🟠 `🇫🇷 French Preferred` | Language is optional / nice to have |
| 🟢 `✅ No Language Requirement` | No non-English language requirement detected |

- If multiple languages are detected, the top two are shown in the badge
- All badge colours meet **WCAG AA contrast** standards

### 🚫 Hide Promoted Jobs
Automatically hides jobs marked as "Promoted" from the LinkedIn job list sidebar. Uses multiple detection methods to catch all LinkedIn layout variants:
- Checks visible label text
- Scans `aria-label` attributes
- Detects class names containing "promoted"

### 🔁 Hide Reposted Jobs
Automatically hides jobs marked as "Reposted", using the same robust multi-method detection.

### 🗑️ Manual Cache Reset
The popup includes a **Reset Cache** button that clears all cached scan results, forcing fresh detection on the next job click. Useful after updating settings or if a badge seems wrong.

### ⚡ Instant and Private
- **No AI, no API keys, no external requests** — everything runs locally in your browser
- Results are cached per job URL for **30 days** to avoid re-scanning
- Cache is versioned — stale results from older extension versions are automatically discarded

---

## Installation
Download ZIP file from Packages and follow below instructions for Chrome and Firefox:

**How to Install**
*Google Chrome/Brave/Microsoft Edge/Opera/Vivaldi*
1. Open Chrome and go to: chrome://extensions
2. Turn on "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked"
4. Navigate to and select the folder: job-search-enhancer
5. The extension icon (💼) appears in your toolbar

*Mozilla Firefox*
1. Open Firefox and go to: about:debugging
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on…"
4. Navigate to the job-search-enhancer folder and select *manifest.json*
5. The extension icon appears in your toolbar

## Addon Store Versions

### Firefox
Install from the [Firefox Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/linkedin-job-search-enhancer/)

### Chrome / Manual install (Developer Mode)
*(link coming soon)*
1. Clone or download this repository
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `job-search-enhancer` folder

---

## Screenshots
<img width="1800" height="1052" alt="Screenshot 2026-02-28 at 8 45 36 PM" src="https://github.com/user-attachments/assets/cc841b73-09d8-43e0-92a6-9e8f3288ab97" />
<img width="1912" height="1168" alt="Screenshot 2026-02-28 at 8 30 30 PM" src="https://github.com/user-attachments/assets/7615268c-64b2-4186-ac2a-7e56d93ece3f" />
<img width="1912" height="1168" alt="Screenshot 2026-02-28 at 8 28 17 PM" src="https://github.com/user-attachments/assets/d4f482d2-5d1a-44d2-9319-a04dfbd4061b" />
<img width="1912" height="1168" alt="Screenshot 2026-02-28 at 8 29 50 PM" src="https://github.com/user-attachments/assets/e9ad88c0-f0b0-4cba-b774-e6795f8b716f" />
<img width="1912" height="1168" alt="Screenshot 2026-02-28 at 8 30 00 PM" src="https://github.com/user-attachments/assets/20aa6523-7bd8-491e-948f-8fb5352a7b3d" />

---

## Source Code

The extension is written entirely in **plain HTML, CSS, and JavaScript** — no build tools, no bundlers, no minifiers, no preprocessors using Claude Sonnet 4.6 on Google Antigravity.

What you see in the repository is exactly what runs in the browser.

```
job-search-enhancer/
├── manifest.json          # Extension manifest (MV3)
├── content.js             # Main content script — badge injection, filtering, SPA navigation
├── languageKeywords.js    # All language keywords, stopwords, and detection functions
├── background.js          # Background script (minimal)
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic — settings save/load, cache reset
├── popup.css              # Popup styles
├── badge.css              # Badge styles (injected into LinkedIn pages)
├── styles.css             # General content styles
└── icons/                 # Extension icons
```

### Key files

- **`languageKeywords.js`** — Self-contained keyword database. Contains `LANGUAGE_DATA` (required/fluent/optional keywords per language), `LANGUAGE_EXCLUSIONS` (false-positive guards), `LANGUAGE_STOPWORDS` (for document language detection), and three exported functions: `checkLanguageRequirement`, `checkLanguageProximity`, `detectDocumentLanguage`.
- **`content.js`** — Runs on `linkedin.com/jobs/*`. Handles SPA navigation detection, the 3-pass language scan, badge DOM injection, promoted/reposted card filtering, and result caching.
- **`popup.js`** — Reads/writes settings via `chrome.storage.local`. Sends a `SETTINGS_UPDATED` message to the active tab when settings change so the badge updates immediately without a page reload.

---

## Privacy

This extension:
- Collects **no personal data**
- Makes **no network requests**
- Stores only your settings and a scan result cache **locally** in `chrome.storage.local`
- Never transmits anything outside your browser

---

## License

MIT
