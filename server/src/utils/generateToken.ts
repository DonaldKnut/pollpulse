import jwt, { SignOptions } from "jsonwebtoken";

interface TokenGenerationOptions {
  expiresIn?: SignOptions["expiresIn"];
  additionalPayload?: Record<string, any>;
}

/**
 * Generates a JWT token with customizable options
 * @param userId - The user ID to include in the token payload
 * @param options - Configuration options for token generation
 * @returns Generated JWT token
 */
const generateToken = (
  userId: string,
  options: TokenGenerationOptions = { expiresIn: "15m" }
): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const { expiresIn = "15m", additionalPayload = {} } = options;

  const payload = {
    id: userId,
    ...additionalPayload,
  };

  const signOptions: SignOptions = {
    expiresIn,
    issuer: "pollpulse",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, signOptions);
};

export default generateToken;
