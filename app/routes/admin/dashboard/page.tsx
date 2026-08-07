import { useState, useEffect } from "react";
import Navbar from "~/components/layout/Navbar";
import { useAuth } from "~/components/providers/AuthProvider";
import AdminInviteComponent from "./components/admin-invite.component";
import CarsComponent from "./components/cars.component";
import RoutesComponent from "./components/routes.compoentn";
import UserComponent from "./components/user.component";

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
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans flex flex-col antialiased">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Overview Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                KUKPS smart talai Control Center
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${
                  isSuperAdmin
                    ? "bg-amber-50 text-amber-900 border-amber-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {isSuperAdmin ? "Role: Super Admin" : "Role: Admin"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              แผงควบคุมระบบผู้ดูแลระบบ (Admin Dashboard)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              จัดการผู้ใช้งานระบบ รหัสเชิญเจ้าหน้าที่ ตรวจสอบสถานะรถตะไล และวางแผนเส้นทางเดินรถสวัสดิการ มก.กำแพงแสน
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
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            }
            isActive={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          />
          <StatCard
            title="รหัสเชิญผู้ดูแลระบบ"
            subtitle="Admin Invites"
            value={isSuperAdmin ? "จัดการสิทธิ์" : "จำกัดสิทธิ์"}
            isLocked={!isSuperAdmin}
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            }
            isActive={activeTab === "invites"}
            onClick={() => setActiveTab("invites")}
          />
          <StatCard
            title="รถตะไลสวัสดิการ"
            subtitle="Active Fleet"
            value="3 คัน"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.676v6.676m0-6.676h3.454c.456 0 .868.27 1.05.688l.848 1.95"
              />
            }
            isActive={activeTab === "cars"}
            onClick={() => setActiveTab("cars")}
          />
          <StatCard
            title="สายการเดินรถ"
            subtitle="Campus Routes"
            value="2 เส้นทาง"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503-14.25l4.372 2.186a1.125 1.125 0 01.625 1.007V19.5a1.125 1.125 0 01-1.55 1.037l-4.52-1.808a1.125 1.125 0 00-.819 0l-4.593 1.837a1.125 1.125 0 01-1.033-.146l-4.372-2.186A1.125 1.125 0 012.25 17.25V4.5a1.125 1.125 0 011.55-1.037l4.52 1.808a1.125 1.125 0 00.819 0l4.593-1.837a1.125 1.125 0 011.033.146z"
              />
            }
            isActive={activeTab === "routes"}
            onClick={() => setActiveTab("routes")}
          />
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-col md:flex-row border-b border-slate-200 space-x-2">
          <button
            onClick={() => setActiveTab("users")}
            id="tab-users"
            className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 shrink-0 ${
              activeTab === "users"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            <span>ผู้ใช้งานระบบ</span>
            {!isSuperAdmin && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200">
                Super Admin
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("invites")}
            id="tab-invites"
            className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 shrink-0 ${
              activeTab === "invites"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <span>จัดการรหัสเชิญ</span>
            {!isSuperAdmin && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200">
                Super Admin
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("cars")}
            id="tab-cars"
            className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 shrink-0 ${
              activeTab === "cars"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.676v6.676m0-6.676h3.454c.456 0 .868.27 1.05.688l.848 1.95"
              />
            </svg>
            <span>การจัดการยานพาหนะ</span>
          </button>

          <button
            onClick={() => setActiveTab("routes")}
            id="tab-routes"
            className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 shrink-0 ${
              activeTab === "routes"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503-14.25l4.372 2.186a1.125 1.125 0 01.625 1.007V19.5a1.125 1.125 0 01-1.55 1.037l-4.52-1.808a1.125 1.125 0 00-.819 0l-4.593 1.837a1.125 1.125 0 01-1.033-.146l-4.372-2.186A1.125 1.125 0 012.25 17.25V4.5a1.125 1.125 0 011.55-1.037l4.52 1.808a1.125 1.125 0 00.819 0l4.593-1.837a1.125 1.125 0 011.033.146z"
              />
            </svg>
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
      className={`p-6 border rounded-2xl bg-white cursor-pointer transition-all ${
        isActive
          ? "border-emerald-600 shadow-md shadow-emerald-600/5 ring-1 ring-emerald-600/20"
          : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider block flex items-center gap-1">
            {subtitle}
            {isLocked && (
              <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-sans">
                Super Admin
              </span>
            )}
          </span>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isActive
              ? "bg-emerald-600 text-white"
              : isLocked
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-800"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {icon}
          </svg>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xl font-extrabold font-mono text-slate-900">
          {value}
        </span>
        <span
          className={`text-xs font-semibold ${
            isActive ? "text-emerald-700" : "text-slate-400"
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
