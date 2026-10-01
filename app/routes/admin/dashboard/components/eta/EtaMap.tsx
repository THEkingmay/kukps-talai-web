// This component is client-only (react-leaflet does not support SSR)
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { RoutePoint } from "~/types";
import type { WebsocketMessageTypeLocation } from "~/components/providers/WebsocketProvider";

const KUKPS_CENTER: [number, number] = [14.02372, 99.97487];

// Active car — pulsing
const activeMarkerIcon = L.divIcon({
  html: `<div class="relative flex h-6 w-6 items-center justify-center"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span><span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary border-2 border-background shadow-[0_0_8px_rgba(0,0,0,0.3)]"></span></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: "!bg-transparent border-none",
});

// Selected active car — slightly larger
const activeMarkerIconSelected = L.divIcon({
  html: `<div class="relative flex h-8 w-8 items-center justify-center"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span><span class="relative inline-flex rounded-full h-5 w-5 bg-primary border-2 border-background shadow-[0_0_8px_rgba(0,0,0,0.3)]"></span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: "!bg-transparent border-none",
});

// Stop marker
const stopIcon = L.divIcon({
  html: `<div class="flex h-5 w-5 items-center justify-center"><div class="h-3.5 w-3.5 rounded-full bg-background border-[2.5px] border-primary/80 shadow-sm"></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
  className: "!bg-transparent border-none",
});

function FlyToSelectedCar({
  selectedCarId,
  currentLocation,
}: {
  selectedCarId: string | null;
  currentLocation: Omit<WebsocketMessageTypeLocation, "type">[] | null;
}) {
  const map = useMap();
  const [lastFlownId, setLastFlownId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCarId || selectedCarId === lastFlownId) return;
    const loc = currentLocation?.find((l) => l.carId === selectedCarId);
    if (loc) {
      map.flyTo([loc.lat, loc.lng], 17, { duration: 1.1, easeLinearity: 0.25 });
      setLastFlownId(selectedCarId);
    }
  }, [selectedCarId, currentLocation, map, lastFlownId]);

  return null;
}

export interface EtaMapProps {
  role: "admin" | "user";
  currentLocation: Omit<WebsocketMessageTypeLocation, "type">[] | null;
  routePoints: RoutePoint[];
  selectedRouteId: string | null;
  selectedCarId: string | null;
  carIdsInRoute: string[];
  onCarSelect: (carId: string | null) => void;
  isConnected: boolean;
}

export default function EtaMap({
  role: _role, // role is reserved for future use
  currentLocation,
  routePoints,
  selectedCarId,
  carIdsInRoute,
  onCarSelect,
  isConnected,
}: EtaMapProps) {
  // Deduplicate named stops (same logic as CarDetailMap lines 76-105)
  const filteredRoutePoints = useMemo(() => {
    const routeStops = routePoints.filter(
      (r) => r.name !== null && r.name !== "",
    );
    const result: { text: string; lat: number; lng: number }[] = [];
    const hasPosition: { lat: number; lng: number }[] = [];

    for (let i = 0; i < routeStops.length; i++) {
      const stop = routeStops[i];
      const existingIdx = hasPosition.findIndex(
        (p) => p.lat === stop.lat && p.lng === stop.lng,
      );
      if (existingIdx === -1 && stop.name) {
        hasPosition.push({ lat: stop.lat, lng: stop.lng });
        result.push({ text: stop.name, lat: stop.lat, lng: stop.lng });
      } else if (existingIdx >= 0 && stop.name) {
        result[existingIdx].text += "," + stop.name;
      }
    }
    return result;
  }, [routePoints]);

  // Filter currentLocation by carIdsInRoute — always show active cars only (for both roles)
  const visibleLocations = useMemo(() => {
    if (!currentLocation) return [];
    return currentLocation
      .filter((l) => carIdsInRoute.includes(l.carId))
      .filter((l) => l.status === "active");
  }, [currentLocation, carIdsInRoute]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={KUKPS_CENTER}
        zoom={16}
        minZoom={13}
        scrollWheelZoom
        attributionControl
        zoomControl
        doubleClickZoom
        dragging
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route polyline */}
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: "var(--primary)", weight: 4, opacity: 0.8 }}
          />
        )}

        {/* Stop markers */}
        {filteredRoutePoints.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]} icon={stopIcon}>
            <Popup>
              <div className="font-mono text-xs text-gray-700 min-w-[120px]">
                <p className="font-semibold text-gray-900 text-[11px] uppercase tracking-wider mb-0.5">
                  ป้ายจอด
                </p>
                <p className="text-gray-500">{p.text}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Car markers — all visible cars are active (filtered above) */}
        {visibleLocations.map((location) => {
          const isSelected = selectedCarId === location.carId;
          const icon = isSelected ? activeMarkerIconSelected : activeMarkerIcon;
          return (
            <Marker
              key={location.carId}
              position={[location.lat, location.lng]}
              icon={icon}
              eventHandlers={{ click: () => onCarSelect(location.carId) }}
            />
          );
        })}

        {/* FlyTo when selected car changes */}
        <FlyToSelectedCar
          selectedCarId={selectedCarId}
          currentLocation={currentLocation}
        />
      </MapContainer>

      {/* Loading overlay when currentLocation is null */}
      {currentLocation === null && (
        <div className="absolute inset-0 z-[999] pointer-events-none flex flex-col items-center justify-center gap-2">
          <div className="bg-background/90 border border-border rounded-md px-5 py-3.5 shadow-sm flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              กำลังโหลดข้อมูล...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
