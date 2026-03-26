import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  try {
    const { content, title } = req.body;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: `
You are an expert SEO + AI visibility analyst.

Analyze and return:

1. SEO Issues
2. AI Visibility Improvements
3. Content Weaknesses
4. Suggested:
   - Meta Title
   - Meta Description
   - H1
5. Scores:
   - SEO Score (0-100)
   - AI Visibility Score (0-100)

Title: ${title}

Content:
${content}
`,
        stream: false
      })
    });

    const data = await response.json();

    res.json({
      result: data.response || "No response from Ollama"
    });

  } catch (err) {
    res.status(500).json({
      result: "Server Error: " + err.message
    });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend running at http://localhost:3000");
});
