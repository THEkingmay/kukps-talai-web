import type { CarDriverShift } from "~/types";
import ShiftSummaryCard from "./ShiftSummaryCard";

interface PastShiftsListProps {
  groupedShifts: Record<string, CarDriverShift[]>;
  logCountByShift: Map<string, number>;
  shiftsWithActiveLog: Set<string>;
}

/** "งานที่ผ่านมา" tab body: shifts grouped by month/year label. */
export default function PastShiftsList({
  groupedShifts,
  logCountByShift,
  shiftsWithActiveLog,
}: PastShiftsListProps) {
  return (
    <>
      {(Object.entries(groupedShifts) as [string, CarDriverShift[]][]).map(
        ([monthLabel, shiftsInMonth]) => (
          <div key={monthLabel} className="space-y-2">
            <h3 className="text-xs font-medium tracking-wide text-muted-foreground">
              {monthLabel}
            </h3>
            <div className="space-y-2">
              {shiftsInMonth.map((shift) => (
                <ShiftSummaryCard
                  key={shift.id}
                  shift={shift}
                  status="past"
                  logCount={logCountByShift.get(shift.id) ?? 0}
                  hasActiveLog={shiftsWithActiveLog.has(shift.id)}
                />
              ))}
            </div>
          </div>
        ),
      )}
    </>
  );
}
