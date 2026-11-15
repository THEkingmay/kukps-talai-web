import { useCallback, useState } from "react";
import { endDriving, startDriving } from "~/actions/driving-log.action";
import { useDialog } from "~/components/providers/DialogProvider";
import type { CarDriverShift, DrivingLog } from "~/types";
import { useNow } from "~/hooks/useNow";

interface UseShiftStatusCardOptions {
  shift: CarDriverShift;
  currentDriving: DrivingLog | null;
  overdue?: boolean;
  /**
   * แจ้ง parent เมื่อสถานะการขับเปลี่ยน
   * - `log` = log ที่กำลัง active (กดเริ่มงาน) หรือ null (กดหยุดงาน)
   * - `endedLog` = log ที่เพิ่งปิดไปแล้ว ส่งมาเฉพาะตอนกดหยุดงาน
   *   เพื่อให้ parent อัปเดตประวัติได้ทันทีโดยไม่ต้องรอ fetch ใหม่
   */
  onCurrentDrivingChange: (
    log: DrivingLog | null,
    endedLog?: DrivingLog,
  ) => void;
}

/**
 * Start/stop behaviour for the driver's current shift card.
 *
 * Owns the API calls, the pending flags, the "confirm end" step and the 30s
 * elapsed-time ticker; the card itself is pure markup.
 */
export function useShiftStatusCard({
  shift,
  currentDriving,
  overdue = false,
  onCurrentDrivingChange,
}: UseShiftStatusCardOptions) {
  const { alert } = useDialog();

  const [isPending, setIsPending] = useState(false);
  const [isConfirmingEnd, setIsConfirmingEnd] = useState(false);

  const isDriving = currentDriving !== null;
  // live ticker — refresh elapsed time every 30s while driving
  const now = useNow(30_000, isDriving);

  const start = useCallback(async () => {
    setIsPending(true);
    const res = await startDriving(shift.id);
    setIsPending(false);
    if (res.success) {
      onCurrentDrivingChange(res.data.data);
    } else {
      alert({
        title: "เริ่มงานไม่สำเร็จ",
        description: res.error,
      });
    }
  }, [alert, onCurrentDrivingChange, shift.id]);

  const confirmEnd = useCallback(async () => {
    if (!currentDriving) return;
    setIsPending(true);
    const res = await endDriving(currentDriving.id);
    setIsPending(false);
    if (res.success) {
      onCurrentDrivingChange(null, res.data.data);
      setIsConfirmingEnd(false);
    } else {
      alert({
        title: "หยุดงานไม่สำเร็จ",
        description: res.error,
      });
    }
  }, [alert, currentDriving, onCurrentDrivingChange]);

  const requestEnd = useCallback(() => setIsConfirmingEnd(true), []);
  const cancelEnd = useCallback(() => setIsConfirmingEnd(false), []);

  const elapsedMs = currentDriving
    ? now - new Date(currentDriving.startedAt).getTime()
    : 0;

  return {
    isDriving,
    isPending,
    isConfirmingEnd,
    overdue,
    elapsedMs,
    startTime: new Date(shift.startTime),
    endTime: new Date(shift.endTime),
    routeName: shift.moreData.routeName ?? "ไม่ระบุสายรถ",
    carNumber: shift.moreData.carNumber ?? "-",
    start,
    confirmEnd,
    requestEnd,
    cancelEnd,
  };
}
