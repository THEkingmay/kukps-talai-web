import type { DrivingLog } from "~/types";
import { Badge } from "~/components/ui/badge";
import {
  formatElapsed,
  formatShiftWindow,
  formatThaiDate,
  formatThaiTime,
} from "~/helper";
import { isSameDay } from "date-fns";
import type { DriverDashboardLogGroup } from "../hooks/useDriverDashboard";

const activeLogBadgeClass =
  "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";

const logStatus = (log: DrivingLog) =>
  log.status === "active"
    ? {
        label: "กำลังขับ",
        variant: "outline" as const,
        className: activeLogBadgeClass,
      }
    : {
        label: "สิ้นสุดแล้ว",
        variant: "secondary" as const,
        className: undefined,
      };

interface DrivingLogGroupsProps {
  logGroups: DriverDashboardLogGroup[];
  now: Date;
}

/** "ประวัติการกด" tab body: one card per shift with its start/end log rows. */
export default function DrivingLogGroups({
  logGroups,
  now,
}: DrivingLogGroupsProps) {
  return (
    <>
      {logGroups.map((group) => (
        <div
          key={group.shiftId}
          className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
        >
          <div className="flex items-start justify-between gap-3 border-b bg-muted/30 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {group.routeName ?? "ไม่ระบุสายรถ"}
              </p>
              <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                รถ {group.carNumber ?? "-"} ·{" "}
                {formatShiftWindow(group.startTime, group.endTime)}
              </p>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {group.logs.length} ครั้ง
            </Badge>
          </div>

          <ul className="divide-y">
            {group.logs.map(({ log }) => {
              const start = new Date(log.startedAt);
              const end = log.endedAt ? new Date(log.endedAt) : null;
              const duration = end
                ? end.getTime() - start.getTime()
                : now.getTime() - start.getTime();
              const status = logStatus(log);
              const showDate =
                !isSameDay(start, group.startTime) ||
                (end !== null && !isSameDay(start, end));

              return (
                <li
                  key={log.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm tabular-nums text-foreground">
                      {formatThaiTime(start)} –{" "}
                      {end ? formatThaiTime(end) : "ปัจจุบัน"}
                    </p>
                    {showDate && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatThaiDate(start)}
                        {end && ` – ${formatThaiDate(end)}`}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {formatElapsed(duration)}
                    </span>
                    <Badge variant={status.variant} className={status.className}>
                      {status.label}
                    </Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
