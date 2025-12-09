import { Router } from "express";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware";
import {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
} from "./vehiclescontroller";

const router = Router();

router.get("/", getAllVehicles); // Public
router.get("/:vehicleId", getSingleVehicle); // Public

router.post("/", authMiddleware, adminOnly, createVehicle); // Admin only
router.put("/:vehicleId", authMiddleware, adminOnly, updateVehicle); // Admin only
router.delete("/:vehicleId", authMiddleware, adminOnly, deleteVehicle); // Admin only

export default router;
