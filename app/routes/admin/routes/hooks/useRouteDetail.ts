import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import type { Route, ResponseCarData, RoutePoint } from "~/types";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  deleteRoute,
  getRouteById,
  restoreRoute,
  updateRoute,
} from "~/actions/route.action";
import { getCars } from "~/actions/car.action";
import { getRoutePointsByRouteId } from "~/actions/route-points.action";

/**
 * State + behaviour for the admin route detail page (/admin/routes/:routeId).
 *
 * Every fetch, dialog, pending flag and derivation lives here; the page only
 * composes markup. The breadcrumb effect stays in the route file because it
 * belongs to the admin shell, not to this page's data.
 */
export function useRouteDetail() {
  const { routeId } = useParams<{ routeId: string }>();
  const { alert, confirm } = useDialog();

  const [route, setRoute] = useState<Route | null>(null);
  const [cars, setCars] = useState<ResponseCarData[]>([]);
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modals / pending flags
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editRouteName, setEditRouteName] = useState("");
  const [pointsRoute, setPointsRoute] = useState<Route | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionPending, setActionPending] = useState(false);

  const fetchPoints = useCallback(async () => {
    if (!routeId) return;
    try {
      const res = await getRoutePointsByRouteId(routeId);
      if (res.success) {
        setPoints(
          [...(res.data.data || [])].sort((a, b) => a.sequence - b.sequence),
        );
      }
    } catch {
      // non-critical: table/map show empty state
    }
  }, [routeId]);

  const fetchRoute = useCallback(async () => {
    if (!routeId) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const [routeRes, carsRes] = await Promise.all([
        getRouteById(routeId),
        getCars(),
      ]);
      if (routeRes.success) {
        setRoute(routeRes.data.data);
      } else {
        setLoadError(routeRes.error || "ไม่พบข้อมูลสายการเดินรถ");
      }
      if (carsRes.success) {
        setCars(carsRes.data.data || []);
      }
      await fetchPoints();
    } catch {
      setLoadError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  }, [routeId, fetchPoints]);

  useEffect(() => {
    void fetchRoute();
  }, [fetchRoute]);

  // --- Derived data ---

  const isDeleted = route ? route.deletedAt !== null : false;

  const carsInRoute = useMemo(
    () => cars.filter((car) => car.routeId === routeId),
    [cars, routeId],
  );

  // The edit modal is only mounted while its open flag is set.
  const editingRoute = isEditOpen ? route : null;

  // --- Modal controls ---

  const openEditModal = useCallback(() => {
    if (!route) return;
    setEditRouteName(route.name);
    setIsEditOpen(true);
  }, [route]);

  const closeEditModal = useCallback(() => {
    setIsEditOpen(false);
  }, []);

  const openPointsEditor = useCallback(() => {
    if (!route) return;
    setPointsRoute(route);
  }, [route]);

  // Close points editor → refresh the stops shown on the page
  const closePointsEditor = useCallback(() => {
    setPointsRoute(null);
    void fetchPoints();
  }, [fetchPoints]);

  // --- Mutations ---

  const submitUpdate = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!route || !editRouteName.trim()) return;

      setIsSubmitting(true);
      try {
        const res = await updateRoute(route.id, editRouteName.trim());
        if (res.success) {
          alert({
            title: "บันทึกการแก้ไขสำเร็จ",
            description: `อัปเดตชื่อเส้นทางเป็น "${editRouteName.trim()}" เรียบร้อย`,
          });
          setRoute(res.data.data);
          setIsEditOpen(false);
        } else {
          alert({ title: "แก้ไขไม่สำเร็จ", description: res.error });
        }
      } catch {
        alert({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถบันทึกข้อมูลได้",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [alert, editRouteName, route],
  );

  const requestDelete = useCallback(() => {
    if (!route) return;
    confirm({
      title: "ยืนยันการลบเส้นทาง?",
      description: `คุณต้องการลบเส้นทาง ${route.name} ใช่หรือไม่? (สถานะจะถูกเปลี่ยนเป็นลบแล้ว)`,
      confirmText: "ยืนยันลบ",
      cancelText: "ยกเลิก",
      onConfirm: async () => {
        setActionPending(true);
        try {
          const res = await deleteRoute(route.id);
          if (res.success) {
            alert({
              title: "ลบสำเร็จ",
              description: "ลบเส้นทางออกจากระบบเรียบร้อยแล้ว",
            });
            // Stay on the page — DeletedOverlay shows itself after the refetch.
            await fetchRoute();
          } else {
            alert({ title: "ลบไม่สำเร็จ", description: res.error });
          }
        } catch {
          alert({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถลบเส้นทางได้",
          });
        } finally {
          setActionPending(false);
        }
      },
    });
  }, [alert, confirm, fetchRoute, route]);

  const requestRestore = useCallback(() => {
    if (!route) return;
    confirm({
      title: "ยืนยันการกู้คืนเส้นทาง?",
      description: `คุณต้องการกู้คืนเส้นทาง ${route.name} ใช่หรือไม่?`,
      confirmText: "ยืนยันกู้คืน",
      cancelText: "ยกเลิก",
      onConfirm: async () => {
        setActionPending(true);
        try {
          const res = await restoreRoute(route.id);
          if (res.success) {
            alert({
              title: "กู้คืนสำเร็จ",
              description: "กู้คืนเส้นทางกลับสู่ระบบเรียบร้อยแล้ว",
            });
            await fetchRoute();
          } else {
            alert({ title: "กู้คืนไม่สำเร็จ", description: res.error });
          }
        } catch {
          alert({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถกู้คืนเส้นทางได้",
          });
        } finally {
          setActionPending(false);
        }
      },
    });
  }, [alert, confirm, fetchRoute, route]);

  return {
    // data
    route,
    points,
    isLoading,
    loadError,
    isDeleted,
    carsInRoute,
    // edit modal
    editingRoute,
    editRouteName,
    setEditRouteName,
    isSubmitting,
    openEditModal,
    closeEditModal,
    submitUpdate,
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
