import { getCars } from "~/actions/car.action";
import { getRoutes } from "~/actions/route.action";
import { getRoutePointsByRouteId } from "~/actions/route-poimts.action";
import { useEffect, useMemo, useState } from "react";
import type { ResponseCarData, Route, RoutePoint } from "~/types";
import { useCarLocation } from "~/hook/useCarLocation.hook";
import { formatDate } from "~/helper";
import { Button } from "~/components/ui/button";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";

export default function EtaComponent({ role }: { role: "admin" | "user" }) {
  const [cars, setCars] = useState<ResponseCarData[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const { currentLocation, isConnected } = useCarLocation(WS_URL);

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  const filteredCarsInSelectedRoute = useMemo(() => {
    if (!selectedRouteId) return [];
    return cars.filter((car) => car.routeId === selectedRouteId);
  }, [selectedRouteId, cars]);
  const carIdInRoute = filteredCarsInSelectedRoute.map((car) => car.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsData, routesData] = await Promise.all([
          getCars(),
          getRoutes(),
        ]);
        if (carsData.success) setCars(carsData.data.data);
        if (routesData.success) {
          setRoutes(routesData.data.data);
          setSelectedRouteId(routesData.data.data[0]?.id);
        }

        if (routesData.success) {
          const routePointsData = await Promise.all(
            routesData.data.data.map(async (route) => {
              const points = await getRoutePointsByRouteId(route.id);
              return points.success ? points.data.data : [];
            }),
          );
          setRoutePoints(routePointsData.flat());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>ETA Page</h1>
      <div className="border">
        <div className="text-lg text-red-500">เลือกสายรถ</div>
        {routes.map((route) => (
          <div key={route.id}>
            <Button onClick={() => setSelectedRouteId(route.id)}>
              {route.name}
            </Button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border">
          <div className="text-lg text-red-500"> สายที่เลือก</div>
          {routes
            .filter((route) => route.id === selectedRouteId)
            .map((route) => (
              <div key={route.id}>
                <h2>{route.name}</h2>
              </div>
            ))}
          <div className="text-lg text-red-500"> จุดจอดของสายนี้</div>
          {routePoints
            .filter((point) => point.routeId === selectedRouteId)
            .map((point) => (
              <div key={point.id}>
                <p>{point.name}</p>
              </div>
            ))}
        </div>

        {/*ถ้าสถานะเป็น inActive จะไม่แสดงบนแผนที่เลย*/}
        <div className="border">
          <div className="text-lg text-red-500">map รถในแผนที่</div>
          {currentLocation
            ?.filter((l) => carIdInRoute.includes(l.carId))
            .map((location) => (
              <div className="border" key={location.carId}>
                <p>{location.carId}</p>
                <p>{location.lat}</p>
                <p>{location.lng}</p>
                <p>{location.status}</p>
                <Button onClick={() => setSelectedCarId(location.carId)}>
                  ดูข้อมูลรถ
                </Button>
              </div>
            ))}
        </div>
      </div>
      <div className="border">
        {selectedCarId && (
          <div>
            <div className="text-lg text-red-500">ดูรายละเอียดรถ</div>

            {
              filteredCarsInSelectedRoute.find(
                (car) => car.id === selectedCarId,
              )?.carNumber
            }
            <Button onClick={() => setSelectedCarId(null)}>กลับไป</Button>
          </div>
        )}
      </div>
    </div>
  );
}
