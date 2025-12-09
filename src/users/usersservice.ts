
import pool from "../config/db";

// ✅ GET ALL USERS
export const getAllUsersService = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC"
  );
  return result.rows;
};

// ✅ GET USER BY ID
export const getUserByIdService = async (id: number) => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const updateUserService = async (id: number, data: any) => {
  const keys = Object.keys(data);
  if (!keys.length) return null;

  const setString = keys.map((k, i) => `"${k}"=$${i + 1}`).join(", ");
  const values = Object.values(data);

  const query = `UPDATE users SET ${setString} WHERE id=$${values.length + 1} RETURNING *`;
  const result = await pool.query(query, [...values, id]);

  return result.rows[0];
};


// ✅ DELETE USER (Only if NO active bookings)
export const deleteUserService = async (id: number) => {
  const bookingCheck = await pool.query(
    `
    SELECT * FROM bookings
    WHERE customer_id = $1 AND status = 'active'
  `,
    [id]
  );

  if (bookingCheck.rowCount > 0) {
    return false;
  }

  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return true;
};
