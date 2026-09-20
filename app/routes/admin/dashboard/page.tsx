import { useState, useEffect } from "react";
import Navbar from "~/components/layout/Navbar";
import { useAuth } from "~/components/providers/AuthProvider";
import AdminInviteComponent from "./components/admin-invite.component";
import CarsComponent from "./components/cars.component";
import RoutesComponent from "./components/routes.component";
import UserComponent from "./components/user.component";
import {
  Users,
  UserPlus,
  Bus,
  Route as RouteIcon,
  ShieldAlert,
} from "lucide-react";

export function meta() {
  return [
    { title: "Dashboard — KUKPS smart talai" },
    {
      name: "description",
      content: "ระบบควบคุมและบริหารจัดการ KUKPS smart talai สำหรับผู้ดูแลระบบ",
    },
  ];
}

type TabType = "users" | "invites" | "cars" | "routes";

export default function DashboardRoute() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  const [activeTab, setActiveTab] = useState<TabType>("users");

  // Default to users tab if superadmin, else cars
  useEffect(() => {
    if (isSuperAdmin) {
      setActiveTab("users");
    } else {
      setActiveTab("cars");
    }
  }, [isSuperAdmin]);

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans flex flex-col antialiased">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Overview Header */}
        <div className="bg-white border border-gray-200 rounded-md p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-gray-100 text-black border border-gray-300">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                KUKPS smart talai Control Center
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${
                  isSuperAdmin
                    ? "bg-amber-50 text-amber-900 border-amber-200"
                    : "bg-gray-200 text-gray-700 border-gray-200"
                }`}
              >
                {isSuperAdmin ? "Role: Super Admin" : "Role: Admin"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              แผงควบคุมระบบผู้ดูแลระบบ (Admin Dashboard)
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl">
              จัดการผู้ใช้งานระบบ รหัสเชิญเจ้าหน้าที่ ตรวจสอบสถานะรถตะไล
              และวางแผนเส้นทางเดินรถสวัสดิการ มก.กำแพงแสน
            </p>
          </div>
        </div>

        {/* Top Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="ผู้ใช้งานระบบ"
            subtitle="User Accounts"
            value={isSuperAdmin ? "จัดการผู้ใช้" : "จำกัดสิทธิ์"}
            isLocked={!isSuperAdmin}
            icon={<Users className="w-5 h-5" />}
            isActive={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          />
          <StatCard
            title="รหัสเชิญผู้ดูแลระบบ"
            subtitle="Admin Invites"
            value={isSuperAdmin ? "จัดการสิทธิ์" : "จำกัดสิทธิ์"}
            isLocked={!isSuperAdmin}
            icon={<UserPlus className="w-5 h-5" />}
            isActive={activeTab === "invites"}
            onClick={() => setActiveTab("invites")}
          />
          <StatCard
            title="รถตะไล"
            subtitle="Active Fleet"
            value="จัดการรถตะไล"
            icon={<Bus className="w-5 h-5" />}
            isActive={activeTab === "cars"}
            onClick={() => setActiveTab("cars")}
          />
          <StatCard
            title="สายการเดินรถ"
            subtitle="Campus Routes"
            value="จัดการเส้นทาง"
            icon={<RouteIcon className="w-5 h-5" />}
            isActive={activeTab === "routes"}
            onClick={() => setActiveTab("routes")}
          />
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-col md:flex-row border-b border-gray-200 space-x-2">
          <button
            onClick={() => setActiveTab("users")}
            id="tab-users"
            className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 shrink-0 ${
              activeTab === "users"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ผู้ใช้งานระบบ</span>
            {!isSuperAdmin && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-600" />
                Super Admin
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("invites")}
            id="tab-invites"
            className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 shrink-0 ${
              activeTab === "invites"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>จัดการรหัสเชิญ</span>
            {!isSuperAdmin && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-600" />
                Super Admin
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("cars")}
            id="tab-cars"
            className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 shrink-0 ${
              activeTab === "cars"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>การจัดการยานพาหนะ</span>
          </button>

          <button
            onClick={() => setActiveTab("routes")}
            id="tab-routes"
            className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 shrink-0 ${
              activeTab === "routes"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <RouteIcon className="w-4 h-4" />
            <span>สายการเดินรถ</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === "users" && <UserComponent />}
          {activeTab === "invites" && <AdminInviteComponent />}
          {activeTab === "cars" && <CarsComponent />}
          {activeTab === "routes" && <RoutesComponent />}
        </div>
      </main>
    </div>
  );
}

/* Stat Metric Card Component */
function StatCard({
  title,
  subtitle,
  value,
  icon,
  isActive,
  isLocked,
  onClick,
}: {
  title: string;
  subtitle: string;
  value: string;
  icon: React.ReactNode;
  isActive: boolean;
  isLocked?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-6 border rounded-md bg-white cursor-pointer transition-all ${
        isActive
          ? "border-black shadow-md shadow-black/5 ring-1 ring-black/20"
          : "border-gray-200 hover:border-gray-300 hover:shadow-xs"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-mono font-medium text-gray-500 uppercase tracking-wider block flex items-center gap-1">
            {subtitle}
            {isLocked && (
              <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-sans">
                Super Admin
              </span>
            )}
          </span>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
        </div>

        <div
          className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
            isActive
              ? "bg-black text-white"
              : isLocked
                ? "bg-amber-50 text-amber-700"
                : "bg-gray-100 text-black"
          }`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <span className="text-xl font-extrabold font-mono text-gray-900">
          {value}
        </span>
        <span
          className={`text-xs font-semibold ${
            isActive ? "text-gray-600" : "text-gray-400"
          }`}
        >
          {isActive
            ? "กำลังแสดงข้อมูล →"
            : isLocked
              ? "จำกัดสิทธิ์เฉพาะ Super Admin"
              : "กดดูรายละเอียด"}
        </span>
      </div>
    </div>
  );
}
