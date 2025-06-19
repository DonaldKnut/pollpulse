import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import roomRoutes from "./routes/roomRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

export default app;
