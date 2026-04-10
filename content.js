(function () {
  try {
    if (document.getElementById("seo-inspector-panel")) return;

    function createPanel() {
      const panel = document.createElement("div");
      panel.id = "seo-inspector-panel";
      panel.style.position = "fixed";
      panel.style.top = "20px";
      panel.style.right = "20px";
      panel.style.width = "320px";
      panel.style.maxHeight = "420px";
      panel.style.overflowY = "auto";
      panel.style.background = "#111";
      panel.style.color = "#fff";
      panel.style.padding = "10px";
      panel.style.borderRadius = "8px";
      panel.style.zIndex = "999999";
      panel.style.fontSize = "12px";
      panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
      panel.innerHTML = "<b>SEO Structure Report</b><br/><small>Client-side analysis</small><br/><br/>";
      document.body.appendChild(panel);
      return panel;
    }

    function addLine(panel, label, value, status) {
      const color =
        status === "good" ? "#00e676" :
        status === "warn" ? "#ffca28" : "#ff5252";

      const div = document.createElement("div");
      div.style.marginBottom = "6px";
      div.innerHTML = `<span style="color:${color}">${label}: ${value}</span>`;
      panel.appendChild(div);
    }

    function highlight(el, color) {
      el.style.outline = `2px dashed ${color}`;
    }

    const panel = createPanel();

    // ---------- HEADINGS ----------
    const h1 = document.querySelectorAll("h1").length;
    const h2 = document.querySelectorAll("h2").length;

    addLine(panel, "H1 count", h1, h1 === 1 ? "good" : "bad");
    addLine(panel, "H2 count", h2, h2 > 0 ? "good" : "warn");

    // ---------- META ----------
    const meta = document.querySelector("meta[name='description']");
    addLine(panel, "Meta description", meta ? "Found" : "Not found", meta ? "good" : "bad");

    // ---------- PARAGRAPHS ----------
    let longCount = 0;
    document.querySelectorAll("p").forEach(p => {
      if (p.innerText.split(/\s+/).length > 120) {
        longCount++;
        highlight(p, "orange");
      }
    });

    addLine(panel, "Long paragraphs", longCount, longCount === 0 ? "good" : "warn");

    // ---------- LISTS ----------
    const lists = document.querySelectorAll("ul, ol").length;
    addLine(panel, "Lists", lists, lists > 0 ? "good" : "bad");

    // ---------- INTERNAL LINKS ----------
    const links = [...document.querySelectorAll("a")];
    const internal = links.filter(a => a.href.includes(location.hostname)).length;

    addLine(panel, "Internal links", internal, internal >= 3 ? "good" : "warn");

    // ---------- FAQ ----------
    const text = document.body.innerText.toLowerCase();
    const faq = text.includes("faq") || text.includes("frequently asked");

    addLine(panel, "FAQ section", faq ? "Found" : "Not found", faq ? "good" : "bad");

  } catch (e) {
    console.error(e);
  }
})();
