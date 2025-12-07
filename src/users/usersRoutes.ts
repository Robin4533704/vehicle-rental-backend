import { Router } from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "./userscontroller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// ✅ Admin Only - View all users
router.get("/", authenticate, authorize(["admin"]), getAllUsers);

// ✅ Admin OR Own Profile - Update user
router.put("/:userId", authenticate, updateUser);

// ✅ Admin Only - Delete user (if no active bookings)
router.delete("/:userId", authenticate, authorize(["admin"]), deleteUser);

export default router;
