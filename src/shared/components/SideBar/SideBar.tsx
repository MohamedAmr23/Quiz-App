"use client";

import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileQuestion,
  Layers,
  LayoutDashboard,
  Users,
  CircleHelp,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Students", icon: Users, href: "/students" },
    { name: "Questions", icon: FileQuestion, href: "/questions" },
    { name: "Groups", icon: Layers, href: "/groups" },
    { name: "Quizzes", icon: ClipboardList, href: "/quizzes" },
    { name: "Results", icon: BarChart3, href: "/results" },
    { name: "Change Password", icon: Lock, href: "/change-password" },
  ];

  return (
    <aside className="flex h-screen w-20 sm:w-24 md:w-72 flex-col border-r border-[#E9DDD1] bg-[#FCFAF8] shadow-sm transition-all duration-300">
      <div className="flex items-center justify-center md:justify-start gap-4 border-b border-[#E9DDD1] px-3 md:px-6 py-6">
        <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-[#F6EADF] shadow-sm transition duration-300 hover:scale-105 shrink-0">
          <BookOpen className="h-6 w-6 md:h-7 md:w-7 text-[#B78757]" />
        </div>

        <div className="hidden md:block">
          <h1 className="text-2xl font-bold text-[#3D3128]">Quiz App</h1>

        </div>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-2 px-3 md:px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center justify-center md:justify-start gap-4 rounded-2xl px-3 md:px-5 py-4 transition-all duration-300
              ${
                active
                  ? "bg-[#C89B6D] text-white shadow-md"
                  : "text-[#5F4B3D] hover:bg-[#F6EADF] hover:text-[#A06B43] hover:translate-x-1"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                  active
                    ? "text-white"
                    : "text-[#A18A77] group-hover:text-[#A06B43]"
                }`}
              />

              <span className="hidden md:block font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E9DDD1] p-3 md:p-5">
        <button className="group flex w-full items-center justify-center md:justify-start gap-4 rounded-2xl bg-[#F6EADF] px-3 md:px-5 py-4 transition duration-300 hover:bg-[#EEDCCB]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm shrink-0">
            <CircleHelp className="h-5 w-5 text-[#B78757]" />
          </div>

          <div className="hidden md:block text-left">
            <p className="font-semibold text-[#5F4B3D]">Help Center</p>

            <span className="text-xs text-[#9D826E]">Need assistance?</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
