import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "@/types";

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// Create the context with initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that wraps your application
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user state from localStorage at mount
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user data", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  // Login function — sets localStorage and updates state
  const login = (userData: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout function — clears localStorage and resets state
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
