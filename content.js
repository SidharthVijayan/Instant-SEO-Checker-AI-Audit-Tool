chrome.runtime.onMessage.addListener((request) => {

  if (request.action === "analyze") {

    const fullText = document.body.innerText || "";
    const title = document.title || "";

    const wordCount = fullText.split(/\s+/).length;

    const result = {
      wordCount,
      title,
      url: window.location.href,
      text: fullText.substring(0, 2000)
    };

    chrome.runtime.sendMessage({
      action: "analysisResult",
      data: result
    });

    // 🔥 AI CALL
    fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: result.text,
        title: title
      })
    })
    .then(res => res.json())
    .then(ai => {
      chrome.runtime.sendMessage({
        action: "aiResult",
        data: ai.result || "No AI response"
      });
    })
    .catch(err => {
      chrome.runtime.sendMessage({
        action: "aiResult",
        data: "AI Error: " + err.message
      });
    });
  }
});
