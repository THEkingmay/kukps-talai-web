import { lazy, Suspense, useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { ResponseCarData, Route, DrivingLog } from "~/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  getCarById,
  updateCar,
  deleteCar,
  restoreCar,
} from "~/actions/car.action";
import { getRoutes } from "~/actions/route.action";
import { getCurrentDriving } from "~/actions/driving-log.action";
import { formatElapsed } from "~/routes/driver/dashboard/components/shiftStatusCard";

import { formatDate } from "~/helper";
import { CarStatusBadge } from "../dashboard/components/cars/CarTable";
import CarHistoryLogList from "../dashboard/components/cars/CarHistoryLogList";
import CarRouteStops from "../dashboard/components/cars/CarRouteStops";
import EditCarModal from "../dashboard/components/cars/EditCarModal";
import CredentialModal from "../dashboard/components/cars/CredentialModal";
import RoutePointModal from "../dashboard/components/routes/RoutePoint.component";
import { useAdminShell } from "../shell/ShellContext";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Loader2, SearchX } from "lucide-react";
import { VercelSpinner } from "~/components/ui/Loading";

// Leaflet uses `window` — keep it off the SSR path (same as the old detail modal).
const CarDetailMap = lazy(
  () => import("../dashboard/components/cars/CarDetailMap"),
);

export function meta() {
  return [
    { title: "รายละเอียดรถตะไล — KUKPS smart talai" },
    {
      name: "description",
      content: "ข้อมูลรถตะไล สายการเดินรถ จุดจอด และประวัติการเดินทาง",
    },
  ];
}

