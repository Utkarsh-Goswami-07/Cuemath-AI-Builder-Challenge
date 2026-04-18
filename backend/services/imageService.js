const axios = require("axios");

// Generate image via Stability AI
async function generateWithStability(prompt, width = 1024, height = 1024) {
  if (!process.env.STABILITY_API_KEY) {
    throw new Error("STABILITY_API_KEY not configured");
  }

  const response = await axios.post(
    "https://api.stability.ai/v2beta/stable-image/generate/core",
    {
      prompt: `${prompt}. Clean, modern, educational illustration. Vibrant colors. Professional design.`,
      negative_prompt: "text, words, letters, numbers, watermarks, nsfw, realistic photo, ugly",
      aspect_ratio: width > height ? "1:1" : "1:1",
      output_format: "png",
      style_preset: "digital-art",
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        Accept: "image/*",
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    }
  );

  const base64 = Buffer.from(response.data).toString("base64");
  return `data:image/png;base64,${base64}`;
}

// Generate beautiful SVG illustration as fallback
function generateSVGIllustration(visualType, theme, slideType, heading) {
  const colors = {
    primary: theme?.primaryColor || "#FF6B35",
    secondary: theme?.secondaryColor || "#1A1A2E",
    accent: theme?.accentColor || "#FFD700",
    bg: theme?.backgroundColor || "#FFF8F5",
  };

  const svgs = {
    chart: generateChartSVG(colors),
    abstract: generateAbstractSVG(colors, slideType),
    illustration: generateIllustrationSVG(colors, slideType),
    icon: generateIconSVG(colors, slideType),
    photo: generateAbstractSVG(colors, slideType),
  };

  const svg = svgs[visualType] || svgs.abstract;
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

function generateChartSVG(colors) {
  return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.secondary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:0.8" />
    </linearGradient>
    <linearGradient id="bar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.accent}" />
      <stop offset="100%" style="stop-color:${colors.primary}" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <!-- Grid lines -->
  <line x1="60" y1="50" x2="60" y2="320" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <line x1="60" y1="320" x2="370" y2="320" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <!-- Bars (forgetting curve style - decreasing) -->
  <rect x="80" y="100" width="40" height="220" fill="url(#bar)" rx="4" opacity="0.9"/>
  <rect x="150" y="165" width="40" height="155" fill="url(#bar)" rx="4" opacity="0.85"/>
  <rect x="220" y="210" width="40" height="110" fill="url(#bar)" rx="4" opacity="0.8"/>
  <rect x="290" y="240" width="40" height="80" fill="url(#bar)" rx="4" opacity="0.75"/>
  <!-- Curve overlay -->
  <path d="M 100 110 Q 190 140 260 215 T 380 265" stroke="${colors.accent}" stroke-width="3" fill="none" stroke-dasharray="8,4"/>
  <!-- Dots -->
  <circle cx="100" cy="110" r="6" fill="${colors.accent}"/>
  <circle cx="170" cy="170" r="6" fill="${colors.accent}"/>
  <circle cx="240" cy="215" r="6" fill="${colors.accent}"/>
  <circle cx="310" cy="245" r="6" fill="${colors.accent}"/>
  <!-- Decorative circles -->
  <circle cx="360" cy="60" r="30" fill="${colors.primary}" opacity="0.3"/>
  <circle cx="30" cy="350" r="20" fill="${colors.accent}" opacity="0.2"/>
</svg>`;
}

function generateAbstractSVG(colors, slideType) {
  const shapes = {
    hook: `
      <circle cx="200" cy="180" r="120" fill="${colors.primary}" opacity="0.15"/>
      <circle cx="200" cy="180" r="80" fill="${colors.primary}" opacity="0.25"/>
      <circle cx="200" cy="180" r="45" fill="${colors.primary}" opacity="0.9"/>
      <circle cx="200" cy="180" r="20" fill="white" opacity="0.95"/>
      <!-- Orbiting dots -->
      <circle cx="320" cy="180" r="10" fill="${colors.accent}"/>
      <circle cx="200" cy="60" r="7" fill="${colors.accent}" opacity="0.8"/>
      <circle cx="80" cy="180" r="10" fill="${colors.accent}"/>
      <circle cx="200" cy="300" r="7" fill="${colors.accent}" opacity="0.8"/>
    `,
    insight: `
      <!-- Brain/network pattern -->
      <circle cx="200" cy="200" r="60" fill="none" stroke="${colors.primary}" stroke-width="3" opacity="0.6"/>
      <circle cx="130" cy="140" r="25" fill="${colors.primary}" opacity="0.7"/>
      <circle cx="270" cy="140" r="25" fill="${colors.accent}" opacity="0.7"/>
      <circle cx="200" cy="280" r="25" fill="${colors.primary}" opacity="0.5"/>
      <line x1="130" y1="140" x2="200" y2="200" stroke="${colors.accent}" stroke-width="2"/>
      <line x1="270" y1="140" x2="200" y2="200" stroke="${colors.accent}" stroke-width="2"/>
      <line x1="200" y1="200" x2="200" y2="280" stroke="${colors.accent}" stroke-width="2"/>
    `,
    cta: `
      <!-- Arrow / forward motion -->
      <rect x="60" y="170" width="220" height="60" rx="30" fill="${colors.primary}"/>
      <polygon points="290,170 360,200 290,230" fill="${colors.accent}"/>
      <circle cx="380" cy="200" r="15" fill="${colors.accent}" opacity="0.5"/>
      <circle cx="50" cy="200" r="8" fill="${colors.primary}" opacity="0.4"/>
    `,
    stat: `
      <!-- Big number feel -->
      <text x="200" y="230" text-anchor="middle" font-size="140" font-weight="900" fill="${colors.primary}" opacity="0.2" font-family="Arial">%</text>
      <circle cx="200" cy="200" r="100" fill="none" stroke="${colors.accent}" stroke-width="8" stroke-dasharray="200,400" stroke-linecap="round"/>
      <circle cx="200" cy="200" r="100" fill="none" stroke="${colors.primary}" stroke-width="3" opacity="0.3"/>
    `,
  };

  const shapeContent = shapes[slideType] || shapes.insight;

  return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.secondary}" />
      <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:0.3" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg2)"/>
  <!-- Background pattern -->
  <circle cx="380" cy="380" r="120" fill="${colors.primary}" opacity="0.08"/>
  <circle cx="20" cy="20" r="80" fill="${colors.accent}" opacity="0.06"/>
  ${shapeContent}
</svg>`;
}

function generateIllustrationSVG(colors, slideType) {
  return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.secondary}" />
      <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:0.5" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#sky)"/>
  <!-- Stars/dots -->
  <circle cx="50" cy="50" r="2" fill="white" opacity="0.8"/>
  <circle cx="150" cy="30" r="1.5" fill="white" opacity="0.6"/>
  <circle cx="300" cy="70" r="2" fill="white" opacity="0.7"/>
  <circle cx="370" cy="40" r="1.5" fill="white" opacity="0.5"/>
  <!-- Main illustration: child at desk with lightbulb -->
  <ellipse cx="200" cy="340" rx="80" ry="15" fill="${colors.primary}" opacity="0.3"/>
  <!-- Desk -->
  <rect x="120" y="300" width="160" height="12" rx="3" fill="${colors.accent}" opacity="0.8"/>
  <rect x="135" y="312" width="8" height="40" fill="${colors.accent}" opacity="0.6"/>
  <rect x="257" y="312" width="8" height="40" fill="${colors.accent}" opacity="0.6"/>
  <!-- Person (simple) -->
  <circle cx="200" cy="260" r="28" fill="${colors.accent}" opacity="0.9"/>
  <rect x="180" y="288" width="40" height="12" rx="3" fill="${colors.primary}"/>
  <!-- Lightbulb above -->
  <circle cx="200" cy="180" r="30" fill="${colors.accent}" opacity="0.95"/>
  <rect x="193" y="210" width="14" height="10" fill="${colors.accent}" opacity="0.8"/>
  <!-- Rays -->
  <line x1="200" y1="140" x2="200" y2="125" stroke="${colors.accent}" stroke-width="3" opacity="0.7"/>
  <line x1="230" y1="155" x2="240" y2="143" stroke="${colors.accent}" stroke-width="3" opacity="0.7"/>
  <line x1="170" y1="155" x2="160" y2="143" stroke="${colors.accent}" stroke-width="3" opacity="0.7"/>
  <line x1="240" y1="180" x2="258" y2="180" stroke="${colors.accent}" stroke-width="3" opacity="0.7"/>
  <line x1="160" y1="180" x2="142" y2="180" stroke="${colors.accent}" stroke-width="3" opacity="0.7"/>
</svg>`;
}

function generateIconSVG(colors, slideType) {
  return generateAbstractSVG(colors, slideType || "insight");
}

async function generateImage(visualPrompt, visualType, theme, slideType, width = 1024, height = 1024) {
  // Try Stability AI first
  if (process.env.STABILITY_API_KEY) {
    try {
      return await generateWithStability(visualPrompt, width, height);
    } catch (err) {
      console.warn("Stability AI failed, using SVG fallback:", err.message);
    }
  }
  
  // Fallback to SVG
  return generateSVGIllustration(visualType, theme, slideType, "");
}

module.exports = { generateImage, generateSVGIllustration };
