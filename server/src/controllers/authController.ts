import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken";

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// Cookie config
const REFRESH_TOKEN_COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

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

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, "Email already exists");
    }

    const user = await User.create({ username, email, password });

    // Generate both tokens with options object
    const accessToken = generateToken(user.id, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = generateToken(user.id, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_CONFIG);

    res.status(201).json({
      success: true,
      accessToken,
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

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 401, "Invalid credentials");
    }

    // Generate both tokens with options object
    const accessToken = generateToken(user.id, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = generateToken(user.id, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_CONFIG);

    res.json({
      success: true,
      accessToken,
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

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return sendError(res, 401, "No refresh token provided");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 401, "User not found");
    }

    // Generate new access token with options object
    const newAccessToken = generateToken(user.id, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err: any) {
    res.clearCookie("refreshToken");
    return sendError(res, 401, "Invalid refresh token", err.message);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Logged out successfully" });
};

export const verifyToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendError(res, 401, "No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return sendError(res, 401, "User not found");
    }

    res.json({
      success: true,
      isValid: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err: any) {
    return sendError(res, 401, "Invalid token", err.message);
  }
};
