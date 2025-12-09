"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const usersRoutes_1 = __importDefault(require("./users/usersRoutes"));
const vehiclesRoutes_1 = __importDefault(require("./vehicles/vehiclesRoutes"));
const bookingsRoutes_1 = __importDefault(require("./bookings/bookingsRoutes"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ✅ Test Route (Health Check)
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚗 Vehicle Rental API is running successfully!",
    });
});
app.get("/db-test", async (req, res) => {
    try {
        const result = await db_1.default.query("SELECT NOW()");
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB connection failed" });
    }
});
// // ✅ API Routes Setup
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/users", usersRoutes_1.default);
app.use("/api/v1/vehicles", vehiclesRoutes_1.default);
app.use("/api/v1/bookings", bookingsRoutes_1.default);
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
exports.default = app;
