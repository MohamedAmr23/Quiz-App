"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F5F2] px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-2xl animate-pulse">
        <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#EFE4DA]">
          <span className="animate-bounce text-6xl font-extrabold text-[#6F4E37]">
            404
          </span>
        </div>

        <h1 className="text-3xl font-bold text-[#4B352A]">Page Not Found</h1>

        <p className="mt-3 text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => router.push("/")}
            className="flex-1 rounded-xl bg-[#6F4E37] px-5 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#5A3F2D] hover:shadow-lg active:scale-95"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.back()}
            className="flex-1 rounded-xl border-2 border-[#6F4E37] px-5 py-3 font-semibold text-[#6F4E37] transition-all duration-300 hover:-translate-y-1 hover:bg-[#6F4E37] hover:text-white hover:shadow-lg active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
