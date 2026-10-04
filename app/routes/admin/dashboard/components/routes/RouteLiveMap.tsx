import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { RoutePoint, ResponseCarData } from "~/types";
import { useWebsocket } from "~/components/providers/WebsocketProvider";

const KUKPS_CENTER: [number, number] = [14.02372, 99.97487];

// Live car marker — pulsing dot (same pattern as CarDetailMap)
const carIcon = L.divIcon({
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

function FitBounds({ points }: { points: { lat: number; lng: number }[] }) {
  const map = useMap();
  const [hasFitted, setHasFitted] = useState(false);

  useEffect(() => {
    if (!hasFitted && points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
      setHasFitted(true);
    }
  }, [points, hasFitted, map]);

  return null;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

interface RouteLiveMapProps {
  routeId: string;
  points: RoutePoint[];
  cars: ResponseCarData[];
}

/**
 * Read-only live map of a route: route polyline, stops,
 * and live positions (WS) of the cars assigned to this route.
 */
export default function RouteLiveMap({ routeId, points, cars }: RouteLiveMapProps) {
  const { currentLocation } = useWebsocket();

  const carIds = cars.map((c) => c.id);
  const liveLocations = (currentLocation ?? []).filter((l) =>
    carIds.includes(l.carId),
  );

  const sortedPoints = [...points].sort((a, b) => a.sequence - b.sequence);
  const stops = sortedPoints.filter((p) => p.name !== null && p.name !== "");

  return (
    <div className="relative h-full w-full min-h-[380px] overflow-hidden rounded-md border border-gray-200">
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
        <FitBounds points={sortedPoints} />
        {sortedPoints.length > 0 && (
          <Polyline
            positions={sortedPoints.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: "var(--primary)",
              weight: 4,
              opacity: 0.8,
            }}
          />
        )}
        {stops.map((p, i) => (
          <Marker key={`stop-${routeId}-${i}`} position={[p.lat, p.lng]} icon={stopIcon}>
            <Popup>
              <div className="font-mono text-xs text-gray-700 min-w-[120px]">
                <p className="font-semibold text-gray-900 text-[11px] uppercase tracking-wider mb-0.5">
                  ป้ายจอด
                </p>
                <p className="text-gray-500">{p.name}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {liveLocations.map((loc) => (
          <Marker
            key={`live-${loc.carId}`}
            position={[loc.lat, loc.lng]}
            icon={carIcon}
          >
            <Popup>
              <div className="font-mono text-xs text-gray-700 space-y-1 min-w-[160px]">
                <p className="font-semibold text-gray-900 text-[11px] uppercase tracking-wider">
                  รถตำแหน่งล่าสุด
                </p>
                <p className="text-gray-500">
                  {loc.lat}, {loc.lng}
                </p>
                <p className="text-gray-400 text-[10px]">
                  {formatTime(new Date(loc.createdAt))}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* No-signal overlay (only when the route has cars) */}
      {carIds.length > 0 && liveLocations.length === 0 && (
        <div className="absolute inset-0 z-[999] pointer-events-none flex items-center justify-center">
          <div className="bg-background/90 border border-border rounded-md px-5 py-3.5 shadow-sm">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              ไม่พบสัญญาณ GPS ของรถในสายนี้
            </span>
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] border-t border-border bg-background/95 backdrop-blur-sm px-3 py-2 flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border bg-primary/10 text-primary border-primary/20 shrink-0">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              liveLocations.length > 0 ? "bg-primary animate-pulse" : "bg-muted-foreground"
            }`}
          />
          Live {liveLocations.length}/{carIds.length} รถ
        </span>
        <span className="w-px h-3 bg-border shrink-0" />
        <span className="text-[10px] font-mono text-muted-foreground">
          {sortedPoints.length} จุดจอด
        </span>
      </div>
    </div>
  );
}
