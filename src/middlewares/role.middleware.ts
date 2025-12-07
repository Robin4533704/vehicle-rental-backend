import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

// ✅ Role-Based Authorization Middleware
export const authorize = (roles: ("admin" | "customer")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden access" });
    }

    next();
  };
};
