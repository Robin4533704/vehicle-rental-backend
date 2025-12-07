import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "./auth.service";

// ✅ SIGNUP CONTROLLER
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // ✅ Basic Validation
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const emailLower = email.toLowerCase();

    // ✅ Check if user already exists
    const existingUser = await findUserByEmail(emailLower);
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    // ✅ Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create User
    await createUser({
      name,
      email: emailLower,
      password: hashedPassword,
      phone,
      role,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ✅ SIGNIN CONTROLLER
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const emailLower = email.toLowerCase();

    // ✅ Check User Exists
    const user = await findUserByEmail(emailLower);
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ✅ Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
    });
  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
