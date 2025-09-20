import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// Routes
// Auth
app.use("/api/auth", authRoutes);

// Route Test
app.get("/", (req, res) => {
  res.send("BookGoal API is running");
});



export default app;
