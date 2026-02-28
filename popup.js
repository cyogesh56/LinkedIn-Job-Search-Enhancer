/**
 * popup.js — Loads and saves user settings for Job Search Enhancer.
 */

"use strict";

// ─── DOM References ────────────────────────────────────────────────────────────
const resetCacheBtn = document.getElementById("reset-cache-btn");
const languageToggle = document.getElementById("language-toggle");
const promotedToggle = document.getElementById("promoted-toggle");
const repostedToggle = document.getElementById("reposted-toggle");
const settingsForm = document.getElementById("settings-form");
const statusMessage = document.getElementById("status-message");
const saveBtn = document.getElementById("save-btn");
const saveBtnText = document.getElementById("save-btn-text");
const saveBtnSpinner = document.getElementById("save-btn-spinner");

// ─── Reset Cache ───────────────────────────────────────────────────────────────
resetCacheBtn.addEventListener("click", () => {
  chrome.storage.local.remove("jseScannedJobs", () => {
    showStatus("🗑 Cache cleared — jobs will be re-analysed on next click.", "success", 3000);
    resetCacheBtn.textContent = "✓ Cleared!";
    setTimeout(() => { resetCacheBtn.textContent = "Reset Cache"; }, 2500);
  });
});

// ─── Status Message Helper ─────────────────────────────────────────────────────
function showStatus(message, type = "success", durationMs = 3500) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.classList.remove("hidden");

  clearTimeout(statusMessage._timer);
  statusMessage._timer = setTimeout(() => {
    statusMessage.classList.add("hidden");
  }, durationMs);
}

// ─── Set Button Loading State ──────────────────────────────────────────────────
function setLoading(isLoading) {
  saveBtn.disabled = isLoading;
  saveBtnText.textContent = isLoading ? "Saving…" : "Save Settings";
  if (isLoading) {
    saveBtnSpinner.classList.remove("hidden");
  } else {
    saveBtnSpinner.classList.add("hidden");
  }
}

// ─── Load Settings from Storage ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(
    { languageDetectionEnabled: false, hidePromoted: false, hideReposted: false },
    (settings) => {
      if (chrome.runtime.lastError) {
        showStatus("Could not load settings: " + chrome.runtime.lastError.message, "error");
        return;
      }
      languageToggle.checked = Boolean(settings.languageDetectionEnabled);
      promotedToggle.checked = Boolean(settings.hidePromoted);
      repostedToggle.checked = Boolean(settings.hideReposted);
    }
  );
});

// ─── Save Settings ─────────────────────────────────────────────────────────────
settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const languageDetectionEnabled = languageToggle.checked;
  const hidePromoted = promotedToggle.checked;
  const hideReposted = repostedToggle.checked;

  setLoading(true);

  try {
    await new Promise((resolve, reject) => {
      chrome.storage.local.set(
        { languageDetectionEnabled, hidePromoted, hideReposted },
        () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve();
          }
        }
      );
    });

    showStatus("✅ Settings saved! Reload the LinkedIn tab.", "success");

    // Notify the active LinkedIn tab that settings changed
    try {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (activeTab && activeTab.url && activeTab.url.includes("linkedin.com/jobs")) {
        chrome.tabs.sendMessage(activeTab.id, { type: "SETTINGS_UPDATED" }).catch(() => { });
      }
    } catch (_) { }

  } catch (err) {
    showStatus("❌ Failed to save settings: " + err.message, "error");
  } finally {
    setLoading(false);
  }
});
