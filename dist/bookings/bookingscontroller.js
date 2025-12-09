"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBooking = exports.getBookings = exports.createBooking = void 0;
const bookingsservice_1 = require("./bookingsservice");
const vehiclesservice_1 = require("../vehicles/vehiclesservice");
// ✅ CREATE BOOKING
const createBooking = async (req, res) => {
    try {
        const { vehicle_id, rent_start_date, rent_end_date } = req.body;
        const customer_id = req.user.id;
        if (!vehicle_id || !rent_start_date || !rent_end_date) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const vehicle = await (0, vehiclesservice_1.getSingleVehicleService)(vehicle_id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        if (vehicle.availability_status === "booked") {
            return res.status(400).json({ message: "Vehicle is already booked" });
        }
        const startDate = new Date(rent_start_date);
        const endDate = new Date(rent_end_date);
        if (endDate <= startDate) {
            return res.status(400).json({ message: "End date must be after start date" });
        }
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const total_price = diffDays * vehicle.daily_rent_price;
        // ✅ Create Booking
        const booking = await (0, bookingsservice_1.createBookingService)({
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            total_price,
            status: "active",
        });
        // ✅ Update vehicle status to booked
        await (0, vehiclesservice_1.updateVehicleService)(vehicle_id, { availability_status: "booked" });
        res.status(201).json(booking);
    }
    catch (error) {
        console.error("Create Booking Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createBooking = createBooking;
// ✅ GET BOOKINGS (Role-based)
const getBookings = async (req, res) => {
    try {
        const role = req.user.role;
        const id = req.user.id;
        const bookings = await (0, bookingsservice_1.getBookingsService)(role, id);
        res.status(200).json(bookings);
    }
    catch (error) {
        console.error("Get Bookings Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getBookings = getBookings;
// ✅ UPDATE BOOKING
const updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const role = req.user.role;
        const id = req.user.id;
        const booking = await (0, bookingsservice_1.getBookingByIdService)(Number(bookingId));
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const now = new Date();
        const startDate = new Date(booking.rent_start_date);
        // ✅ Customer: Cancel before start date
        if (role === "customer") {
            if (booking.customer_id !== id) {
                return res.status(403).json({ message: "Forbidden" });
            }
            if (now >= startDate) {
                return res.status(400).json({ message: "Cannot cancel after start date" });
            }
            const updatedBooking = await (0, bookingsservice_1.updateBookingService)(Number(bookingId), { status: "cancelled" });
            await (0, vehiclesservice_1.updateVehicleService)(booking.vehicle_id, { availability_status: "available" });
            return res.status(200).json(updatedBooking);
        }
        // ✅ Admin: Mark returned
        if (role === "admin") {
            const updatedBooking = await (0, bookingsservice_1.updateBookingService)(Number(bookingId), { status: "returned" });
            await (0, vehiclesservice_1.updateVehicleService)(booking.vehicle_id, { availability_status: "available" });
            return res.status(200).json(updatedBooking);
        }
        res.status(403).json({ message: "Forbidden" });
    }
    catch (error) {
        console.error("Update Booking Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateBooking = updateBooking;
