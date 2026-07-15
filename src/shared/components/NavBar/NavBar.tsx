"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, User, LogOut } from "lucide-react";
import Title from "../Title";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export default function NavBar() {
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

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
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
    <nav className="flex items-center justify-between bg-white px-4 sm:px-6 py-2.5 shadow-sm">
      <div className="min-w-0 flex-1">
        <Title />
      </div>

      <div className="relative ml-3 shrink-0" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-gray-100 transition"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
            {initials}
          </div>

          <div className="hidden md:flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold text-gray-800">
              {userName}
            </span>

            <span className="text-xs text-green-600 capitalize">
              {user.role}
            </span>
          </div>

          <ChevronDown
            className={`h-5 w-5 transition ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`absolute right-0 mt-3 w-52 rounded-xl border bg-white shadow-xl transition-all duration-200 ${
            open
              ? "visible opacity-100 translate-y-0"
              : "invisible opacity-0 -translate-y-2"
          }`}
        >
          <button
            onClick={handleProfile}
            className="flex w-full items-center gap-3 px-4 py-3 hover:bg-green-50 transition"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
              <User className="h-5 w-5 text-green-700" />
            </div>

            <span className="text-sm font-medium">Profile</span>
          </button>

          <hr />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
              <LogOut className="h-5 w-5" />
            </div>

            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}