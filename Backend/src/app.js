import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan";
import cors from "cors";
import chatRouter from "./routes/chat.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "../public");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://perplexus.onrender.com",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// Serve static frontend assets
app.use(express.static(publicPath));

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

// SPA client-side routing fallback (serves index.html for all non-API GET requests)
app.use((req, res, next) => {
  if (req.method === "GET") {
    return res.sendFile(path.join(publicPath, "index.html"));
  }
  next();
});

export default app;
