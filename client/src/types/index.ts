// src/types.ts
export interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  options: string[];
  deadline: string;
  votes?: number[];
}

export interface VoteData {
  optionIndex: number;
}

export interface Result {
  option: string;
  votes: number;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface NotificationState {
  message: string;
  type: "success" | "error";
}
