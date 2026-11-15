import { useCallback, useEffect, useRef, useState } from "react";
import {
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  isWithinInterval,
} from "date-fns";
import { useAuth } from "~/components/providers/AuthProvider";
import { useDialog } from "~/components/providers/DialogProvider";
import { getByDriverId } from "~/actions/assignment-driver.action";
import {
  getCurrentDriving,
  getMyLogs,
  type GetDrivingLogType,
} from "~/actions/driving-log.action";
import type { CarDriverShift, DrivingLog } from "~/types";
import { formatThaiDay, formatThaiMonthYear } from "~/helper";

/** กะที่เคยถูกกดงาน พร้อมข้อมูลที่ต้องใช้แสดง "ประวัติการกด". */
export interface DriverDashboardLogGroup {
  shiftId: string;
  logs: GetDrivingLogType[];
  startTime: Date;
  endTime: Date;
  carNumber: string | null;
  routeName: string | null;
}

/**
 * State + behaviour for the driver dashboard (งานของฉัน).
 *
 * The page itself only renders markup and wires these values to the presentational
 * components — no fetching, no alert handling, no derivations.
 */
export function useDriverDashboard() {
  const { user } = useAuth();
  const { alert } = useDialog();

  const [shifts, setShifts] = useState<CarDriverShift[]>([]);
  const [currentDriving, setCurrentDriving] = useState<DrivingLog | null>(null);
  const [logs, setLogs] = useState<GetDrivingLogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // กัน response รอบเก่ามาทับ state รอบใหม่ (เช่น กดหยุดแล้วกดเริ่มต่อทันที)
  const fetchIdRef = useRef(0);

  // silent = true → refresh ข้อมูลเบื้องหลังโดยไม่สลับหน้าเป็น skeleton
  const fetchData = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!user?.id) return;

      const fetchId = ++fetchIdRef.current;
      const isLatest = () => fetchId === fetchIdRef.current;

      if (!silent) setIsLoading(true);
      try {
        const [shiftsRes, currentRes, logsRes] = await Promise.all([
          getByDriverId(user.id),
          getCurrentDriving(),
          getMyLogs(),
        ]);

        if (shiftsRes.success && isLatest()) {
          setShifts(shiftsRes.data.data);
        }
        if (currentRes.success && isLatest()) {
          setCurrentDriving(currentRes.data.data);
        }
        if (logsRes.success && isLatest()) {
          setLogs(logsRes.data.data);
        }
      } catch {
        if (isLatest()) {
          alert({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถโหลดข้อมูลตารางงานได้",
          });
        }
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [user?.id, alert],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // กดเริ่ม/หยุดงานเรียบร้อยแล้ว → อัปเดต "ประวัติการกด" ให้ทันที
  // 1) ใช้ข้อมูลจาก response patch เข้า state ก่อน (ไม่ต้องรอ network รอบใหม่)
  // 2) แล้วดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์มาทับแบบเงียบ ๆ (ไม่โชว์ skeleton)
  const handleCurrentDrivingChange = useCallback(
    (log: DrivingLog | null, endedLog?: DrivingLog) => {
      setCurrentDriving(log);

      if (endedLog) {
        setLogs((prev) =>
          prev.map((item) =>
            item.log.id === endedLog.id ? { ...item, log: endedLog } : item,
          ),
        );
      }

      void fetchData({ silent: true });
    },
    [fetchData],
  );

  // "ตอนนี้" สำหรับคำนวณช่วงเวลา/จัดกลุ่มงาน — คำนวณใหม่ทุกครั้งที่ render
  // (ไม่มี interval ในหน้านี้ ตัวเลขเวลาที่เดินจริงมาจาก refetch ฝั่งเซิร์ฟเวอร์)
  const now = new Date();

  // กำลังทำงาน (Active)
  const activeShifts = shifts.filter((shift) =>
    isWithinInterval(now, {
      start: new Date(shift.startTime),
      end: new Date(shift.endTime),
    }),
  );
  const activeShift = activeShifts[0];

  // กะของ log ที่ยัง active อยู่ — อาจเป็นกะที่เลยเวลาสิ้นสุดไปแล้วก็ได้
  const drivingShift = currentDriving
    ? (shifts.find((shift) => shift.id === currentDriving.shiftId) ?? null)
    : null;
  const statusShift = drivingShift ?? activeShift;
  const isOverdue = drivingShift
    ? isBefore(new Date(drivingShift.endTime), now)
    : false;

  // จำนวนครั้งที่กดงาน และกะที่ยังมี log ค้างอยู่
  const logCountByShift = new Map<string, number>();
  const shiftsWithActiveLog = new Set<string>();
  logs.forEach(({ log }) => {
    logCountByShift.set(
      log.shiftId,
      (logCountByShift.get(log.shiftId) ?? 0) + 1,
    );
    if (log.status === "active") {
      shiftsWithActiveLog.add(log.shiftId);
    }
  });

  // ประวัติการกดเริ่ม–หยุดงาน จัดกลุ่มตามกะ (ใหม่ → เก่า)
  const shiftById = new Map(shifts.map((shift) => [shift.id, shift]));
  const logGroups = Array.from(
    logs.reduce((acc, item) => {
      const list = acc.get(item.log.shiftId) ?? [];
      list.push(item);
      acc.set(item.log.shiftId, list);
      return acc;
    }, new Map<string, GetDrivingLogType[]>()),
  )
    .map(([shiftId, items]): DriverDashboardLogGroup => {
      const shift = shiftById.get(shiftId) ?? null;
      const sortedLogs = [...items].sort(
        (a, b) =>
          new Date(a.log.startedAt).getTime() -
          new Date(b.log.startedAt).getTime(),
      );
      const startTime = shift
        ? new Date(shift.startTime)
        : new Date(items[0].shiftStartTime);
      const endTime = shift
        ? new Date(shift.endTime)
        : new Date(items[0].shiftEndTime);

      return {
        shiftId,
        logs: sortedLogs,
        startTime,
        endTime,
        carNumber: shift?.moreData.carNumber ?? null,
        routeName: shift?.moreData.routeName ?? null,
      };
    })
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

  // งานถัดไป (Upcoming)
  const upcomingShifts = shifts
    .filter((shift) => isAfter(new Date(shift.startTime), now))
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

  // งานที่ผ่านมา (Past)
  const pastShifts = shifts
    .filter((shift) => isBefore(new Date(shift.endTime), now))
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );

  // จัดกลุ่มงานถัดไปตามวัน
  const groupedUpcoming = upcomingShifts.reduce(
    (acc, shift) => {
      const d = new Date(shift.startTime);
      let key = "";
      if (isToday(d)) {
        key = "วันนี้";
      } else if (isTomorrow(d)) {
        key = "พรุ่งนี้";
      } else {
        key = formatThaiDay(d);
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(shift);
      return acc;
    },
    {} as Record<string, CarDriverShift[]>,
  );

  // จัดกลุ่มงานที่ผ่านมาตามเดือน/ปี
  const groupedPast = pastShifts.reduce(
    (acc, shift) => {
      const key = formatThaiMonthYear(new Date(shift.startTime));
      if (!acc[key]) acc[key] = [];
      acc[key].push(shift);
      return acc;
    },
    {} as Record<string, CarDriverShift[]>,
  );

  return {
    // data + state
    shifts,
    currentDriving,
    logs,
    isLoading,
    fetchIdRef,
    fetchData,
    handleCurrentDrivingChange,
    // derived
    now,
    activeShifts,
    activeShift,
    drivingShift,
    statusShift,
    isOverdue,
    logCountByShift,
    shiftsWithActiveLog,
    logGroups,
    upcomingShifts,
    pastShifts,
    groupedUpcoming,
    groupedPast,
  };
}
