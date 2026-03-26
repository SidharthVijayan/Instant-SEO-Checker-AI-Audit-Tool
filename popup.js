document.addEventListener("DOMContentLoaded", () => {

  const metricsEl = document.getElementById("metrics");

  // Load cached data
  chrome.storage.local.get("seoData", (res) => {
    if (res.seoData) {
      metricsEl.innerText = "Words: " + res.seoData.wordCount;
    }
  });

  // Send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.id) {
      metricsEl.innerText = "No active tab";
      return;
    }

    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "analyze" },
      () => {
        if (chrome.runtime.lastError) {
          metricsEl.innerText =
            "⚠️ Refresh page or use normal site";
        }
      }
    );
  });
});

// Listen for results
chrome.runtime.onMessage.addListener((request) => {

  if (request.action === "analysisResult") {
    document.getElementById("metrics").innerText =
      `Words: ${request.data.wordCount}`;
  }

  if (request.action === "aiResult") {
    document.getElementById("aiInsights").innerText =
      request.data || "No AI result";
  }

});
