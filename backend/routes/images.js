const express = require("express");
const router = express.Router();
const { generateImage, generateSVGIllustration } = require("../services/imageService");

// POST /api/images/generate
// Generate a single image
router.post("/generate", async (req, res) => {
  try {
    const { prompt, visualType = "abstract", theme, slideType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "prompt is required" });
    }

    const imageData = await generateImage(prompt, visualType, theme, slideType);
    res.json({ success: true, imageData });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
});

// POST /api/images/svg
// Generate an SVG illustration (always works, no API key needed)
router.post("/svg", (req, res) => {
  try {
    const { visualType = "abstract", theme, slideType = "insight" } = req.body;
    const svgData = generateSVGIllustration(visualType, theme, slideType, "");
    res.json({ success: true, imageData: svgData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
