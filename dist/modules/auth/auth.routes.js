"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authcontroller_1 = require("./authcontroller");
const router = (0, express_1.Router)();
router.post("/signup", authcontroller_1.signup);
router.post("/signin", authcontroller_1.signin);
exports.default = router;
