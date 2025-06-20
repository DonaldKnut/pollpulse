import { Request, Response } from "express";
import User from "../models/User";
import generateToken from "../utils/generateToken";

// Utility function for consistent error structure
const sendError = (
  res: Response,
  status: number,
  message: string,
  debug?: any
) => {
  console.error(`❌ ${message}`, debug || "");
  return res.status(status).json({
    success: false,
    message,
  });
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return sendError(
      res,
      400,
      "All fields (username, email, password) are required"
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, "An account with this email already exists");
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user.id.toString());

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err: any) {
    return sendError(res, 500, "Registration failed", err);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password });

  if (!email || !password) {
    return sendError(res, 400, "Email and password are required");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 401, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password");
    }

    const token = generateToken(user.id.toString());
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err: any) {
    return sendError(res, 500, "Login failed", err);
  }
};
