require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
connectDB();

const generateRoutes = require("./routes/generate");
const imageRoutes = require("./routes/images");
const exportRoutes = require("./routes/export");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
    ].filter(Boolean);
    if (!origin || allowed.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

app.use("/api/generate", generateRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/export", exportRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      groq: !!process.env.GROQ_API_KEY,
      stability: !!process.env.STABILITY_API_KEY,
      mongodb: !!process.env.MONGODB_URI,
    }
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Cuemath Studio Backend running on http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Groq:      ${process.env.GROQ_API_KEY ? "✅ Configured" : "❌ Missing"}`);
  console.log(`🗄️  MongoDB:   ${process.env.MONGODB_URI ? "✅ Configured" : "❌ Missing"}`);
  console.log(`🎨 Stability: ${process.env.STABILITY_API_KEY ? "✅ Configured" : "⚠️  Optional"}\n`);
});