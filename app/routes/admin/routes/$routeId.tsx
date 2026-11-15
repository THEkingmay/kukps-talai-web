import { lazy, Suspense, useEffect } from "react";
import type { Route } from "~/types";
import DeletedOverlay from "~/components/DeletedOverlay";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAdminShell } from "../shell/ShellContext";

import CarRouteStops from "~/routes/admin/dashboard/components/cars/CarRouteStops";
import EditRouteModal from "~/routes/admin/dashboard/components/routes/EditRouteModal";
import RoutePointModal from "~/routes/admin/dashboard/components/routes/RoutePoint.component";

import RouteCarsCard from "./components/RouteCarsCard";
import RouteDetailHeader from "./components/RouteDetailHeader";
import RouteInfoCard from "./components/RouteInfoCard";
import {
  RouteDetailError,
  RouteDetailLoading,
} from "./components/RouteDetailStates";
import { useRouteDetail } from "./hooks/useRouteDetail";

// Leaflet uses `window` — keep it off the SSR path.
const RouteLiveMap = lazy(
  () => import("../dashboard/components/routes/RouteLiveMap"),
);

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
  const { setBreadcrumb } = useAdminShell();
  const detail = useRouteDetail();

  // Breadcrumb: "สายการเดินรถ / <routeName>"
  useEffect(() => {
    setBreadcrumb(detail.route?.name ?? null);
    return () => setBreadcrumb(null);
  }, [detail.route, setBreadcrumb]);

  if (detail.isLoading) {
    return <RouteDetailLoading />;
  }

  if (detail.loadError || !detail.route) {
    return <RouteDetailError loadError={detail.loadError} />;
  }

  const route: Route = detail.route;

  return (
    <div className="relative space-y-6 p-4 md:p-6 lg:p-8">
      {detail.isDeleted && (
        <DeletedOverlay
          title="สายการเดินรถนี้ถูกลบแล้ว"
          description="ข้อมูลยังถูกเก็บไว้ในระบบ — กู้คืนเพื่อให้ใช้งานได้อีกครั้ง หรือกลับไปหน้ารายการสายการเดินรถ"
          onRestore={detail.requestRestore}
          restoreLabel="กู้คืนสายรถ"
          restorePending={detail.actionPending}
          backTo="/admin/routes"
          backLabel="← กลับหน้ารายการสายรถ"
        />
      )}

      <RouteDetailHeader
        route={route}
        isDeleted={detail.isDeleted}
        actionPending={detail.actionPending}
        onOpenPoints={detail.openPointsEditor}
        onOpenEdit={detail.openEditModal}
        onDelete={detail.requestDelete}
      />

      <RouteInfoCard route={route} />

      <RouteCarsCard carsInRoute={detail.carsInRoute} />

      {/* Stops */}
      <Card>
        <CardHeader>
          <CardTitle>จุดจอด</CardTitle>
        </CardHeader>
        <CarRouteStops
          routeId={route.id}
          routeName={route.name}
          onManage={detail.openPointsEditor}
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
              <RouteLiveMap
                routeId={route.id}
                points={detail.points}
                cars={detail.carsInRoute}
              />
            </Suspense>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <EditRouteModal
        route={detail.editingRoute}
        editName={detail.editRouteName}
        isSubmitting={detail.isSubmitting}
        onChangeName={detail.setEditRouteName}
        onSubmit={detail.submitUpdate}
        onClose={detail.closeEditModal}
      />
      <RoutePointModal
        isOpen={Boolean(detail.pointsRoute)}
        route={detail.pointsRoute}
        onClose={detail.closePointsEditor}
      />
    </div>
  );
}
