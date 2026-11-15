import { useEffect, useRef } from "react";
import type { LatLng } from "leaflet";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import type {
  GroupedPendingRoutePoint,
  GroupedRoutePoint,
  RoutePointEditorMode,
} from "~/routes/admin/dashboard/hooks/useRoutePointEditor";
import { createSequenceIcon, DEFAULT_MAP_CENTER } from "./leafletIcons";

interface MapClickHandlerProps {
  onMapClick: (latlng: LatLng) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

/** Fits the viewport to the points once, on first load. */
function MapCenterer({ points }: { points: { lat: number; lng: number }[] }) {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    if (points.length > 0 && !hasCentered.current) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
      hasCentered.current = true;
    }
  }, [points, map]);

  return null;
}

interface RoutePointMapCanvasProps {
  groupedPoints: GroupedRoutePoint[];
  groupedPendingPoints: GroupedPendingRoutePoint[];
  mapPoints: { lat: number; lng: number }[];
  hasExistingPoints: boolean;
  mode: RoutePointEditorMode;
  isLoading: boolean;
  onMapClick: (latlng: LatLng) => void;
}

/**
 * The Leaflet canvas: markers (deduplicated by coordinate), the connecting
 * polyline, and the two click affordances that drive the editor.
 */
export default function RoutePointMapCanvas({
  groupedPoints,
  groupedPendingPoints,
  mapPoints,
  hasExistingPoints,
  mode,
  isLoading,
  onMapClick,
}: RoutePointMapCanvasProps) {
  const defaultCenter = DEFAULT_MAP_CENTER;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={17}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={onMapClick} />

      {/* Existing points */}
      {groupedPoints.map((group) => {
        const seqText = group.indices.join(",");
        return (
          <Marker
            key={`grouped-${group.lat}-${group.lng}`}
            position={[group.lat, group.lng]}
            icon={createSequenceIcon(seqText, false, group.isStop)}
            eventHandlers={{
              click: (e) => {
                // อนุญาตให้คลิกจุดเดิมเพื่อแทรก/ต่อจุดที่พิกัดเดิมได้
                if (mode === "insert") {
                  onMapClick(e.latlng);
                }
              },
            }}
          >
            <Popup className="font-mono text-xs">
              <strong>ลำดับ: {seqText}</strong>
              <br />
              ประเภท: {group.isStop ? "จุดจอดรถ (Stop)" : "จุดผ่าน (Point)"}
              {group.names.length > 0 && (
                <>
                  <br />
                  ชื่อ: {group.names.join(", ")}
                </>
              )}
            </Popup>
          </Marker>
        );
      })}

      {/* Pending points */}
      {groupedPendingPoints.map((group) => {
        const seqText = group.indices.join(",");
        return (
          <Marker
            key={`pending-grouped-${group.lat}-${group.lng}`}
            position={[group.lat, group.lng]}
            icon={createSequenceIcon(seqText, true)}
            eventHandlers={{
              click: (e) => {
                // อนุญาตให้คลิกจุดเดิมเพื่อสร้างเส้นทางวนกลับ (Loop)
                if (!hasExistingPoints) {
                  onMapClick(e.latlng);
                }
              },
            }}
          >
            <Popup className="font-mono text-xs">
              <strong>จุดใหม่ลำดับ: {seqText}</strong>
            </Popup>
          </Marker>
        );
      })}

      {/* Lines connecting points */}
      {mapPoints.length > 1 && (
        <Polyline
          positions={mapPoints}
          color="var(--primary)"
          weight={4}
          opacity={0.8}
        />
      )}

      {/* Auto center map when loaded */}
      {!isLoading && <MapCenterer points={mapPoints} />}
    </MapContainer>
  );
}
