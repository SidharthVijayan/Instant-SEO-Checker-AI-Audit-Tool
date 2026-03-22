let pageText = "";

document.addEventListener("DOMContentLoaded", () => {

  chrome.storage.local.get("seoData", (res) => {
    if (res.seoData) updateUI(res.seoData);
  });

  setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" });
    });
  }, 100);
});

function updateUI(d) {
  pageText = d.text;

  document.getElementById("seoScore").innerText = d.seoScore + "%";
  document.getElementById("aiScore").innerText = d.aiScore + "%";
  document.getElementById("originality").innerText = d.originality + "%";

  document.getElementById("metrics").innerText =
    `Words: ${d.wordCount} | Sentence length: ${d.avgSentenceLength}`;

  const issueBox = document.getElementById("issues");
  issueBox.innerHTML = "";
  d.issues.forEach(i => {
    const p = document.createElement("p");
    p.innerText = "⚠️ " + i;
    issueBox.appendChild(p);
  });

  const llmBox = document.getElementById("llm");
  llmBox.innerHTML = "";
  d.llmSuggestions.forEach(s => {
    const p = document.createElement("p");
    p.innerText = "• " + s;
    llmBox.appendChild(p);
  });
}
