import { Request, Response } from "express";
import {
  createVehicleService,
  getAllVehiclesService,
  getSingleVehicleService,
  updateVehicleService,
  deleteVehicleService,
} from "./vehiclesservice";

// CREATE VEHICLE (Admin)
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    if (!vehicle_name || !type || !registration_number || !daily_rent_price || !availability_status) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const vehicle = await createVehicleService({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error("Create Vehicle Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ GET ALL VEHICLES
export const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await getAllVehiclesService();

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

// ✅ GET SINGLE VEHICLE
// export const getSingleVehicle = async (req: Request, res: Response) => {
//   try {
//        console.log("Params:", req.params);
//     console.log("Headers:", req.headers);
//     const { vehicleId } = req.params;

//     const parsedId = Number(vehicleId);
//     if (isNaN(parsedId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid vehicle ID",
//       });
//     }

//     const vehicle = await getSingleVehicleService(parsedId);

//     if (!vehicle) {
//       return res.status(404).json({
//         success: false,
//         message: "Vehicle not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Vehicle retrieved successfully",
//       data: vehicle,
//     });
//   } catch (error) {
//     console.error("Get Single Vehicle Error:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

export const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    console.log("Params:", req.params);
    console.log("Headers:", req.headers);

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


export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

   const allowedFields = ["vehicle_name", "type", "registration_number", "daily_rent_price", "availability_status"];
const updateData: any = {};
for (const key of allowedFields) {
  if (req.body[key] !== undefined) {
    updateData[key] = req.body[key];
  }
}
console.log("Update Data Prepared:", updateData);
    const updatedVehicle = await updateVehicleService(Number(vehicleId), updateData);

    console.log("Vehicle updated:", updatedVehicle);

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


// DELETE VEHICLE
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    const deleted = await deleteVehicleService(Number(vehicleId));

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
