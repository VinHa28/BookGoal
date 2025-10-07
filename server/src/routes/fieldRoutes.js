import express from "express";
import {
  addField,
  getAllSlots,
  getBookedSlots,
  getFieldById,
  getFields,
  updateField,
} from "../controllers/fieldController.js";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", getFields);
router.get("/:id", getFieldById);
router.get("/:id/booked-slots", getBookedSlots);
router.get("/:id/all-slots", getAllSlots);

router.post("/", verifyToken, verifyAdmin, addField);
router.put("/:id", verifyToken, verifyAdmin, updateField);
export default router;
