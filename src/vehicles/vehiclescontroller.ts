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
    console.log("===== CREATE VEHICLE REQUEST =====");
    console.log("Headers:", req.headers);       // 
    console.log("Body:", req.body);           

    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    if (!vehicle_name || !type || !registration_number || !daily_rent_price || !availability_status) {
      console.log("Missing field detected!");  
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const vehicle = await createVehicleService({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });

    console.log("Vehicle created successfully:", vehicle); 
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error: any) {
    console.error("Create Vehicle Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await getAllVehiclesService();


    console.log("DB vehicles:", vehicles);

    if (!vehicles || vehicles.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles,
    });
  } catch (error) {
    console.error("Get All Vehicles Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ GET SINGLE VEHICLE (Public)
export const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await getSingleVehicleService(Number(vehicleId));

    console.log("Single vehicle fetched:", vehicle); 

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error("Get Single Vehicle Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ UPDATE VEHICLE (Admin Only)
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const updatedVehicle = await updateVehicleService(Number(vehicleId), req.body);

    console.log("Vehicle updated:", updatedVehicle); // ডিবাগ লগ

    if (!updatedVehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (error) {
    console.error("Update Vehicle Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ DELETE VEHICLE (Admin Only + No Active Booking)
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    const deleted = await deleteVehicleService(Number(vehicleId));

    console.log("Delete result:", deleted); // ডিবাগ লগ

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "Vehicle has active bookings, cannot delete",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Delete Vehicle Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
