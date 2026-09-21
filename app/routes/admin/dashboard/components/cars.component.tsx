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
import CarTable from "./cars/CarTable";
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
  const [routeFilter, setRouteFilter] = useState<string>("all");

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
    return {
      total: cars.length,
      active: cars.filter((c) => c.status === "active").length,
      inactive: cars.filter((c) => c.status !== "active").length,
    };
  }, [cars]);

  // Handle Detail Modal Load
  const handleOpenDetailModal = async (id: string) => {
    setSelectedCarId(id);
    setIsDetailLoading(true);
    try {
      const detail = await getCarById(id);
      if (detail.success) {
        setDetailCar(detail.data.data);
      }
    } catch (err) {
      console.error("Failed to load car details:", err);
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
        routeId: newRouteId,
        carNumber: newCarNumber.trim(),
      });

      if (res.success) {
        alert({
          title: "เพิ่มรถตะไลสำเร็จ",
          description: `สร้างรถหมายเลข "${newCarNumber.trim()}" เรียบร้อยแล้ว`,
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

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (
        searchQuery !== "" &&
        !car.carNumber.includes(searchQuery) &&
        !car.id.includes(searchQuery)
      )
        return false;
      if (routeFilter !== "all" && car.routeId !== routeFilter) return false;
      if (statusFilter !== "all" && car.status !== statusFilter) return false;
      return true;
    });
  }, [cars, searchQuery, statusFilter, routeFilter]);

  return (
    <div className="space-y-6">
      {/* Vercel-style Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vehicles</h2>
          <p className="text-muted-foreground text-sm">
            จัดการข้อมูลรถตะไลประจำสาย และข้อมูลการเดินรถเบื้องต้น
          </p>
        </div>
      </div>

      {/* 1. Metrics Overview */}
      <CarMetrics
        total={metrics.total}
        active={metrics.active}
        inactive={metrics.inactive}
      />

      {/* Main Container */}
      <div className="bg-background border rounded-md shadow-sm overflow-hidden">
        <CarSearchToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          routeFilter={routeFilter}
          onRouteFilterChange={setRouteFilter}
          routes={routes}
          isLoading={isLoading}
          onRefresh={() => fetchFleetData(false)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        {/* Fleet Content */}
        <div className="p-0">
          {error && (
            <div className="m-4 p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => fetchFleetData(false)}
                className="underline font-semibold hover:text-destructive/80"
              >
                ลองอีกครั้ง
              </button>
            </div>
          )}

          <CarTable
            cars={cars}
            filteredCars={filteredCars}
            routeNameMap={routeNameMap}
            isLoading={isLoading}
            deletingId={deletingId}
            onOpenDetail={handleOpenDetailModal}
            onOpenEdit={handleOpenEdit}
            onDelete={handleDeleteCar}
            onOpenCredential={setCredentialCarId}
          />
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
