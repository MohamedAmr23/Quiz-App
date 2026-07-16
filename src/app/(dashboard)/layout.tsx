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
    <div className="min-h-screen bg-gray-50">
      <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* 
        Mobile: no left margin (sidebar is a drawer overlay)
                BUT add top padding for the sidebar's own fixed mobile top bar (~57px)
        Desktop (lg): left margin for the fixed sidebar, no top padding
      */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-300
          pt-[57px] lg:pt-0
          ml-0 ${collapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        {/* NavBar — sticky below the mobile top bar on mobile, at top on desktop */}
        <NavBar />

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}