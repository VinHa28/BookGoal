import express from "express";
import {
  createNotification,
  getAllNotifications,
  getNotificationsByUser,
  getNotificationById,
  updateNotification,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/", getAllNotifications);
router.get("/user/:userId", getNotificationsByUser);
router.get("/:id", getNotificationById);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;
