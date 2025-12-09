"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.createUser = void 0;
const db_1 = __importDefault(require("../../config/db"));
// ✅ CREATE USER (Signup)
const createUser = async (userData) => {
    const { name, email, password, phone, role } = userData;
    const query = `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
  `;
    const values = [name, email, password, phone, role];
    const result = await db_1.default.query(query, values);
    return result.rows[0];
};
exports.createUser = createUser;
// ✅ FIND USER BY EMAIL (Signin)
const findUserByEmail = async (email) => {
    const query = `
    SELECT * FROM users
    WHERE email = $1
  `;
    const result = await db_1.default.query(query, [email]);
    return result.rows[0];
};
exports.findUserByEmail = findUserByEmail;
