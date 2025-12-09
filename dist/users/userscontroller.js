"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = void 0;
const usersservice_1 = require("./usersservice");
// ✅ GET ALL USERS (Admin Only)
const getAllUsers = async (_req, res) => {
    try {
        const users = await (0, usersservice_1.getAllUsersService)();
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllUsers = getAllUsers;
// ✅ UPDATE USER (Admin or Own Profile)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedUser = req.user; // from JWT
        // ✅ Fetch target user
        const targetUser = await (0, usersservice_1.getUserByIdService)(Number(id));
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // ✅ Customer can update ONLY own profile
        if (loggedUser.role === "customer" && loggedUser.id !== Number(id)) {
            return res.status(403).json({ message: "Forbidden access" });
        }
        const updatedUser = await (0, usersservice_1.updateUserService)(Number(id), req.body);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateUser = updateUser;
// ✅ DELETE USER (Admin Only + No Active Bookings)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await (0, usersservice_1.deleteUserService)(Number(id));
        if (!deleted) {
            return res
                .status(400)
                .json({ message: "User has active bookings, cannot delete" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteUser = deleteUser;
