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
| AI Content | Groq (Llama 3.3 70B) |
| Database | MongoDB Atlas |
| AI Images | Stability AI (optional) + SVG fallback |
| Frontend | React 18 + Framer Motion |
| Fonts | Syne + DM Sans |

---

## Quick Start

### 1. Clone the project

```bash
git clone https://github.com/Utkarsh-Goswami-07/cuemath-studio.git
cd cuemath-studio
```

### 2. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Setup environment variables

Create `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_atlas_uri
STABILITY_API_KEY=
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. Start the app

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm start
```

Opens at **http://localhost:3000**

---

## API Keys

| Key | Required | Get It |
|-----|----------|--------|
| `GROQ_API_KEY` | ✅ Yes | [console.groq.com](https://console.groq.com) |
| `MONGODB_URI` | ✅ Yes | [mongodb.com/atlas](https://mongodb.com/atlas) |
| `STABILITY_API_KEY` | ⚠️ Optional | [platform.stability.ai](https://platform.stability.ai) |

Without Stability AI, the app uses SVG illustrations as visual placeholders.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate/creative` | Generate full creative from prompt |
| POST | `/api/generate/slide` | Regenerate single slide |
| POST | `/api/generate/caption` | Regenerate caption |
| GET | `/api/generate/history` | Get last 20 creatives |
| GET | `/api/generate/creative/:id` | Load a specific creative |
| PUT | `/api/generate/creative/:id` | Update/auto-save creative |
| DELETE | `/api/generate/creative/:id` | Delete creative |
| POST | `/api/images/generate` | Generate single image |
| GET | `/api/health` | Health check |

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
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── Creative.js
│   ├── routes/
│   │   ├── generate.js
│   │   ├── images.js
│   │   └── export.js
│   └── services/
│       ├── claudeService.js
│       └── imageService.js
└── frontend/
    └── src/
        ├── pages/
        │   └── Studio.js
        ├── components/
        │   ├── IdeaInput.js
        │   ├── FormatSelector.js
        │   ├── SlideCanvas.js
        │   ├── SlideStrip.js
        │   ├── SlideEditor.js
        │   ├── CaptionPanel.js
        │   ├── BrandPanel.js
        │   ├── ExportPanel.js
        │   ├── ProgressOverlay.js
        │   └── Sidebar.js
        ├── hooks/
        │   └── useStudio.js
        └── utils/
            └── api.js
```

## Roadmap

- [ ] PNG/PDF export of slides
- [ ] Custom brand kit upload (logo, fonts)
- [ ] Drag-and-drop slide reordering
- [ ] Scheduling integration (Buffer, Later)
- [ ] A/B variant generation

---

Built for the Cuemath content team 🟠
