import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { startScheduler } from "./scheduler";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Vite dev server needs this off in development
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting — prevents API abuse and runaway OpenAI costs
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please slow down." },
});

// Tighter limit on AI endpoints (they cost money)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 AI calls per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "AI rate limit reached. Please wait a moment." },
});

app.use("/api", apiLimiter);
app.use("/api/chat", aiLimiter);
app.use("/api/inspiration", aiLimiter);
app.use("/api/daily-boost", aiLimiter);

app.use(express.json({ limit: "50kb" })); // Prevent oversized payloads
app.use(express.urlencoded({ extended: false, limit: "50kb" }));
app.use("/attached_assets", express.static(path.join(__dirname, "../attached_assets")));

const server = createServer(app);

(async () => {
  await registerRoutes(app);

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }

  startScheduler();

  const port = Number(process.env.PORT) || 5000;
  server.listen(port, () => {
    log(`Cribbles running at http://localhost:${port}`);
  });
})();
