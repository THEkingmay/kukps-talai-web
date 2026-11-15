import { useCallback, useEffect, useState } from "react";
import type { RoutePoint } from "~/types";
import { getRoutePointsByRouteId } from "~/actions/route-points.action";

interface UseCarRouteStopsOptions {
  routeId: string;
}

/**
 * State + behaviour for the route stop table of a car/route detail view.
 *
 * Loads the route points (sorted by sequence) and exposes the loading/error
 * flags. The component only renders markup and wires these values to the
 * presentational table — no fetching, no state, no derivations.
 */
export function useCarRouteStops({ routeId }: UseCarRouteStopsOptions) {
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoints = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getRoutePointsByRouteId(routeId);
      if (res.success) {
        setPoints([...res.data.data].sort((a, b) => a.sequence - b.sequence));
      } else {
        setError(res.error || "ไม่สามารถดึงข้อมูลจุดจอดได้");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  }, [routeId]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  return {
    points,
    isLoading,
    error,
    refresh: fetchPoints,
  };
}
