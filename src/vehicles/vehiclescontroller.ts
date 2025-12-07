import { Request, Response } from "express";
import {
  createVehicleService,
  getAllVehiclesService,
  getSingleVehicleService,
  updateVehicleService,
  deleteVehicleService,
} from "./vehiclesservice";

// ✅ CREATE VEHICLE (Admin Only)
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    if (
      !vehicle_name ||
      !type ||
      !registration_number ||
      !daily_rent_price
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vehicle = await createVehicleService({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });

    res.status(201).json(vehicle);
  } catch (error: any) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ message: "Registration number already exists" });
    }

    console.error("Create Vehicle Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ GET ALL VEHICLES (Public)
export const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await getAllVehiclesService();
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Get All Vehicles Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ GET SINGLE VEHICLE (Public)
export const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await getSingleVehicleService(Number(vehicleId));
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error("Get Single Vehicle Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ UPDATE VEHICLE (Admin Only)
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const updatedVehicle = await updateVehicleService(
      Number(vehicleId),
      req.body
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error("Update Vehicle Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ DELETE VEHICLE (Admin Only + No Active Booking)
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    const deleted = await deleteVehicleService(Number(vehicleId));
    if (!deleted) {
      return res
        .status(400)
        .json({ message: "Vehicle has active bookings, cannot delete" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Delete Vehicle Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
