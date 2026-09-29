import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import type { ResponseCarData, RoutePoint } from "~/types";
import { useCarLocation } from "~/hook/useCarLocation.hook";
import { getRoutePointsByRouteId } from "~/actions/route-points.action";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";
const KUKPS_CENTER: [number, number] = [14.02372, 99.97487];

// Active vehicle marker — Pulsing dot using Tailwind classes
const markerIcon = L.divIcon({
  html: `<div class="relative flex h-6 w-6 items-center justify-center">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
    <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary border-2 border-background shadow-[0_0_8px_rgba(0,0,0,0.3)]"></span>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
  className: "!bg-transparent border-none",
});

// Route stop marker — compact circle
const stopIcon = L.divIcon({
  html: `<div class="flex h-5 w-5 items-center justify-center">
    <div class="h-3.5 w-3.5 rounded-full bg-background border-[2.5px] border-primary/80 shadow-sm"></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
  className: "!bg-transparent border-none",
});

function FlyTo({ position }: { position: [number, number] }) {
  const map = useMap();
  const [hasFlown, setHasFlown] = useState(false);

  useEffect(() => {
    if (!hasFlown) {
      map.flyTo(position, 17, { duration: 1.1, easeLinearity: 0.25 });
      setHasFlown(true);
    }
  }, [position, hasFlown, map]);

  return null;
}

interface CarDetailMapProps {
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

export default function CarDetailMap({ car }: CarDetailMapProps) {
  const { currentLocation } = useCarLocation(WS_URL);

  const loc = currentLocation?.find((l) => l.carId === car?.id);
  const position: [number, number] | null = loc ? [loc.lat, loc.lng] : null;
  const isActive = loc?.status === "active";
  const lastSeen = loc ? new Date(loc.createdAt) : null;

  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  let routeStops = routePoints.filter((r) => r.name !== null && r.name !== "");
  let filteredRoutePoints: { text: string; lat: number; lng: number }[] = [];
  let hasPosition: { lat: number; lng: number }[] = [];
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
      let idx = hasPosition.findIndex(
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

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-md overflow-hidden border border-gray-200">
      {/* Map */}
      <MapContainer
        center={KUKPS_CENTER}
        zoom={16}
        minZoom={14}
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
        {position && (
          <>
            <Marker position={position} icon={markerIcon}>
              <Popup>
                <div className="font-mono text-xs text-gray-700 space-y-1 min-w-[160px]">
                  <p className="font-semibold text-gray-900 text-[11px] uppercase tracking-wider">
                    ตำแหน่งรถล่าสุด
                  </p>
                  <p className="text-gray-500">
                    {position[0]}, {position[1]}
                  </p>
                  {lastSeen && (
                    <p className="text-gray-400 text-[10px]">
                      {formatTime(lastSeen)}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
            <FlyTo position={position} />
          </>
        )}
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: "var(--primary)",
              weight: 4,
              opacity: 0.8,
            }}
          />
        )}
        {filteredRoutePoints.length > 0 &&
          filteredRoutePoints.map((p, i) => (
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
      </MapContainer>

      {/* No-signal overlay */}
      {!position && (
        <div className="absolute inset-0 z-[999] pointer-events-none flex flex-col items-center justify-center gap-2">
          <div className="bg-background/90 border border-border rounded-md px-5 py-3.5 shadow-sm flex flex-col items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-muted-foreground"
            >
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              ไม่พบสัญญาณ GPS
            </span>
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] border-t border-border bg-background/95 backdrop-blur-sm px-3 py-2 flex items-center gap-3">
        {loc ? (
          <>
            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border shrink-0 ${
                isActive
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isActive ? "bg-primary animate-pulse" : "bg-muted-foreground"
                }`}
              />
              {isActive ? "Active" : "Inactive"}
            </span>

            {/* Divider */}
            <span className="w-px h-3 bg-border shrink-0" />

            {/* Coordinates */}
            {position && (
              <>
                <span className="text-[10px] font-mono text-muted-foreground tabular-nums hidden sm:block">
                  {position[0]}, {position[1]}
                </span>
                <span className="w-px h-3 bg-border shrink-0 hidden sm:block" />
              </>
            )}

            {/* Last update time */}
            {lastSeen && (
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                อัปเดต{" "}
                <span className="font-semibold text-foreground">
                  {formatTime(lastSeen)}
                </span>
              </span>
            )}
          </>
        ) : (
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            ไม่พบสัญญาณ GPS
          </span>
        )}

        {/* Route indicator — right side */}
        {routePoints.length > 0 && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 shrink-0 text-primary"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className="text-primary font-semibold">
              {routePoints.length}
            </span>{" "}
            จุด
          </span>
        )}
      </div>
    </div>
  );
}
