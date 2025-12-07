
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

// ✅ UPDATE USER (Admin or Own Profile)
export const updateUserService = async (id: number, data: any) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in data) {
    fields.push(`${key} = $${index}`);
    values.push(data[key]);
    index++;
  }

  if (fields.length === 0) return null;

  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id, name, email, phone, role
  `;

  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

// ✅ DELETE USER (Only if NO active bookings)
export const deleteUserService = async (userId: number) => {
  const bookingCheck = await pool.query(
    `
    SELECT * FROM bookings
    WHERE customer_id = $1 AND status = 'active'
  `,
    [userId]
  );

  if (bookingCheck.rowCount > 0) {
    return false;
  }

  await pool.query("DELETE FROM users WHERE id = $1", [userId]);
  return true;
};
