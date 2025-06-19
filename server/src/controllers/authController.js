"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const userExists = yield User_1.default.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "Email already registered" });
        const user = yield User_1.default.create({ username, email, password });
        const token = (0, generateToken_1.default)(user._id);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: "Registration failed", error: err });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password }); // Debug log
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isMatch = yield user.comparePassword(password);
        console.log("Password match:", isMatch); // Debug log
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = (0, generateToken_1.default)(user._id);
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login failed", error: err });
    }
});
exports.login = login;
