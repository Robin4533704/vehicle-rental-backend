import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "./auth.service";

const JWT_SECRET = "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"; 

// ✅ Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await createUser({ name, email, password, phone, role });
    res.status(201).json({ success: true, message: "User created", data: user });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Login
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ success: true, token });
  } catch (error: any) {
    console.error("Signin error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
