chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "analyze") {

    const fullText = document.body.innerText || "";
    const title = document.title || "";

    // Basic quick result
    const wordCount = fullText.split(/\s+/).length;

    const result = {
      wordCount,
      title,
      url: window.location.href,
      text: fullText.substring(0, 2000)
    };

    chrome.storage.local.set({ seoData: result });

    chrome.runtime.sendMessage({
      action: "analysisResult",
      data: result
    });

    // ===== AI CALL =====
    fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: fullText.substring(0, 2000),
        title: title
      })
    })
    .then(res => res.json())
    .then(ai => {
      chrome.runtime.sendMessage({
        action: "aiResult",
        data: ai.result
      });
    })
    .catch(err => console.error(err));
  }
});
