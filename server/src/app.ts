import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import roomRoutes from "./routes/roomRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Vite Dev (local)
  "https://pollpulse-app.netlify.app", // Netlify (production)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies, authorization headers, etc.
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

export default app;
