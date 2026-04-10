document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: analyzePage
  });

  displayResults(results[0].result);
});

function displayResults(data) {
  const el = document.getElementById("results");

  el.innerHTML = `
    <div class="section">
      <b>Headings</b><br/>
      <span class="${data.h1 === 1 ? 'good' : 'bad'}">H1: ${data.h1}</span><br/>
      <span class="${data.h2 > 0 ? 'good' : 'warn'}">H2: ${data.h2}</span><br/>
      <span class="${data.h3 > 0 ? 'good' : 'warn'}">H3: ${data.h3}</span>
    </div>

    <div class="section">
      <b>Meta</b><br/>
      <span class="${data.title ? 'good' : 'bad'}">Title: ${data.title ? 'Present' : 'Missing'}</span><br/>
      <span class="${data.metaDesc ? 'good' : 'bad'}">Meta Description: ${data.metaDesc ? 'Present' : 'Missing'}</span>
    </div>

    <div class="section">
      <b>Content</b><br/>
      <span class="${data.longParas === 0 ? 'good' : 'warn'}">Long Paragraphs: ${data.longParas}</span><br/>
      <span class="${data.lists > 0 ? 'good' : 'bad'}">Lists: ${data.lists}</span><br/>
      <span class="${data.tables > 0 ? 'good' : 'bad'}">Tables: ${data.tables}</span>
    </div>

    <div class="section">
      <b>Links</b><br/>
      <span class="${data.internalLinks >= 3 ? 'good' : 'warn'}">
        Internal Links: ${data.internalLinks}
      </span>
    </div>

    <div class="section">
      <b>AI Readiness</b><br/>
      <span class="${data.faq ? 'good' : 'bad'}">FAQ Section: ${data.faq ? 'Found' : 'Missing'}</span><br/>
      <span class="${data.tldr ? 'good' : 'bad'}">TL;DR: ${data.tldr ? 'Found' : 'Missing'}</span><br/>
      <span class="${data.definition ? 'good' : 'bad'}">Definition Block: ${data.definition ? 'Found' : 'Missing'}</span>
    </div>

    <div class="section">
      <b>Score</b><br/>
      <span class="good">${data.score}/100</span>
    </div>
  `;
}

function analyzePage() {
  const h1 = document.querySelectorAll("h1").length;
  const h2 = document.querySelectorAll("h2").length;
  const h3 = document.querySelectorAll("h3").length;

  const title = document.querySelector("title")?.innerText || "";
  const metaDesc = document.querySelector("meta[name='description']");

  const paragraphs = [...document.querySelectorAll("p")];
  const longParas = paragraphs.filter(p => p.innerText.split(" ").length > 80).length;

  const lists = document.querySelectorAll("ul, ol").length;
  const tables = document.querySelectorAll("table").length;

  const links = [...document.querySelectorAll("a")];
  const internalLinks = links.filter(a => a.href.includes(location.hostname)).length;

  // AI signals
  const text = document.body.innerText.toLowerCase();

  const faq = text.includes("faq") || text.includes("frequently asked questions");
  const tldr = text.includes("tl;dr");
  const definition = text.includes(" is ") && text.includes(" refers to ");

  // scoring
  let score = 0;
  if (h1 === 1) score += 10;
  if (h2 > 0) score += 10;
  if (metaDesc) score += 15;
  if (longParas === 0) score += 10;
  if (lists > 0) score += 10;
  if (tables > 0) score += 10;
  if (internalLinks >= 3) score += 10;
  if (faq) score += 10;
  if (tldr) score += 10;
  if (definition) score += 5;

  return {
    h1, h2, h3,
    title: !!title,
    metaDesc: !!metaDesc,
    longParas,
    lists,
    tables,
    internalLinks,
    faq,
    tldr,
    definition,
    score
  };
}
