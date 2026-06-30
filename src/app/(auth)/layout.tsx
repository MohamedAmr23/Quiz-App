import Image from "next/image";
import logoWhite from "@/assets/images/Logo-white.svg";
import authImg from "@/assets/images/auth-img.svg";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#0D1321] text-slate-100 font-nunito flex">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 md:p-16">
          <div className="flex items-center gap-2.5 select-none">
            <Image
              src={logoWhite}
              alt="QuizWiz Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center max-w-lg w-full mx-auto py-10">
            {children}
          </div>
          <div className="h-10 hidden sm:block"></div>
        </div>
        <div className="hidden lg:flex lg:col-span-5 items-center justify-center p-6 sm:p-10 md:p-12">
          <div className="w-full h-full bg-[#FDF2E2] rounded-[2.5rem] flex items-center justify-center p-8 shadow-lg">
            <Image
              src={authImg}
              alt="QuizWiz Education Illustration"
              className="object-contain max-h-[80%] max-w-[85%] w-auto h-auto"
            />
          </div>
        </div>

      </div>
    </div>
  );
}