const express = require("express");
const router = express.Router();

// POST /api/export/json
// Export creative as JSON
router.post("/json", (req, res) => {
  try {
    const { creative } = req.body;
    if (!creative) return res.status(400).json({ error: "creative data required" });

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="cuemath-${creative.id || "creative"}.json"`);
    res.json(creative);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/export/text
// Export as plain text (for copywriters)
router.post("/text", (req, res) => {
  try {
    const { creative } = req.body;
    if (!creative) return res.status(400).json({ error: "creative data required" });

    let text = `CUEMATH SOCIAL MEDIA CREATIVE\n`;
    text += `================================\n`;
    text += `Title: ${creative.title}\n`;
    text += `Format: ${creative.format}\n`;
    text += `Generated: ${creative.createdAt}\n\n`;

    text += `SLIDES\n------\n`;
    creative.slides?.forEach((slide, i) => {
      text += `\nSlide ${i + 1} [${slide.type?.toUpperCase()}]\n`;
      text += `Heading: ${slide.heading}\n`;
      if (slide.subheading) text += `Subheading: ${slide.subheading}\n`;
      if (slide.bodyText) text += `Body: ${slide.bodyText}\n`;
      if (slide.callout) text += `Callout: ${slide.callout}\n`;
      text += `Visual: ${slide.visualPrompt}\n`;
    });

    text += `\nCAPTION\n-------\n${creative.caption}\n`;
    text += `\nHASHTAGS\n--------\n${creative.hashtags?.join(" ")}\n`;

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename="cuemath-${creative.id || "creative"}.txt"`);
    res.send(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
