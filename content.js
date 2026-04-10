// content.js (PRO VERSION)

(function () {
  try {
    console.log("SEO Inspector PRO loaded");

    const issues = [];

    // ---------- HELPERS ----------
    function createPanel() {
      const panel = document.createElement("div");
      panel.id = "seo-inspector-panel";
      panel.style.position = "fixed";
      panel.style.top = "20px";
      panel.style.right = "20px";
      panel.style.width = "300px";
      panel.style.maxHeight = "400px";
      panel.style.overflowY = "auto";
      panel.style.background = "#111";
      panel.style.color = "#fff";
      panel.style.padding = "10px";
      panel.style.borderRadius = "8px";
      panel.style.zIndex = "999999";
      panel.style.fontSize = "12px";
      panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
      panel.innerHTML = "<b>🔍 SEO Issues</b><br/><br/>";
      document.body.appendChild(panel);
      return panel;
    }

    function addIssue(panel, title, reason, fix) {
      const div = document.createElement("div");
      div.style.marginBottom = "10px";
      div.innerHTML = `
        <b style="color:#ff5252;">${title}</b><br/>
        <small>Why: ${reason}</small><br/>
        <small style="color:#00e676;">Fix: ${fix}</small>
      `;
      panel.appendChild(div);
    }

    function highlightElement(el, color = "red") {
      el.style.outline = `2px dashed ${color}`;
    }

    // ---------- CHECKS ----------

    // H1 check
    const h1s = document.querySelectorAll("h1");
    if (h1s.length === 0) {
      issues.push({
        title: "Missing H1",
        reason: "Search engines rely on H1 to understand page topic",
        fix: "Add one clear H1 with primary keyword"
      });
    }

    // H2 check
    const h2s = document.querySelectorAll("h2");
    if (h2s.length === 0) {
      issues.push({
        title: "No H2 headings",
        reason: "Poor content structure affects readability and SEO",
        fix: "Break content into sections using H2 tags"
      });
    }

    // Meta description
    const metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      issues.push({
        title: "Missing Meta Description",
        reason: "Reduces CTR and snippet control in search",
        fix: "Add a 140–160 character meta description"
      });
    }

    // Paragraph length
    const paragraphs = document.querySelectorAll("p");
    let longParaCount = 0;

    paragraphs.forEach(p => {
      const words = p.innerText.split(/\s+/).length;
      if (words > 120) {
        longParaCount++;
        highlightElement(p, "orange");
      }
    });

    if (longParaCount > 0) {
      issues.push({
        title: "Long Paragraphs",
        reason: "Hard to read and poor for AI extraction",
        fix: "Keep paragraphs under 80 words"
      });
    }

    // Lists
    const lists = document.querySelectorAll("ul, ol").length;
    if (lists === 0) {
      issues.push({
        title: "No Lists Found",
        reason: "Lists improve readability and AI extraction",
        fix: "Add bullet points for key sections"
      });
    }

    // Internal links
    const links = [...document.querySelectorAll("a")];
    const internalLinks = links.filter(a => a.href.includes(location.hostname)).length;

    if (internalLinks < 3) {
      issues.push({
        title: "Low Internal Links",
        reason: "Weak site structure and SEO signal",
        fix: "Add at least 3–5 internal links"
      });
    }

    // FAQ detection
    const text = document.body.innerText.toLowerCase();
    if (!text.includes("faq") && !text.includes("frequently asked")) {
      issues.push({
        title: "No FAQ Section",
        reason: "Important for AI and featured snippets",
        fix: "Add FAQ section with questions and answers"
      });
    }

    // ---------- PANEL ----------
    if (issues.length > 0) {
      const panel = createPanel();

      issues.forEach(issue => {
        addIssue(panel, issue.title, issue.reason, issue.fix);
      });
    }

  } catch (err) {
    console.error("SEO Inspector PRO error:", err);
  }
})();
