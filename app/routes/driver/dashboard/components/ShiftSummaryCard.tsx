import type { CarDriverShift } from "~/types";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { formatThaiDate, formatTimeWindow } from "~/helper";
import { BusFront } from "lucide-react";

const overdueBadgeClass =
  "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";

interface ShiftSummaryCardProps {
  shift: CarDriverShift;
  status: "upcoming" | "past";
  logCount: number;
  hasActiveLog: boolean;
}

/** One shift row inside the "งานถัดไป" / "งานที่ผ่านมา" tabs. */
export default function ShiftSummaryCard({
  shift,
  status,
  logCount,
  hasActiveLog,
}: ShiftSummaryCardProps) {
  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);

  const badge = hasActiveLog
    ? {
        label: "ยังไม่ปิดงาน",
        variant: "outline" as const,
        className: overdueBadgeClass,
      }
    : status === "past"
      ? {
          label: "เสร็จสิ้น",
          variant: "secondary" as const,
          className: undefined,
        }
      : {
          label: "รอเริ่ม",
          variant: "outline" as const,
          className: undefined,
        };

  return (
    <Card className="py-0 shadow-none">
      <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {shift.moreData.routeName || "ไม่ระบุสายรถ"}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground">
            <BusFront className="size-3.5 shrink-0" />
            <span>รถ {shift.moreData.carNumber ?? "-"}</span>
            {status === "past" && (
              <>
                <span aria-hidden="true">·</span>
                <span>{formatThaiDate(startTime)}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 sm:shrink-0 sm:flex-col sm:items-end sm:gap-1.5 sm:text-right">
          <p className="font-mono text-sm font-medium tabular-nums text-foreground">
            {formatTimeWindow(startTime, endTime)}
          </p>
          <div className="flex items-center gap-1.5">
            {status === "past" && logCount > 0 && (
              <span className="text-[11px] tabular-nums text-muted-foreground">
                กด {logCount} ครั้ง
              </span>
            )}
            <Badge variant={badge.variant} className={badge.className}>
              {badge.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
