import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: { id: number; email: string; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("=== Auth Middleware Triggered ===");
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.originalUrl);
  console.log("Headers:", req.headers);

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("No Authorization header found");
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  let token: string | undefined;
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log("Token extracted from Bearer:", token);
  } else {
    token = authHeader;
    console.log("Token extracted directly:", token);
  }

  if (!token) {
    console.log("Token is empty after extraction");
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    console.log("JWT Payload:", payload);
    req.user = payload;
    next();
  } catch (err: any) {
    console.log("JWT Verification Failed:", err.message);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("=== Admin Middleware Triggered ===");
  console.log("User role:", req.user?.role);

  if (req.user?.role !== "admin") {
    console.log("Access denied: not admin");
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};
