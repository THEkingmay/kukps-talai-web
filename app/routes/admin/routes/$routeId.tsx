import { lazy, Suspense, useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router";
import type { Route, ResponseCarData, RoutePoint } from "~/types";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  getRouteById,
  updateRoute,
  deleteRoute,
  restoreRoute,
} from "~/actions/route.action";
import { getCars } from "~/actions/car.action";
import { getRoutePointsByRouteId } from "~/actions/route-points.action";
import { formatDate } from "~/helper";

import { CarStatusBadge } from "../dashboard/components/cars/CarTable";
import CarRouteStops from "../dashboard/components/cars/CarRouteStops";
import EditRouteModal from "../dashboard/components/routes/EditRouteModal";
import RoutePointModal from "../dashboard/components/routes/RoutePoint.component";
import { useAdminShell } from "../shell/ShellContext";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Loader2, SearchX } from "lucide-react";
import { VercelSpinner } from "~/components/ui/Loading";
import DeletedOverlay from "~/components/DeletedOverlay";

// Leaflet uses `window` — keep it off the SSR path.
const RouteLiveMap = lazy(() => import("../dashboard/components/routes/RouteLiveMap"));

export function meta() {
  return [
    { title: "รายละเอียดสายการเดินรถ — KUKPS smart talai" },
    {
      name: "description",
      content: "ข้อมูลสายการเดินรถ จุดจอด และรถในสาย",
    },
  ];
}

export default function RouteDetailPage() {
  const { routeId } = useParams<{ routeId: string }>();
  const { alert, confirm } = useDialog();
  const { setBreadcrumb } = useAdminShell();

  const [route, setRoute] = useState<Route | null>(null);
  const [cars, setCars] = useState<ResponseCarData[]>([]);
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modals / actions
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [editRouteName, setEditRouteName] = useState<string>("");
  const [pointsRoute, setPointsRoute] = useState<Route | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionPending, setActionPending] = useState<boolean>(false);

  const fetchPoints = useCallback(async () => {
    if (!routeId) return;
    try {
      const res = await getRoutePointsByRouteId(routeId);
      if (res.success) {
        setPoints([...(res.data.data || [])].sort((a, b) => a.sequence - b.sequence));
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
    fetchRoute();
  }, [fetchRoute]);

  // Breadcrumb: "สายการเดินรถ / <routeName>"
  useEffect(() => {
    setBreadcrumb(route?.name ?? null);
    return () => setBreadcrumb(null);
  }, [route, setBreadcrumb]);

  const isDeleted = route ? route.deletedAt !== null : false;
  const carsInRoute = cars.filter((c) => c.routeId === routeId);

  // --- Actions ---

  const handleOpenEdit = () => {
    if (!route) return;
    setEditRouteName(route.name);
    setIsEditOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handleDelete = () => {
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
            // อยู่หน้าเดิม — DeletedOverlay จะโชว์เองหลัง refetch
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
  };

  const handleRestore = () => {
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
  };

  // Close points editor → refresh the stops shown on the page
  const closePointsEditor = () => {
    setPointsRoute(null);
    fetchPoints();
  };

  // --- Render states ---

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
        <VercelSpinner />
        <p className="text-sm font-medium text-muted-foreground">
          กำลังโหลดข้อมูลสายการเดินรถ...
        </p>
      </div>
    );
  }

  if (loadError || !route) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">
          ไม่พบข้อมูลสายการเดินรถ
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {loadError ??
            "สายการเดินรถที่เลือกไม่พบในระบบ (อาจถูกลบหรือใช้ URL ไม่ถูกต้อง)"}
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link to="/admin/routes">กลับหน้ารายการสายการเดินรถ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 p-4 md:p-6 lg:p-8">
      {isDeleted && (
        <DeletedOverlay
          title="สายการเดินรถนี้ถูกลบแล้ว"
          description="ข้อมูลยังถูกเก็บไว้ในระบบ — กู้คืนเพื่อให้ใช้งานได้อีกครั้ง หรือกลับไปหน้ารายการสายการเดินรถ"
          onRestore={handleRestore}
          restoreLabel="กู้คืนสายรถ"
          restorePending={actionPending}
          backTo="/admin/routes"
          backLabel="← กลับหน้ารายการสายรถ"
        />
      )}

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">
            สายการเดินรถ: {route.name}
          </h1>
          <p className="truncate font-mono text-xs text-muted-foreground">
            Route ID: {route.id}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPointsRoute(route)}
            className="h-8"
          >
            จัดการจุดจอด
          </Button>
          <Button variant="outline" size="sm" onClick={handleOpenEdit} className="h-8">
            แก้ไขชื่อ
          </Button>
          {!isDeleted ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={actionPending}
              className="h-8"
            >
              {actionPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "ลบสายรถ"
              )}
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" asChild className="h-8">
            <Link to="/admin/routes">← กลับรายการ</Link>
          </Button>
        </div>
      </div>

      {/* Route info */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลสายการเดินรถ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y text-sm">
            <div className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-muted-foreground">ชื่อสายการเดินรถ</span>
              <span className="truncate pl-4 font-semibold">{route.name}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-muted-foreground">รหัส (ID)</span>
              <span className="truncate pl-4 font-mono font-semibold">
                {route.id}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-muted-foreground">สร้างเมื่อ</span>
              <span className="font-semibold">{formatDate(route.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-muted-foreground">แก้ไขล่าสุด</span>
              <span className="font-semibold">{formatDate(route.updatedAt)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-muted-foreground">ผู้แก้ไขล่าสุด</span>
              <span className="font-mono font-semibold">
                {route.updatedBy || "-"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cars on this route */}
      <Card>
        <CardHeader>
          <CardTitle>รถในสายนี้</CardTitle>
        </CardHeader>
        <CardContent>
          {carsInRoute.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-muted-foreground">
              <p className="text-sm font-medium">ยังไม่มีรถในสายนี้</p>
              <p className="text-xs opacity-70">
                เพิ่มรถแล้วเลือก assign เข้าสายนี้จากหน้ารถตะไล
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>หมายเลขรถ / ID</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>อัปเดตล่าสุด</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carsInRoute.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <Link
                        to={`/admin/cars/${car.id}`}
                        className="font-bold text-foreground hover:underline"
                      >
                        {car.carNumber}
                      </Link>
                      <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                        ID: {car.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <CarStatusBadge
                        status={car.status}
                        isDeleted={car.deletedAt !== null}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatDate(car.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Stops */}
      <Card>
        <CardHeader>
          <CardTitle>จุดจอด</CardTitle>
        </CardHeader>
        <CarRouteStops
          routeId={route.id}
          routeName={route.name}
          onManage={() => setPointsRoute(route)}
        />
      </Card>

      {/* Live map */}
      <Card>
        <CardHeader>
          <CardTitle>แผนที่สดของสายรถ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[420px] overflow-hidden rounded-xl border md:h-[560px]">
            <Suspense
              fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    กำลังโหลดแผนที่...
                  </span>
                </div>
              }
            >
              <RouteLiveMap routeId={route.id} points={points} cars={carsInRoute} />
            </Suspense>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <EditRouteModal
        route={isEditOpen ? route : null}
        editName={editRouteName}
        isSubmitting={isSubmitting}
        onChangeName={setEditRouteName}
        onSubmit={handleUpdateSubmit}
        onClose={() => setIsEditOpen(false)}
      />
      <RoutePointModal
        isOpen={Boolean(pointsRoute)}
        route={pointsRoute}
        onClose={closePointsEditor}
      />
    </div>
  );
}
