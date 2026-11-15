import { useCallback, useEffect, useState } from "react";
import type { CarHistoryLog } from "~/types";
import { getCarLogsByCarId } from "~/actions/car-history-log.action";

interface UseCarHistoryLogsOptions {
  carId: string;
}

/**
 * State + behaviour for the GPS history table of a car.
 *
 * Loads the latest logs and exposes the loading/error flags. The component only
 * renders markup and wires these values to the presentational table — no
 * fetching, no state, no derivations.
 */
export function useCarHistoryLogs({ carId }: UseCarHistoryLogsOptions) {
  const [logs, setLogs] = useState<CarHistoryLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getCarLogsByCarId(carId, 100);
      if (res.success) {
        setLogs(res.data.data || []);
      } else {
        setError(res.error || "ไม่สามารถดึงข้อมูลประวัติการเดินทางได้");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    if (carId) {
      fetchLogs();
    }
  }, [carId, fetchLogs]);

  return {
    logs,
    isLoading,
    error,
    refresh: fetchLogs,
  };
}
