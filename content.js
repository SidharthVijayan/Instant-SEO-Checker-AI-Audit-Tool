chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "analyze") {

    try {
      const fullText = document.body.innerText || "";
      const text = fullText.substring(0, 3000).toLowerCase();

      const title = document.title || "";
      const metaDescription = document.querySelector('meta[name="description"]')?.content || "";
      const h1Tags = document.querySelectorAll("h1");

      // WORD LISTS
      const powerWords = ["secret","proven","instant","guaranteed","exclusive","ultimate","best","top"];
      const scarcityWords = ["limited","only today","hurry","last chance","act now"];
      const fearWords = ["danger","risk","warning","mistake","avoid","loss"];

      function countWords(list, text) {
        let count = 0;
        for (let word of list) {
          if (text.includes(word)) {
            count += text.split(word).length - 1;
          }
        }
        return count;
      }

      const powerCount = countWords(powerWords, text);
      const scarcityCount = countWords(scarcityWords, text);
      const fearCount = countWords(fearWords, text);

      // CONTENT METRICS
      const wordCount = fullText.split(" ").length;
      const sentenceCount = fullText.split(".").length;
      const avgSentenceLength = Math.round(wordCount / sentenceCount);

      // SCORES
      let persuasionScore = Math.min(100,
        powerCount * 2 + scarcityCount * 3 + fearCount * 2
      );

      let manipulation = "LOW";
      if (persuasionScore > 60) manipulation = "HIGH";
      else if (persuasionScore > 30) manipulation = "MEDIUM";

      let seoScore = 100;

      if (title.length < 30 || title.length > 60) seoScore -= 15;
      if (metaDescription.length < 50 || metaDescription.length > 160) seoScore -= 15;
      if (h1Tags.length === 0) seoScore -= 20;
      if (h1Tags.length > 1) seoScore -= 10;

      // SUGGESTIONS
      let suggestions = [];

      if (title.length < 30) suggestions.push("Title is too short. Add keywords.");
      if (metaDescription.length < 50) suggestions.push("Meta description is weak or missing.");
      if (h1Tags.length === 0) suggestions.push("Add an H1 tag.");

      if (wordCount < 300) suggestions.push("Content is too thin. Add depth.");
      if (avgSentenceLength > 25) suggestions.push("Sentences too long. Improve readability.");

      if (persuasionScore === 0) {
        suggestions.push("Add emotional or persuasive language.");
      }

      if (persuasionScore > 70) {
        suggestions.push("Reduce aggressive persuasion for better trust.");
      }

      const result = {
        seoScore,
        persuasionScore,
        manipulation,
        powerCount,
        scarcityCount,
        fearCount,
        suggestions,
        wordCount,
        avgSentenceLength,
        text: fullText.substring(0, 1000)
      };

      // CACHE
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
