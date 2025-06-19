// src/models/Room.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOption {
  text: string;
  votes: number;
  justification?: string[];
}

export interface IRoom extends Document {
  creator: mongoose.Types.ObjectId;
  title: string;
  description: string;
  options: IOption[];
  deadline: Date;
  voters: string[];
  createdAt: Date;
  updatedAt: Date;
}

const optionSchema = new Schema<IOption>(
  {
    text: { type: String, required: true },
    votes: { type: Number, default: 0 },
    justification: [{ type: String }],
  },
  { _id: false }
);

const roomSchema = new Schema<IRoom>(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    options: [optionSchema],
    deadline: { type: Date, required: true },
    voters: [{ type: String }],
  },
  { timestamps: true }
);

const Room = mongoose.model<IRoom>("Room", roomSchema);
export default Room;
