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

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="container mx-auto max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner Overview Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              จัดการผู้ใช้งานระบบ รหัสเชิญเจ้าหน้าที่ ตรวจสอบสถานะรถตะไล
              และวางแผนเส้นทางเดินรถ
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              System Online
            </Badge>
            {isSuperAdmin && (
              <Badge variant="secondary" className="gap-1">
                <ShieldAlert className="h-3 w-3" />
                Super Admin
              </Badge>
            )}
          </div>
        </div>

        {/* Top Metric Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="ผู้ใช้งานระบบ"
            subtitle="User Accounts"
            value={isSuperAdmin ? "จัดการผู้ใช้" : "จำกัดสิทธิ์"}
            isLocked={!isSuperAdmin}
            icon={<Users className="h-4 w-4" />}
            isActive={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          />
          <StatCard
            title="รหัสเชิญผู้ดูแลระบบ"
            subtitle="Admin Invites"
            value={isSuperAdmin ? "จัดการสิทธิ์" : "จำกัดสิทธิ์"}
            isLocked={!isSuperAdmin}
            icon={<UserPlus className="h-4 w-4" />}
            isActive={activeTab === "invites"}
            onClick={() => setActiveTab("invites")}
          />
          <StatCard
            title="รถตะไล"
            subtitle="Active Fleet"
            value="จัดการรถตะไล"
            icon={<Bus className="h-4 w-4" />}
            isActive={activeTab === "cars"}
            onClick={() => setActiveTab("cars")}
          />
          <StatCard
            title="สายการเดินรถ"
            subtitle="Campus Routes"
            value="จัดการเส้นทาง"
            icon={<RouteIcon className="h-4 w-4" />}
            isActive={activeTab === "routes"}
            onClick={() => setActiveTab("routes")}
          />
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex overflow-x-auto border-b">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === "users"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            }`}
          >
            <Users className="h-4 w-4" />
            ผู้ใช้งานระบบ
            {!isSuperAdmin && (
              <Badge variant="outline" className="ml-1 h-5 bg-muted/50 px-1 text-[10px]">
                <ShieldAlert className="mr-1 h-3 w-3" />
                Locked
              </Badge>
            )}
          </button>

          <button
            onClick={() => setActiveTab("invites")}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === "invites"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            จัดการรหัสเชิญ
            {!isSuperAdmin && (
              <Badge variant="outline" className="ml-1 h-5 bg-muted/50 px-1 text-[10px]">
                <ShieldAlert className="mr-1 h-3 w-3" />
                Locked
              </Badge>
            )}
          </button>

          <button
            onClick={() => setActiveTab("cars")}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === "cars"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            }`}
          >
            <Bus className="h-4 w-4" />
            การจัดการยานพาหนะ
          </button>

          <button
            onClick={() => setActiveTab("routes")}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === "routes"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
            }`}
          >
            <RouteIcon className="h-4 w-4" />
            สายการเดินรถ
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pt-4">
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
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all hover:border-foreground/20 hover:shadow-sm ${
        isActive
          ? "border-primary ring-1 ring-primary"
          : isLocked
            ? "opacity-60 grayscale"
            : ""
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {subtitle}
          {isLocked && (
            <Badge variant="outline" className="ml-2 h-4 px-1 text-[9px] uppercase">
              Super Admin
            </Badge>
          )}
        </CardTitle>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-md ${
            isActive
              ? "bg-primary text-primary-foreground"
              : isLocked
                ? "bg-muted text-muted-foreground"
                : "bg-muted/50 text-foreground"
          }`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold">{title}</div>
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          {isActive
            ? "• กำลังแสดงข้อมูล"
            : isLocked
              ? "🔒 จำกัดสิทธิ์เฉพาะ Super Admin"
              : "→ กดดูรายละเอียด"}
        </p>
      </CardContent>
    </Card>
  );
}
