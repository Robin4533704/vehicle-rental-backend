import pool from "../config/db";

// ✅ CREATE VEHICLE
export const createVehicleService = async (data: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status = "available",
  } = data;

  const query = `
    INSERT INTO vehicles 
    (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const result = await pool.query(query, [
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  ]);

  return result.rows[0];
};

// ✅ GET ALL VEHICLES
export const getAllVehiclesService = async () => {
  const result = await pool.query("SELECT * FROM vehicles ORDER BY id DESC");
  return result.rows;
};

// ✅ GET SINGLE VEHICLE
export const getSingleVehicleService = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM vehicles WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

// ✅ UPDATE VEHICLE
export const updateVehicleService = async (id: number, data: any) => {
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
    UPDATE vehicles
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

// ✅ DELETE VEHICLE (Only if NO active bookings)
export const deleteVehicleService = async (vehicleId: number) => {
  const bookingCheck = await pool.query(
    `
    SELECT * FROM bookings
    WHERE vehicle_id = $1 AND status = 'active'
  `,
    [vehicleId]
  );

  if (bookingCheck.rowCount > 0) {
    return false;
  }

  await pool.query("DELETE FROM vehicles WHERE id = $1", [vehicleId]);
  return true;
};
