const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const FORMAT_SPECS = {
  carousel: {
    name: "Carousel",
    aspectRatio: "1:1",
    minSlides: 5,
    maxSlides: 10,
    structure: "Hook → Build → Insight → Insight → CTA",
  },
  instagram_post: {
    name: "Instagram Post",
    aspectRatio: "1:1",
    slides: 1,
    structure: "Single impactful message with hook + value + CTA",
  },
  story: {
    name: "Instagram Story",
    aspectRatio: "9:16",
    slides: 1,
    structure: "Quick, vertical-first storytelling",
  },
  linkedin: {
    name: "LinkedIn Post",
    aspectRatio: "1.91:1",
    slides: 1,
    structure: "Professional insight with data/stats",
  },
};

const BRAND = {
  name: "Cuemath",
  audience: "Parents of K-12 children",
  voice: "Warm, authoritative, science-backed, encouraging",
  colors: {
    primary: "#FF6B35",
    secondary: "#1A1A2E",
    accent: "#FFD700",
    light: "#FFF8F5",
    text: "#2D2D2D",
  },
  tagline: "The Math Expert",
};

async function callGroq(prompt, systemInstruction, maxTokens = 8000) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: maxTokens,
    temperature: 0.8,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: prompt },
    ],
  });

  const text = response.choices[0].message.content.trim();
  return JSON.parse(text);
}

async function generateContent(prompt, format, slideCount, tone, customBrand) {
  const brand = { ...BRAND, ...customBrand };
  const formatSpec = FORMAT_SPECS[format] || FORMAT_SPECS.carousel;
  const numSlides = slideCount || (format === "carousel" ? 5 : 1);

  const systemInstruction = `You are an expert social media content strategist for ${brand.name}, a leading math education platform.
Brand Voice: ${brand.voice}
Target Audience: ${brand.audience}
Brand Colors: Primary ${brand.colors.primary}, Secondary ${brand.colors.secondary}, Accent ${brand.colors.accent}
You create thumb-stopping, science-backed educational content that helps parents understand learning science and trust ${brand.name}.
CRITICAL: Respond ONLY with valid JSON. No explanation, no markdown.`;

  const userPrompt = `Create a ${formatSpec.name} social media creative for ${brand.name}.

User's Idea: "${prompt}"
Format: ${format} (${formatSpec.aspectRatio} aspect ratio)
Number of Slides: ${numSlides}
Tone: ${tone || "Educational yet warm"}
Content Structure: ${formatSpec.structure}

Return this exact JSON structure:
{
  "title": "Internal title for this creative",
  "format": "${format}",
  "theme": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "backgroundColor": "#hex",
    "textColor": "#hex",
    "fontStyle": "modern|playful|bold|elegant",
    "backgroundStyle": "gradient|solid|pattern|mesh"
  },
  "slides": [
    {
      "slideNumber": 1,
      "type": "hook|insight|stat|quote|cta|cover",
      "heading": "Short punchy headline (max 8 words)",
      "subheading": "Supporting text (max 15 words)",
      "bodyText": "2 sentences max",
      "callout": "One short stat or quote (can be null)",
      "visualPrompt": "Brief image description",
      "visualType": "illustration|abstract|chart|icon|photo",
      "emoji": "1 emoji",
      "layout": "centered|left-aligned|split|overlay",
      "backgroundColor": null
    }
  ],
  "caption": "Instagram caption (100-150 chars)",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "altText": "Brief accessibility description",
  "insights": {
    "hook": "One sentence",
    "narrative": "One sentence",
    "cta": "One sentence"
  }
}

Carousel rules:
- Slide 1: HOOK - bold statement that stops scrolling
- Middle slides: BUILD - one insight per slide
- Last slide: CTA - clear next step + Cuemath branding
Keep all text fields SHORT to stay within token limits.`;

  const parsed = await callGroq(userPrompt, systemInstruction, 8000);

  parsed.slides = parsed.slides.map((slide, i) => ({
    ...slide,
    slideNumber: i + 1,
    brandName: brand.name,
  }));

  return parsed;
}

async function regenerateSlide(slide, instruction, format, brand) {
  const systemInstruction = `You are a social media content expert for Cuemath. Respond ONLY with valid JSON.`;

  // Remove imageData before sending to API — it's huge base64 data
  const { imageData, ...slideWithoutImage } = slide;

  const prompt = `Regenerate this single slide based on the instruction.

Current Slide:
${JSON.stringify(slideWithoutImage, null, 2)}

Instruction: "${instruction}"
Format: ${format}

Return JSON with the same structure but updated content. Only change what the instruction asks for. Keep all text SHORT. Do not include imageData in response.`;

  return await callGroq(prompt, systemInstruction, 2000);
}

async function generateCaption(slides, format, tone) {
  const systemInstruction = `You are a social media copywriter for Cuemath. Respond ONLY with valid JSON.`;

  const content = slides.map((s) => `${s.heading}: ${s.bodyText}`).join("\n");

  const prompt = `Write an engaging ${format} caption for this content:
${content}

Tone: ${tone || "Warm and educational"}

Return JSON: { "caption": "text under 150 chars", "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"], "firstComment": "short text" }`;

  return await callGroq(prompt, systemInstruction, 1000);
}

module.exports = { generateContent, regenerateSlide, generateCaption, FORMAT_SPECS, BRAND };