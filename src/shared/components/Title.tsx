

"use client";

import { usePathname } from "next/navigation";

export default function Title() {
  const pathname = usePathname();

  const titles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/students": "Students",
    "/questions": "Questions",
    "/groups": "Groups",
    "/quizzes": "Quizzes",
    "/quizzes/results" : "Results"
  };

  const title = titles[pathname] || "Dashboard";

  return (
    <div className="flex items-center gap-4">
      <h2 className="text-2xl font-bold text-[#3D3128]">
        {title}
      </h2>
    </div>
  );
}
