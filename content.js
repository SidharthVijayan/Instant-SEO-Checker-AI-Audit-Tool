chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "analyze") {

    try {
      const fullText = document.body.innerText || "";
      const text = fullText.substring(0, 4000).toLowerCase();

      const title = document.title || "";
      const metaDescription = document.querySelector('meta[name="description"]')?.content || "";
      const h1Tags = document.querySelectorAll("h1");

      const wordCount = fullText.split(/\s+/).length;
      const sentenceCount = fullText.split(/[.!?]/).length;
      const avgSentenceLength = Math.round(wordCount / (sentenceCount || 1));

      const headings = Array.from(document.querySelectorAll("h1,h2,h3"))
        .map(h => h.innerText.toLowerCase());

      const faqWords = ["what","how","why","when","which"];

      function countWords(list, text) {
        let count = 0;
        for (let word of list) {
          if (text.includes(word)) count += text.split(word).length - 1;
        }
        return count;
      }

      const powerWords = ["best","ultimate","top","proven","exclusive","powerful"];
      const powerCount = countWords(powerWords, text);

      // SEO SCORE
      let seoScore = 100;
      if (title.length < 40 || title.length > 60) seoScore -= 15;
      if (!metaDescription) seoScore -= 20;
      if (h1Tags.length !== 1) seoScore -= 15;
      if (wordCount < 600) seoScore -= 20;

      // AI SCORE
      let aiScore = 0;
      if (h1Tags.length === 1) aiScore += 20;
      if (wordCount > 800) aiScore += 20;
      if (avgSentenceLength < 20) aiScore += 15;
      if (headings.length > 5) aiScore += 15;
      if (faqWords.some(w => text.includes(w))) aiScore += 20;
      if (text.includes(":") || text.includes("-")) aiScore += 10;
      aiScore = Math.min(aiScore, 100);

      // ORIGINALITY
      let originality = 100;
      const words = text.split(" ");
      const uniqueWords = new Set(words);
      if (uniqueWords.size < words.length * 0.6) originality -= 30;
      if (powerCount > 10) originality -= 20;

      // ISSUES
      let issues = [];
      if (title.length < 40) issues.push("Title too short");
      if (!metaDescription) issues.push("Missing meta description");
      if (h1Tags.length !== 1) issues.push("Incorrect H1 structure");
      if (wordCount < 600) issues.push("Content too thin");

      // LLM SUGGESTIONS
      let llmSuggestions = [];
      if (wordCount < 800) llmSuggestions.push("Increase content depth (800+ words)");
      if (!faqWords.some(w => text.includes(w))) llmSuggestions.push("Add FAQ sections");
      if (avgSentenceLength > 20) llmSuggestions.push("Use shorter sentences");
      if (headings.length < 5) llmSuggestions.push("Add structured headings");
      if (!text.includes(":")) llmSuggestions.push("Use lists/definitions");

      const result = {
        seoScore,
        aiScore,
        originality,
        wordCount,
        avgSentenceLength,
        issues,
        llmSuggestions,

        // IMPORTANT FOR REPORT
        url: window.location.href,
        title,
        metaDescription,
        h1: document.querySelector("h1")?.innerText || "",

        text: fullText.substring(0, 1000)
      };

      chrome.storage.local.set({ seoData: result });

      chrome.runtime.sendMessage({
        action: "analysisResult",
        data: result
      });

    } catch (err) {
      console.error(err);
    }
  }
});
