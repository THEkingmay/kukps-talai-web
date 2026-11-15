import Navbar from "~/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { formatThaiFullDate } from "~/helper";
import { CalendarDays, Clock, History } from "lucide-react";
import ShiftStatusCard from "./components/shiftStatusCard";
import DashboardEmptyState from "./components/DashboardEmptyState";
import DashboardSkeleton from "./components/DashboardSkeleton";
import DrivingLogGroups from "./components/DrivingLogGroups";
import PastShiftsList from "./components/PastShiftsList";
import UpcomingShiftsList from "./components/UpcomingShiftsList";
import { useDriverDashboard } from "./hooks/useDriverDashboard";

export default function DriverDashboardPage() {
  const {
    isLoading,
    now,
    currentDriving,
    drivingShift,
    statusShift,
    isOverdue,
    handleCurrentDrivingChange,
    logCountByShift,
    shiftsWithActiveLog,
    logGroups,
    groupedUpcoming,
    groupedPast,
  } = useDriverDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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
              onCurrentDrivingChange={handleCurrentDrivingChange}
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
              <UpcomingShiftsList
                groupedShifts={groupedUpcoming}
                logCountByShift={logCountByShift}
                shiftsWithActiveLog={shiftsWithActiveLog}
              />
            ) : (
              <DashboardEmptyState
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
              <PastShiftsList
                groupedShifts={groupedPast}
                logCountByShift={logCountByShift}
                shiftsWithActiveLog={shiftsWithActiveLog}
              />
            ) : (
              <DashboardEmptyState
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
              <DashboardEmptyState
                icon={<History className="size-5" />}
                title="ยังไม่มีประวัติการกดงาน"
                description="เมื่อคุณกดเริ่มหรือหยุดงาน รายการจะแสดงที่นี่"
              />
            ) : (
              <DrivingLogGroups logGroups={logGroups} now={now} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
