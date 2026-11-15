import { useEffect, useState } from "react";
import { getActiveAll } from "~/actions/driving-log.action";
import { useAuth } from "~/components/providers/AuthProvider";
import { useNow } from "~/hooks/useNow";
import type { DrivingLog } from "~/types";

export type ActiveDriver = {
  log: DrivingLog;
  driverId: string;
  driverName: string;
  driverPhone: string;
  profileImageUrl: string | null;
  carId: string;
  carNumber: string;
};

/**
 * Feed for the admin top-bar "who is driving right now" popover.
 *
 * Admins only — the fetch is skipped entirely for other roles.
 */
export function useActiveDrivers() {
  const { user } = useAuth();
  const isAdmin = !!user && ["superadmin", "admin"].includes(user.role);

  const [activeLogs, setActiveLogs] = useState<ActiveDriver[]>([]);
  const [isLoading, setIsLoading] = useState(isAdmin);

  // keep elapsed time fresh while drivers are on the road
  const now = useNow(30_000, activeLogs.length > 0);

  useEffect(() => {
    if (!isAdmin) return;

    async function fetchActiveLogs() {
      try {
        const result = await getActiveAll();
        if (result.success) {
          setActiveLogs(result.data.data);
        } else {
          console.error("Error fetching active driving logs:", result.error);
        }
      } catch (error) {
        console.error("Error fetching active driving logs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActiveLogs();
  }, [isAdmin]);

  return {
    isAdmin,
    activeLogs,
    isLoading,
    now,
    count: activeLogs.length,
    hasActive: activeLogs.length > 0,
  };
}
