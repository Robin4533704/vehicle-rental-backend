import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes"
import userRoutes from "./users/usersRoutes"
import vehicleRoutes from "./vehicles/vehiclesRoutes"
import bookingRoutes from "./bookings/bookingsRoutes"
import pool from "./config/db";
dotenv.config();


const app: Application = express();


app.use(cors()); 
app.use(express.json()); 

// ✅ Test Route (Health Check)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚗 Vehicle Rental API is running successfully!",
  });
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});


// // ✅ API Routes Setup
 app.use("/api/v1/auth", authRoutes);
 app.use("/api/v1/users", userRoutes);
 app.use("/api/v1/vehicles", vehicleRoutes);
 app.use("/api/v1/bookings", bookingRoutes);


app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;