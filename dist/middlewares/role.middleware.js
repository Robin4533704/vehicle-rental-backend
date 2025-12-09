"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
// ✅ Role-Based Authorization Middleware
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden access" });
        }
        next();
    };
};
exports.authorize = authorize;
