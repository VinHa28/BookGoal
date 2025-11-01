import express from "express";
import {
  createNotification,
  getUnreadCount,
  getUserNotifications,
  markAsRead,
} from "../controllers/notificationController.js";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createNotification);
router.post("/mark-readed", verifyToken, markAsRead);
router.get("/unread", verifyToken, getUnreadCount);
router.get("/my", verifyToken, getUserNotifications);

export default router;
