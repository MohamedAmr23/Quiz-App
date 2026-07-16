"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, User, LogOut, Menu } from "lucide-react";
import Title from "../Title";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface NavBarProps {
  onMenuClick?: () => void;
}

export default function NavBar({ onMenuClick }: NavBarProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) setUser(JSON.parse(profile));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userProfile");
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/profile");
    setOpen(false);
  };

  if (!user) return null;

  const userName = `${user.first_name} ${user.last_name}`;
  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-6">

      
    {/* Title only — no hamburger here */}
    <div className="min-w-0 flex-1">
      <Title />
    </div>

      <div className="relative z-50 ml-3 index-50 shrink-0" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-gray-100"
        >
          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
            {initials}
          </div>

          {/* Name + role — hidden on small screens */}
          <div className="hidden flex-col items-start leading-tight md:flex">
            <span className="max-w-[120px] truncate text-sm font-semibold text-gray-800">
              {userName}
            </span>
            <span className="text-xs capitalize text-green-600">
              {user.role}
            </span>
          </div>

          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        <div
          className={`absolute right-0 mt-3 index-60 w-52 rounded-xl border bg-white shadow-xl transition-all duration-200 ${
            open
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0"
          }`}
        >
          {/* User info header */}
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-gray-800">
              {userName}
            </p>
            <p className="truncate text-xs text-gray-400">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium capitalize text-green-600">
              {user.role}
            </span>
          </div>

          {/* Profile */}
          <button
            onClick={handleProfile}
            className="flex w-full items-center gap-3 px-4 py-3 transition hover:bg-green-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <User size={15} className="text-green-700" />
            </div>
            <span className="text-sm font-medium text-gray-700">Profile</span>
          </button>

          <hr className="border-gray-100" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 transition hover:bg-red-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <LogOut size={15} className="text-red-500" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}