"use client";

import React from "react";
import ToastProvider from "./toast.provider";
import AuthProvider from "./auth.provider";

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
