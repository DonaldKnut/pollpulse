import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import { verifyToken } from "@/services/authService";
import api from "@/services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (accessToken && storedUser) {
          const isValid = await verifyToken(accessToken);

          if (isValid) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            await clearAuthData();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        await clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = async (): Promise<void> => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token_expiry");
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (userData: User, accessToken: string): Promise<void> => {
    try {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      const tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
      localStorage.setItem("token_expiry", tokenExpiry.toString());

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      await clearAuthData();
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await clearAuthData();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const response = await api.post("/auth/refresh");
      const newAccessToken = response.data.accessToken;

      if (!newAccessToken) {
        throw new Error("No new access token returned");
      }

      localStorage.setItem("token", newAccessToken);

      const newExpiry = Date.now() + 60 * 60 * 1000;
      localStorage.setItem("token_expiry", newExpiry.toString());
    } catch (error) {
      console.error("Token refresh error:", error);
      await clearAuthData();
    }
  };

  useEffect(() => {
    const checkTokenExpiry = () => {
      const expiry = localStorage.getItem("token_expiry");
      if (expiry && Date.now() > parseInt(expiry)) {
        clearAuthData();
      }
    };

    const interval = setInterval(() => {
      checkTokenExpiry();
      refreshAuth(); // Automatically refresh token every 10 minutes
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
