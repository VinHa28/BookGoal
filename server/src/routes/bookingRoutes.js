import express from "express";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import {
  cancelBooking,
  confirmBooking,
  createBooking,
  getAllBookings,
  getRecentBookings,
  getUserBookings,
  getUserLatestBooking,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.post("/my", verifyToken, getUserBookings);
router.get("/my-latest", verifyToken, getUserLatestBooking);
router.put("/cancel/:id", verifyToken, cancelBooking);

router.get("/", verifyToken, verifyAdmin, getAllBookings);
router.put("/:id/confirm", verifyToken, verifyAdmin, confirmBooking);
router.get("/recent", verifyToken, verifyAdmin, getRecentBookings);
router.patch("/:id/status", verifyToken, verifyAdmin, updateBookingStatus);

export default router;
