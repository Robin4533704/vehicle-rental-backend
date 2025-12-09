"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicleService = exports.updateVehicleService = exports.getSingleVehicleService = exports.getAllVehiclesService = exports.createVehicleService = void 0;
const db_1 = __importDefault(require("../config/db"));
// ✅ CREATE VEHICLE
const createVehicleService = async (data) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status = "available", } = data;
    const query = `
    INSERT INTO vehicles 
    (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
    const result = await db_1.default.query(query, [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
    ]);
    return result.rows[0];
};
exports.createVehicleService = createVehicleService;
// ✅ GET ALL VEHICLES
const getAllVehiclesService = async () => {
    const result = await db_1.default.query("SELECT * FROM vehicles ORDER BY id DESC");
    return result.rows;
};
exports.getAllVehiclesService = getAllVehiclesService;
// ✅ GET SINGLE VEHICLE
const getSingleVehicleService = async (id) => {
    const result = await db_1.default.query("SELECT * FROM vehicles WHERE id = $1", [id]);
    return result.rows[0];
};
exports.getSingleVehicleService = getSingleVehicleService;
// ✅ UPDATE VEHICLE
const updateVehicleService = async (id, data) => {
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in data) {
        fields.push(`${key} = $${index}`);
        values.push(data[key]);
        index++;
    }
    if (fields.length === 0)
        return null;
    const query = `
    UPDATE vehicles
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;
    values.push(id);
    const result = await db_1.default.query(query, values);
    return result.rows[0];
};
exports.updateVehicleService = updateVehicleService;
// ✅ DELETE VEHICLE (Only if NO active bookings)
const deleteVehicleService = async (vehicleId) => {
    const bookingCheck = await db_1.default.query(`
    SELECT * FROM bookings
    WHERE vehicle_id = $1 AND status = 'active'
  `, [vehicleId]);
    if (bookingCheck.rowCount > 0) {
        return false;
    }
    await db_1.default.query("DELETE FROM vehicles WHERE id = $1", [vehicleId]);
    return true;
};
exports.deleteVehicleService = deleteVehicleService;
