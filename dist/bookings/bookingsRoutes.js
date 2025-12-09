"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingscontroller_1 = require("./bookingscontroller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// ✅ POST /api/v1/bookings - Customer/Admin
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["customer", "admin"]), bookingscontroller_1.createBooking);
// ✅ GET /api/v1/bookings - Role-based (Admin: all, Customer: own)
router.get("/", auth_middleware_1.authenticate, bookingscontroller_1.getBookings);
// ✅ PUT /api/v1/bookings/:bookingId - Cancel/Return
router.put("/:bookingId", auth_middleware_1.authenticate, bookingscontroller_1.updateBooking);
exports.default = router;
