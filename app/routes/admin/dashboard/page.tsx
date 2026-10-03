import { useState, useEffect } from "react";
import Navbar from "~/components/layout/Navbar";
import { useAuth } from "~/components/providers/AuthProvider";
import AdminInviteComponent from "./components/admin-invite.component";
import CarsComponent from "./components/cars.component";
import RoutesComponent from "./components/routes.component";
import UserComponent from "./components/user.component";
import AssignmentDriverComponent from "./components/assignment-driver.component";
import EtaView from "./components/eta/EtaView";

import { ShieldAlert } from "lucide-react";
import GlobalAlert from "~/components/ui/GlobalAlert";

export function meta() {
  return [
    { title: "Dashboard — KUKPS smart talai" },
    {
      name: "description",
      content: "ระบบควบคุมและบริหารจัดการ KUKPS smart talai สำหรับผู้ดูแลระบบ",
    },
  ];
}

type TabType =
  "users" | "invites" | "cars" | "routes" | "assignment-driver" | "eta";

export default function DashboardRoute() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  const [activeTab, setActiveTab] = useState<TabType>("users");

  useEffect(() => {
    if (isSuperAdmin) {
      setActiveTab("users");
    } else {
      setActiveTab("cars");
    }
  }, [isSuperAdmin]);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Full-Screen Layout */}
      <main className="flex flex-1 min-h-0 flex-col md:flex-row w-full">
        {/* Sidebar / Mobile Nav */}
        <aside className="w-full md:w-56 lg:w-56 shrink-0 border-b md:border-b-0 md:border-r border-border p-4">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {[
              { id: "users", label: "ผู้ใช้งาน", requiresSuperAdmin: true },
              { id: "invites", label: "รหัสเชิญ", requiresSuperAdmin: true },
              { id: "cars", label: "ยานพาหนะ", requiresSuperAdmin: false },
              {
                id: "routes",
                label: "สายการเดินรถ",
                requiresSuperAdmin: false,
              },
              {
                id: "assignment-driver",
                label: "การจัดการงานผู้ขับรถ",
                requiresSuperAdmin: false,
              },
              {
                id: "eta",
                label: "ดูตำแหน่งรถแบบเรียลไทม์",
                requiresSuperAdmin: false,
              },
            ].map((item) => {
              const isDisabled = item.requiresSuperAdmin && !isSuperAdmin;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    !isDisabled && setActiveTab(item.id as TabType)
                  }
                  disabled={isDisabled}
                  className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-left ${
                    isActive
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {item.label}
                  {isDisabled && <ShieldAlert className="ml-2 h-3 w-3" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className={activeTab === "eta"
          ? "flex-1 min-w-0 min-h-0 overflow-hidden"
          : "flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-auto outline-none"
        }>
          {activeTab === "users" && <UserComponent />}
          {activeTab === "invites" && <AdminInviteComponent />}
          {activeTab === "cars" && <CarsComponent />}
          {activeTab === "routes" && <RoutesComponent />}
          {activeTab === "assignment-driver" && <AssignmentDriverComponent />}
          {activeTab === "eta" && <EtaView role="admin" />}
        </div>
      </main>
      <GlobalAlert />
    </div>
  );
}
