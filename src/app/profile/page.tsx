"use client";

import { useEffect, useState } from "react";
import { User, Mail, ShieldCheck, BadgeCheck } from "lucide-react";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");

    if (profile) {
      setUser(JSON.parse(profile));
    }
  }, []);

  if (!user) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg text-gray-500">Loading Profile...</p>
      </div>
    );
  }

  const initials = `${user.first_name[0]}${user.last_name[0]}`;

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="overflow-hidden rounded-3xl border border-[#E8D7C8] bg-white shadow-lg">
        <div className="bg-linear-to-r from-[#C89B6D] via-[#D5AE83] to-[#E6C6A3] px-10 py-10">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#FCF7F2] text-4xl font-bold text-[#8B5E3C] shadow-lg">
              {initials}
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white">
                {user.first_name} {user.last_name}
              </h1>

              <p className="mt-2 text-lg text-[#FFF8F2]">{user.role}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-8 md:grid-cols-2">
          <InfoCard
            icon={<User size={22} />}
            title="First Name"
            value={user.first_name}
          />

          <InfoCard
            icon={<User size={22} />}
            title="Last Name"
            value={user.last_name}
          />

          <InfoCard
            icon={<Mail size={22} />}
            title="Email"
            value={user.email}
          />

          <InfoCard
            icon={<ShieldCheck size={22} />}
            title="Role"
            value={user.role}
          />

          <InfoCard
            icon={<BadgeCheck size={22} />}
            title="Status"
            value={user.status}
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="group flex items-center gap-5 rounded-2xl border border-[#EFE3D7] bg-[#FFFCFA] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C89B6D] hover:shadow-lg">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8EFE7] text-[#B78757] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#C89B6D] group-hover:text-white">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>

        <h3 className="mt-1 text-lg font-semibold text-[#4B3A2F]">{value}</h3>
      </div>
    </div>
  );
}
