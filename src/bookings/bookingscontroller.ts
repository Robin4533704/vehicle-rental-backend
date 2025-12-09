import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createBookingService,
  getBookingsService,
  updateBookingService,
  getBookingByIdService,
} from "./bookingsservice";
import { getSingleVehicleService, updateVehicleService } from "../vehicles/vehiclesservice";
import pool from "../config/db";

// ✅ CREATE BOOKING
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { vehicle_id, rent_start_date, rent_end_date } = req.body;
    const customer_id = req.user.id;

    if (!vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vehicle = await getSingleVehicleService(vehicle_id);
    console.log("Vehicle fetched:", vehicle);
    if (!vehicle) {
      console.log("Querying vehicle with ID:", vehicle_id);
     const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [vehicle_id]);
console.log("Query result:", result.rows);
return result.rows[0];
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
    const booking = await createBookingService({
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status: "active",
    });

    // ✅ Update vehicle status to booked
    await updateVehicleService(vehicle_id, { availability_status: "booked" });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ GET BOOKINGS (Role-based)
export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user.role;
    const id = req.user.id;

    const bookings = await getBookingsService(role, id);
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ UPDATE BOOKING
export const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    const role = req.user.role;
    const id = req.user.id;

    const booking = await getBookingByIdService(Number(bookingId));
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

      const updatedBooking = await updateBookingService(Number(bookingId), { status: "cancelled" });
      await updateVehicleService(booking.vehicle_id, { availability_status: "available" });
      return res.status(200).json(updatedBooking);
    }

    // ✅ Admin: Mark returned
    if (role === "admin") {
      const updatedBooking = await updateBookingService(Number(bookingId), { status: "returned" });
      await updateVehicleService(booking.vehicle_id, { availability_status: "available" });
      return res.status(200).json(updatedBooking);
    }

    res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    console.error("Update Booking Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
