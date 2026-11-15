import type { CarDriverShift } from "~/types";
import ShiftSummaryCard from "./ShiftSummaryCard";

interface UpcomingShiftsListProps {
  groupedShifts: Record<string, CarDriverShift[]>;
  logCountByShift: Map<string, number>;
  shiftsWithActiveLog: Set<string>;
}

/** "งานถัดไป" tab body: shifts grouped by day label. */
export default function UpcomingShiftsList({
  groupedShifts,
  logCountByShift,
  shiftsWithActiveLog,
}: UpcomingShiftsListProps) {
  return (
    <>
      {(Object.entries(groupedShifts) as [string, CarDriverShift[]][]).map(
        ([dateLabel, shiftsInDate]) => (
          <div key={dateLabel} className="space-y-2">
            <h3 className="text-xs font-medium tracking-wide text-muted-foreground">
              {dateLabel}
            </h3>
            <div className="space-y-2">
              {shiftsInDate.map((shift) => (
                <ShiftSummaryCard
                  key={shift.id}
                  shift={shift}
                  status="upcoming"
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
