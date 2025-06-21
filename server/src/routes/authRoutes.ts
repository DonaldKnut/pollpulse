import { Router } from "express";
import {
  register,
  login,
  verifyToken,
  refreshToken,
  logout,
} from "../controllers/authController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/refresh", asyncHandler(refreshToken));
router.post("/verify", asyncHandler(verifyToken));
router.post("/logout", asyncHandler(logout));

export default router;
