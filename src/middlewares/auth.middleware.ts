import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

// ✅ Extend Express Request
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// ✅ Auth Middleware (JWT verification)
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = payload; // TypeScript now knows req.user exists
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

// ✅ Admin Only Middleware
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

