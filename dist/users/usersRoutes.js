"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userscontroller_1 = require("./userscontroller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// ✅ Admin Only - View all users
router.get("/", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin"]), userscontroller_1.getAllUsers);
// ✅ Admin OR Own Profile - Update user
router.put("/:id", auth_middleware_1.authenticate, userscontroller_1.updateUser);
// ✅ Admin Only - Delete user (if no active bookings)
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin"]), userscontroller_1.deleteUser);
exports.default = router;
