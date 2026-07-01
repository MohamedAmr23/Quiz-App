"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LogOut, KeyRound } from "lucide-react";
import { axiosClient } from "@/shared/lib/apis/axiosClient";
import ConfirmationModal from "@/shared/components/ConfirmationModal/ConfirmationModal";

export default function Home() {
  const router = useRouter();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogoutConfirm() {
    setIsLoggingOut(true);
    try {
      await axiosClient.get("/auth/logout");
    } catch {
      // clear and redirect even if request fails
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userProfile");
      }
      toast.success("Logged out successfully!");
      router.push("/login");
    }
  }

  return (
    <>
      <div className="bg-red-500">hello world</div>

      <div className="flex gap-4 p-6">
        <button
          onClick={() => router.push("/change-password")}
          className="flex items-center gap-2 rounded-xl border border-white/15 bg-transparent px-5 py-3 text-white font-medium hover:border-white/40 transition-colors"
        >
          <KeyRound className="w-5 h-5" strokeWidth={1.5} />
          Change Password
        </button>

        <button
          onClick={() => setLogoutModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/40 px-5 py-3 text-red-400 font-medium hover:bg-red-500/30 transition-colors"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          Logout
        </button>
      </div>

      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Log out?"
        description="Are you sure you want to log out? You'll need to sign in again to access your account."
        confirmLabel="Log out"
        cancelLabel="Stay"
        isLoading={isLoggingOut}
      />
    </>
  );
}
