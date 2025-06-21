// src/services/authService.ts
import api from "./api";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  message?: string;
}

/**
 * Logs in a user and returns the auth response.
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

/**
 * Registers a new user and returns the auth response.
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);

  if (response.status !== 201) {
    throw new Error(response.data.message || "Registration failed");
  }

  return response.data;
};

/**
 * Verifies if the token is valid using the /auth/verify endpoint.
 */
export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await api.post(
      "/auth/verify",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data?.isValid === true;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};
