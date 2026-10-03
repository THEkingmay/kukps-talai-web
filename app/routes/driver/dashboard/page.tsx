import { useEffect, useState } from "react";
import Navbar from "~/components/layout/Navbar";
import { useAuth } from "~/components/providers/AuthProvider";
import { getByDriverId } from "~/actions/assignment-driver.action";
import { getCars } from "~/actions/car.action";
import { getRoutes } from "~/actions/route.action";
import type { CarDriverShift, ResponseCarData, Route } from "~/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import {
  isAfter,
  isBefore,
  isWithinInterval,
  isToday,
  isTomorrow,
  format,
} from "date-fns";
import { th } from "date-fns/locale";
import {
  Car,
  Clock,
  CalendarDays,
  Route as RouteIcon,
  ArrowRight,
} from "lucide-react";
import Loading from "~/components/ui/Loading";
import { useDialog } from "~/components/providers/DialogProvider";
import { Badge } from "~/components/ui/badge";
import DrivingStartEndBtn from "./components/drivingStartEndBtn";

export default function DriverDashboardPage() {
  const { user } = useAuth();
  const { alert } = useDialog();
  const [shifts, setShifts] = useState<CarDriverShift[]>([]);
  const [cars, setCars] = useState<Record<string, ResponseCarData>>({});
  const [routes, setRoutes] = useState<Record<string, Route>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [shiftsRes, carsRes, routesRes] = await Promise.all([
          getByDriverId(user.id),
          getCars(),
          getRoutes(),
        ]);

        if (shiftsRes.success) {
          setShifts(shiftsRes.data.data);
        }

        if (carsRes.success) {
          const carMap: Record<string, ResponseCarData> = {};
          carsRes.data.data.forEach((car) => {
            carMap[car.id] = car;
          });
          setCars(carMap);
        }

        if (routesRes.success) {
          const routeMap: Record<string, Route> = {};
          routesRes.data.data.forEach((route) => {
            routeMap[route.id] = route;
          });
          setRoutes(routeMap);
        }
      } catch (error) {
        alert({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลตารางงานได้",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  const now = new Date();

  // กำลังทำงาน (Active)
  const activeShifts = shifts.filter((shift) =>
    isWithinInterval(now, {
      start: new Date(shift.startTime),
      end: new Date(shift.endTime),
    }),
  );

  // งานที่จะถึง (Upcoming)
  const upcomingShifts = shifts
    .filter((shift) => isAfter(new Date(shift.startTime), now))
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

  // ประวัติ (Past)
  const pastShifts = shifts
    .filter((shift) => isBefore(new Date(shift.endTime), now))
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );

  // Group upcoming by date
  const groupedUpcoming = upcomingShifts.reduce(
    (acc, shift) => {
      const d = new Date(shift.startTime);
      let key = "";
      if (isToday(d)) {
        key = "วันนี้";
      } else if (isTomorrow(d)) {
        key = "พรุ่งนี้";
      } else {
        key = format(d, "d MMM yyyy", { locale: th });
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(shift);
      return acc;
    },
    {} as Record<string, CarDriverShift[]>,
  );

  // Group past by month/year for history tab
  const groupedPast = pastShifts.reduce(
    (acc, shift) => {
      const d = new Date(shift.startTime);
      const key = format(d, "MMMM yyyy", { locale: th });
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
    status: "active" | "upcoming" | "past";
  }) => {
    const startTime = new Date(shift.startTime);
    const endTime = new Date(shift.endTime);
    const car = cars[shift.carId];
    const route = car?.routeId ? routes[car.routeId] : null;

    // Check if it's a multi-day shift
    const isMultiDay =
      startTime.getDate() !== endTime.getDate() ||
      startTime.getMonth() !== endTime.getMonth() ||
      startTime.getFullYear() !== endTime.getFullYear();

    return (
      <Card
        className={`overflow-hidden transition-all bg-card ${status === "active" ? "border-foreground/20 shadow-sm ring-1 ring-foreground/5" : "shadow-sm hover:border-foreground/20"}`}
      >
        <CardContent className="p-0">
          <div className="p-5 flex flex-col gap-4">
            {/* Header: Status and Route */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted border border-border/50">
                  <RouteIcon className="w-4 h-4 text-foreground/70" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    สายรถ
                  </span>
                  <span className="font-semibold text-foreground leading-tight">
                    {route?.name || "ไม่ระบุสายรถ"}
                  </span>
                </div>
              </div>

              {status === "active" && (
                <Badge className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border-emerald-500/20 shrink-0 shadow-none">
                  <span className="relative flex h-2 w-2 mr-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  กำลังทำงาน
                </Badge>
              )}
              {status === "past" && (
                <Badge
                  variant="outline"
                  className="text-muted-foreground shrink-0 shadow-none bg-muted/50 font-medium"
                >
                  เสร็จสิ้น
                </Badge>
              )}
            </div>

            <div className="h-px w-full bg-border/50" />

            {/* Content: Time and Car */}
            <div className="grid grid-cols-2 gap-4">
              {/* Time */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> เวลา
                </span>
                {isMultiDay ? (
                  <div className="text-sm font-medium text-foreground">
                    {format(startTime, "d MMM, HH:mm", { locale: th })} -{" "}
                    {format(endTime, "d MMM, HH:mm", { locale: th })}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">
                      {format(startTime, "HH:mm")}
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">
                      {format(endTime, "HH:mm")}
                    </span>
                    {status === "past" && (
                      <span className="text-xs text-muted-foreground ml-1 hidden sm:inline-block">
                        ({format(startTime, "d MMM", { locale: th })})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Car */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Car className="w-3 h-3" /> เลขประจำคันรถ
                </span>
                <span className="text-sm font-medium text-foreground">
                  {car?.carNumber || "-"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <DrivingStartEndBtn currentShift={activeShifts[0]} />
      <main className="flex-1 px-4 py-8 md:px-8 max-w-2xl mx-auto w-full">
        <div className="mb-8 flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            ตารางงานของฉัน
          </h1>
          <p className="text-sm text-muted-foreground">
            ดูเวลาการทำงาน ข้อมูลสายรถ และรถที่คุณได้รับมอบหมาย
          </p>
        </div>

        {/* Active Shift Hero Section */}
        {activeShifts.length > 0 && (
          <div className="mb-12 space-y-4">
            <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              กำลังดำเนินการ
            </h2>
            {activeShifts.map((shift) => (
              <ShiftCard key={shift.id} shift={shift} status="active" />
            ))}
          </div>
        )}

        {/* Tabs for Upcoming and Past */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">งานที่จะถึง</TabsTrigger>
            <TabsTrigger value="history">ประวัติย้อนหลัง</TabsTrigger>
          </TabsList>

          <TabsContent
            value="upcoming"
            className="space-y-8 outline-none animate-in fade-in-50 duration-300"
          >
            {Object.keys(groupedUpcoming).length > 0
              ? (
                  Object.entries(groupedUpcoming) as [
                    string,
                    CarDriverShift[],
                  ][]
                ).map(([dateLabel, shiftsInDate]) => (
                  <div key={dateLabel} className="space-y-4">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {dateLabel}
                    </h3>
                    <div className="space-y-3">
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
              : !activeShifts.length && (
                  <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg bg-muted/30">
                    <CalendarDays className="h-8 w-8 text-muted-foreground/40 mb-3" />
                    <h3 className="text-sm font-medium text-foreground">
                      ไม่มีงานที่กำลังจะถึง
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                      คุณยังไม่ได้รับการมอบหมายงานในอนาคต
                    </p>
                  </div>
                )}
          </TabsContent>

          <TabsContent
            value="history"
            className="space-y-8 outline-none animate-in fade-in-50 duration-300"
          >
            {Object.keys(groupedPast).length > 0 ? (
              (Object.entries(groupedPast) as [string, CarDriverShift[]][]).map(
                ([monthLabel, shiftsInMonth]) => (
                  <div key={monthLabel} className="space-y-4">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {monthLabel}
                    </h3>
                    <div className="space-y-3">
                      {shiftsInMonth.map((shift) => (
                        <ShiftCard key={shift.id} shift={shift} status="past" />
                      ))}
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg bg-muted/30">
                <Clock className="h-8 w-8 text-muted-foreground/40 mb-3" />
                <h3 className="text-sm font-medium text-foreground">
                  ไม่มีประวัติการทำงาน
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  งานที่จบไปแล้วจะแสดงที่นี่
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
