import { useState, useEffect, useMemo } from "react";
import type { ResponseCarData, Route, CarStatus } from "~/types";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "~/actions/car.action";
import { getRoutes } from "~/actions/route.action";

import CarMetrics from "./cars/CarMetrics";
import CarSearchToolbar from "./cars/CarSearchToolbar";
import CarItemCard from "./cars/CarItemCard";
import CarDetailModal from "./cars/CarDetailModal";
import CreateCarModal from "./cars/CreateCarModal";
import EditCarModal from "./cars/EditCarModal";
import CredentialModal from "./cars/CredentialModal";

type StatusFilter = "all" | CarStatus;

export default function CarsComponent() {
  const { alert, confirm } = useDialog();
  const [cars, setCars] = useState<ResponseCarData[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingCar, setEditingCar] = useState<ResponseCarData | null>(null);

  // Car Detail State (getCarById)
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [detailCar, setDetailCar] = useState<ResponseCarData | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);

  // Create Form State
  const [newCarNumber, setNewCarNumber] = useState<string>("");
  const [newRouteId, setNewRouteId] = useState<string>("");

  // Edit Form State
  const [editCarNumber, setEditCarNumber] = useState<string>("");
  const [editRouteId, setEditRouteId] = useState<string>("");

  // Action Pending States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [credentialCarId, setCredentialCarId] = useState<string | null>(null);

  // Prevent background scrolling when any modal is active
  const isAnyModalOpen =
    isCreateModalOpen ||
    Boolean(editingCar) ||
    Boolean(selectedCarId) ||
    Boolean(credentialCarId);

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

  // Fetch Cars & Routes
  const fetchFleetData = async (showToast = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const [carRes, routeRes] = await Promise.all([getCars(), getRoutes()]);

      if (carRes.success) {
        setCars(
          carRes.data.data.sort((a, b) =>
            a.createdAt > b.createdAt ? -1 : 1,
          ) || [],
        );
      } else {
        setError(carRes.error || "ดึงข้อมูลยานพาหนะไม่สำเร็จ");
      }

      if (routeRes.success) {
        setRoutes(routeRes.data.data || []);
      }

      if (showToast && carRes.success) {
        alert({
          title: "อัปเดตข้อมูลรถตะไลสำเร็จ",
          description: "อัปเดตข้อมูลรถตะไลสำเร็จเรียบร้อยแล้ว",
        });
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetData(false);
  }, []);

  // Map Route IDs to Route Names for easy lookup
  const routeNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    routes.forEach((r) => {
      map[r.id] = r.name;
    });
    return map;
  }, [routes]);

  // Compute Metrics Summary
  const metrics = useMemo(() => {
    const total = cars.length;
    const active = cars.filter((c) => c.status === "active").length;
    const inactive = cars.filter((c) => c.status === "inactive").length;
    return { total, active, inactive };
  }, [cars]);

  // Filtered Cars
  const filteredCars = useMemo(() => {
    return cars.filter((c) => {
      const query = searchQuery.trim().toLowerCase();
      const routeName = c.routeId
        ? (routeNameMap[c.routeId] || "").toLowerCase()
        : "";
      const matchesSearch =
        query === "" ||
        c.carNumber.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        routeName.includes(query);

      const matchesStatus = statusFilter === "all" || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [cars, searchQuery, statusFilter, routeNameMap]);

  // Fetch Car Details by ID
  const handleOpenDetailModal = async (id: string) => {
    setSelectedCarId(id);
    setDetailCar(null);
    setIsDetailLoading(true);
    try {
      const res = await getCarById(id);
      if (res.success) {
        setDetailCar(res.data.data);
      } else {
        alert({
          title: "โหลดข้อมูลไม่สำเร็จ",
          description: res.error,
        });
        setSelectedCarId(null);
      }
    } catch {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลรายละเอียดรถตะไลได้",
      });
      setSelectedCarId(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Create Car Handler
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarNumber.trim() || !newRouteId) return;

    setIsSubmitting(true);
    try {
      const res = await createCar({
        carNumber: newCarNumber.trim(),
        routeId: newRouteId,
      });

      if (res.success) {
        alert({
          title: "เพิ่มรถตะไลสำเร็จ",
          description: `เพิ่ม "${newCarNumber.trim()}" เข้าสู่ระบบเรียบร้อยแล้ว`,
        });
        setNewCarNumber("");
        setNewRouteId("");
        setIsCreateModalOpen(false);
        fetchFleetData(false);
      } else {
        alert({
          title: "เพิ่มรถไม่สำเร็จ",
          description: res.error,
        });
      }
    } catch {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลรถตะไลได้",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (car: ResponseCarData) => {
    setEditingCar(car);
    setEditCarNumber(car.carNumber);
    setEditRouteId(car.routeId || "");
  };

  // Update Car Handler
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar || !editCarNumber.trim() || !editRouteId) return;

    setIsSubmitting(true);
    try {
      const res = await updateCar(editingCar.id, {
        id: editingCar.id,
        createdAt:
          typeof editingCar.createdAt === "string"
            ? editingCar.createdAt
            : editingCar.createdAt?.toISOString() || new Date().toISOString(),
        routeId: editRouteId,
        carNumber: editCarNumber.trim(),
        status: editingCar.status,
      });

      if (res.success) {
        alert({
          title: "บันทึกการแก้ไขสำเร็จ",
          description: `อัปเดตข้อมูล "${editCarNumber.trim()}" เรียบร้อยแล้ว`,
        });
        setEditingCar(null);
        fetchFleetData(false);
      } else {
        alert({
          title: "แก้ไขไม่สำเร็จ",
          description: res.error,
        });
      }
    } catch {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการแก้ไขข้อมูลได้",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Car Handler
  const handleDeleteCar = async (carToDelete: ResponseCarData) => {
    confirm({
      title: "ยืนยันการลบรถตะไล?",
      description: `คุณต้องการลบ ${carToDelete.carNumber} (ID: ${carToDelete.id}) ใช่หรือไม่?`,
      confirmText: "ยืนยันลบ",
      cancelText: "ยกเลิก",
      onConfirm: async () => {
        setDeletingId(carToDelete.id);
        try {
          const res = await deleteCar(carToDelete.id);
          if (res.success) {
            alert({
              title: "ลบสำเร็จ",
              description: "ลบรถตะไลออกจากระบบเรียบร้อยแล้ว",
            });
            fetchFleetData(false);
          } else {
            alert({
              title: "ลบไม่สำเร็จ",
              description: res.error,
            });
          }
        } catch {
          alert({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถลบรถตะไลได้",
          });
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  // Format Helper
  const formatDate = (dateInput?: Date | string | null) => {
    if (!dateInput) return "-";
    try {
      const date =
        typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      return new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    } catch {
      return String(dateInput);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Metrics Overview */}
      <CarMetrics
        total={metrics.total}
        active={metrics.active}
        inactive={metrics.inactive}
      />

      {/* 2. Main Control Container */}
      <div className="bg-white border border-gray-200 rounded-md shadow-xs overflow-hidden">
        <CarSearchToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          isLoading={isLoading}
          onRefresh={() => fetchFleetData(true)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        {/* Fleet Grid Content */}
        <div className="p-5 sm:p-6">
          {error && (
            <div className="mb-4 p-4 rounded-md bg-gray-100 border border-gray-300 text-gray-900 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => fetchFleetData(false)}
                className="underline font-semibold hover:text-gray-900"
              >
                ลองอีกครั้ง
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 border border-gray-200 rounded-md bg-white/50 animate-pulse space-y-4"
                >
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded w-full" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-gray-200 rounded-md bg-white/30">
              <p className="text-xs text-gray-500 font-medium">
                {searchQuery
                  ? "ไม่พบข้อมูลรถตะไลที่ตรงกับเงื่อนไขการค้นหา"
                  : "ยังไม่มีข้อมูลรถตะไลในระบบ"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCars.map((car) => (
                <CarItemCard
                  key={car.id}
                  car={car}
                  routeNameMap={routeNameMap}
                  deletingId={deletingId}
                  onOpenDetail={handleOpenDetailModal}
                  onOpenEdit={handleOpenEdit}
                  onDelete={handleDeleteCar}
                  onOpenCredential={setCredentialCarId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <CredentialModal
        isOpen={Boolean(credentialCarId)}
        carId={credentialCarId || ""}
        onClose={() => setCredentialCarId(null)}
      />
      {/* Detail Modal (getCarById) */}
      <CarDetailModal
        isOpen={Boolean(selectedCarId)}
        car={detailCar}
        isLoading={isDetailLoading}
        routeNameMap={routeNameMap}
        onClose={() => setSelectedCarId(null)}
        formatDate={formatDate}
      />

      {/* Create Modal */}
      <CreateCarModal
        isOpen={isCreateModalOpen}
        carNumber={newCarNumber}
        routeId={newRouteId}
        routes={routes}
        isSubmitting={isSubmitting}
        onChangeCarNumber={setNewCarNumber}
        onChangeRouteId={setNewRouteId}
        onSubmit={handleCreateSubmit}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Modal */}
      <EditCarModal
        car={editingCar}
        carNumber={editCarNumber}
        routeId={editRouteId}
        routes={routes}
        isSubmitting={isSubmitting}
        onChangeCarNumber={setEditCarNumber}
        onChangeRouteId={setEditRouteId}
        onSubmit={handleUpdateSubmit}
        onClose={() => setEditingCar(null)}
      />
    </div>
  );
}
