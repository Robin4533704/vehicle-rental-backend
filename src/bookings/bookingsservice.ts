import pool from "../config/db";

interface CreateBookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status: "active" | "cancelled" | "returned";
}

// ✅ CREATE BOOKING
export const createBookingService = async (data: CreateBookingPayload) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = data;

  const query = `
    INSERT INTO bookings
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const result = await pool.query(query, [
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  ]);

  return result.rows[0];
};

// ✅ GET BOOKINGS (Role-based)
export const getBookingsService = async (role: string, id: number) => {
  if (role === "admin") {
    const result = await pool.query("SELECT * FROM bookings ORDER BY id DESC");
    return result.rows;
  } else {
    const result = await pool.query(
      "SELECT * FROM bookings WHERE customer_id = $1 ORDER BY id DESC",
      [id]
    );
    return result.rows;
  }
};

// ✅ GET BOOKING BY ID
export const getBookingByIdService = async (id: number) => {
  const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [id]);
  return result.rows[0];
};

// ✅ UPDATE BOOKING
export const updateBookingService = async (id: number, data: any) => {
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
    UPDATE bookings
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};
