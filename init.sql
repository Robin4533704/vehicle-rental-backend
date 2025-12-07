CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  password TEXT NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(120) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
  registration_number VARCHAR(50) NOT NULL UNIQUE,
  daily_rent_price DECIMAL(10,2) NOT NULL CHECK (daily_rent_price > 0),
  availability_status VARCHAR(15) NOT NULL DEFAULT 'available'
    CHECK (availability_status IN ('available', 'booked')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price DECIMAL(12,2) NOT NULL CHECK (total_price > 0),
  status VARCHAR(15) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'cancelled', 'returned')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_customer
    FOREIGN KEY (customer_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_vehicle
    FOREIGN KEY (vehicle_id)
    REFERENCES vehicles(id)
    ON DELETE CASCADE,

  CONSTRAINT valid_rental_date
    CHECK (rent_end_date > rent_start_date)
);
