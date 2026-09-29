import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { getCars } from "~/actions/car.action";
import { getRoutes } from "~/actions/route.action";
import { getAllRoutePoints } from "~/actions/route-points.action";
import {
  getCarsPublic,
  getRoutesPublic,
  getAllRoutePointsPublic,
} from "~/actions/public-eta.action";
import { useCarLocation } from "~/hook/useCarLocation.hook";
import type { ResponseCarData, Route, RoutePoint } from "~/types";
import EtaCarCard from "./EtaCarCard";
import EtaSidebar from "./EtaSidebar";
import { ClientOnly } from "~/components/client-only";

// Lazy import — Leaflet uses `window` and cannot run on the server (SSR)
const EtaMap = lazy(() => import("./EtaMap"));

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";

interface EtaViewProps {
  role: "admin" | "user";
}

export default function EtaView({ role }: EtaViewProps) {
  const [cars, setCars] = useState<ResponseCarData[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const { currentLocation, isConnected } = useCarLocation(WS_URL);

  // Initial fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsData, routesData] = await Promise.all([
          role === "user" ? getCarsPublic() : getCars(),
          role === "user" ? getRoutesPublic() : getRoutes(),
        ]);
        if (carsData.success) setCars(carsData.data.data);
        if (routesData.success) {
          setRoutes(routesData.data.data);
          setSelectedRouteId(routesData.data.data[0]?.id ?? null);
          if (role === "user") {
            getAllRoutePointsPublic().then((data) => {
              if (data.success) setRoutePoints(data.data.data);
            });
          } else {
            getAllRoutePoints().then((data) => {
              if (data.success) setRoutePoints(data.data.data);
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [role]);

  const carIdsInRoute = useMemo(
    () => cars.filter((c) => c.routeId === selectedRouteId).map((c) => c.id),
    [cars, selectedRouteId],
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      {/* Desktop sidebar */}
      <EtaSidebar
        variant="sidebar"
        className="hidden md:flex flex-col w-80 shrink-0 border-r border-border bg-background"
        role={role}
        routes={routes}
        cars={cars}
        currentLocation={currentLocation}
        selectedRouteId={selectedRouteId}
        selectedCarId={selectedCarId}
        onRouteSelect={(id) => {
          setSelectedRouteId(id);
          setSelectedCarId(null);
        }}
        onCarSelect={setSelectedCarId}
        isConnected={isConnected}
      />

      {/* Map area */}
      <div className="flex-1 relative min-h-0">
        <ClientOnly
          fallback={
            <div className="h-full w-full animate-pulse bg-muted flex items-center justify-center">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                กำลังโหลดแผนที่...
              </span>
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="h-full w-full animate-pulse bg-muted flex items-center justify-center">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  กำลังโหลดแผนที่...
                </span>
              </div>
            }
          >
            <EtaMap
              role={role}
              currentLocation={currentLocation}
              routePoints={routePoints.filter(
                (r) => r.routeId === selectedRouteId,
              )}
              selectedRouteId={selectedRouteId}
              selectedCarId={selectedCarId}
              carIdsInRoute={carIdsInRoute}
              onCarSelect={setSelectedCarId}
              isConnected={isConnected}
            />
          </Suspense>
        </ClientOnly>
        {selectedCarId && (
          <div className="absolute bottom-20 left-4 z-[1001] md:bottom-6">
            <EtaCarCard
              carId={selectedCarId}
              cars={cars}
              currentLocation={currentLocation}
              role={role}
              onClose={() => setSelectedCarId(null)}
            />
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      <EtaSidebar
        variant="sheet"
        className="md:hidden"
        role={role}
        routes={routes}
        cars={cars}
        currentLocation={currentLocation}
        selectedRouteId={selectedRouteId}
        selectedCarId={selectedCarId}
        onRouteSelect={(id) => {
          setSelectedRouteId(id);
          setSelectedCarId(null);
        }}
        onCarSelect={setSelectedCarId}
        isConnected={isConnected}
      />
    </div>
  );
}
