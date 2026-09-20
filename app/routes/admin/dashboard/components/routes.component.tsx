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

import RouteDetailModal from "./routes/RouteDetailModal";
import CreateRouteModal from "./routes/CreateRouteModal";
import EditRouteModal from "./routes/EditRouteModal";
import RouteItemCard from "./routes/RouteItemCard";
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
    isCreateModalOpen || Boolean(editingRoute) || Boolean(selectedRouteId) || Boolean(pointsRoute);

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
        r.id.toLowerCase().includes(query)
    );
  }, [routes, searchQuery]);

  // Handle Create Route
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName.trim()) return;

    if (
      routes.find(
        (r) => r.name.toLowerCase() === newRouteName.trim().toLowerCase()
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
        (r) => r.name.toLowerCase() === editRouteName.trim().toLowerCase()
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
      }
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
    <div className="bg-white border border-gray-200 rounded-md shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black" />
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              จัดการเส้นทางเดินรถตะไล (Transit Routes)
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            บริหารจัดการเส้นทางเดินรถสวัสดิการ มก.กำแพงแสน
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-gray-100 text-black border border-gray-300/80">
            ทั้งหมด: {routes.length} สาย
          </span>

          <button
            onClick={() => fetchRoutesData(true)}
            disabled={isLoading}
            className="p-2 rounded-lg text-gray-500 bg-white border border-gray-200 hover:bg-white hover:text-gray-900 transition-all disabled:opacity-50"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isLoading ? "animate-spin text-black" : ""
              }`}
            />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-black hover:bg-gray-600 active:bg-black transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มเส้นทาง</span>
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 sm:p-5 border-b border-gray-200 bg-white">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อเส้นทาง หรือ ID..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6">
        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 rounded-md bg-gray-100 border border-gray-300 text-gray-900 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchRoutesData(false)}
              className="underline font-semibold hover:text-gray-900"
            >
              ลองอีกครั้ง
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="space-y-3 py-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-4 border border-gray-200 rounded-md bg-white/50 animate-pulse flex items-center justify-between"
              >
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
                <div className="h-8 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        ) : filteredRoutes.length === 0 ? (
          /* Empty State */
          <div className="py-12 text-center border border-dashed border-gray-200 rounded-md bg-white/30">
            <p className="text-xs text-gray-500 font-medium">
              {searchQuery
                ? "ไม่พบเส้นทางที่ตรงกับการค้นหา"
                : "ยังไม่มีข้อมูลเส้นทางเดินรถในระบบ"}
            </p>
          </div>
        ) : (
          /* Routes List */
          <div className="space-y-3">
            {filteredRoutes.map((route, idx) => (
              <RouteItemCard
                key={route.id}
                route={route}
                index={idx}
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
            ))}
          </div>
        )}
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
