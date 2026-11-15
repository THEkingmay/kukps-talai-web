import { useCallback, useEffect, useState } from "react";
import type { LatLng } from "leaflet";
import type { Route, RoutePoint } from "~/types";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  createPoints,
  deletePoint,
  getRoutePointsByRouteId,
  updatePoint,
} from "~/actions/route-points.action";

/**
 * Editor rules for route points:
 * 1. A route with no points gets them in bulk from map clicks — sequence starts
 *    at 10000 and grows by 10000 per click.
 * 2. Existing points can have their name + "seconds to next stop" edited
 *    (`updatePoint(pointId, { name, timeToNextSecs })`).
 * 3. Any single point can be deleted.
 * 4. A new point can be inserted between two existing points; the sequence is
 *    the floor average of the neighbours, then `createPoints` persists it.
 */

export type RoutePointEditorMode = "view" | "insert";

export interface PendingRoutePoint {
  lat: number;
  lng: number;
  sequence: number;
  name: string;
  timeToNextSecs: string;
}

export interface RoutePointEditValues {
  name: string;
  timeToNextSecs: string;
}

export type RoutePointEditState = Record<string, RoutePointEditValues>;

export interface GroupedRoutePoint {
  lat: number;
  lng: number;
  indices: number[];
  isStop: boolean;
  names: string[];
}

export interface GroupedPendingRoutePoint {
  lat: number;
  lng: number;
  indices: number[];
}

const SEQUENCE_STEP = 10_000;

interface UseRoutePointEditorOptions {
  isOpen: boolean;
  route: Route | null;
}

