import express from "express";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import {
  cancelBooking,
  confirmBooking,
  createBooking,
  getAllBookings,
  getUserBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

// User booking
router.post("/", verifyToken, createBooking);
router.get("/my", verifyToken, getUserBookings);
router.put("/cancel/:id", verifyToken, cancelBooking);

// Admin
router.get("/", verifyToken, verifyAdmin, getAllBookings);
router.put("/:id/confirm", verifyToken, verifyAdmin, confirmBooking);
export default router;
