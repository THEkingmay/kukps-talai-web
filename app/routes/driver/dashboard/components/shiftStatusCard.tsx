import type { CarDriverShift, DrivingLog } from "~/types";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  formatElapsed,
  formatShiftWindow,
  formatThaiTime,
} from "~/helper";
import { useShiftStatusCard } from "~/routes/driver/dashboard/hooks/useShiftStatusCard";
import {
  BusFront,
  Loader2,
  OctagonX,
  Play,
  Route,
  TriangleAlert,
} from "lucide-react";

interface ShiftStatusCardProps {
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

export default function ShiftStatusCard({
  shift,
  currentDriving,
  overdue = false,
  onCurrentDrivingChange,
}: ShiftStatusCardProps) {
  const {
    isDriving,
    isPending,
    isConfirmingEnd,
    elapsedMs,
    startTime,
    endTime,
    routeName,
    carNumber,
    start,
    confirmEnd,
    requestEnd,
    cancelEnd,
  } = useShiftStatusCard({
    shift,
    currentDriving,
    overdue,
    onCurrentDrivingChange,
  });

  return (
    <Card className="py-0 shadow-none">
      <CardContent className="p-4 sm:p-5">
        {/* Status row */}
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          {isDriving ? (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-foreground">
                กำลังขับอยู่
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
              <span className="text-sm font-medium text-foreground">
                พร้อมเริ่มงาน
              </span>
            </div>
          )}
          <span className="text-xs tabular-nums text-muted-foreground sm:text-sm">
            {formatShiftWindow(startTime, endTime)}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <Route className="size-3.5 shrink-0" />
            <span className="truncate">{routeName}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BusFront className="size-3.5 shrink-0" />
            รถ {carNumber}
          </span>
        </div>

        {overdue && isDriving && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              กะนี้เลยเวลาสิ้นสุดแล้ว แต่ยังไม่ได้กดหยุดงาน —
              กรุณากดหยุดงานเพื่อปิดรายการ
            </span>
          </div>
        )}

        {currentDriving ? (
          <>
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  ขับมาแล้ว
                </span>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  เริ่ม {formatThaiTime(currentDriving.startedAt)}
                </span>
              </div>
              <div className="mt-1 text-3xl font-medium tracking-tight tabular-nums text-foreground sm:text-4xl">
                {formatElapsed(elapsedMs)}
              </div>
            </div>

            {isConfirmingEnd ? (
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground">
                  จะหยุดงานตอนนี้ไหม?
                </p>
                <div className="mt-2.5 flex gap-2">
                  <Button
                    variant="outline"
                    className="h-11 flex-1"
                    onClick={cancelEnd}
                    disabled={isPending}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    variant="destructive"
                    className="h-11 flex-1"
                    onClick={confirmEnd}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <OctagonX />
                    )}
                    หยุดงาน
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="mt-4 h-11 w-full"
                onClick={requestEnd}
              >
                <OctagonX />
                หยุดงาน
              </Button>
            )}
          </>
        ) : (
          <div className="mt-4 border-t pt-4">
            <Button
              size="lg"
              className="h-11 w-full"
              onClick={start}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Play />}
              เริ่มงาน
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
