// Extract full page text
const text = document.body.innerText.toLowerCase();

// Keyword groups
const powerWords = ["secret", "proven", "instant", "guaranteed", "exclusive"];
const scarcityWords = ["limited", "only today", "hurry", "last chance"];
const fearWords = ["danger", "risk", "warning", "shocking", "fear"];

// Count function
function countWords(wordList, text) {
  let count = 0;
  wordList.forEach(word => {
    const regex = new RegExp("\\b" + word + "\\b", "g");
    const matches = text.match(regex);
    if (matches) count += matches.length;
  });
  return count;
}

// Counts
const powerCount = countWords(powerWords, text);
const scarcityCount = countWords(scarcityWords, text);
const fearCount = countWords(fearWords, text);

// Scoring
let persuasionScore = Math.min(100,
  powerCount * 2 +
  scarcityCount * 3 +
  fearCount * 2
);

// Manipulation level
let manipulation = "LOW";
if (persuasionScore > 60) manipulation = "HIGH";
else if (persuasionScore > 30) manipulation = "MEDIUM";

// Send data to popup
chrome.runtime.sendMessage({
  action: "analysisResult",
  data: {
    persuasionScore,
    manipulation,
    powerCount,
    scarcityCount,
    fearCount
  }
});
