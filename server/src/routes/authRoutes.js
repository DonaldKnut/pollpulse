"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
router.post("/register", (0, asyncHandler_1.asyncHandler)(authController_1.register));
router.post("/login", (0, asyncHandler_1.asyncHandler)(authController_1.login));
exports.default = router;
