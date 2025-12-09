import pool from "../../config/db";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "customer";
}

// ✅ CREATE USER (Signup)
export const createUser = async (userData: CreateUserPayload) => {
  const { name, email, password, phone, role } = userData;

  const query = `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
  `;
  const values = [name, email, password, phone, role];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// ✅ FIND USER BY EMAIL (Signin)
export const findUserByEmail = async (email: string) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// ✅ GET ALL USERS (Admin)
export const getAllUsersFromDB = async () => {
  const query = `SELECT id, name, email, phone, role FROM users`;
  const result = await pool.query(query);
  return result.rows;
};
