import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  updateUserName,
} from "../controllers/userController.js";

import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, verifyAdmin, updateUser);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);
router.patch("/:id/status", verifyToken, verifyAdmin, updateUserStatus);
router.put("/my/:id", verifyToken, updateUserName);

export default router;
