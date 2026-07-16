"use client";

import { useEffect, useState } from "react";
import {
  House, Users, BadgeCheck, FileBadge2, CircleHelp,
  FileQuestion, Group, Lock, PanelLeftClose, PanelLeftOpen,
  Sparkles, X, Menu,
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
  const [role, setRole] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const profile = localStorage.getItem("userProfile");
      if (profile) {
        const user = JSON.parse(profile);
        setRole(user.role ?? "");
      } else {
        setRole("");
      }
    } catch {
      setRole("");
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const links = [
    { name: "Dashboard", icon: House, href: "/", roles: ["Instructor", "Student"]  },
    { name: "Students", icon: Users, href: "/students", roles: ["Instructor"] },
    { name: "Questions", icon: FileQuestion, href: "/questions", roles: ["Instructor"] },
    { name: "Groups", icon: Group, href: "/groups", roles: ["Instructor"] },
    { name: "Quizzes", icon: FileBadge2, href: "/quizzes", roles: ["Instructor", "Student"] },
    { name: "Results", icon: BadgeCheck, href: "/quizzes/results", roles: ["Instructor", "Student"] },
    { name: "Change Password", icon: Lock, href: "/change-password", roles: ["Instructor"] },
  ];

  const visibleLinks = role === null ? [] : links.filter((l) => l.roles.includes(role));
  const mainLinks = visibleLinks.filter((l) => l.href !== "/change-password");
  const changePasswordLink = visibleLinks.find((l) => l.href === "/change-password");

  const NavLinks = ({ onlyIcons = false }: { onlyIcons?: boolean }) => (
    <>
      {role === null && (
        <>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-14 animate-pulse rounded-xl bg-gray-100 ${onlyIcons ? "w-12 mx-auto" : "w-full"}`}
            />
          ))}
        </>
      )}

      {role !== null && (
        <>
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center rounded-xl py-3 transition-all duration-300
                  ${onlyIcons ? "justify-center" : "gap-4 px-3"}
                  ${active ? "bg-[#FFEDDF] text-black" : "hover:bg-[#FFF5EC]"}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFEDDF]">
                  <Icon className="h-5 w-5" />
                </div>
                {!onlyIcons && <span className="font-bold whitespace-nowrap">{link.name}</span>}
              </Link>
            );
          })}

          {role === "Instructor" && (
            <Link
              href="/generate-questions"
              className={`group flex items-center rounded-xl py-3 transition-all duration-300
                ${pathname === "/generate-questions" ? "bg-[#FFEDDF] text-black" : "hover:bg-[#FFF5EC]"}
                ${onlyIcons ? "justify-center" : "gap-4 px-3"}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFEDDF]">
                <Sparkles className="h-5 w-5 text-orange-500" />
              </div>
              {!onlyIcons && <span className="font-bold whitespace-nowrap">Generate Question</span>}
            </Link>
          )}

          {changePasswordLink && (() => {
            const Icon = changePasswordLink.icon;
            const active = pathname === changePasswordLink.href;
            return (
              <Link
                href={changePasswordLink.href}
                className={`group flex items-center rounded-xl py-3 transition-all duration-300
                  ${onlyIcons ? "justify-center" : "gap-4 px-3"}
                  ${active ? "bg-[#FFEDDF] text-black" : "hover:bg-[#FFF5EC]"}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFEDDF]">
                  <Icon className="h-5 w-5" />
                </div>
                {!onlyIcons && <span className="font-bold whitespace-nowrap">{changePasswordLink.name}</span>}
              </Link>
            );
          })()}
        </>
      )}
    </>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <Image src={Logo} alt="Logo" width={40} height={40} />
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 hover:bg-gray-100 transition"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200 shadow-xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <Image src={Logo} alt="Logo" width={48} height={48} />
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-5 flex flex-col gap-2 px-3 overflow-y-auto max-h-[calc(100vh-80px)] pb-24">
          <NavLinks onlyIcons={false} />
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-200 p-3">
          <button className="flex w-full items-center gap-4 px-3 rounded-xl py-3 transition hover:bg-[#FFF5EC]">
            <div className="flex h-10 w-10 items-center justify-center">
              <CircleHelp className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Help Center</p>
              <span className="text-xs text-gray-500">Need assistance?</span>
            </div>
          </button>
        </div>
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className={`flex items-center border-b border-gray-200 p-5 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && <Image src={Logo} alt="Logo" width={56} height={56} />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        <nav className="mt-5 flex flex-col gap-2 px-3 flex-1 overflow-y-auto">
          <NavLinks onlyIcons={collapsed} />
        </nav>

        <div className="border-t border-gray-200 p-3">
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
    </>
  );
}