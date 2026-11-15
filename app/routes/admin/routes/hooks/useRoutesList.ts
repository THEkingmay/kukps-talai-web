import { useCallback, useEffect, useMemo, useState } from "react";
import type { Route } from "~/types";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  createRoute,
  deleteRoute,
  getRoutes,
  restoreRoute,
  updateRoute,
} from "~/actions/route.action";
import { useBodyScrollLock } from "~/hooks/useBodyScrollLock";

/**
 * State + behaviour for the admin route list (/admin/routes).
 *
 * The page itself only renders markup and wires these values to the
 * presentational components — no fetching, no alert/confirm handling and no
 * derivations live in the route file.
 */
export function useRoutesList() {
  const { alert, confirm } = useDialog();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & selected states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [pointsRoute, setPointsRoute] = useState<Route | null>(null);

  // Form state
  const [newRouteName, setNewRouteName] = useState("");
  const [editRouteName, setEditRouteName] = useState("");

  // Pending flags
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAnyModalOpen =
    isCreateModalOpen || Boolean(editingRoute) || Boolean(pointsRoute);
  useBodyScrollLock(isAnyModalOpen);

  const fetchRoutesData = useCallback(
    async (showToast = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getRoutes();
        if (res.success) {
          setRoutes(res.data.data || []);
        } else {
          setError(res.error || "ดึงข้อมูลเส้นทางไม่สำเร็จ");
          return;
        }

        if (showToast) {
          alert({
            title: "อัปเดตข้อมูลเรียบร้อย",
            description: "อัปเดตข้อมูลเส้นทางเรียบร้อยแล้ว",
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

  // Initial load — one fetch per mount. Refetches are explicit (refresh button /
  // after a mutation), matching the original page behaviour.
  useEffect(() => {
    void fetchRoutesData(false);
  }, []);

  const refresh = useCallback(() => {
    void fetchRoutesData(false);
  }, [fetchRoutesData]);

  // --- Derived data ---

  const filteredRoutes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return routes;
    return routes.filter(
      (route) =>
        route.name.toLowerCase().includes(query) ||
        route.id.toLowerCase().includes(query),
    );
  }, [routes, searchQuery]);

  // --- Modal controls ---

  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const openEditModal = useCallback((route: Route) => {
    setEditingRoute(route);
    setEditRouteName(route.name);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditingRoute(null);
  }, []);

  const openPointsEditor = useCallback((route: Route) => {
    setPointsRoute(route);
  }, []);

  const closePointsEditor = useCallback(() => {
    setPointsRoute(null);
  }, []);

  // --- Mutations ---

  const submitCreate = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!newRouteName.trim()) return;

      if (
        routes.find(
          (route) =>
            route.name.toLowerCase() === newRouteName.trim().toLowerCase(),
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
          void fetchRoutesData(false);
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
    },
    [alert, fetchRoutesData, newRouteName, routes],
  );

  const submitUpdate = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!editingRoute || !editRouteName.trim()) return;

      if (
        routes.find(
          (route) =>
            route.name.toLowerCase() === editRouteName.trim().toLowerCase(),
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
          void fetchRoutesData(false);
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
    },
    [alert, editRouteName, editingRoute, fetchRoutesData, routes],
  );

  const requestDelete = useCallback(
    (routeToDelete: Route) => {
      confirm({
        title: "ยืนยันการลบเส้นทาง?",
        description: `คุณต้องการลบเส้นทาง ${routeToDelete.name} ใช่หรือไม่? (สถานะจะถูกเปลี่ยนเป็นลบแล้ว)`,
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
              void fetchRoutesData(false);
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
    },
    [alert, confirm, fetchRoutesData],
  );

  const requestRestore = useCallback(
    (routeToRestore: Route) => {
      confirm({
        title: "ยืนยันการกู้คืนเส้นทาง?",
        description: `คุณต้องการกู้คืนเส้นทาง ${routeToRestore.name} ใช่หรือไม่?`,
        confirmText: "ยืนยันกู้คืน",
        cancelText: "ยกเลิก",
        onConfirm: async () => {
          setDeletingId(routeToRestore.id);
          try {
            const res = await restoreRoute(routeToRestore.id);
            if (res.success) {
              alert({
                title: "กู้คืนสำเร็จ",
                description: "กู้คืนเส้นทางกลับสู่ระบบเรียบร้อยแล้ว",
              });
              void fetchRoutesData(false);
            } else {
              alert({
                title: "กู้คืนไม่สำเร็จ",
                description: res.error,
              });
            }
          } catch {
            alert({
              title: "เกิดข้อผิดพลาด",
              description: "ไม่สามารถกู้คืนเส้นทางได้",
            });
          } finally {
            setDeletingId(null);
          }
        },
      });
    },
    [alert, confirm, fetchRoutesData],
  );

  return {
    // data
    routes,
    isLoading,
    error,
    filteredRoutes,
    // search
    searchQuery,
    setSearchQuery,
    // create modal
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    newRouteName,
    setNewRouteName,
    submitCreate,
    // edit modal
    editingRoute,
    openEditModal,
    closeEditModal,
    editRouteName,
    setEditRouteName,
    submitUpdate,
    // points editor
    pointsRoute,
    openPointsEditor,
    closePointsEditor,
    // table actions
    deletingId,
    requestDelete,
    requestRestore,
    // misc
    isSubmitting,
    refresh,
  };
}
