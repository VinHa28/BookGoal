import { Router } from "express";
import { login, logout, register } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", verifyToken, logout);

export default authRoutes;
