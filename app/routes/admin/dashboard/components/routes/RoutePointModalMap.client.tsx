import { useState, useEffect, useCallback, useRef } from "react";
import type { Route, RoutePoint } from "~/types";
import {
  getRoutePointsByRouteId,
  createPoints,
  updatePoint,
  deletePoint,
} from "~/actions/route-poimts.action";
import Swal from "sweetalert2";
import {
  X,
  MapPin,
  Plus,
  Save,
  Trash2,
  Route as RouteIcon,
  Navigation,
  Crosshair,
  Loader2,
} from "lucide-react";

//1 ถ้ายังไม่เคยสร้าง RoutePoint จะได้ length == 0 ให้สร้างก่อนโดยแอดมินสามารถกดบนแผนที่ต่อไปได้เรื่อยๆ โดยกำหนดให้ index 0 มีค่า sequence = 10000 , index ถัดไปเพิ่มทีละ 10000
// บันทึกเป็นอาเรย์ไปยัง createPoints
// 2.สามารถแก้ไขชื่อและเวลาที่จะถึงจุดถัดไปหน่วยวินาทีได้โดยถ้าแก้ไขจะส่งไปที่ updatePoint(pointId , {name , timeToNextSecs})
// 3.กดลบุได้
// 4.การแทรกจุดตรงกลางของสองจุด
// 4.1 เลือกว่าจะแทรกจุดตรงกลางของจุดใดกับจุดหนึ่ง
// 4.2 แทรกจุดใหม่ที่ตำแหน่งที่ระบุโดยเลือกบยแผนที่
// 4.3 คำนวนsequence ของจุดใหม่โดยใช้ sequence ของจุดที่อยู่ก่อนหน้าและหลังหน้าบวกกันหารสอง และส่งไปที่ createPoint เพื่อบันทึก

