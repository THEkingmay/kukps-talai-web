import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { ResponseCarData } from "~/types";
import { useCarLocation } from "~/hook/useCarLocation.hook";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";
const KUKPS_CENTER: [number, number] = [14.02372, 99.97487];

const markerIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
    <circle cx="12" cy="12" r="10" fill="#0ea5e9" opacity="0.15">
      <animate attributeName="r" values="10;16;10" dur="2.4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.15;0;0.15" dur="2.4s" repeatCount="indefinite"/>
    </circle>
    <path d="M12 0C7.02 0 3 4.02 3 9c0 6.75 9 18 9 18s9-11.25 9-18c0-4.98-4.02-9-9-9z"
      fill="#0ea5e9" stroke="white" stroke-width="1.5"/>
    <circle cx="12" cy="9" r="3.5" fill="white"/>
  </svg>`,
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -42],
  className: "",
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

// wss://api.talai-kukps.app
// https://api.talai-kukps.app/cars

export default function CarDetailMap({ car }: CarDetailMapProps) {
  const { currentLocation } = useCarLocation(WS_URL);

  const loc = currentLocation?.find((l) => l.carId === car?.id);
  const position: [number, number] | null = loc ? [loc.lat, loc.lng] : null;
  const isActive = loc?.status === "active";
  const lastSeen = loc ? new Date(loc.createdAt) : null;

  return (
    <div
      className={`relative w-full h-full min-h-[380px] ${
        isActive
          ? " bg-gradient-to-r from-green-900 via-green-300 to-green-900 bg-clip-border shadow-[0_0_25px_rgba(34,197,94,0.7)]"
          : ""
      }`}
      style={{ borderRadius: 12, overflow: "clip" }}
    >
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
                <div style={{ textAlign: "center", fontFamily: "sans-serif" }}>
                  <strong style={{ fontSize: 13 }}>📍 ตำแหน่งรถล่าสุด</strong>
                  <br />
                  <span style={{ fontSize: 11, color: "#6b7280" }}>
                    {position[0]}, {position[1]}
                  </span>
                </div>
              </Popup>
            </Marker>
            <FlyTo position={position} />
          </>
        )}
      </MapContainer>

      <div className="absolute bottom-0 left-0 right-0 z-[1000] border-t border-slate-200 bg-white px-3 py-2 flex items-center gap-3">
        {loc ? (
          <>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border ${
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

            {lastSeen && (
              <>
                <span className="w-px h-3 bg-slate-200 shrink-0" />
                <span className="text-[10px] font-mono text-slate-500">
                  อัปเดตล่าสุด{" "}
                  <span className="font-semibold text-slate-800">
                    {formatTime(lastSeen)}
                  </span>
                </span>
              </>
            )}
          </>
        ) : (
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            ไม่พบสัญญาณ GPS
          </span>
        )}
      </div>
    </div>
  );
}
