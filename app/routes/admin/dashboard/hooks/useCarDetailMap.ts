import { useEffect, useState } from "react";
import type { ResponseCarData, RoutePoint } from "~/types";
import { getRoutePointsByRouteId } from "~/actions/route-points.action";
import { useWebsocket } from "~/components/providers/WebsocketProvider";

interface UseCarDetailMapOptions {
  car: ResponseCarData | null;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/**
 * State + behaviour for the live car map.
 *
 * Resolves the car's latest websocket position, derives the formatted "last
 * updated" label and loads the route polyline/stops. Leaflet itself stays in
 * the component — this hook has no map dependency.
 */
export function useCarDetailMap({ car }: UseCarDetailMapOptions) {
  const { currentLocation } = useWebsocket();

  const loc = currentLocation?.find((l) => l.carId === car?.id);
  const position: [number, number] | null = loc ? [loc.lat, loc.lng] : null;
  const isActive = loc?.status === "active";
  const lastSeen = loc ? new Date(loc.createdAt) : null;
  const lastSeenLabel = lastSeen ? formatTime(lastSeen) : null;

  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);

  const routeStops = routePoints.filter((r) => r.name !== null && r.name !== "");
  const filteredRoutePoints: { text: string; lat: number; lng: number }[] = [];
  const hasPosition: { lat: number; lng: number }[] = [];
  for (let i = 0; i < routeStops.length; i++) {
    // ไม่เคยมี
    if (
      !hasPosition.find(
        (p) => p.lat === routeStops[i].lat && p.lng === routeStops[i].lng,
      ) &&
      routeStops[i].name
    ) {
      hasPosition.push({ lat: routeStops[i].lat, lng: routeStops[i].lng });
      filteredRoutePoints.push({
        text: routeStops[i].name!,
        lat: routeStops[i].lat,
        lng: routeStops[i].lng,
      });
    } else if (
      // ซ้ำ
      hasPosition.find(
        (p) => p.lat === routeStops[i].lat && p.lng === routeStops[i].lng,
      ) &&
      routeStops[i].name
    ) {
      const idx = hasPosition.findIndex(
        (p) => p.lat === routeStops[i].lat && p.lng === routeStops[i].lng,
      );
      filteredRoutePoints[idx].text += "," + routeStops[i].name;
    }
  }

  useEffect(() => {
    const fetchRoutePoints = async () => {
      if (car?.id && car.routeId) {
        const response = await getRoutePointsByRouteId(car.routeId);
        setRoutePoints(response.success ? response.data.data : []);
      }
    };

    if (car?.id && car.routeId) {
      fetchRoutePoints();
    }
  }, [car?.id, car?.routeId]);

  return {
    // live position
    loc,
    position,
    isActive,
    lastSeenLabel,
    // route
    routePoints,
    filteredRoutePoints,
  };
}
