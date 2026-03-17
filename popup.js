document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("analyzeBtn");

  btn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"]
      });
    });
  });
});
