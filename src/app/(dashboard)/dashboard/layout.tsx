"use client";

import { useState } from "react";
import NavBar from "@/shared/components/NavBar/NavBar";
import SideBar from "@/shared/components/SideBar/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen">
      <SideBar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main
        className={`min-h-screen flex flex-col transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <NavBar />

        <div className="flex-1 p-4">
          {children}
        </div>
      </main>
    </div>
  );
}