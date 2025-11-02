import express from "express";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import {
  cancelBooking,
  confirmBooking,
  createBooking,
  getAllBookings,
  getBookingById,
  getRecentBookings,
  getUserBookings,
  getUserLatestBooking,
  requestCancelBooking,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/my-latest", verifyToken, getUserLatestBooking);
router.get("/:id", getBookingById);
router.patch("/:id", verifyToken, requestCancelBooking);
router.post("/", verifyToken, createBooking);
router.post("/my", verifyToken, getUserBookings);
router.put("/cancel/:id", verifyToken, cancelBooking);

router.get("/", verifyToken, verifyAdmin, getAllBookings);
router.put("/:id/confirm", verifyToken, verifyAdmin, confirmBooking);
router.get("/recent", verifyToken, verifyAdmin, getRecentBookings);
router.patch("/:id/status", verifyToken, verifyAdmin, updateBookingStatus);

export default router;
