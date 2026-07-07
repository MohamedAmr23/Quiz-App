import NavBar from "@/shared/components/NavBar/NavBar";
import SideBar from "@/shared/components/SideBar/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
        <SideBar />

      <div className="flex-1 flex flex-col">
        <NavBar title="Dashboard" />
        {children}
      </div>
    </div>
  );
}
