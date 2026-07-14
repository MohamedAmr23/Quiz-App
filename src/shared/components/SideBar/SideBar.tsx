"use client";

import { useEffect, useState } from "react";
import {
  House,
  Users,
  BadgeCheck,
  FileBadge2,
  CircleHelp,
  FileQuestion,
  Group,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/assets/images/Logo.png";

interface SideBarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideBar({ collapsed, setCollapsed }: SideBarProps) {
  const pathname = usePathname();
  const [role, setRole] = useState("");

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      const user = JSON.parse(profile);
      setRole(user.role);
    }
  }, []);

  const links = [
    {
      name: "Dashboard",
      icon: House,
      href: "/",
      roles: ["Instructor", "Student"],
    },
    {
      name: "Students",
      icon: Users,
      href: "/students",
      roles: ["Instructor"],
    },
    {
      name: "Questions",
      icon: FileQuestion,
      href: "/questions",
      roles: ["Instructor"],
    },
    {
      name: "Groups",
      icon: Group,
      href: "/groups",
      roles: ["Instructor"],
    },
    {
      name: "Quizzes",
      icon: FileBadge2,
      href: "/quizzes",
      roles: ["Instructor", "Student"],
    },
    {
      name: "Results",
      icon: BadgeCheck,
      href: "/quizzes/results",
      roles: ["Instructor", "Student"],
    }
    ,
    // {
    //   name: "Generate Question",
    //   icon: Sparkles,
    //   href: "/generate-question",
    //   roles: ["Instructor"],
    // },
    {
      name: "Change Password",
      icon: Lock,
      href: "/change-password",
      roles: ["Instructor"],
    },
  ];

  const visibleLinks = links.filter((link) => link.roles.includes(role));

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen border-r border-gray-200 bg-white shadow-sm transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`flex items-center border-b border-gray-200 p-5 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && <Image src={Logo} alt="Logo" width={56} height={56} />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 transition hover:bg-gray-100"
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      <nav className="mt-5 flex flex-col gap-2 px-3">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          const isGenerate = link.href === "/generate-question";
          const active = pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center rounded-xl py-3 transition-all duration-300
                ${collapsed ? "justify-center" : "gap-4 px-3"}
                ${active ? "bg-[#FFEDDF] text-black" : "hover:bg-[#FFF5EC]"}`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all ${
                  isGenerate
                    ? "bg-gradient-to-br from-purple-100 to-blue-100"
                    : "bg-[#FFEDDF]"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isGenerate ? "text-purple-600" : ""}`}
                />
              </div>

              {!collapsed && (
                <span
                  className={`whitespace-nowrap font-bold ${
                    isGenerate ? "bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent" : ""
                  }`}
                >
                  {link.name}
                </span>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="pointer-events-none absolute left-20 z-50 ml-1 hidden whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white group-hover:block">
                  {link.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-gray-200 p-3">
        <button
          className={`flex w-full items-center rounded-xl py-3 transition hover:bg-[#FFF5EC] ${
            collapsed ? "justify-center" : "gap-4 px-3"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center">
            <CircleHelp className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="text-left">
              <p className="font-semibold">Help Center</p>
              <span className="text-xs text-gray-500">Need assistance?</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}