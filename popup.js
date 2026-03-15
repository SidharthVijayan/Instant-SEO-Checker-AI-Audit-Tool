chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

chrome.tabs.sendMessage(tabs[0].id, {action: "analyze"}, function(response) {

document.getElementById("results").innerHTML = `

<h3>SEO Score: ${response.seoScore}/100</h3>

<p><b>Title Length:</b> ${response.titleLength}</p>
<p><b>Meta Description:</b> ${response.metaLength}</p>
<p><b>Word Count:</b> ${response.wordCount}</p>
<p><b>H1 Count:</b> ${response.h1}</p>
<p><b>H2 Count:</b> ${response.h2}</p>
<p><b>Images:</b> ${response.images}</p>
<p><b>Images missing ALT:</b> ${response.missingAlt}</p>

`;

});

});
