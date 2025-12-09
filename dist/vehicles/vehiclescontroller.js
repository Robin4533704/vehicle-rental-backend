"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.getSingleVehicle = exports.getAllVehicles = exports.createVehicle = void 0;
const vehiclesservice_1 = require("./vehiclesservice");
// ✅ CREATE VEHICLE (Admin Only)
const createVehicle = async (req, res) => {
    try {
        const { vehicle_name, type, registration_number, daily_rent_price, availability_status, } = req.body;
        if (!vehicle_name ||
            !type ||
            !registration_number ||
            !daily_rent_price) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const vehicle = await (0, vehiclesservice_1.createVehicleService)({
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status,
        });
        res.status(201).json(vehicle);
    }
    catch (error) {
        if (error.code === "23505") {
            return res
                .status(409)
                .json({ message: "Registration number already exists" });
        }
        console.error("Create Vehicle Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createVehicle = createVehicle;
// ✅ GET ALL VEHICLES (Public)
const getAllVehicles = async (_req, res) => {
    try {
        const vehicles = await (0, vehiclesservice_1.getAllVehiclesService)();
        res.status(200).json(vehicles);
    }
    catch (error) {
        console.error("Get All Vehicles Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllVehicles = getAllVehicles;
// ✅ GET SINGLE VEHICLE (Public)
const getSingleVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const vehicle = await (0, vehiclesservice_1.getSingleVehicleService)(Number(vehicleId));
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json(vehicle);
    }
    catch (error) {
        console.error("Get Single Vehicle Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getSingleVehicle = getSingleVehicle;
// ✅ UPDATE VEHICLE (Admin Only)
const updateVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const updatedVehicle = await (0, vehiclesservice_1.updateVehicleService)(Number(vehicleId), req.body);
        if (!updatedVehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json(updatedVehicle);
    }
    catch (error) {
        console.error("Update Vehicle Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateVehicle = updateVehicle;
// ✅ DELETE VEHICLE (Admin Only + No Active Booking)
const deleteVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const deleted = await (0, vehiclesservice_1.deleteVehicleService)(Number(vehicleId));
        if (!deleted) {
            return res
                .status(400)
                .json({ message: "Vehicle has active bookings, cannot delete" });
        }
        res.status(200).json({ message: "Vehicle deleted successfully" });
    }
    catch (error) {
        console.error("Delete Vehicle Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteVehicle = deleteVehicle;