export default function CarDetailPage() {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const { alert, confirm } = useDialog();
  const { setBreadcrumb } = useAdminShell();
  const [now, setNow] = useState(() => Date.now());

  const [car, setCar] = useState<ResponseCarData | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentDriving, setCurrentDriving] = useState<DrivingLog | null>(null);
  const isDriving = !!currentDriving;
  // Modals / actions
  const [editingCar, setEditingCar] = useState<ResponseCarData | null>(null);
  const [editCarNumber, setEditCarNumber] = useState<string>("");
  const [editRouteId, setEditRouteId] = useState<string>("");
  const [credentialOpen, setCredentialOpen] = useState<boolean>(false);
  const [pointsRoute, setPointsRoute] = useState<Route | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionPending, setActionPending] = useState<boolean>(false);

  const fetchCar = useCallback(async () => {
    if (!carId) return;
    setIsLoading(true);
    setLoadError(null);
    // clear stale driving state so a refetch (restore, driver change) can't show an outdated shift
    setCurrentDriving(null);
    try {
      const [carRes, routesRes] = await Promise.all([
        getCarById(carId),
        getRoutes(),
      ]);
      if (carRes.success) {
        setCar(carRes.data.data);
        if (carRes.data.data.driverData?.id) {
          const drivingLogRes = await getCurrentDriving(
            carRes.data.data.driverData.id,
          );
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

  useEffect(() => {
    if (!isDriving) return;
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, [isDriving]);
  // Breadcrumb: "รถตะไล / <carNumber>"
  useEffect(() => {
    setBreadcrumb(car?.carNumber ?? null);
    return () => setBreadcrumb(null);
  }, [car, setBreadcrumb]);

  const isDeleted = car ? car.deletedAt !== null : false;
  const carRoute = car?.routeId
    ? routes.find((r) => r.id === car.routeId)
    : null;

  // --- Actions ---

  const handleOpenEdit = () => {
    if (!car) return;
    setEditingCar(car);
    setEditCarNumber(car.carNumber);
    setEditRouteId(car.routeId || "");
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handleDelete = () => {
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
            navigate("/admin/cars", { replace: true });
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
  };

  const handleRestore = () => {
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
  };

  const openPointsEditor = () => {
    if (!carRoute) return;
    setPointsRoute(carRoute);
  };

  // --- Render states ---

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
        <VercelSpinner />
        <p className="text-sm font-medium text-muted-foreground">
          กำลังโหลดข้อมูลรถตะไล...
        </p>
      </div>
    );
  }

  if (loadError || !car) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">
          ไม่พบข้อมูลรถตะไล
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {loadError ??
            "รถตะไลที่เลือกไม่พบในระบบ (อาจถูกลบหรือใช้ URL ไม่ถูกต้อง)"}
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link to="/admin/cars">กลับหน้ารายการรถตะไล</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Deleted banner */}
      {isDeleted && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-500/30 bg-amber-50 p-4 dark:bg-amber-900/20">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="gap-1 border-amber-500/40 text-amber-700 dark:text-amber-400"
            >
              ถูกลบแล้ว
            </Badge>
            <span className="text-sm text-foreground">
              รถตะไลนี้ถูกตั้งค่าสถานะว่าลบแล้ว — ข้อมูลยังคงแสดงอยู่
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleRestore}
            disabled={actionPending}
            className="shrink-0"
          >
            {actionPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "กู้คืนรถ"
            )}
          </Button>
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">
                รถตะไลหมายเลข {car.carNumber}
              </h1>
              <CarStatusBadge status={car.status} isDeleted={isDeleted} />
            </div>
            <p className="truncate font-mono text-xs text-muted-foreground">
              System ID: {car.id}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCredentialOpen(true)}
            className="h-8"
          >
            MQTT Credentials
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenEdit}
            className="h-8"
          >
            แก้ไขข้อมูล
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
                "ลบรถ"
              )}
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" asChild className="h-8">
            <Link to="/admin/cars">← กลับรายการ</Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList
          variant="line"
          className="w-full justify-start overflow-x-auto"
        >
          <TabsTrigger value="overview">ข้อมูลทั่วไป</TabsTrigger>
          <TabsTrigger value="live-map">Live Map</TabsTrigger>
          <TabsTrigger value="stops">จุดจอด</TabsTrigger>
          <TabsTrigger value="history">ประวัติการเดินทาง</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          {/* Assigned route */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                สายการเดินรถปัจจุบัน
              </CardTitle>
            </CardHeader>
            <CardContent>
              {carRoute ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {carRoute.name}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      {carRoute.id}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" asChild className="h-8">
                    <Link to={`/admin/routes/${carRoute.id}`}>
                      ดูรายละเอียดสายรถ →
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  รถนี้ยังไม่ได้ assign สายการเดินรถ — กด "แก้ไขข้อมูล"
                  เพื่อเลือกสาย
                </p>
              )}
            </CardContent>
          </Card>

          {/* General info */}
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลทั่วไป</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y text-sm">
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <span className="text-muted-foreground">รหัสระบบ (ID)</span>
                  <span className="truncate pl-4 font-mono font-semibold">
                    {car.id}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <span className="text-muted-foreground">สถานะ</span>
                  <span>
                    <CarStatusBadge status={car.status} isDeleted={isDeleted} />
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <span className="text-muted-foreground">ผู้แก้ไขล่าสุด</span>
                  <span className="font-mono font-semibold">
                    {car.updatedBy || "System Admin"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <span className="text-muted-foreground">สร้างเมื่อ</span>
                  <span className="font-semibold">
                    {formatDate(car.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <span className="text-muted-foreground">อัปเดตล่าสุด</span>
                  <span className="font-semibold">
                    {formatDate(car.updatedAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                คนขับรถที่รับผิดชอบปัจจุบัน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {car.driverData ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-muted">
                        {car.driverData.profileImageUrl ? (
                          <AvatarImage
                            src={car.driverData.profileImageUrl}
                            alt={car.driverData.email || "User"}
                            className="hover:scale-[1.02] transition-transform"
                          />
                        ) : (
                          <AvatarFallback className="bg-muted hover:bg-muted/80 transition-colors">
                            {car.driverData.firstName?.[0] || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-semibold text-base text-foreground">
                          {car.driverData.firstName} {car.driverData.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {car.driverData.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/admin/assignments/${car.driverData.id}`}
                      className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      ดูประวัติการมอบหมายงาน
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="flex items-center justify-center mb-2">
                      <Avatar className="h-8 w-8 border-muted">
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          ?
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ไม่มีข้อมูลคนขับรถที่รับผิดชอบปัจจุบัน
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      โปรดตรวจสอบการมอบหมายงานในระบบ
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                สถานะการทำงานปัจจุบัน
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentDriving ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    เริ่มทำงาน: {formatDate(currentDriving.startedAt)}
                  </p>
                  <p className="font-semibold text-base text-foreground">
                    ทำงานมาแล้ว{" "}
                    {formatElapsed(
                      now - new Date(currentDriving.startedAt).getTime(),
                    )}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  ยังไม่ได้กดเริ่มงาน
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live-map" className="pt-4">
          <div className="relative h-[80vh] overflow-hidden rounded-xl border bg-card shadow-sm ">
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
              <CarDetailMap car={car} />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="stops" className="pt-4">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            {car.routeId ? (
              <CarRouteStops
                routeId={car.routeId}
                routeName={carRoute?.name || `สาย: ${car.routeId}`}
                onManage={openPointsEditor}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
                <p className="text-sm font-medium">
                  รถนี้ยังไม่ได้ assign สายการเดินรถ
                </p>
                <p className="text-xs opacity-70">
                  จึงยังไม่มีจุดจอดให้แสดง — กด "แก้ไขข้อมูล" เพื่อเลือกสายรถ
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <CarHistoryLogList carId={car.id} formatDate={formatDate} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
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
      <CredentialModal
        isOpen={credentialOpen}
        carId={credentialOpen ? car.id : ""}
        onClose={() => setCredentialOpen(false)}
      />
      <RoutePointModal
        isOpen={Boolean(pointsRoute)}
        route={pointsRoute}
        onClose={() => setPointsRoute(null)}
      />
    </div>
  );
}
