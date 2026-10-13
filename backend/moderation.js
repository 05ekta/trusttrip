// backend/moderation.js
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Use global fetch (Node 18+) — if your Node version doesn't support it, install node-fetch
const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.warn("WARNING: OPENAI_API_KEY not set in .env");
}

/**
 * POST /moderate
 * body: { text: string, fileUrl?: string, threshold?: number, categories?: string[] }
 * Returns: { allowed: boolean, reasons: [...], raw: <openai response> }
 */
router.post("/moderate", async (req, res) => {
  try {
    const { text = "", fileUrl = null, threshold = 0.5, categories = null } = req.body;

    // Basic check
    if (!text && !fileUrl) return res.status(400).json({ error: "Provide text or fileUrl" });

    // If fileUrl is provided and is a local path you want to moderate,
    // you could read and extract its text server-side here (optional).
    // For now, we moderate the `text` field.
    const content = String(text);

    // Call OpenAI Moderation endpoint
    const resp = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({ model: "omni-moderation-latest", input: content }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("OpenAI moderation error:", resp.status, t);
      return res.status(500).json({ error: "Moderation provider error", detail: t });
    }

    const json = await resp.json();
    // OpenAI moderation shape: { results: [ { categories: {...}, category_scores: {...}, flagged: bool } ] }
    const result = json.results?.[0] || {};
    const categoriesObj = result.categories || {};
    const scores = result.category_scores || {};

    // Build labels array of { label, score, flagged }
    const labels = Object.keys(categoriesObj).map((label) => ({
      label,
      flagged: !!categoriesObj[label],
      score: scores[label] ?? null,
    }));

    // Decide "unsafe" based on flagged OR (score >= threshold) — and optional category filter
    let unsafe = labels.filter((l) => l.flagged || (typeof l.score === "number" && l.score >= threshold));
    if (Array.isArray(categories) && categories.length) {
      unsafe = unsafe.filter((l) => categories.includes(l.label));
    }

    const allowed = unsafe.length === 0;

    return res.json({
      allowed,
      unsafe,
      labels,
      raw: result,
    });
  } catch (err) {
    console.error("Moderation endpoint error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
