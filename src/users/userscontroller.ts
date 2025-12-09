import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  getAllUsersService,
  updateUserService,
  deleteUserService,
  getUserByIdService,
} from "./usersservice";

export const getAllUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const loggedUser = req.user;

    const parsedId = Number(userId);
    if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid user ID" });

    const targetUser = await getUserByIdService(parsedId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    if (loggedUser.role === "customer" && loggedUser.id !== parsedId)
      return res.status(403).json({ message: "Forbidden access" });

    // ✅ Allowed fields for update
    const allowedFields = ["name", "email", "phone", "role"];
    const updateData: any = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }

    if (Object.keys(updateData).length === 0)
      return res.status(400).json({ message: "No valid fields provided for update" });

    const updatedUser = await updateUserService(parsedId, updateData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const {  userId  } = req.params;

    const deleted = await deleteUserService(Number( userId ));
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
