import { Router } from "express";
import {
  createBooking,
  getBookings,
  updateBooking,
} from "./bookingscontroller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// ✅ POST /api/v1/bookings - Customer/Admin
router.post("/", authMiddleware, authorize(["customer", "admin"]), createBooking);

// ✅ GET /api/v1/bookings - Role-based (Admin: all, Customer: own)
router.get("/", authMiddleware, getBookings);

// ✅ PUT /api/v1/bookings/:bookingId - Cancel/Return
router.put("/:bookingId", authMiddleware, updateBooking);

export default router;
