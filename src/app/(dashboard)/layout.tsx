"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/shared/components/SideBar/SideBar";
import NavBar from "@/shared/components/NavBar/NavBar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      
      router.replace("/login");
      return;
    }

    document.cookie = `accessToken=${token}; path=/; max-age=${
      60 * 60 * 24 * 7
    }; SameSite=Lax`;

    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
      </div>
    );
  }

  return (
    <div className="flex">
      <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <NavBar />
        <main>{children}</main>
      </div>
    </div>
  );
}