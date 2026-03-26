document.addEventListener("DOMContentLoaded", () => {

  const metricsEl = document.getElementById("metrics");
  const aiEl = document.getElementById("aiInsights");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    // Inject content.js every time (no refresh needed)
    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["content.js"]
      },
      () => {
        chrome.tabs.sendMessage(tabId, { action: "analyze" });
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
