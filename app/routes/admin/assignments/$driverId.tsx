import { Link } from "react-router";
import { SearchX } from "lucide-react";

import { Button } from "~/components/ui/button";
import { VercelSpinner } from "~/components/ui/Loading";

import DriverHeader from "./components/DriverHeader";
import DrivingStatusCard from "./components/DrivingStatusCard";
import ShiftAssignmentsTable from "./components/ShiftAssignmentsTable";
import { useDriverAssignments } from "./hooks/useDriverAssignments";

export function meta() {
  return [
    { title: "ประวัติการมอบหมายงานคนขับ — KUKPS smart talai" },
    {
      name: "description",
      content: "งานทั้งหมดและประวัติการกดเริ่ม–หยุดงานของคนขับ",
    },
  ];
}

export default function DriverAssignmentsPage() {
  const assignments = useDriverAssignments();

  if (assignments.isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
        <VercelSpinner />
        <p className="text-sm font-medium text-muted-foreground">
          กำลังโหลดข้อมูลคนขับ...
        </p>
      </div>
    );
  }

  if (assignments.loadError || !assignments.driver) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">
          ไม่พบข้อมูลคนขับ
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {assignments.loadError ?? "ไม่พบคนขับคนนี้ในระบบ"}
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link to="/admin/assignments">กลับหน้ารายการมอบหมายงาน</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <DriverHeader
        driver={assignments.driver}
        name={assignments.driverName}
        initials={assignments.driverInitials}
      />

      <DrivingStatusCard
        currentDriving={assignments.currentDriving}
        currentShift={assignments.currentShift}
        carNumberById={assignments.carNumberById}
        now={assignments.now}
      />

      <ShiftAssignmentsTable
        shifts={assignments.shifts}
        visibleShifts={assignments.visibleShifts}
        carNumberById={assignments.carNumberById}
        logsByShift={assignments.logsByShift}
        now={assignments.now}
        search={assignments.search}
        onSearchChange={assignments.setSearch}
        sortDesc={assignments.sortDesc}
        onToggleSort={assignments.toggleSort}
        expanded={assignments.expanded}
        onToggleExpanded={assignments.toggleExpanded}
      />
    </div>
  );
}
