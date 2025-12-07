import { Router } from "express";
import {
  createBooking,
  getBookings,
  updateBooking,
} from "./bookingscontroller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// ✅ POST /api/v1/bookings - Customer/Admin
router.post("/", authenticate, authorize(["customer", "admin"]), createBooking);

// ✅ GET /api/v1/bookings - Role-based (Admin: all, Customer: own)
router.get("/", authenticate, getBookings);

// ✅ PUT /api/v1/bookings/:bookingId - Cancel/Return
router.put("/:bookingId", authenticate, updateBooking);

export default router;
