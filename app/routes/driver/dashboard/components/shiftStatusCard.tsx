import { useEffect, useState } from "react";
import {
  endDriving,
  getCurrentDriving,
  startDriving,
} from "~/actions/driving-log.action";
import type {
  CarDriverShift,
  DrivingLog,
  ResponseCarData,
  Route,
} from "~/types";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useDialog } from "~/components/providers/DialogProvider";
import { formatDate } from "~/helper";
import { format } from "date-fns";
import { Loader2, OctagonX, Play } from "lucide-react";

export function formatElapsed(ms: number) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours} ชม. ${minutes} นาที`;
  return `${minutes} นาที`;
}

interface ShiftStatusCardProps {
  shift: CarDriverShift;
  car?: ResponseCarData;
  route?: Route;
}

export default function ShiftStatusCard({
  shift,
  car,
  route,
}: ShiftStatusCardProps) {
  const { alert } = useDialog();
  const [currentDriving, setCurrentDriving] = useState<DrivingLog | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isConfirmingEnd, setIsConfirmingEnd] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const isDriving = !!currentDriving;

  useEffect(() => {
    const fetchCurrentDriving = async () => {
      try {
        const res = await getCurrentDriving();
        if (res.success) {
          setCurrentDriving(res.data.data);
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchCurrentDriving();
  }, []);

  // live ticker — refresh elapsed time every 30s while driving
  useEffect(() => {
    if (!isDriving) return;
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, [isDriving]);

  const handleStart = async () => {
    setIsPending(true);
    const res = await startDriving(shift.id);
    setIsPending(false);
    if (res.success) {
      setCurrentDriving(res.data.data);
      setNow(Date.now());
    } else {
      alert({
        title: "เริ่มงานไม่สำเร็จ",
        description: res.error,
      });
    }
  };

  const handleEndConfirm = async () => {
    if (!currentDriving) return;
    setIsPending(true);
    const res = await endDriving(currentDriving.id);
    setIsPending(false);
    if (res.success) {
      setCurrentDriving(null);
      setIsConfirmingEnd(false);
    } else {
      alert({
        title: "หยุดงานไม่สำเร็จ",
        description: res.error,
      });
    }
  };

  const elapsedMs = currentDriving
    ? now - new Date(currentDriving.startedAt).getTime()
    : 0;

  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);

  return (
    <Card
      className={
        isDriving
          ? "border-emerald-500/30 shadow-sm ring-1 ring-emerald-500/20"
          : "shadow-none"
      }
    >
      <CardContent className="hidden md:inline p-5">
        {/* Status row */}
        <div className="flex items-center justify-between gap-3">
          {isDriving ? (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                กำลังเดินทาง
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
          <span className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
            <span className="sm:inline">
              {formatDate(startTime)} - {formatDate(endTime)}
            </span>
          </span>
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          {route?.name ?? "ไม่ระบุสายรถ"} · รถ {car?.carNumber ?? "-"}
        </div>

        {/* Live elapsed time */}
        {isDriving && (
          <div className="mt-4">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              ขับมาแล้ว
            </div>
            <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
              {formatElapsed(elapsedMs)}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="mt-4">
          {isFetching ? (
            <Button size="lg" className="h-11 w-full" disabled>
              <Loader2 className="animate-spin" /> กำลังโหลด...
            </Button>
          ) : isDriving ? (
            isConfirmingEnd ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-sm text-foreground">
                  คุณขับมาแล้ว {formatElapsed(elapsedMs)} — จะหยุดงานตอนนี้ ไหม?
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="destructive"
                    className="h-11 flex-1"
                    onClick={handleEndConfirm}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <OctagonX />
                    )}{" "}
                    หยุดงาน
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-11 flex-1"
                    onClick={() => setIsConfirmingEnd(false)}
                    disabled={isPending}
                  >
                    ยกเลิก
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="h-11 w-full"
                onClick={() => setIsConfirmingEnd(true)}
              >
                <OctagonX /> หยุดงาน
              </Button>
            )
          ) : (
            <Button
              size="lg"
              className="h-11 w-full"
              onClick={handleStart}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Play />}{" "}
              เริ่มงาน
            </Button>
          )}
        </div>
      </CardContent>
      <CardContent className="inline md:hidden p-5">
        {/* Status row */}
        <div className="flex flex-col items-center justify-between gap-3">
          {isDriving ? (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                กำลังเดินทาง
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
          <span className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
            <span className="sm:inline">
              {formatDate(startTime)} - {formatDate(endTime)}
            </span>
          </span>
        </div>

        <div className="mt-1 text-xs text-center text-muted-foreground">
          {route?.name ?? "ไม่ระบุสายรถ"} · รถ {car?.carNumber ?? "-"}
        </div>

        {/* Live elapsed time */}
        {isDriving && (
          <div className="mt-4 text-center">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              ขับมาแล้ว
            </div>
            <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
              {formatElapsed(elapsedMs)}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="mt-4">
          {isFetching ? (
            <Button size="lg" className="h-11 w-full" disabled>
              <Loader2 className="animate-spin" /> กำลังโหลด...
            </Button>
          ) : isDriving ? (
            isConfirmingEnd ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-sm text-foreground">
                  คุณขับมาแล้ว {formatElapsed(elapsedMs)} — จะหยุดงานตอนนี้ ไหม?
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="destructive"
                    className="h-11 flex-1"
                    onClick={handleEndConfirm}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <OctagonX />
                    )}{" "}
                    หยุดงาน
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-11 flex-1"
                    onClick={() => setIsConfirmingEnd(false)}
                    disabled={isPending}
                  >
                    ยกเลิก
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="h-11 w-full"
                onClick={() => setIsConfirmingEnd(true)}
              >
                <OctagonX /> หยุดงาน
              </Button>
            )
          ) : (
            <Button
              size="lg"
              className="h-11 w-full"
              onClick={handleStart}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Play />}{" "}
              เริ่มงาน
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
