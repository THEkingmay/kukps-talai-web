import { lazy, Suspense, useEffect } from "react";
import type { ResponseCarData } from "~/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import DeletedOverlay from "~/components/DeletedOverlay";
import { formatDate } from "~/helper";
import { useAdminShell } from "~/routes/admin/shell/ShellContext";

import CarHistoryLogList from "~/routes/admin/dashboard/components/cars/CarHistoryLogList";
import CarRouteStops from "~/routes/admin/dashboard/components/cars/CarRouteStops";
import EditCarModal from "~/routes/admin/dashboard/components/cars/EditCarModal";
import CredentialModal from "~/routes/admin/dashboard/components/cars/CredentialModal";
import RoutePointModal from "~/routes/admin/dashboard/components/routes/RoutePoint.component";

import CarDetailHeader from "./components/CarDetailHeader";
import CarOverviewTab from "./components/CarOverviewTab";
import { CarDetailError, CarDetailLoading } from "./components/CarDetailStates";
import { useCarDetail } from "./hooks/useCarDetail";

import { Loader2 } from "lucide-react";

// Leaflet uses `window` — keep it off the SSR path.
const CarDetailMap = lazy(
  () => import("~/routes/admin/dashboard/components/cars/CarDetailMap"),
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
  const { setBreadcrumb } = useAdminShell();
  const detail = useCarDetail();

  // Breadcrumb: "รถตะไล / <carNumber>"
  useEffect(() => {
    setBreadcrumb(detail.car?.carNumber ?? null);
    return () => setBreadcrumb(null);
  }, [detail.car, setBreadcrumb]);

  if (detail.isLoading) {
    return <CarDetailLoading />;
  }

  if (detail.loadError || !detail.car) {
    return <CarDetailError loadError={detail.loadError} />;
  }

  const car: ResponseCarData = detail.car;

  return (
    <div className="relative space-y-6 p-4 md:p-6 lg:p-8">
      {detail.isDeleted && (
        <DeletedOverlay
          title="รถตะไลคันนี้ถูกลบแล้ว"
          description="ข้อมูลยังถูกเก็บไว้ในระบบ — กู้คืนเพื่อให้ใช้งานได้อีกครั้ง หรือกลับไปหน้ารายการรถตะไล"
          onRestore={detail.requestRestore}
          restoreLabel="กู้คืนรถ"
          restorePending={detail.actionPending}
          backTo="/admin/cars"
          backLabel="← กลับหน้ารายการรถ"
        />
      )}

      <CarDetailHeader
        car={car}
        isDeleted={detail.isDeleted}
        actionPending={detail.actionPending}
        onOpenCredentials={detail.openCredentials}
        onOpenEdit={detail.openEditModal}
        onDelete={detail.requestDelete}
      />

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

        <TabsContent value="overview" className="pt-4">
          <CarOverviewTab
            car={car}
            carRoute={detail.carRoute}
            routeStopCount={detail.routeStopCount}
            currentDriving={detail.currentDriving}
            now={detail.now}
            onOpenEdit={detail.openEditModal}
            isDeleted={detail.isDeleted}
          />
        </TabsContent>

        <TabsContent value="live-map" className="pt-4">
          <div className="relative h-[80vh] overflow-hidden rounded-xl border bg-card shadow-sm">
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
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            {car.routeId ? (
              <CarRouteStops
                routeId={car.routeId}
                routeName={detail.carRoute?.name || `สาย: ${car.routeId}`}
                onManage={detail.openPointsEditor}
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
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <CarHistoryLogList carId={car.id} formatDate={formatDate} />
          </div>
        </TabsContent>
      </Tabs>

      <EditCarModal
        car={detail.editingCar}
        carNumber={detail.editCarNumber}
        routeId={detail.editRouteId}
        routes={detail.routes}
        isSubmitting={detail.isSubmitting}
        onChangeCarNumber={detail.setEditCarNumber}
        onChangeRouteId={detail.setEditRouteId}
        onSubmit={detail.submitEdit}
        onClose={detail.closeEditModal}
      />
      <CredentialModal
        isOpen={detail.credentialOpen}
        carId={detail.credentialOpen ? car.id : ""}
        onClose={detail.closeCredentials}
      />
      <RoutePointModal
        isOpen={Boolean(detail.pointsRoute)}
        route={detail.pointsRoute}
        onClose={detail.closePointsEditor}
      />
    </div>
  );
}
