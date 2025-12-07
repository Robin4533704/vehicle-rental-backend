import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  getAllUsersService,
  updateUserService,
  deleteUserService,
  getUserByIdService,
} from "./usersservice";

// ✅ GET ALL USERS (Admin Only)
export const getAllUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ UPDATE USER (Admin or Own Profile)
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const loggedUser = req.user; // from JWT

    // ✅ Fetch target user
    const targetUser = await getUserByIdService(Number(userId));
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Customer can update ONLY own profile
    if (loggedUser.role === "customer" && loggedUser.userId !== Number(userId)) {
      return res.status(403).json({ message: "Forbidden access" });
    }

    const updatedUser = await updateUserService(Number(userId), req.body);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ DELETE USER (Admin Only + No Active Bookings)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const deleted = await deleteUserService(Number(userId));
    if (!deleted) {
      return res
        .status(400)
        .json({ message: "User has active bookings, cannot delete" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
