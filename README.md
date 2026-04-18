# 🎨 Cuemath Social Media Studio

Turn a rough idea into a polished, ready-to-post social media creative in seconds.

## What It Does

- **Input**: A rough idea in plain English
- **Output**: A designed multi-slide carousel (or post/story/linkedin) with copy, visuals, caption, and hashtags
- **Edit**: Tweak any slide's text, regenerate individual slides with AI, swap themes
- **Export**: Copy to clipboard, download as text or JSON

---

## Stack

| Layer | Tech |
|-------|------|
| Backend | Node.js + Express |
| AI Content | Anthropic Claude (claude-opus-4-5) |
| AI Images | Stability AI (optional) + SVG fallback |
| Frontend | React 18 + Framer Motion |
| Fonts | Syne + DM Sans |

---

## Quick Start

### 1. Clone / unzip the project

```bash
cd cuemath-studio
```

### 2. Run the interactive setup

```bash
node scripts/setup.js
```

This creates `backend/.env` with your API keys.

### 3. Install dependencies

```bash
npm run install:all
```

### 4. Start the app

```bash
npm run dev
```

Opens at **http://localhost:3000** (frontend) + **http://localhost:3001** (backend API)

---

## Manual Setup (without setup script)

1. Copy `.env.example` to `.env` in the `backend/` folder:

```bash
cp backend/.env.example backend/.env
```

2. Edit `backend/.env`:

```env
ANTHROPIC_API_KEY=sk-ant-...your-key...
STABILITY_API_KEY=sk-...optional...
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. Install:

```bash
npm install                 # root
cd backend && npm install   # backend
cd ../frontend && npm install  # frontend
```

4. Start:

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm start
```

---

## API Keys

| Key | Required | Get It |
|-----|----------|--------|
| `ANTHROPIC_API_KEY` | ✅ Yes | [console.anthropic.com](https://console.anthropic.com) |
| `STABILITY_API_KEY` | ⚠️ Optional | [platform.stability.ai](https://platform.stability.ai) |

Without Stability AI, the app uses beautiful SVG illustrations as visual placeholders.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate/creative` | Generate full creative from prompt |
| POST | `/api/generate/slide` | Regenerate single slide |
| POST | `/api/generate/caption` | Regenerate caption |
| GET | `/api/generate/formats` | Available formats |
| GET | `/api/generate/prompts` | Example prompts |
| POST | `/api/images/generate` | Generate single image |
| POST | `/api/export/json` | Export as JSON |
| POST | `/api/export/text` | Export as text |
| GET | `/api/health` | Health check |

### Example Request

```bash
curl -X POST http://localhost:3001/api/generate/creative \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Carousel about the forgetting curve and how spaced repetition fixes it",
    "format": "carousel",
    "slideCount": 6,
    "tone": "Educational yet warm"
  }'
```

---

## Formats

| Format | Aspect Ratio | Slides |
|--------|-------------|--------|
| `carousel` | 1:1 | 4–10 |
| `instagram_post` | 1:1 | 1 |
| `story` | 9:16 | 1 |
| `linkedin` | 1.91:1 | 1 |

---

## Project Structure

```
cuemath-studio/
├── backend/
│   ├── server.js              # Express app
│   ├── routes/
│   │   ├── generate.js        # Content generation endpoints
│   │   ├── images.js          # Image generation endpoints
│   │   └── export.js          # Export endpoints
│   └── services/
│       ├── claudeService.js   # Anthropic AI integration
│       └── imageService.js    # Stability AI + SVG fallback
├── frontend/
│   └── src/
│       ├── pages/
│       │   └── Studio.js      # Main studio page
│       ├── components/
│       │   ├── IdeaInput.js   # Prompt input
│       │   ├── FormatSelector.js
│       │   ├── SlideCanvas.js # Visual slide renderer
│       │   ├── SlideStrip.js  # Thumbnail navigation
│       │   ├── SlideEditor.js # Text editing + AI rewrite
│       │   ├── CaptionPanel.js
│       │   ├── BrandPanel.js  # Theme/color controls
│       │   ├── ExportPanel.js
│       │   └── ProgressOverlay.js
│       ├── hooks/
│       │   └── useStudio.js   # All state management
│       └── utils/
│           └── api.js         # API client
└── scripts/
    └── setup.js               # Interactive setup script
```

---

## Roadmap / Next Enhancements

- [ ] HTML canvas export (PNG/PDF download of slides)
- [ ] Saved creatives library with local storage
- [ ] Custom brand kit upload (logo, fonts)
- [ ] Drag-and-drop slide reordering
- [ ] Figma / Canva export integration
- [ ] Scheduling integration (Buffer, Later)
- [ ] A/B variant generation
- [ ] Analytics dashboard

---

Built for the Cuemath content team 🟠
