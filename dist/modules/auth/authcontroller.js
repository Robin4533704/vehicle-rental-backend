"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("./auth.service");
// ✅ SIGNUP CONTROLLER
const signup = async (req, res) => {
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
        const existingUser = await (0, auth_service_1.findUserByEmail)(emailLower);
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email",
            });
        }
        // ✅ Hash Password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // ✅ Create User
        await (0, auth_service_1.createUser)({
            name,
            email: emailLower,
            password: hashedPassword,
            phone,
            role,
        });
        return res.status(201).json({
            message: "User registered successfully",
        });
    }
    catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.signup = signup;
// ✅ SIGNIN CONTROLLER
const signin = async (req, res) => {
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
        const user = await (0, auth_service_1.findUserByEmail)(emailLower);
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        // ✅ Compare Password
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        // ✅ Generate JWT Token
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.status(200).json({
            token,
        });
    }
    catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.signin = signin;
