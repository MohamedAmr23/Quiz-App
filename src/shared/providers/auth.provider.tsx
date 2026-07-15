"use client";

import React, { createContext, useState, useEffect } from "react";

export interface UserProfile {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  role: string;
}

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, profile: UserProfile) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("userProfile");

      if (storedAccessToken && storedRefreshToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setAccessTokenState(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(parsedUser);
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userProfile");
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "accessToken" && !event.newValue) {
        setAccessTokenState(null);
        setRefreshToken(null);
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (newAccessToken: string, newRefreshToken: string, profile: UserProfile) => {
    setAccessTokenState(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUser(profile);

    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("userProfile", JSON.stringify(profile));
  };

  const logout = () => {
    setAccessTokenState(null);
    setRefreshToken(null);
    setUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userProfile");
  };

  const setAccessToken = (newToken: string) => {
    setAccessTokenState(newToken);
    localStorage.setItem("accessToken", newToken);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        isLoading,
        login,
        logout,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
