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
import { getRoutePointsByRouteId } from "~/actions/route-poimts.action";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";
const KUKPS_CENTER: [number, number] = [14.02372, 99.97487];

// Active vehicle marker — animated sonar ring + solid pin
const markerIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48" width="32" height="48">
    <circle cx="16" cy="14" r="12" fill="#0ea5e9" opacity="0.12">
      <animate attributeName="r" values="12;20;12" dur="2.6s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.12;0;0.12" dur="2.6s" repeatCount="indefinite"/>
    </circle>
    <circle cx="16" cy="14" r="7" fill="#0ea5e9" opacity="0.22">
      <animate attributeName="r" values="7;14;7" dur="2.6s" begin="0.4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.22;0;0.22" dur="2.6s" begin="0.4s" repeatCount="indefinite"/>
    </circle>
    <path d="M16 2C10.477 2 6 6.477 6 12c0 7.5 10 20 10 20S26 19.5 26 12C26 6.477 21.523 2 16 2z"
      fill="#0ea5e9" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="16" cy="12" r="4" fill="white"/>
    <circle cx="16" cy="12" r="2" fill="#0284c7"/>
  </svg>`,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -50],
  className: "",
});

// Route stop marker — compact numbered circle
function makeStopIcon(label: string) {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
      <circle cx="12" cy="12" r="10" fill="white" stroke="#64748b" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="4" fill="#64748b"/>
    </svg>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
    className: "",
    tooltipAnchor: [0, -14],
  });
}

const stopIcon = makeStopIcon("");

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
    <div className="relative w-full h-full min-h-[380px] rounded-xl overflow-hidden border border-slate-200">
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
                <div className="font-mono text-xs text-slate-700 space-y-1 min-w-[160px]">
                  <p className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
                    ตำแหน่งรถล่าสุด
                  </p>
                  <p className="text-slate-500">
                    {position[0]}, {position[1]}
                  </p>
                  {lastSeen && (
                    <p className="text-slate-400 text-[10px]">
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
              color: "#0ea5e9",
              weight: 3,
              opacity: 0.55,
              dashArray: "6 4",
            }}
          />
        )}
        {filteredRoutePoints.length > 0 &&
          filteredRoutePoints.map((p, i) => (
            <Marker key={i} position={[p.lat, p.lng]} icon={stopIcon}>
              <Popup>
                <div className="font-mono text-xs text-slate-700 min-w-[120px]">
                  <p className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider mb-0.5">
                    ป้ายจอด
                  </p>
                  <p className="text-slate-600">{p.text}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* No-signal overlay */}
      {!position && (
        <div className="absolute inset-0 z-[999] pointer-events-none flex flex-col items-center justify-center gap-2">
          <div className="bg-white/90 border border-slate-200 rounded-xl px-5 py-3.5 shadow-sm flex flex-col items-center gap-1.5">
            {/* Signal icon — drawn SVG, no emoji */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              ไม่พบสัญญาณ GPS
            </span>
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] border-t border-slate-200 bg-white/95 backdrop-blur-sm px-3 py-2 flex items-center gap-3">
        {loc ? (
          <>
            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border shrink-0 ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-50 text-slate-500 border-slate-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              {isActive ? "Active" : "Inactive"}
            </span>

            {/* Divider */}
            <span className="w-px h-3 bg-slate-200 shrink-0" />

            {/* Coordinates */}
            {position && (
              <>
                <span className="text-[10px] font-mono text-slate-400 tabular-nums hidden sm:block">
                  {position[0]}, {position[1]}
                </span>
                <span className="w-px h-3 bg-slate-200 shrink-0 hidden sm:block" />
              </>
            )}

            {/* Last update time */}
            {lastSeen && (
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                อัปเดต{" "}
                <span className="font-semibold text-slate-700">
                  {formatTime(lastSeen)}
                </span>
              </span>
            )}
          </>
        ) : (
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            ไม่พบสัญญาณ GPS
          </span>
        )}

        {/* Route indicator — right side */}
        {routePoints.length > 0 && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 shrink-0"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className="text-sky-600 font-semibold">
              {routePoints.length}
            </span>{" "}
            จุด
          </span>
        )}
      </div>
    </div>
  );
}
