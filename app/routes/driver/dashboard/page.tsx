import { useEffect, useState, type ReactNode } from "react";
import Navbar from "~/components/layout/Navbar";
import { useAuth } from "~/components/providers/AuthProvider";
import { getByDriverId } from "~/actions/assignment-driver.action";
import {
  getCurrentDriving,
  getMyLogs,
  type GetDrivingLogType,
} from "~/actions/driving-log.action";
import type { CarDriverShift, DrivingLog } from "~/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  isTomorrow,
  isWithinInterval,
} from "date-fns";
import { BusFront, CalendarDays, Clock, History } from "lucide-react";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  formatShiftWindow,
  formatThaiDate,
  formatThaiDay,
  formatThaiFullDate,
  formatThaiMonthYear,
  formatThaiTime,
  formatTimeWindow,
} from "~/helper";
import ShiftStatusCard, { formatElapsed } from "./components/shiftStatusCard";

const activeLogBadgeClass =
  "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
const overdueBadgeClass =
  "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";

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

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center sm:py-16">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-8 md:px-8">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="mb-6 h-60 w-full rounded-xl" />
        <Skeleton className="mb-4 h-11 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </main>
    </div>
  );
}

export default function DriverDashboardPage() {
  const { user } = useAuth();
  const { alert } = useDialog();
  const [shifts, setShifts] = useState<CarDriverShift[]>([]);
  const [currentDriving, setCurrentDriving] = useState<DrivingLog | null>(null);
  const [logs, setLogs] = useState<GetDrivingLogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [shiftsRes, currentRes, logsRes] = await Promise.all([
          getByDriverId(user.id),
          getCurrentDriving(),
          getMyLogs(),
        ]);

        if (shiftsRes.success) {
          setShifts(shiftsRes.data.data);
        }
        if (currentRes.success) {
          setCurrentDriving(currentRes.data.data);
        }
        if (logsRes.success) {
          setLogs(logsRes.data.data);
        }
      } catch {
        alert({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลตารางงานได้",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id, alert]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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
    .map(([shiftId, items]) => {
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

  const ShiftCard = ({
    shift,
    status,
  }: {
    shift: CarDriverShift;
    status: "upcoming" | "past";
  }) => {
    const startTime = new Date(shift.startTime);
    const endTime = new Date(shift.endTime);
    const logCount = logCountByShift.get(shift.id) ?? 0;
    const hasActiveLog = shiftsWithActiveLog.has(shift.id);

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
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-8 md:px-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            งานของฉัน
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatThaiFullDate(now)}
          </p>
        </div>

        {/* สถานะงานปัจจุบัน + ปุ่มเริ่ม/หยุดงาน */}
        {statusShift && (
          <div className="mb-6">
            <ShiftStatusCard
              key={statusShift.id}
              shift={statusShift}
              currentDriving={drivingShift ? currentDriving : null}
              overdue={isOverdue}
              onCurrentDrivingChange={setCurrentDriving}
            />
          </div>
        )}

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList
            variant="line"
            className="grid h-auto w-full grid-cols-3 gap-0 border-b border-border p-0 group-data-horizontal/tabs:h-auto"
          >
            <TabsTrigger
              value="upcoming"
              className="h-11 whitespace-normal text-center text-[13px] leading-tight sm:text-sm"
            >
              งานถัดไป
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="h-11 whitespace-normal text-center text-[13px] leading-tight sm:text-sm"
            >
              งานที่ผ่านมา
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="h-11 whitespace-normal text-center text-[13px] leading-tight sm:text-sm"
            >
              ประวัติการกด
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="upcoming"
            className="space-y-6 outline-none animate-in fade-in-50 duration-300"
          >
            {Object.keys(groupedUpcoming).length > 0 ? (
              (
                Object.entries(groupedUpcoming) as [string, CarDriverShift[]][]
              ).map(([dateLabel, shiftsInDate]) => (
                <div key={dateLabel} className="space-y-2">
                  <h3 className="text-xs font-medium tracking-wide text-muted-foreground">
                    {dateLabel}
                  </h3>
                  <div className="space-y-2">
                    {shiftsInDate.map((shift) => (
                      <ShiftCard
                        key={shift.id}
                        shift={shift}
                        status="upcoming"
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<CalendarDays className="size-5" />}
                title="ยังไม่มีงานถัดไป"
                description="ตารางงานใหม่จะแสดงที่นี่เมื่อผู้ดูแลมอบหมาย"
              />
            )}
          </TabsContent>

          <TabsContent
            value="history"
            className="space-y-6 outline-none animate-in fade-in-50 duration-300"
          >
            {Object.keys(groupedPast).length > 0 ? (
              (Object.entries(groupedPast) as [string, CarDriverShift[]][]).map(
                ([monthLabel, shiftsInMonth]) => (
                  <div key={monthLabel} className="space-y-2">
                    <h3 className="text-xs font-medium tracking-wide text-muted-foreground">
                      {monthLabel}
                    </h3>
                    <div className="space-y-2">
                      {shiftsInMonth.map((shift) => (
                        <ShiftCard key={shift.id} shift={shift} status="past" />
                      ))}
                    </div>
                  </div>
                ),
              )
            ) : (
              <EmptyState
                icon={<Clock className="size-5" />}
                title="ยังไม่มีงานที่ผ่านมา"
                description="งานที่จบแล้วจะแสดงที่นี่"
              />
            )}
          </TabsContent>

          <TabsContent
            value="logs"
            className="space-y-4 outline-none animate-in fade-in-50 duration-300"
          >
            {logGroups.length === 0 ? (
              <EmptyState
                icon={<History className="size-5" />}
                title="ยังไม่มีประวัติการกดงาน"
                description="เมื่อคุณกดเริ่มหรือหยุดงาน รายการจะแสดงที่นี่"
              />
            ) : (
              logGroups.map((group) => (
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
                            <Badge
                              variant={status.variant}
                              className={status.className}
                            >
                              {status.label}
                            </Badge>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
