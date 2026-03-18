const text = document.body.innerText.toLowerCase();

// ===== SEO CHECKS =====
const title = document.title;
const metaDescription = document.querySelector('meta[name="description"]')?.content || "";
const h1Tags = document.querySelectorAll("h1");

// ===== WORD LISTS =====
const powerWords = ["secret", "proven", "instant", "guaranteed", "exclusive"];
const scarcityWords = ["limited", "only today", "hurry", "last chance"];
const fearWords = ["danger", "risk", "warning", "shocking", "fear"];

// ===== COUNT FUNCTION =====
function countWords(list, text) {
  let count = 0;
  list.forEach(word => {
    const regex = new RegExp("\\b" + word + "\\b", "g");
    const matches = text.match(regex);
    if (matches) count += matches.length;
  });
  return count;
}

// ===== COUNTS =====
const powerCount = countWords(powerWords, text);
const scarcityCount = countWords(scarcityWords, text);
const fearCount = countWords(fearWords, text);

// ===== SCORES =====
let persuasionScore = Math.min(100,
  powerCount * 2 + scarcityCount * 3 + fearCount * 2
);

let manipulation = "LOW";
if (persuasionScore > 60) manipulation = "HIGH";
else if (persuasionScore > 30) manipulation = "MEDIUM";

// ===== SEO SCORE =====
let seoScore = 100;

if (title.length < 30 || title.length > 60) seoScore -= 15;
if (metaDescription.length < 50 || metaDescription.length > 160) seoScore -= 15;
if (h1Tags.length === 0) seoScore -= 20;
if (h1Tags.length > 1) seoScore -= 10;

// ===== AI SUGGESTIONS =====
let suggestions = [];

if (title.length < 30) {
  suggestions.push("Make your title longer and more descriptive (50–60 chars ideal)");
}

if (metaDescription.length < 50) {
  suggestions.push("Add a proper meta description to improve CTR");
}

if (h1Tags.length === 0) {
  suggestions.push("Add an H1 tag to structure your content");
}

if (persuasionScore > 70) {
  suggestions.push("Your content is too aggressive. Reduce urgency & emotional pressure.");
}

if (persuasionScore < 20) {
  suggestions.push("Add stronger emotional or persuasive words to improve engagement.");
}

// ===== SEND DATA =====
chrome.runtime.sendMessage({
  action: "analysisResult",
  data: {
    seoScore,
    persuasionScore,
    manipulation,
    powerCount,
    scarcityCount,
    fearCount,
    suggestions
  }
});
