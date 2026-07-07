"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, User, LogOut } from "lucide-react";
import Title from "../Title/Title";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface NavBarProps {
  title: string;
}

export default function NavBar({ title }: NavBarProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");

    if (profile) {
      setUser(JSON.parse(profile));
    }
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
  };

  if (!user) return null;

  const userName = `${user.first_name} ${user.last_name}`;
  const initials = `${user.first_name[0]}${user.last_name[0]}`;

  return (
    <nav className="flex items-center justify-between bg-white px-3 sm:px-6 py-4 sm:py-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <Title title={title} />

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="group flex items-center gap-2 sm:gap-3 rounded-xl px-2 sm:px-3 py-2 transition-all duration-300 hover:bg-gray-50"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-green-200 group-hover:shadow-md">
            {initials}
          </div>

          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold text-gray-800 transition-colors duration-300 group-hover:text-green-700">
              {userName}
            </span>

            <span className="text-xs text-green-600 font-medium">
              {user.role}
            </span>
          </div>

          <ChevronDown
            size={18}
            className={`text-gray-500 transition-all duration-300 ${
              open ? "rotate-180 text-[#8B6B4A]" : ""
            }`}
          />
        </button>

        <div
          className={`absolute right-0 top-full mt-4 w-48 sm:w-56 origin-top-right overflow-hidden rounded-xl border border-[#E9DDD1] bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-200 ${
            open
              ? "visible translate-y-0 scale-100 opacity-100"
              : "invisible -translate-y-2 scale-95 opacity-0"
          }`}
        >
          <button
            onClick={handleProfile}
            className="group flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-green-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700 transition-all duration-200 group-hover:scale-105">
              <User size={18} />
            </div>

            <span className="group-hover:text-green-700">Profile</span>
          </button>

          <div className="mx-4 border-t border-[#E9DDD1]" />

          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600 transition-all duration-200 group-hover:scale-105">
              <LogOut size={18} />
            </div>

            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
