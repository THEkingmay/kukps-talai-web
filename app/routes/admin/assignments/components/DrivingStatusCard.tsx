import type { CarDriverShift, DrivingLog } from "~/types";

import { Card, CardContent } from "~/components/ui/card";

import { formatDate, formatElapsed } from "~/helper";

interface DrivingStatusCardProps {
  currentDriving: DrivingLog | null;
  currentShift: CarDriverShift | null;
  carNumberById: Map<string, string>;
  now: number;
}

export default function DrivingStatusCard({
  currentDriving,
  currentShift,
  carNumberById,
  now,
}: DrivingStatusCardProps) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {currentDriving ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <div>
                <p className="text-sm font-medium">กำลังขับอยู่</p>
                <p className="text-xs text-muted-foreground">
                  เริ่ม {formatDate(currentDriving.startedAt)}
                  {currentShift
                    ? ` · รถ ${carNumberById.get(currentShift.carId) ?? "-"}`
                    : ""}
                </p>
              </div>
            </>
          ) : (
            <>
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
              <div>
                <p className="text-sm font-medium">ไม่ได้อยู่ระหว่างการขับ</p>
                <p className="text-xs text-muted-foreground">
                  ยังไม่มีการกดเริ่มงานที่ค้างอยู่
                </p>
              </div>
            </>
          )}
        </div>
        {currentDriving && (
          <div className="text-left sm:text-right">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              ขับมาแล้ว
            </p>
            <p className="text-2xl font-medium tabular-nums tracking-tight">
              {formatElapsed(
                now - new Date(currentDriving.startedAt).getTime(),
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
