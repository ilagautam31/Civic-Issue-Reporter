import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow the configured production URL, plus any Vercel preview deployment
// (Vercel generates a new random-hash URL per push, so we can't hardcode all of them)
const allowedOrigins = [process.env.CLIENT_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. curl, Postman) which send no origin
      if (!origin) return callback(null, true);

      const isAllowedExact = allowedOrigins.includes(origin);
      const isVercelPreview = /^https:\/\/civic-issue-reporter-[\w-]+\.vercel\.app$/.test(origin);
      const isLocalDev = /^http:\/\/localhost:\d+$/.test(origin);

      if (isAllowedExact || isVercelPreview || isLocalDev) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("Civic Issue Reporter API is running");
});

// Basic error handler (e.g. catches multer file errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));