// We only import react-leaflet client-side to prevent SSR issues if any, but Vite handles it fine usually.
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet Default Icon
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Custom Icon builder to show sequence numbers
const createSequenceIcon = (seqText: string | number, isPending: boolean = false, isStop: boolean = false) => {
  const text = String(seqText);

  if (isPending) {
    return L.divIcon({
      className: "custom-leaflet-icon",
      html: `<div style="transform: translate(-50%, -50%);" class="flex items-center justify-center min-w-[32px] h-8 px-1.5 rounded-full border-2 shadow-sm font-mono text-[11px] font-bold leading-none transition-all bg-amber-100 border-amber-500 text-amber-800 whitespace-nowrap">${text}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }

  if (isStop) {
    return L.divIcon({
      className: "custom-leaflet-icon",
      html: `<div style="transform: translate(-50%, -50%);" class="flex items-center justify-center min-w-[32px] h-8 px-1.5 rounded-full border-2 border-white shadow-sm font-mono text-[11px] font-bold leading-none transition-all bg-sky-500 text-white whitespace-nowrap">${text}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }

  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `<div style="transform: translate(-50%, -50%);" class="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full border-[1.5px] border-slate-300 bg-white shadow-sm font-mono text-[9px] font-bold leading-none transition-all text-slate-500 whitespace-nowrap">${text}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: L.LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Center map component
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

interface RoutePointModalProps {
  isOpen: boolean;
  route: Route | null;
  onClose: () => void;
}

type Mode = "view" | "insert";

export default function RoutePointModal({
  isOpen,
  route,
  onClose,
}: RoutePointModalProps) {
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Pending points for creation (when length === 0)
  const [pendingPoints, setPendingPoints] = useState<
    {
      lat: number;
      lng: number;
      sequence: number;
      name: string;
      timeToNextSecs: string;
    }[]
  >([]);

  // Insert mode state (length > 0)
  const [mode, setMode] = useState<Mode>("view");
  const [insertAfterSeq, setInsertAfterSeq] = useState<number | null>(null);
  const [insertBeforeSeq, setInsertBeforeSeq] = useState<number | null>(null);

  // Edit state for existing points
  const [editState, setEditState] = useState<
    Record<string, { name: string; timeToNextSecs: string }>
  >({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPoints = useCallback(async () => {
    if (!route) return;
    setIsLoading(true);
    setPendingPoints([]);
    setMode("view");
    setInsertAfterSeq(null);
    setInsertBeforeSeq(null);
    try {
      const res = await getRoutePointsByRouteId(route.id);
      if (res.success) {
        // Sort by sequence to ensure order
        const sortedPoints = [...res.data.data].sort(
          (a, b) => a.sequence - b.sequence,
        );
        setPoints(sortedPoints);

        // Initialize edit states
        const initialEditState: Record<
          string,
          { name: string; timeToNextSecs: string }
        > = {};
        sortedPoints.forEach((p) => {
          initialEditState[p.id] = {
            name: p.name || "",
            timeToNextSecs: p.timeToNextSecs ? String(p.timeToNextSecs) : "",
          };
        });
        setEditState(initialEditState);
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลจุดจอดได้",
      });
    } finally {
      setIsLoading(false);
    }
  }, [route]);

  useEffect(() => {
    if (isOpen && route) {
      fetchPoints();
    }
  }, [isOpen, route, fetchPoints]);

  if (!isOpen || !route) return null;

  // --- Handlers ---

  const handleMapClick = async (latlng: L.LatLng) => {
    if (points.length === 0) {
      // 1. Initial creation mode
      const nextSeq =
        pendingPoints.length === 0
          ? 10000
          : pendingPoints[pendingPoints.length - 1].sequence + 10000;
      setPendingPoints((prev) => [
        ...prev,
        {
          lat: latlng.lat,
          lng: latlng.lng,
          sequence: nextSeq,
          name: "",
          timeToNextSecs: "",
        },
      ]);
    } else if (mode === "insert") {
      // 4. Insert mode
      let newSequence = 0;
      if (insertAfterSeq !== null && insertBeforeSeq !== null) {
        newSequence = Math.floor((insertAfterSeq + insertBeforeSeq) / 2);
      } else if (insertAfterSeq !== null && insertBeforeSeq === null) {
        newSequence = insertAfterSeq + 10000;
      } else if (insertAfterSeq === null && insertBeforeSeq !== null) {
        newSequence = Math.floor(insertBeforeSeq / 2); // Insert at very beginning
      }

      setIsSaving(true);
      try {
        const payload = [
          {
            routeId: route.id,
            sequence: newSequence,
            lat: latlng.lat,
            lng: latlng.lng,
            name: null,
            timeToNextSecs: null,
          },
        ];
        const res = await createPoints(payload);
        if (res.success) {
          await fetchPoints();
        } else {
          Swal.fire({
            icon: "error",
            title: "เพิ่มไม่สำเร็จ",
            text: res.error,
          });
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: "ไม่สามารถเพิ่มจุดใหม่ได้",
        });
      } finally {
        setIsSaving(false);
        setMode("view");
      }
    }
  };

  const handleSaveInitialPoints = async () => {
    if (pendingPoints.length === 0) return;
    setIsSaving(true);
    try {
      const payload = pendingPoints.map((p) => ({
        routeId: route.id,
        sequence: p.sequence,
        lat: p.lat,
        lng: p.lng,
        name: p.name.trim() || null,
        timeToNextSecs: p.timeToNextSecs
          ? parseInt(p.timeToNextSecs, 10)
          : null,
      }));
      const res = await createPoints(payload);
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          text: "สร้างเส้นทางสำเร็จ",
          timer: 1500,
          showConfirmButton: false,
        });
        await fetchPoints();
      } else {
        Swal.fire({ icon: "error", title: "บันทึกไม่สำเร็จ", text: res.error });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateExistingPoint = async (pointId: string) => {
    const edit = editState[pointId];
    if (!edit) return;

    setUpdatingId(pointId);
    try {
      const payload = {
        name: edit.name.trim() || null,
        timeToNextSecs: edit.timeToNextSecs
          ? parseInt(edit.timeToNextSecs, 10)
          : null,
      };
      const res = await updatePoint(pointId, payload);
      if (res.success) {
        // Just update local state to avoid full re-fetch if we want to be fast
        setPoints((prev) =>
          prev.map((p) => (p.id === pointId ? { ...p, ...payload } : p)),
        );
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "บันทึกข้อมูลจุดสำเร็จ",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({ icon: "error", title: "แก้ไขไม่สำเร็จ", text: res.error });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถแก้ไขจุดได้",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeletePoint = async (pointId: string) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบจุดจอดนี้ใช่หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
    });

    if (!confirm.isConfirmed) return;

    setDeletingId(pointId);
    try {
      const res = await deletePoint(pointId);
      if (res.success) {
        setPoints((prev) => prev.filter((p) => p.id !== pointId));
      } else {
        Swal.fire({ icon: "error", title: "ลบไม่สำเร็จ", text: res.error });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถลบข้อมูลได้",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Check if existing point has unsaved changes
  const hasChanges = (pointId: string) => {
    const p = points.find((x) => x.id === pointId);
    if (!p) return false;
    const edit = editState[pointId];
    if (!edit) return false;
    const currentName = p.name || "";
    const currentTime = p.timeToNextSecs ? String(p.timeToNextSecs) : "";
    return edit.name !== currentName || edit.timeToNextSecs !== currentTime;
  };

  // Check if a point is considered a stop (has name or time)
  const isStopPoint = (pointId: string) => {
    const edit = editState[pointId];
    if (edit) {
      return Boolean(edit.name.trim() || edit.timeToNextSecs);
    }
    const p = points.find((x) => x.id === pointId);
    return Boolean(p?.name?.trim() || p?.timeToNextSecs);
  };

  // Group points for Map rendering
  const groupedPoints = (() => {
    if (points.length > 0) {
      const groups = new Map<string, { lat: number; lng: number; indices: number[]; isStop: boolean; names: string[] }>();
      points.forEach((p, idx) => {
        const key = `${p.lat},${p.lng}`;
        if (!groups.has(key)) {
          groups.set(key, { lat: p.lat, lng: p.lng, indices: [], isStop: false, names: [] });
        }
        const g = groups.get(key)!;
        g.indices.push(idx + 1);
        if (p.name) g.names.push(p.name);
        if (isStopPoint(p.id)) {
          g.isStop = true;
        }
      });
      return Array.from(groups.values());
    }
    return [];
  })();

  const groupedPendingPoints = (() => {
    if (points.length === 0 && pendingPoints.length > 0) {
      const groups = new Map<string, { lat: number; lng: number; indices: number[] }>();
      pendingPoints.forEach((p, idx) => {
        const key = `${p.lat},${p.lng}`;
        if (!groups.has(key)) {
          groups.set(key, { lat: p.lat, lng: p.lng, indices: [] });
        }
        groups.get(key)!.indices.push(idx + 1);
      });
      return Array.from(groups.values());
    }
    return [];
  })();

  // Derived state for Map
  const mapPoints =
    points.length > 0
      ? points.map((p) => ({ lat: p.lat, lng: p.lng }))
      : pendingPoints.map((p) => ({ lat: p.lat, lng: p.lng }));

  // Default Center (KU Kamphaeng Saen roughly)
  const defaultCenter: L.LatLngTuple = [14.025, 99.975];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs bg-slate-900/40 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-[98vw] max-w-[1600px] overflow-hidden flex flex-col h-[95vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                จัดการเส้นทาง: {route.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                ID: {route.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Left: Map Area */}
          <div className="flex-1 relative bg-slate-100 min-h-[300px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-slate-200">
            {mode === "insert" && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2 animate-pulse">
                <Crosshair className="w-4 h-4" />
                คลิกบนแผนที่เพื่อแทรกจุดจอด
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode("view");
                  }}
                  className="ml-2 text-slate-300 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <MapContainer
              center={defaultCenter}
              zoom={17}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onMapClick={handleMapClick} />

              {/* Existing Points */}
              {groupedPoints.map((g, idx) => {
                const seqText = g.indices.join(",");
                return (
                  <Marker
                    key={`grouped-${g.lat}-${g.lng}`}
                    position={[g.lat, g.lng]}
                    icon={createSequenceIcon(seqText, false, g.isStop)}
                    eventHandlers={{
                      click: (e) => {
                        // อนุญาตให้คลิกจุดเดิมเพื่อแทรก/ต่อจุดที่พิกัดเดิมได้
                        if (mode === "insert") {
                          handleMapClick(e.latlng);
                        }
                      },
                    }}
                  >
                    <Popup className="font-mono text-xs">
                      <strong>ลำดับ: {seqText}</strong>
                      <br />
                      ประเภท: {g.isStop ? "จุดจอดรถ (Stop)" : "จุดผ่าน (Point)"}
                      {g.names.length > 0 && (
                        <>
                          <br />
                          ชื่อ: {g.names.join(", ")}
                        </>
                      )}
                    </Popup>
                  </Marker>
                );
              })}

              {/* Pending Points */}
              {groupedPendingPoints.map((g, idx) => {
                const seqText = g.indices.join(",");
                return (
                  <Marker
                    key={`pending-grouped-${g.lat}-${g.lng}`}
                    position={[g.lat, g.lng]}
                    icon={createSequenceIcon(seqText, true)}
                    eventHandlers={{
                      click: (e) => {
                        // อนุญาตให้คลิกจุดเดิมเพื่อสร้างเส้นทางวนกลับ (Loop)
                        if (points.length === 0) {
                          handleMapClick(e.latlng);
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
                  color="#0ea5e9"
                  weight={4}
                  opacity={0.8}
                />
              )}

              {/* Auto center map when loaded */}
              {!isLoading && <MapCenterer points={mapPoints} />}
            </MapContainer>
          </div>

          {/* Right: Sidebar Panel */}
          <div className="w-full lg:w-[400px] xl:w-[450px] bg-white flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <RouteIcon className="w-4 h-4 text-sky-600" /> รายการจุดจอด
              </span>
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                {points.length > 0
                  ? `${points.length} จุด`
                  : pendingPoints.length > 0
                    ? `${pendingPoints.length} จุดใหม่`
                    : "ว่างเปล่า"}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="py-12 text-center text-slate-500 font-mono">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                  กำลังโหลดข้อมูล...
                </div>
              ) : points.length === 0 && pendingPoints.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                  <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 mx-auto mb-3 flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    ยังไม่มีจุดจอดในเส้นทางนี้
                  </h4>
                  <p className="text-xs text-slate-500 px-4">
                    คลิกบนแผนที่เพื่อเริ่มสร้างเส้นทาง จุดแรกจะถูกสร้างทันที
                  </p>
                </div>
              ) : (
                <div className="space-y-2 pb-10">
                  {/* Render Existing Points */}
                  {points.map((p, idx) => {
                    const isStop = isStopPoint(p.id);
                    return (
                      <div key={p.id}>
                        <div
                          className={`p-3 rounded-xl border transition-all ${
                            updatingId === p.id
                              ? "bg-sky-50 border-sky-200"
                              : isStop
                                ? "bg-white border-sky-100 shadow-sm hover:border-sky-300"
                                : "bg-white border-slate-100 shadow-2xs hover:border-slate-300 opacity-80 hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                                isStop
                                  ? "bg-sky-500 text-white border-sky-600 shadow-sm"
                                  : "bg-slate-50 text-slate-500 border-slate-200"
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <div className="flex-1 space-y-2.5 min-w-0">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                    ชื่อจุด / ป้าย
                                  </label>
                                  <input
                                    type="text"
                                    value={editState[p.id]?.name || ""}
                                    onChange={(e) =>
                                      setEditState((prev) => ({
                                        ...prev,
                                        [p.id]: {
                                          ...prev[p.id],
                                          name: e.target.value,
                                        },
                                      }))
                                    }
                                    placeholder="เช่น หน้า มก."
                                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                    เวลาไปจุดถัดไป (วิ)
                                  </label>
                                  <input
                                    type="number"
                                    value={
                                      editState[p.id]?.timeToNextSecs || ""
                                    }
                                    onChange={(e) =>
                                      setEditState((prev) => ({
                                        ...prev,
                                        [p.id]: {
                                          ...prev[p.id],
                                          timeToNextSecs: e.target.value,
                                        },
                                      }))
                                    }
                                    placeholder="เช่น 120"
                                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-mono"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] font-mono text-slate-400">
                                  SEQ: {p.sequence}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {hasChanges(p.id) && (
                                    <button
                                      onClick={() =>
                                        handleUpdateExistingPoint(p.id)
                                      }
                                      disabled={updatingId === p.id}
                                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-all shadow-xs disabled:opacity-50 flex items-center gap-1"
                                    >
                                      {updatingId === p.id ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <Save className="w-3 h-3" />
                                      )}
                                      บันทึก
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeletePoint(p.id)}
                                    disabled={deletingId === p.id}
                                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-50"
                                    title="ลบจุดนี้"
                                  >
                                    {deletingId === p.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Insert Point Divider */}
                        {idx < points.length - 1 && (
                          <div className="flex justify-center my-1 relative group">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-slate-100 group-hover:border-sky-200 transition-colors border-dashed" />
                            </div>
                            <button
                              onClick={() => {
                                setMode("insert");
                                setInsertAfterSeq(p.sequence);
                                setInsertBeforeSeq(points[idx + 1].sequence);
                              }}
                              className="relative bg-white px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-400 group-hover:text-sky-600 border border-slate-200 group-hover:border-sky-300 transition-all flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-2xs"
                            >
                              <Plus className="w-3 h-3" /> แทรกจุด
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add to End Button (only if points exist) */}
                  {points.length > 0 && mode === "view" && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setMode("insert");
                          setInsertAfterSeq(points[points.length - 1].sequence);
                          setInsertBeforeSeq(null);
                        }}
                        className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-white text-slate-500 hover:text-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" /> เพิ่มจุดต่อท้าย
                      </button>
                    </div>
                  )}

                  {/* Render Pending Points (during initial setup) */}
                  {pendingPoints.length > 0 && (
                    <div className="space-y-3">
                      {pendingPoints.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 shadow-2xs"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-amber-200">
                              {idx + 1}
                            </div>
                            <div className="flex-1 space-y-2.5 min-w-0">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                    ชื่อจุด
                                  </label>
                                  <input
                                    type="text"
                                    value={p.name}
                                    onChange={(e) =>
                                      setPendingPoints((prev) => {
                                        const n = [...prev];
                                        n[idx].name = e.target.value;
                                        return n;
                                      })
                                    }
                                    placeholder="ยังไม่มีชื่อ"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                    เวลาถึงจุดถัดไป(วิ)
                                  </label>
                                  <input
                                    type="number"
                                    value={p.timeToNextSecs}
                                    onChange={(e) =>
                                      setPendingPoints((prev) => {
                                        const n = [...prev];
                                        n[idx].timeToNextSecs = e.target.value;
                                        return n;
                                      })
                                    }
                                    placeholder="เช่น 120"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono text-amber-600/70">
                                  SEQ: {p.sequence}
                                </span>
                                <button
                                  onClick={() =>
                                    setPendingPoints((prev) =>
                                      prev.filter((_, i) => i !== idx),
                                    )
                                  }
                                  className="text-[10px] font-semibold text-rose-600 hover:underline"
                                >
                                  ลบจุดนี้
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Action for Pending Points */}
            {points.length === 0 && pendingPoints.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                <button
                  onClick={handleSaveInitialPoints}
                  disabled={isSaving}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  บันทึกเส้นทาง ({pendingPoints.length} จุด)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
