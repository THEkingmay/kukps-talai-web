import { useEffect, useState } from "react";
import Navbar from "~/components/layout/Navbar";
import { useAuth } from "~/components/providers/AuthProvider";
import { getByDriverId } from "~/actions/assignment-driver.action";
import type { CarDriverShift } from "~/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import {
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  isWithinInterval,
  format,
} from "date-fns";
import { th } from "date-fns/locale";
import { CalendarDays, Clock } from "lucide-react";
import Loading from "~/components/ui/Loading";
import { useDialog } from "~/components/providers/DialogProvider";
import ShiftStatusCard from "./components/shiftStatusCard";

export default function DriverDashboardPage() {
  const { user } = useAuth();
  const { alert } = useDialog();
  const [shifts, setShifts] = useState<CarDriverShift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const shiftsRes = await getByDriverId(user.id);

        if (shiftsRes.success) {
          setShifts(shiftsRes.data.data);
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
  const activeShift = activeShifts[0];

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

  // Monthly stats
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const shiftsThisMonth = shifts.filter((shift) =>
    isWithinInterval(new Date(shift.startTime), {
      start: monthStart,
      end: nextMonthStart,
    }),
  ).length;

  const ShiftCard = ({
    shift,
    status,
  }: {
    shift: CarDriverShift;
    status: "upcoming" | "past";
  }) => {
    const startTime = new Date(shift.startTime);
    const endTime = new Date(shift.endTime);

    // Check if it's a multi-day shift
    const isMultiDay =
      startTime.getDate() !== endTime.getDate() ||
      startTime.getMonth() !== endTime.getMonth() ||
      startTime.getFullYear() !== endTime.getFullYear();

    const timeLabel = isMultiDay
      ? `${format(startTime, "d MMM, HH:mm", { locale: th })} – ${format(endTime, "d MMM, HH:mm", { locale: th })}`
      : `${format(startTime, "HH:mm")} – ${format(endTime, "HH:mm")}`;

    const dateLabel =
      status === "upcoming"
        ? isToday(startTime)
          ? "วันนี้"
          : isTomorrow(startTime)
            ? "พรุ่งนี้"
            : format(startTime, "d MMM", { locale: th })
        : format(startTime, "d MMM", { locale: th });

    return (
      <Card className="shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">
                {shift.moreData.routeName || "ไม่ระบุสายรถ"}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                รถ {shift.moreData.carNumber ?? "-"} · {dateLabel}
              </div>
            </div>
            <div className="shrink-0 sm:text-right">
              <div className="text-sm font-medium tabular-nums text-foreground">
                {timeLabel}
              </div>
              {status === "past" && (
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  เสร็จสิ้น
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 px-4 pb-16 pt-8 md:px-8 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            ตารางงานของฉัน
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {format(now, "EEEE d MMMM yyyy", { locale: th })}
          </p>
        </div>

        {/* Active shift status + start/end action */}
        {activeShift && (
          <div className="mb-6">
            <ShiftStatusCard shift={activeShift} />
          </div>
        )}

        {/* Upcoming and History */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList
            variant="line"
            className="grid h-auto w-full grid-cols-2 gap-0 border-b border-border p-0"
          >
            <TabsTrigger value="upcoming">งานที่จะถึง</TabsTrigger>
            <TabsTrigger value="history">ประวัติย้อนหลัง</TabsTrigger>
          </TabsList>

          <TabsContent
            value="upcoming"
            className="space-y-8 outline-none animate-in fade-in-50 duration-300"
          >
            {Object.keys(groupedUpcoming).length > 0 ? (
              (
                Object.entries(groupedUpcoming) as [string, CarDriverShift[]][]
              ).map(([dateLabel, shiftsInDate]) => (
                <div key={dateLabel} className="space-y-4">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
            ) : !activeShift ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CalendarDays className="mb-3 h-5 w-5 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  คุณยังไม่มีงานที่กำลังจะถึง
                </p>
              </div>
            ) : null}
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
                    <div className="space-y-2">
                      {shiftsInMonth.map((shift) => (
                        <ShiftCard key={shift.id} shift={shift} status="past" />
                      ))}
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Clock className="mb-3 h-5 w-5 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
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
