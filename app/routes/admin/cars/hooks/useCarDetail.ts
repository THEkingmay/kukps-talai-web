import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import type { DrivingLog, ResponseCarData, Route } from "~/types";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  deleteCar,
  getCarById,
  restoreCar,
  updateCar,
} from "~/actions/car.action";
import { getRoutes } from "~/actions/route.action";
import { getRoutePointsByRouteId } from "~/actions/route-points.action";
import { getCurrentDriving } from "~/actions/driving-log.action";
import { useNow } from "~/hooks/useNow";

/**
 * State + behaviour for the admin car detail page (/admin/cars/:carId).
 *
 * The page component only renders markup; every fetch, dialog and derivation
 * lives here.
 */
export function useCarDetail() {
  const { carId } = useParams<{ carId: string }>();
  const { alert, confirm } = useDialog();

  const [car, setCar] = useState<ResponseCarData | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentDriving, setCurrentDriving] = useState<DrivingLog | null>(null);
  const [routeStopCount, setRouteStopCount] = useState(0);

  // Modals / pending flags
  const [editingCar, setEditingCar] = useState<ResponseCarData | null>(null);
  const [editCarNumber, setEditCarNumber] = useState("");
  const [editRouteId, setEditRouteId] = useState("");
  const [credentialOpen, setCredentialOpen] = useState(false);
  const [pointsRoute, setPointsRoute] = useState<Route | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionPending, setActionPending] = useState(false);

  const isDriving = currentDriving !== null;
  // Live ticker only while a shift is open — otherwise no counter is on screen.
  const now = useNow(30_000, isDriving);

  const fetchCar = useCallback(async () => {
    if (!carId) return;
    setIsLoading(true);
    setLoadError(null);
    // Clear stale driving state so a refetch (restore, driver change) can't show
    // an outdated shift.
    setCurrentDriving(null);
    try {
      const [carRes, routesRes] = await Promise.all([
        getCarById(carId),
        getRoutes(),
      ]);
      if (carRes.success) {
        setCar(carRes.data.data);
        const driverId = carRes.data.data.driverData?.id;
        if (driverId) {
          const drivingLogRes = await getCurrentDriving(driverId);
          if (drivingLogRes.success) {
            setCurrentDriving(drivingLogRes.data.data);
          }
        }
      } else {
        setLoadError(carRes.error || "ไม่พบข้อมูลรถตะไล");
      }
      if (routesRes.success) {
        setRoutes(routesRes.data.data || []);
      }
    } catch {
      setLoadError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  // Count real stops for the assigned route (the routes API doesn't include stops)
  useEffect(() => {
    let cancelled = false;
    if (!car?.routeId) {
      setRouteStopCount(0);
      return;
    }
    getRoutePointsByRouteId(car.routeId).then((res) => {
      if (!cancelled && res.success) {
        setRouteStopCount(res.data.data?.length ?? 0);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [car?.routeId]);

  // --- Derived ---

  const isDeleted = car ? car.deletedAt !== null : false;
  const carRoute = car?.routeId
    ? (routes.find((route) => route.id === car.routeId) ?? null)
    : null;

  // --- Modal controls ---

  const openEditModal = useCallback(() => {
    if (!car) return;
    setEditingCar(car);
    setEditCarNumber(car.carNumber);
    setEditRouteId(car.routeId || "");
  }, [car]);

  const closeEditModal = useCallback(() => setEditingCar(null), []);
  const openCredentials = useCallback(() => setCredentialOpen(true), []);
  const closeCredentials = useCallback(() => setCredentialOpen(false), []);

  const openPointsEditor = useCallback(() => {
    if (!carRoute) return;
    setPointsRoute(carRoute);
  }, [carRoute]);

  const closePointsEditor = useCallback(() => setPointsRoute(null), []);

  // --- Actions ---

  const submitEdit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!car || !editCarNumber.trim() || !editRouteId) return;

      setIsSubmitting(true);
      try {
        const res = await updateCar(car.id, {
          id: car.id,
          createdAt:
            typeof car.createdAt === "string"
              ? car.createdAt
              : car.createdAt?.toISOString() || new Date().toISOString(),
          routeId: editRouteId,
          carNumber: editCarNumber.trim(),
          status: car.status,
        });

        if (res.success) {
          alert({
            title: "บันทึกการแก้ไขสำเร็จ",
            description: `อัปเดตข้อมูล "${editCarNumber.trim()}" เรียบร้อยแล้ว`,
          });
          setCar(res.data.data);
          setEditingCar(null);
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
    [alert, car, editCarNumber, editRouteId],
  );

  const requestDelete = useCallback(() => {
    if (!car) return;
    confirm({
      title: "ยืนยันการลบรถตะไล?",
      description: `คุณต้องการลบ ${car.carNumber} (ID: ${car.id}) ใช่หรือไม่?`,
      confirmText: "ยืนยันลบ",
      cancelText: "ยกเลิก",
      onConfirm: async () => {
        setActionPending(true);
        try {
          const res = await deleteCar(car.id);
          if (res.success) {
            alert({
              title: "ลบสำเร็จ",
              description: "ลบรถตะไลออกจากระบบเรียบร้อยแล้ว",
            });
            // Stay on the page — DeletedOverlay shows itself after the refetch.
            await fetchCar();
          } else {
            alert({ title: "ลบไม่สำเร็จ", description: res.error });
          }
        } catch {
          alert({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถลบรถตะไลได้",
          });
        } finally {
          setActionPending(false);
        }
      },
    });
  }, [alert, car, confirm, fetchCar]);

  const requestRestore = useCallback(() => {
    if (!car) return;
    confirm({
      title: "ยืนยันการกู้คืนรถตะไล?",
      description: `คุณต้องการกู้คืน ${car.carNumber} ใช่หรือไม่?`,
      confirmText: "ยืนยันกู้คืน",
      cancelText: "ยกเลิก",
      onConfirm: async () => {
        setActionPending(true);
        try {
          const res = await restoreCar(car.id);
          if (res.success) {
            alert({
              title: "กู้คืนสำเร็จ",
              description: "กู้คืนรถตะไลกลับสู่ระบบเรียบร้อยแล้ว",
            });
            await fetchCar();
          } else {
            alert({ title: "กู้คืนไม่สำเร็จ", description: res.error });
          }
        } catch {
          alert({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถกู้คืนรถตะไลได้",
          });
        } finally {
          setActionPending(false);
        }
      },
    });
  }, [alert, car, confirm, fetchCar]);

  return {
    // data
    car,
    routes,
    carRoute,
    routeStopCount,
    currentDriving,
    now,
    isLoading,
    loadError,
    isDeleted,
    // edit modal
    editingCar,
    editCarNumber,
    editRouteId,
    setEditCarNumber,
    setEditRouteId,
    isSubmitting,
    openEditModal,
    closeEditModal,
    submitEdit,
    // credentials modal
    credentialOpen,
    openCredentials,
    closeCredentials,
    // points editor
    pointsRoute,
    openPointsEditor,
    closePointsEditor,
    // destructive actions
    actionPending,
    requestDelete,
    requestRestore,
  };
}
