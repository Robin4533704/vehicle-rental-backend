"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingService = exports.getBookingByIdService = exports.getBookingsService = exports.createBookingService = void 0;
const db_1 = __importDefault(require("../config/db"));
// ✅ CREATE BOOKING
const createBookingService = async (data) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, } = data;
    const query = `
    INSERT INTO bookings
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
    const result = await db_1.default.query(query, [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
    ]);
    return result.rows[0];
};
exports.createBookingService = createBookingService;
// ✅ GET BOOKINGS (Role-based)
const getBookingsService = async (role, id) => {
    if (role === "admin") {
        const result = await db_1.default.query("SELECT * FROM bookings ORDER BY id DESC");
        return result.rows;
    }
    else {
        const result = await db_1.default.query("SELECT * FROM bookings WHERE customer_id = $1 ORDER BY id DESC", [id]);
        return result.rows;
    }
};
exports.getBookingsService = getBookingsService;
// ✅ GET BOOKING BY ID
const getBookingByIdService = async (id) => {
    const result = await db_1.default.query("SELECT * FROM bookings WHERE id = $1", [id]);
    return result.rows[0];
};
exports.getBookingByIdService = getBookingByIdService;
// ✅ UPDATE BOOKING
const updateBookingService = async (id, data) => {
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
    UPDATE bookings
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;
    values.push(id);
    const result = await db_1.default.query(query, values);
    return result.rows[0];
};
exports.updateBookingService = updateBookingService;
