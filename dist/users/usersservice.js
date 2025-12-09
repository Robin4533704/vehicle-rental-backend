"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserService = exports.updateUserService = exports.getUserByIdService = exports.getAllUsersService = void 0;
const db_1 = __importDefault(require("../config/db"));
// ✅ GET ALL USERS
const getAllUsersService = async () => {
    const result = await db_1.default.query("SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC");
    return result.rows;
};
exports.getAllUsersService = getAllUsersService;
// ✅ GET USER BY ID
const getUserByIdService = async (id) => {
    const result = await db_1.default.query("SELECT id, name, email, phone, role FROM users WHERE id = $1", [id]);
    return result.rows[0];
};
exports.getUserByIdService = getUserByIdService;
// ✅ UPDATE USER (Admin or Own Profile)
const updateUserService = async (id, data) => {
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
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id, name, email, phone, role
  `;
    values.push(id);
    const result = await db_1.default.query(query, values);
    return result.rows[0];
};
exports.updateUserService = updateUserService;
// ✅ DELETE USER (Only if NO active bookings)
const deleteUserService = async (id) => {
    const bookingCheck = await db_1.default.query(`
    SELECT * FROM bookings
    WHERE customer_id = $1 AND status = 'active'
  `, [id]);
    if (bookingCheck.rowCount > 0) {
        return false;
    }
    await db_1.default.query("DELETE FROM users WHERE id = $1", [id]);
    return true;
};
exports.deleteUserService = deleteUserService;
