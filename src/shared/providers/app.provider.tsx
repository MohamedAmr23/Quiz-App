"use client";

import React from "react";
import ToastProvider from "./toast.provider";

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return <ToastProvider>{children}</ToastProvider>;
}
