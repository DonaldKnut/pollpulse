import { Request, Response } from "express";
import Room, { IRoom } from "../models/Room";
import { Types } from "mongoose";

interface RoomResponse {
  id: string;
  creator: string;
  title: string;
  description: string;
  options: {
    text: string;
    votes: number;
    justification: string[];
  }[];
  deadline: string;
  voters: string[];
  createdAt: string;
  updatedAt: string;
}

export const createRoom = async (req: Request, res: Response) => {
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
    const room = await Room.create({
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

    const roomResponse: RoomResponse = {
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
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Room creation error:", error);
    res.status(500).json({
      message: "Room creation failed",
      error: error.message,
    });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const roomResponse: RoomResponse = {
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
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({
      message: "Failed to fetch room",
      error: error.message,
    });
  }
};

export const voteRoom = async (req: Request, res: Response) => {
  const { optionIndex, voterId, justification } = req.body;

  try {
    const room = await Room.findById(req.params.id);
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
      room.options[optionIndex].justification?.push(justification);
    }

    room.voters.push(voterId);
    await room.save();

    res.json({ message: "Vote recorded" });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({
      message: "Voting failed",
      error: error.message,
    });
  }
};

export const getResults = async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id);
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
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({
      message: "Could not fetch results",
      error: error.message,
    });
  }
};

export const getRoomsByUser = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in query" });
  }

  try {
    const rooms = await Room.find({ creator: userId }).sort({ createdAt: -1 });

    const response = rooms.map((room) => ({
      id: room.id.toString(),
      title: room.title,
      createdAt: room.createdAt.toISOString(),
    }));

    res.json({ rooms: response });
  } catch (err: unknown) {
    const error = err as Error;
    res
      .status(500)
      .json({ message: "Failed to fetch rooms", error: error.message });
  }
};
