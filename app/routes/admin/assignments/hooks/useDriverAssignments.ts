import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";

import type {
  CarDriverShift,
  DrivingLog,
  ResponseCarData,
  User,
} from "~/types";

import { getByDriverId } from "~/actions/assignment-driver.action";
import {
  getAll as getAllDrivingLogs,
  getCurrentDriving,
  type GetAlllogType,
} from "~/actions/driving-log.action";
import { getById } from "~/actions/user.action";
import { getCars } from "~/actions/car.action";

import { formatDate } from "~/helper";
import { useNow } from "~/hooks/useNow";
import { useAdminShell } from "../../shell/ShellContext";
import {
  driverInitials as getDriverInitials,
  driverName as getDriverName,
  shiftStatus,
} from "./helpers";

/**
 * State + behaviour for the admin driver assignment detail page
 * (/admin/assignments/:driverId).
 *
 * The route itself only renders markup and wires these values to the
 * presentational components — no fetching, no derivations.
 */
export function useDriverAssignments() {
  const { driverId } = useParams<{ driverId: string }>();
  const { setBreadcrumb } = useAdminShell();

  const [driver, setDriver] = useState<User | null>(null);
  const [shifts, setShifts] = useState<CarDriverShift[]>([]);
  const [logs, setLogs] = useState<GetAlllogType[]>([]);
  const [cars, setCars] = useState<ResponseCarData[]>([]);
  const [currentDriving, setCurrentDriving] = useState<DrivingLog | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // live ticker — refresh elapsed time every 30s while a log is active
  const now = useNow(30_000, Boolean(currentDriving));

  const load = useCallback(async () => {
    if (!driverId) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const [driverRes, shiftsRes, logsRes, carsRes] = await Promise.all([
        getById(driverId),
        getByDriverId(driverId),
        getAllDrivingLogs(driverId),
        getCars(),
      ]);

      if (!driverRes.success) {
        setLoadError(driverRes.error);
        return;
      }

      setDriver(driverRes.data.data);
      setShifts(shiftsRes.success ? (shiftsRes.data.data ?? []) : []);
      setLogs(
        logsRes.success
          ? (logsRes.data.data ?? []).filter(
              (item) => item.driverId === driverId,
            )
          : [],
      );
      setCars(carsRes.success ? (carsRes.data.data ?? []) : []);

      const currentRes = await getCurrentDriving(driverId);
      if (currentRes.success) setCurrentDriving(currentRes.data.data);
    } catch {
      setLoadError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  }, [driverId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setBreadcrumb(driver ? getDriverName(driver) : null);
    return () => setBreadcrumb(null);
  }, [driver, setBreadcrumb]);

  // --- Derived data ---

  const driverName = driver ? getDriverName(driver) : "";
  const driverInitials = driver ? getDriverInitials(driver) : "";

  const carNumberById = useMemo(() => {
    const map = new Map<string, string>();
    cars.forEach((car) => map.set(car.id, car.carNumber));
    return map;
  }, [cars]);

  const logsByShift = useMemo(() => {
    const map = new Map<string, DrivingLog[]>();
    logs.forEach((item) => {
      const list = map.get(item.log.shiftId) ?? [];
      list.push(item.log);
      map.set(item.log.shiftId, list);
    });
    map.forEach((list) =>
      list.sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
      ),
    );
    return map;
  }, [logs]);

  const visibleShifts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? shifts.filter((shift) => {
          const car = carNumberById.get(shift.carId) ?? shift.carId;
          const haystack = `${car} ${formatDate(shift.startTime)} ${formatDate(
            shift.endTime,
          )} ${shiftStatus(shift.startTime, shift.endTime).label}`.toLowerCase();
          return haystack.includes(query);
        })
      : shifts;

    return [...filtered].sort((a, b) => {
      const diff =
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      return sortDesc ? -diff : diff;
    });
  }, [shifts, search, sortDesc, carNumberById]);

  const currentShift = currentDriving
    ? (shifts.find((shift) => shift.id === currentDriving.shiftId) ?? null)
    : null;

  // --- Table controls ---

  const toggleSort = useCallback(() => {
    setSortDesc((prev) => !prev);
  }, []);

  const toggleExpanded = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return {
    // data
    driver,
    shifts,
    logs,
    cars,
    currentDriving,
    isLoading,
    loadError,
    // table filters
    search,
    setSearch,
    sortDesc,
    toggleSort,
    expanded,
    toggleExpanded,
    // derived
    now,
    carNumberById,
    logsByShift,
    visibleShifts,
    currentShift,
    driverName,
    driverInitials,
  };
}
