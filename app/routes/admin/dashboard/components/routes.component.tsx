import { useState, useEffect, useMemo } from "react";
import type { Route } from "~/types";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} from "~/actions/route.action";
import { RefreshCw, Plus, Search, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import RouteDetailModal from "./routes/RouteDetailModal";
import RouteTable from "./routes/RouteTable";
import CreateRouteModal from "./routes/CreateRouteModal";
import EditRouteModal from "./routes/EditRouteModal";
import RoutePointModal from "./routes/RoutePoint.component";

export default function RoutesComponent() {
  const { alert, confirm } = useDialog();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal & Selected States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  // Route Detail State (getRouteById)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [detailRoute, setDetailRoute] = useState<Route | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);

  // Route Points State
  const [pointsRoute, setPointsRoute] = useState<Route | null>(null);

  // Form & Action States
  const [newRouteName, setNewRouteName] = useState<string>("");
  const [editRouteName, setEditRouteName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Prevent background scrolling when any modal is active
  const isAnyModalOpen =
    isCreateModalOpen ||
    Boolean(editingRoute) ||
    Boolean(selectedRouteId) ||
    Boolean(pointsRoute);

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAnyModalOpen]);

  // Fetch all routes from API
  const fetchRoutesData = async (showToast = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getRoutes();
      if (res.success) {
        setRoutes(res.data.data || []);
        if (showToast) {
          alert({
            title: "อัปเดตข้อมูลเรียบร้อย",
            description: "อัปเดตข้อมูลเส้นทางเรียบร้อยแล้ว",
          });
        }
      } else {
        setError(res.error || "ดึงข้อมูลเส้นทางไม่สำเร็จ");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutesData(false);
  }, []);

  // Fetch Route Details by ID
  const handleOpenDetailModal = async (id: string) => {
    setSelectedRouteId(id);
    setDetailRoute(null);
    setIsDetailLoading(true);
    try {
      const res = await getRouteById(id);
      if (res.success) {
        setDetailRoute(res.data.data);
      } else {
        alert({
          title: "โหลดข้อมูลไม่สำเร็จ",
          description: res.error,
        });
        setSelectedRouteId(null);
      }
    } catch {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลรายละเอียดเส้นทางได้",
      });
      setSelectedRouteId(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Filtered Routes
  const filteredRoutes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return routes;
    return routes.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query),
    );
  }, [routes, searchQuery]);

  // Handle Create Route
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName.trim()) return;

    if (
      routes.find(
        (r) => r.name.toLowerCase() === newRouteName.trim().toLowerCase(),
      )
    ) {
      alert({
        title: "เส้นทางซ้ำ",
        description: `เส้นทาง "${newRouteName.trim()}" มีอยู่แล้ว`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createRoute(newRouteName.trim());
      if (res.success) {
        alert({
          title: "เพิ่มเส้นทางสำเร็จ",
          description: `สร้างเส้นทาง "${res.data.data.name || newRouteName.trim()}" เรียบร้อยแล้ว`,
        });
        setNewRouteName("");
        setIsCreateModalOpen(false);
        fetchRoutesData(false);
      } else {
        alert({
          title: "เพิ่มเส้นทางไม่สำเร็จ",
          description: res.error,
        });
      }
    } catch {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มเส้นทางได้",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Route
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoute || !editRouteName.trim()) return;

    if (
      routes.find(
        (r) => r.name.toLowerCase() === editRouteName.trim().toLowerCase(),
      )
    ) {
      alert({
        title: "เส้นทางซ้ำ",
        description: `เส้นทาง "${editRouteName.trim()}" มีอยู่แล้ว`,
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await updateRoute(editingRoute.id, editRouteName.trim());
      if (res.success) {
        alert({
          title: "บันทึกการแก้ไขสำเร็จ",
          description: `อัปเดตชื่อเส้นทางเป็น "${editRouteName.trim()}" เรียบร้อย`,
        });
        setEditingRoute(null);
        setEditRouteName("");
        fetchRoutesData(false);
      } else {
        alert({
          title: "แก้ไขไม่สำเร็จ",
          description: res.error,
        });
      }
    } catch {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Route
  const handleDelete = async (routeToDelete: Route) => {
    confirm({
      title: "ยืนยันการลบเส้นทาง?",
      description: `คุณต้องการลบเส้นทาง ${routeToDelete.name} ใช่หรือไม่?`,
      confirmText: "ยืนยันลบ",
      cancelText: "ยกเลิก",
      onConfirm: async () => {
        setDeletingId(routeToDelete.id);
        try {
          const res = await deleteRoute(routeToDelete.id);
          if (res.success) {
            alert({
              title: "ลบสำเร็จ",
              description: "ลบเส้นทางออกจากระบบเรียบร้อยแล้ว",
            });
            fetchRoutesData(false);
          } else {
            alert({
              title: "ลบไม่สำเร็จ",
              description: res.error,
            });
          }
        } catch {
          alert({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถลบเส้นทางได้",
          });
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  // Format Helper
  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "-";
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Vercel-style Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Routes</h2>
          <p className="text-muted-foreground text-sm">
            จัดการเส้นทางเดินรถและจุดจอดต่างๆ ของรถตะไล
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => fetchRoutesData(false)} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            รีเฟรช
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มเส้นทาง
          </Button>
        </div>
      </div>

      <div className="bg-background border rounded-md shadow-sm overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อเส้นทาง หรือ ID..."
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9 text-muted-foreground"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-muted text-muted-foreground border">
              ทั้งหมด: {routes.length} สาย
            </span>
          </div>
        </div>

      {/* Content Area */}
      <div className="p-0">
        {/* Error Banner */}
        {error && (
          <div className="m-4 p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchRoutesData(false)}
              className="underline font-semibold hover:text-destructive/80"
            >
              ลองอีกครั้ง
            </button>
          </div>
        )}

        <RouteTable
          routes={routes}
          filteredRoutes={filteredRoutes}
          isLoading={isLoading}
          deletingId={deletingId}
          onOpenDetail={handleOpenDetailModal}
          onOpenEdit={(r) => {
            setEditingRoute(r);
            setEditRouteName(r.name);
          }}
          onOpenPoints={(r) => setPointsRoute(r)}
          onDelete={handleDelete}
          formatDate={formatDate}
        />
      </div>
      </div>

      {/* Detail Modal */}
      <RouteDetailModal
        isOpen={Boolean(selectedRouteId)}
        route={detailRoute}
        isLoading={isDetailLoading}
        onClose={() => setSelectedRouteId(null)}
        formatDate={formatDate}
      />

      {/* Create Modal */}
      <CreateRouteModal
        isOpen={isCreateModalOpen}
        routeName={newRouteName}
        isSubmitting={isSubmitting}
        onChangeName={setNewRouteName}
        onSubmit={handleCreateSubmit}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Modal */}
      <EditRouteModal
        route={editingRoute}
        editName={editRouteName}
        isSubmitting={isSubmitting}
        onChangeName={setEditRouteName}
        onSubmit={handleUpdateSubmit}
        onClose={() => setEditingRoute(null)}
      />

      {/* Points Modal */}
      <RoutePointModal
        isOpen={Boolean(pointsRoute)}
        route={pointsRoute}
        onClose={() => setPointsRoute(null)}
      />
    </div>
  );
}
