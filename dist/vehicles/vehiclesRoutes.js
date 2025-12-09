"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVehicles = void 0;
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const router = (0, express_1.Router)();
// Temporary in-memory DB
const vehicles = [];
// ------------------ ROUTES ------------------
// GET all vehicles (Public)
router.get("/", (req, res) => {
    res.json(vehicles);
});
// GET specific vehicle by ID (Public)
router.get("/:vehicleId", (req, res) => {
    const { vehicleId } = req.params;
    const vehicle = vehicles.find(v => v.id === parseInt(vehicleId));
    if (!vehicle)
        return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
});
// POST new vehicle (Admin only)
router.post("/", (req, res) => {
    // Normally we use JWT middleware to check admin
    // For now assume admin always
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    if (!vehicle_name || !type || !registration_number || !daily_rent_price || !availability_status) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Check unique registration_number
    const exist = vehicles.find(v => v.registration_number === registration_number);
    if (exist)
        return res.status(400).json({ message: "Vehicle with this registration already exists" });
    const newVehicle = {
        id: vehicles.length + 1,
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status
    };
    vehicles.push(newVehicle);
    res.status(201).json({ message: "Vehicle added successfully", vehicle: newVehicle });
});
// PUT update vehicle (Admin only)
router.put("/:vehicleId", (req, res) => {
    const { vehicleId } = req.params;
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    const vehicle = vehicles.find(v => v.id === parseInt(vehicleId));
    if (!vehicle)
        return res.status(404).json({ message: "Vehicle not found" });
    if (vehicle_name)
        vehicle.vehicle_name = vehicle_name;
    if (type)
        vehicle.type = type;
    if (registration_number)
        vehicle.registration_number = registration_number;
    if (daily_rent_price)
        vehicle.daily_rent_price = daily_rent_price;
    if (availability_status)
        vehicle.availability_status = availability_status;
    res.json({ message: "Vehicle updated successfully", vehicle });
});
const getAllVehicles = async () => { const result = await db_1.default.query("SELECT * FROM vehicles ORDER BY id ASC"); return result.rows; };
exports.getAllVehicles = getAllVehicles;
// DELETE vehicle (Admin only)
router.delete("/:vehicleId", (req, res) => {
    const { vehicleId } = req.params;
    const index = vehicles.findIndex(v => v.id === parseInt(vehicleId));
    if (index === -1)
        return res.status(404).json({ message: "Vehicle not found" });
    // Normally check if vehicle has active bookings
    vehicles.splice(index, 1);
    res.json({ message: "Vehicle deleted successfully" });
});
exports.default = router;
