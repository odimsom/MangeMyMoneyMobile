import { setUnauthorizedCallback } from "@/services/api";
import { authService } from "@/services/authService";
import {
  LoginRequest,
  RegisterRequest,
  UpdateUserProfileRequest,
  User,
} from "@/types/auth";
import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  updateProfile: (data: UpdateUserProfileRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  useEffect(() => {
    setUnauthorizedCallback(logout);
    return () => setUnauthorizedCallback(() => {});
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Auth initialization failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setUser(response.user);
  };

  const updateProfile = async (data: UpdateUserProfileRequest) => {
    const updatedUser = await authService.updateProfile(data);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        updateProfile,
        logout,
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