export function useRoutePointEditor({
  isOpen,
  route,
}: UseRoutePointEditorOptions) {
  const { alert, confirm } = useDialog();

  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Points staged for the first save, while the route still has none.
  const [pendingPoints, setPendingPoints] = useState<PendingRoutePoint[]>([]);

  // Insert mode state (only meaningful once the route has points).
  const [mode, setMode] = useState<RoutePointEditorMode>("view");
  const [insertAfterSeq, setInsertAfterSeq] = useState<number | null>(null);
  const [insertBeforeSeq, setInsertBeforeSeq] = useState<number | null>(null);

  // Edit state for persisted points.
  const [editState, setEditState] = useState<RoutePointEditState>({});
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
        const sortedPoints = [...res.data.data].sort(
          (a, b) => a.sequence - b.sequence,
        );
        setPoints(sortedPoints);

        const initialEditState: RoutePointEditState = {};
        sortedPoints.forEach((point) => {
          initialEditState[point.id] = {
            name: point.name || "",
            timeToNextSecs: point.timeToNextSecs
              ? String(point.timeToNextSecs)
              : "",
          };
        });
        setEditState(initialEditState);
      }
    } catch {
      alert({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลจุดจอดได้",
      });
    } finally {
      setIsLoading(false);
    }
  }, [alert, route]);

  useEffect(() => {
    if (isOpen && route) {
      fetchPoints();
    }
  }, [isOpen, route, fetchPoints]);

  // --- Editing helpers exposed to the sidebar ---

  const updateEditField = useCallback(
    (pointId: string, field: keyof RoutePointEditValues, value: string) => {
      setEditState((prev) => ({
        ...prev,
        [pointId]: { ...prev[pointId], [field]: value },
      }));
    },
    [],
  );

  const updatePendingField = useCallback(
    (
      index: number,
      field: "name" | "timeToNextSecs",
      value: string,
    ) => {
      setPendingPoints((prev) =>
        prev.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      );
    },
    [],
  );

  const removePendingPoint = useCallback((index: number) => {
    setPendingPoints((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const startInsert = useCallback(
    (afterSequence: number, beforeSequence: number | null) => {
      setMode("insert");
      setInsertAfterSeq(afterSequence);
      setInsertBeforeSeq(beforeSequence);
    },
    [],
  );

  const cancelInsert = useCallback(() => {
    setMode("view");
    setInsertAfterSeq(null);
    setInsertBeforeSeq(null);
  }, []);

  // --- Map interaction ---

  const handleMapClick = useCallback(
    async (latlng: LatLng) => {
      if (!route) return;

      if (points.length === 0) {
        // Initial creation mode
        const nextSequence =
          pendingPoints.length === 0
            ? SEQUENCE_STEP
            : pendingPoints[pendingPoints.length - 1].sequence + SEQUENCE_STEP;
        setPendingPoints((prev) => [
          ...prev,
          {
            lat: latlng.lat,
            lng: latlng.lng,
            sequence: nextSequence,
            name: "",
            timeToNextSecs: "",
          },
        ]);
        return;
      }

      if (mode !== "insert") return;

      // Insert mode
      let newSequence = 0;
      if (insertAfterSeq !== null && insertBeforeSeq !== null) {
        newSequence = Math.floor((insertAfterSeq + insertBeforeSeq) / 2);
      } else if (insertAfterSeq !== null && insertBeforeSeq === null) {
        newSequence = insertAfterSeq + SEQUENCE_STEP;
      } else if (insertAfterSeq === null && insertBeforeSeq !== null) {
        newSequence = Math.floor(insertBeforeSeq / 2); // Insert at the very beginning
      }

      setIsSaving(true);
      try {
        const res = await createPoints([
          {
            routeId: route.id,
            sequence: newSequence,
            lat: latlng.lat,
            lng: latlng.lng,
            name: null,
            timeToNextSecs: null,
          },
        ]);
        if (res.success) {
          await fetchPoints();
        } else {
          alert({ title: "เพิ่มไม่สำเร็จ", description: res.error });
        }
      } catch {
        alert({
          title: "ข้อผิดพลาด",
          description: "ไม่สามารถเพิ่มจุดใหม่ได้",
        });
      } finally {
        setIsSaving(false);
        setMode("view");
      }
    },
    [
      alert,
      fetchPoints,
      insertAfterSeq,
      insertBeforeSeq,
      mode,
      pendingPoints,
      points.length,
      route,
    ],
  );

  // --- Persistence ---

  const saveInitialPoints = useCallback(async () => {
    if (!route || pendingPoints.length === 0) return;
    setIsSaving(true);
    try {
      const payload = pendingPoints.map((point) => ({
        routeId: route.id,
        sequence: point.sequence,
        lat: point.lat,
        lng: point.lng,
        name: point.name.trim() || null,
        timeToNextSecs: point.timeToNextSecs
          ? parseInt(point.timeToNextSecs, 10)
          : null,
      }));
      const res = await createPoints(payload);
      if (res.success) {
        alert({
          title: "บันทึกสำเร็จ",
          description: "สร้างเส้นทางสำเร็จ",
        });
        await fetchPoints();
      } else {
        alert({ title: "บันทึกไม่สำเร็จ", description: res.error });
      }
    } catch {
      alert({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setIsSaving(false);
    }
  }, [alert, fetchPoints, pendingPoints, route]);

  const saveExistingPoint = useCallback(
    async (pointId: string) => {
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
          // Patch local state instead of re-fetching — the list stays instant.
          setPoints((prev) =>
            prev.map((point) =>
              point.id === pointId ? { ...point, ...payload } : point,
            ),
          );
          alert({
            title: "บันทึกข้อมูลจุดสำเร็จ",
            description: "บันทึกข้อมูลสำเร็จ",
          });
        } else {
          alert({ title: "แก้ไขไม่สำเร็จ", description: res.error });
        }
      } catch {
        alert({
          title: "ข้อผิดพลาด",
          description: "ไม่สามารถแก้ไขจุดได้",
        });
      } finally {
        setUpdatingId(null);
      }
    },
    [alert, editState],
  );

  const requestDeletePoint = useCallback(
    (pointId: string) => {
      confirm({
        title: "ยืนยันการลบ",
        description: "คุณต้องการลบจุดจอดนี้ใช่หรือไม่?",
        confirmText: "ลบ",
        cancelText: "ยกเลิก",
        onConfirm: async () => {
          setDeletingId(pointId);
          try {
            const res = await deletePoint(pointId);
            if (res.success) {
              setPoints((prev) =>
                prev.filter((point) => point.id !== pointId),
              );
            } else {
              alert({
                title: "ลบไม่สำเร็จ",
                description: res.error || "ไม่สามารถลบได้",
              });
            }
          } catch {
            alert({
              title: "ข้อผิดพลาด",
              description: "ไม่สามารถลบข้อมูลได้",
            });
          } finally {
            setDeletingId(null);
          }
        },
      });
    },
    [alert, confirm],
  );

  // --- Derived ---

  const hasChanges = useCallback(
    (pointId: string) => {
      const point = points.find((item) => item.id === pointId);
      if (!point) return false;
      const edit = editState[pointId];
      if (!edit) return false;
      const currentName = point.name || "";
      const currentTime = point.timeToNextSecs
        ? String(point.timeToNextSecs)
        : "";
      return edit.name !== currentName || edit.timeToNextSecs !== currentTime;
    },
    [editState, points],
  );

  const isStopPoint = useCallback(
    (pointId: string) => {
      const edit = editState[pointId];
      if (edit) {
        return Boolean(edit.name.trim() || edit.timeToNextSecs);
      }
      const point = points.find((item) => item.id === pointId);
      return Boolean(point?.name?.trim() || point?.timeToNextSecs);
    },
    [editState, points],
  );

  const groupedPoints: GroupedRoutePoint[] = (() => {
    if (points.length === 0) return [];

    const groups = new Map<string, GroupedRoutePoint>();
    points.forEach((point, index) => {
      const key = `${point.lat},${point.lng}`;
      if (!groups.has(key)) {
        groups.set(key, {
          lat: point.lat,
          lng: point.lng,
          indices: [],
          isStop: false,
          names: [],
        });
      }
      const group = groups.get(key)!;
      group.indices.push(index + 1);
      if (point.name) group.names.push(point.name);
      if (isStopPoint(point.id)) {
        group.isStop = true;
      }
    });
    return Array.from(groups.values());
  })();

  const groupedPendingPoints: GroupedPendingRoutePoint[] = (() => {
    if (points.length > 0 || pendingPoints.length === 0) return [];

    const groups = new Map<string, GroupedPendingRoutePoint>();
    pendingPoints.forEach((point, index) => {
      const key = `${point.lat},${point.lng}`;
      if (!groups.has(key)) {
        groups.set(key, { lat: point.lat, lng: point.lng, indices: [] });
      }
      groups.get(key)!.indices.push(index + 1);
    });
    return Array.from(groups.values());
  })();

  const mapPoints =
    points.length > 0
      ? points.map((point) => ({ lat: point.lat, lng: point.lng }))
      : pendingPoints.map((point) => ({ lat: point.lat, lng: point.lng }));

  const hasExistingPoints = points.length > 0;

  const summaryLabel =
    points.length > 0
      ? `${points.length} จุด`
      : pendingPoints.length > 0
        ? `${pendingPoints.length} จุดใหม่`
        : "ว่างเปล่า";

  return {
    // state
    points,
    pendingPoints,
    editState,
    isLoading,
    isSaving,
    mode,
    updatingId,
    deletingId,
    // derived
    groupedPoints,
    groupedPendingPoints,
    mapPoints,
    hasExistingPoints,
    summaryLabel,
    hasChanges,
    isStopPoint,
    // map
    handleMapClick,
    // sidebar
    updateEditField,
    updatePendingField,
    removePendingPoint,
    startInsert,
    cancelInsert,
    saveExistingPoint,
    requestDeletePoint,
    saveInitialPoints,
  };
}
