document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("analyzeBtn");
  const results = document.getElementById("results");

  btn.addEventListener("click", () => {
    results.innerHTML = "Analyzing...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"]
      });
    });
  });

  chrome.runtime.onMessage.addListener((data) => {

    let scoreClass = data.seoScore > 70 ? "good" : "bad";

    let issues = "";

    if (data.h1 === 0) issues += "<div class='item bad'>❌ No H1 tag</div>";
    if (data.metaLength < 70) issues += "<div class='item bad'>❌ Meta too short</div>";
    if (data.titleLength < 30) issues += "<div class='item bad'>❌ Title too short</div>";
    if (data.missingAlt > 0) issues += "<div class='item bad'>❌ Missing ALT tags</div>";
    if (data.wordCount < 300) issues += "<div class='item bad'>❌ Low content</div>";

    results.innerHTML = `
      <div class="score ${scoreClass}">Score: ${data.seoScore}</div>

      <div class="item">Words: ${data.wordCount}</div>
      <div class="item">Title: ${data.titleLength}</div>
      <div class="item">Meta: ${data.metaLength}</div>
      <div class="item">H1: ${data.h1} | H2: ${data.h2}</div>
      <div class="item">Images: ${data.images}</div>

      <hr>

      <div><b>Issues:</b></div>
      ${issues || "<div class='item good'>✅ No major issues</div>"}
    `;
  });

});
