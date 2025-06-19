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
exports.getResults = exports.voteRoom = exports.getRoom = exports.createRoom = void 0;
const Room_1 = __importDefault(require("../models/Room"));
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, options, deadline } = req.body;
    // Validate required fields
    if (!title || !description || !options || !deadline) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    // Validate options array
    if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ message: "At least 2 options are required" });
    }
    // Validate deadline is in the future
    if (new Date(deadline) <= new Date()) {
        return res.status(400).json({ message: "Deadline must be in the future" });
    }
    try {
        const room = yield Room_1.default.create({
            creator: req.user._id,
            title,
            description,
            options: options.map((opt) => ({
                text: opt,
                votes: 0,
                justification: [],
            })),
            deadline: new Date(deadline),
            voters: [],
        });
        const roomResponse = {
            id: room.id.toString(),
            creator: room.creator.toString(),
            title: room.title,
            description: room.description,
            options: room.options.map((opt) => ({
                text: opt.text,
                votes: opt.votes,
                justification: opt.justification || [],
            })),
            deadline: room.deadline.toISOString(),
            voters: room.voters,
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString(),
        };
        res.status(201).json(roomResponse);
    }
    catch (err) {
        const error = err;
        console.error("Room creation error:", error);
        res.status(500).json({
            message: "Room creation failed",
            error: error.message,
        });
    }
});
exports.createRoom = createRoom;
const getRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield Room_1.default.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const roomResponse = {
            id: room.id.toString(),
            creator: room.creator.toString(),
            title: room.title,
            description: room.description,
            options: room.options.map((opt) => ({
                text: opt.text,
                votes: opt.votes,
                justification: opt.justification || [],
            })),
            deadline: room.deadline.toISOString(),
            voters: room.voters,
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString(),
        };
        res.json(roomResponse);
    }
    catch (err) {
        const error = err;
        res.status(500).json({
            message: "Failed to fetch room",
            error: error.message,
        });
    }
});
exports.getRoom = getRoom;
const voteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { optionIndex, voterId, justification } = req.body;
    try {
        const room = yield Room_1.default.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        if (new Date() > room.deadline) {
            return res.status(400).json({ message: "Voting is closed" });
        }
        if (room.voters.includes(voterId)) {
            return res.status(403).json({ message: "You already voted" });
        }
        room.options[optionIndex].votes++;
        if (justification) {
            (_a = room.options[optionIndex].justification) === null || _a === void 0 ? void 0 : _a.push(justification);
        }
        room.voters.push(voterId);
        yield room.save();
        res.json({ message: "Vote recorded" });
    }
    catch (err) {
        const error = err;
        res.status(500).json({
            message: "Voting failed",
            error: error.message,
        });
    }
});
exports.voteRoom = voteRoom;
const getResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield Room_1.default.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        if (room.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }
        const results = room.options.map((opt) => ({
            option: opt.text,
            votes: opt.votes,
            justification: opt.justification || [],
        }));
        res.json({ results });
    }
    catch (err) {
        const error = err;
        res.status(500).json({
            message: "Could not fetch results",
            error: error.message,
        });
    }
});
exports.getResults = getResults;
