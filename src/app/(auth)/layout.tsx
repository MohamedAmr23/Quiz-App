import Image from "next/image";
import logoWhite from "@/assets/images/Logo-white.svg";
import authImg from "@/assets/images/auth-img.svg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#0D1321] text-slate-100 font-nunito">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12">

        {/* Left Side */}
        <div className="col-span-1 lg:col-span-7 flex min-h-screen flex-col justify-between px-6 py-6 sm:px-10 md:px-14 lg:px-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src={logoWhite}
              alt="QuizWiz Logo"
              className="h-8 sm:h-10 w-auto object-contain"
              priority
            />
          </div>

          {/* Form */}
          <div className="flex flex-1 items-center">
            <div className="w-full max-w-lg py-6">
              {children}
            </div>
          </div>

          {/* Space */}
          <div className="h-4" />
        </div>


        {/* Right Side Image */}
        <div className="hidden lg:flex lg:col-span-5 items-center justify-center p-8">
          <div className="flex h-[85vh] w-full items-center justify-center rounded-[2rem] bg-[#FDF2E2] p-6">
            <Image
              src={authImg}
              alt="QuizWiz Education Illustration"
              className="
                object-contain
                max-h-[55vh]
                max-w-[75%]
                w-auto
                h-auto
              "
              priority
            />
          </div>
        </div>

      </div>
    </div>
  );
}