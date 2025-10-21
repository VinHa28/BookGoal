import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import filedRoutes from "./routes/fieldRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { getStats } from "./controllers/adminController.js";
import { verifyAdmin, verifyToken } from "./middlewares/authMiddleware.js";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// Routes
// Auth
app.use("/api/auth", authRoutes);

// Fields
app.use("/api/fields", filedRoutes);

// Booking
app.use("/api/bookings", bookingRoutes);

// User
app.use("/api/users", userRoutes);

// Notification
app.use("/api/notifications", notificationRoutes);

// Admin
app.get("/api/stats", verifyToken, verifyAdmin, getStats);

// Route Test
app.get("/", (req, res) => {
  res.send("BookGoal API is running");
});

export default app;
