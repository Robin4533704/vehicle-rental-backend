import { Router } from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../users/userscontroller";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware";

const router = Router();

// ✅ Get all users (Admin only)
router.get("/", authMiddleware, adminOnly, getAllUsers);

// ✅ Update user (Admin or Own profile)
router.put("/:userId", authMiddleware, updateUser);

// ✅ Delete user (Admin only + No active bookings)
router.delete("/:userId", authMiddleware, adminOnly, deleteUser);

export default router;

