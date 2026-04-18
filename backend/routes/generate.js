const express = require("express");
const router = express.Router();
const { generateContent, regenerateSlide, generateCaption } = require("../services/claudeService");
const { generateImage } = require("../services/imageService");
const Creative = require("../models/Creative");

router.post("/creative", async (req, res) => {
  try {
    const { prompt, format = "carousel", slideCount, tone, brand, generateImages = true } = req.body;
    if (!prompt || prompt.trim().length < 5)
      return res.status(400).json({ error: "Please provide a more detailed idea" });

    const content = await generateContent(prompt, format, slideCount, tone, brand);

    if (generateImages) {
      content.slides = await Promise.all(content.slides.map(async (slide) => {
        try {
          slide.imageData = await generateImage(slide.visualPrompt, slide.visualType || "abstract", content.theme, slide.type);
        } catch (e) { console.warn("Image failed:", e.message); }
        return slide;
      }));
    }

    content.originalPrompt = prompt;
    content.format = format;
    content.tone = tone;

    const saved = await Creative.create(content);
    res.json({ success: true, creative: { ...content, _id: saved._id, id: saved._id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to generate creative" });
  }
});

router.put("/creative/:id", async (req, res) => {
  try {
    const { creative } = req.body;
    const updated = await Creative.findByIdAndUpdate(req.params.id, creative, { new: true });
    if (!updated) return res.status(404).json({ error: "Creative not found" });
    res.json({ success: true, creative: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/history", async (req, res) => {
  try {
    const creatives = await Creative.find({})
        .sort({ createdAt: -1 })
        .limit(20)
        .select("_id title format originalPrompt createdAt theme slides");
    res.json({ success: true, creatives });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/creative/:id", async (req, res) => {
  try {
    const creative = await Creative.findById(req.params.id);
    if (!creative) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, creative });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/creative/:id", async (req, res) => {
  try {
    await Creative.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/slide", async (req, res) => {
  try {
    const { slide, instruction, format, brand } = req.body;
    if (!slide || !instruction) return res.status(400).json({ error: "slide and instruction required" });
    const updatedSlide = await regenerateSlide(slide, instruction, format, brand);
    if (updatedSlide.visualPrompt) {
      try {
        updatedSlide.imageData = await generateImage(updatedSlide.visualPrompt, updatedSlide.visualType || "abstract", null, updatedSlide.type);
      } catch (e) {}
    }
    res.json({ success: true, slide: updatedSlide });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/caption", async (req, res) => {
  try {
    const { slides, format, tone } = req.body;
    if (!slides?.length) return res.status(400).json({ error: "slides required" });
    const caption = await generateCaption(slides, format, tone);
    res.json({ success: true, ...caption });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/formats", (req, res) => {
  const { FORMAT_SPECS } = require("../services/claudeService");
  res.json({ formats: FORMAT_SPECS });
});

module.exports = router;