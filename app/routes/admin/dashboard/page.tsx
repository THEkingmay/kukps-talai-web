import { useState, useEffect } from "react";
import Navbar from "~/components/layout/Navbar";
import { useAuth } from "~/components/providers/AuthProvider";
import AdminInviteComponent from "./components/admin-invite.component";
import CarsComponent from "./components/cars.component";
import RoutesComponent from "./components/routes.component";
import UserComponent from "./components/user.component";
import { ShieldAlert } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

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
      <main className="container mx-auto max-w-7xl flex-1 space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner Overview Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground text-sm">
              จัดการผู้ใช้งานระบบ รหัสเชิญเจ้าหน้าที่ ตรวจสอบสถานะรถตะไล
              และวางแผนเส้นทางเดินรถ
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 font-mono bg-muted/50 px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              System Online
            </Badge>
            {isSuperAdmin && (
              <Badge variant="secondary" className="gap-1 px-2 py-1">
                <ShieldAlert className="h-3 w-3 text-amber-500" />
                Super Admin
              </Badge>
            )}
          </div>
        </div>

        {/* Tab Navigation Menu using Shadcn Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabType)} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="users" disabled={!isSuperAdmin}>
              ผู้ใช้งาน
              {!isSuperAdmin && <ShieldAlert className="ml-2 h-3 w-3 text-muted-foreground" />}
            </TabsTrigger>
            <TabsTrigger value="invites" disabled={!isSuperAdmin}>
              รหัสเชิญ
              {!isSuperAdmin && <ShieldAlert className="ml-2 h-3 w-3 text-muted-foreground" />}
            </TabsTrigger>
            <TabsTrigger value="cars">ยานพาหนะ</TabsTrigger>
            <TabsTrigger value="routes">สายการเดินรถ</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-0 outline-none">
            <UserComponent />
          </TabsContent>
          
          <TabsContent value="invites" className="mt-0 outline-none">
            <AdminInviteComponent />
          </TabsContent>
          
          <TabsContent value="cars" className="mt-0 outline-none">
            <CarsComponent />
          </TabsContent>
          
          <TabsContent value="routes" className="mt-0 outline-none">
            <RoutesComponent />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
