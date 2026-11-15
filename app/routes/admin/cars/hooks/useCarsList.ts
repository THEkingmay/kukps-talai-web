import { useCallback, useEffect, useMemo, useState } from "react";
import type { CarStatus, ResponseCarData, Route } from "~/types";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  createCar,
  deleteCar,
  getCars,
  restoreCar,
  updateCar,
} from "~/actions/car.action";
import { getRoutes } from "~/actions/route.action";
import { useBodyScrollLock } from "~/hooks/useBodyScrollLock";

export type CarStatusFilter = "all" | CarStatus | "deleted";

/**
 * State + behaviour for the admin car list (/admin/cars).
 *
 * The page itself only renders markup and wires these values to the presentational
 * components — no fetching, no alert/confirm handling, no derivations.
 */
export function useCarsList() {
  const { alert, confirm } = useDialog();

  const [cars, setCars] = useState<ResponseCarData[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CarStatusFilter>("all");
  const [routeFilter, setRouteFilter] = useState("all");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<ResponseCarData | null>(null);
  const [credentialCarId, setCredentialCarId] = useState<string | null>(null);

  // Form state
  const [newCarNumber, setNewCarNumber] = useState("");
  const [newRouteId, setNewRouteId] = useState("");
  const [editCarNumber, setEditCarNumber] = useState("");
  const [editRouteId, setEditRouteId] = useState("");

  // Pending flags
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAnyModalOpen =
    isCreateModalOpen || Boolean(editingCar) || Boolean(credentialCarId);
  useBodyScrollLock(isAnyModalOpen);

  const fetchFleetData = useCallback(
    async (showToast = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const [carRes, routeRes] = await Promise.all([getCars(), getRoutes()]);

        if (carRes.success) {
          setCars(carRes.data.data);
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
    },
    [alert],
  );

  useEffect(() => {
    fetchFleetData();
  }, [fetchFleetData]);

  const refresh = useCallback(() => {
    void fetchFleetData();
  }, [fetchFleetData]);

  // --- Derived data ---

  const routeNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    routes.forEach((route) => {
      map[route.id] = route.name;
    });
    return map;
  }, [routes]);

  const metrics = useMemo(
    () => ({
      total: cars.length,
      active: cars.filter((car) => car.status === "active" && car.deletedAt === null)
        .length,
      inactive: cars.filter(
        (car) => car.status !== "active" && car.deletedAt === null,
      ).length,
      deleted: cars.filter((car) => car.deletedAt !== null).length,
    }),
    [cars],
  );

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (
        searchQuery !== "" &&
        !car.carNumber.includes(searchQuery) &&
        !car.id.includes(searchQuery)
      ) {
        return false;
      }
      if (routeFilter !== "all" && car.routeId !== routeFilter) return false;

      if (statusFilter === "deleted") {
        if (car.deletedAt === null) return false;
      } else if (statusFilter !== "all") {
        if (car.status !== statusFilter || car.deletedAt !== null) return false;
      }

      return true;
    });
  }, [cars, searchQuery, statusFilter, routeFilter]);

  // --- Modal controls ---

  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const openEditModal = useCallback((car: ResponseCarData) => {
    setEditingCar(car);
    setEditCarNumber(car.carNumber);
    setEditRouteId(car.routeId || "");
  }, []);

  const closeEditModal = useCallback(() => {
    setEditingCar(null);
  }, []);

  const openCredentials = useCallback((carId: string) => {
    setCredentialCarId(carId);
  }, []);

  const closeCredentials = useCallback(() => {
    setCredentialCarId(null);
  }, []);

  // --- Mutations ---

  const submitCreate = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
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
          await fetchFleetData();
        } else {
          alert({
            title: "เพิ่มรถไม่สำเร็จ",
            description: res.error.includes("duplicate key value")
              ? "หมายเลขรถนี้มีอยู่แล้ว"
              : res.error,
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
    },
    [alert, fetchFleetData, newCarNumber, newRouteId],
  );

  const submitUpdate = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
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
          await fetchFleetData();
        } else {
          alert({ title: "แก้ไขไม่สำเร็จ", description: res.error });
        }
      } catch {
        alert({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถบันทึกการแก้ไขข้อมูลได้",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [alert, editCarNumber, editRouteId, editingCar, fetchFleetData],
  );

  const requestDelete = useCallback(
    (car: ResponseCarData) => {
      confirm({
        title: "ยืนยันการลบรถตะไล?",
        description: `คุณต้องการลบ ${car.carNumber} (ID: ${car.id}) ใช่หรือไม่?`,
        confirmText: "ยืนยันลบ",
        cancelText: "ยกเลิก",
        onConfirm: async () => {
          setDeletingId(car.id);
          try {
            const res = await deleteCar(car.id);
            if (res.success) {
              alert({
                title: "ลบสำเร็จ",
                description: "ลบรถตะไลออกจากระบบเรียบร้อยแล้ว",
              });
              await fetchFleetData();
            } else {
              alert({ title: "ลบไม่สำเร็จ", description: res.error });
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
    },
    [alert, confirm, fetchFleetData],
  );

  const requestRestore = useCallback(
    (car: ResponseCarData) => {
      confirm({
        title: "ยืนยันการกู้คืนรถตะไล?",
        description: `คุณต้องการกู้คืน ${car.carNumber} ใช่หรือไม่?`,
        confirmText: "ยืนยันกู้คืน",
        cancelText: "ยกเลิก",
        onConfirm: async () => {
          setDeletingId(car.id);
          try {
            const res = await restoreCar(car.id);
            if (res.success) {
              alert({
                title: "กู้คืนสำเร็จ",
                description: "กู้คืนรถตะไลกลับสู่ระบบเรียบร้อยแล้ว",
              });
              await fetchFleetData();
            } else {
              alert({ title: "กู้คืนไม่สำเร็จ", description: res.error });
            }
          } catch {
            alert({
              title: "เกิดข้อผิดพลาด",
              description: "ไม่สามารถกู้คืนรถตะไลได้",
            });
          } finally {
            setDeletingId(null);
          }
        },
      });
    },
    [alert, confirm, fetchFleetData],
  );

  return {
    // data
    cars,
    routes,
    isLoading,
    error,
    routeNameMap,
    metrics,
    filteredCars,
    // filters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    routeFilter,
    setRouteFilter,
    // create modal
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    newCarNumber,
    setNewCarNumber,
    newRouteId,
    setNewRouteId,
    submitCreate,
    // edit modal
    editingCar,
    openEditModal,
    closeEditModal,
    editCarNumber,
    setEditCarNumber,
    editRouteId,
    setEditRouteId,
    submitUpdate,
    // credentials modal
    credentialCarId,
    openCredentials,
    closeCredentials,
    // table actions
    deletingId,
    requestDelete,
    requestRestore,
    // misc
    isSubmitting,
    refresh,
  };
}
