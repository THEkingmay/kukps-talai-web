import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { isAfter, isBefore } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Phone,
  Search,
  SearchX,
} from "lucide-react";

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

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TableSkeleton, VercelSpinner } from "~/components/ui/Loading";

import { formatDate } from "~/helper";
import { formatElapsed } from "~/routes/driver/dashboard/components/shiftStatusCard";
import { useAdminShell } from "../shell/ShellContext";

export function meta() {
  return [
    { title: "ประวัติการมอบหมายงานคนขับ — KUKPS smart talai" },
    {
      name: "description",
      content: "งานทั้งหมดและประวัติการกดเริ่ม–หยุดงานของคนขับ",
    },
  ];
}

const driverName = (user: User) => {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.email;
};

const driverInitials = (user: User) => {
  const first = (user.firstName ?? "").trim().charAt(0);
  const last = (user.lastName ?? "").trim().charAt(0);
  return (first + last || user.email.charAt(0)).toUpperCase();
};

const shiftStatus = (start: Date | string, end: Date | string) => {
  const now = new Date();
  if (isBefore(now, new Date(start))) {
    return { label: "งานในอนาคต", variant: "secondary" as const };
  }
  if (isAfter(now, new Date(end))) {
    return { label: "งานสิ้นสุดแล้ว", variant: "outline" as const };
  }
  return { label: "กำลังดำเนินอยู่", variant: "default" as const };
};

const logStatus = (log: DrivingLog) =>
  log.status === "active"
    ? { label: "กำลังขับ", variant: "default" as const }
    : { label: "สิ้นสุดแล้ว", variant: "outline" as const };

export default function DriverAssignmentsPage() {
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
  const [now, setNow] = useState(() => Date.now());

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
    setBreadcrumb(driver ? driverName(driver) : null);
    return () => setBreadcrumb(null);
  }, [driver, setBreadcrumb]);

  // live ticker — refresh elapsed time every 30s while a log is active
  useEffect(() => {
    if (!currentDriving) return;
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, [currentDriving]);

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

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const currentShift = currentDriving
    ? (shifts.find((shift) => shift.id === currentDriving.shiftId) ?? null)
    : null;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
        <VercelSpinner />
        <p className="text-sm font-medium text-muted-foreground">
          กำลังโหลดข้อมูลคนขับ...
        </p>
      </div>
    );
  }

  if (loadError || !driver) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">
          ไม่พบข้อมูลคนขับ
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {loadError ?? "ไม่พบคนขับคนนี้ในระบบ"}
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link to="/admin/assignments">กลับหน้ารายการมอบหมายงาน</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar size="lg">
          <AvatarImage
            src={driver.profileImageUrl ?? undefined}
            alt={driverName(driver)}
          />
          <AvatarFallback>{driverInitials(driver)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">
            {driverName(driver)}
          </h1>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="truncate">{driver.email}</span>
            {driver.phoneNumber && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {driver.phoneNumber}
              </span>
            )}
          </div>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 self-start sm:self-auto"
        >
          <Link to="/admin/assignments">← กลับรายการมอบหมายงาน</Link>
        </Button>
      </div>

      {/* Current driving status */}
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

      {/* Assignments */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              งานทั้งหมด
            </h2>
            <p className="text-sm text-muted-foreground">
              ทั้งหมด {shifts.length} งาน
              {search.trim() ? ` · แสดง ${visibleShifts.length}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ค้นหาเลขรถ หรือวันที่..."
                className="w-full pl-8 sm:w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0"
              onClick={() => setSortDesc((prev) => !prev)}
            >
              {sortDesc ? (
                <ArrowDown className="h-3.5 w-3.5" />
              ) : (
                <ArrowUp className="h-3.5 w-3.5" />
              )}
              {sortDesc ? "ล่าสุด" : "เก่าสุด"}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]" />
                <TableHead>รถ (ป้ายทะเบียน)</TableHead>
                <TableHead>เวลาเริ่มงาน</TableHead>
                <TableHead>เวลาสิ้นสุด</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">ประวัติเริ่ม–หยุด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleShifts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {search.trim()
                      ? "ไม่พบงานที่ตรงกับคำค้นหา"
                      : "ไม่พบข้อมูลการมอบหมายงาน"}
                  </TableCell>
                </TableRow>
              ) : (
                visibleShifts.map((shift) => {
                  const status = shiftStatus(shift.startTime, shift.endTime);
                  const shiftLogs = logsByShift.get(shift.id) ?? [];
                  const isOpen = expanded.has(shift.id);

                  return (
                    <Fragment key={shift.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => toggleExpanded(shift.id)}
                      >
                        <TableCell className="pr-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            aria-label={
                              isOpen ? "ย่อประวัติ" : "ดูประวัติการขับ"
                            }
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleExpanded(shift.id);
                            }}
                          >
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                          {carNumberById.get(shift.carId) ?? shift.carId}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(shift.startTime)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(shift.endTime)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {shiftLogs.length > 0 ? (
                            <Badge variant="secondary">
                              {shiftLogs.length} ครั้ง
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                      </TableRow>

                      {isOpen && (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={6} className="bg-muted/30 p-0">
                            <div className="px-4 py-3">
                              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                ประวัติการกดเริ่ม–หยุดงาน ({shift.id})
                              </p>
                              {shiftLogs.length === 0 ? (
                                <p className="py-2 text-sm text-muted-foreground">
                                  ยังไม่มีบันทึกการเริ่มงานสำหรับงานนี้
                                </p>
                              ) : (
                                <div className="overflow-hidden rounded-md border bg-background">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>เริ่มงาน</TableHead>
                                        <TableHead>หยุดงาน</TableHead>
                                        <TableHead>ระยะเวลา</TableHead>
                                        <TableHead>สถานะ</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {shiftLogs.map((log) => {
                                        const status = logStatus(log);
                                        const duration = log.endedAt
                                          ? new Date(log.endedAt).getTime() -
                                            new Date(log.startedAt).getTime()
                                          : now -
                                            new Date(log.startedAt).getTime();
                                        return (
                                          <TableRow key={log.id}>
                                            <TableCell className="text-muted-foreground">
                                              {formatDate(log.startedAt)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                              {log.endedAt
                                                ? formatDate(log.endedAt)
                                                : "—"}
                                            </TableCell>
                                            <TableCell className="tabular-nums">
                                              {formatElapsed(duration)}
                                            </TableCell>
                                            <TableCell>
                                              <Badge variant={status.variant}>
                                                {status.label}
                                              </Badge>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
