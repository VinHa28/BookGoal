import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", verifyToken, logout);

authRoutes.post("/verify-email", verifyEmail);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.post("/change-password", verifyToken, changePassword);
export default authRoutes;
