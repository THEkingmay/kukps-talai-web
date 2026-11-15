import { Fragment } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react";

import type { CarDriverShift, DrivingLog } from "~/types";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { formatDate } from "~/helper";
import { shiftStatus } from "../hooks/helpers";
import ShiftLogsTable from "./ShiftLogsTable";

interface ShiftAssignmentsTableProps {
  shifts: CarDriverShift[];
  visibleShifts: CarDriverShift[];
  carNumberById: Map<string, string>;
  logsByShift: Map<string, DrivingLog[]>;
  now: number;
  search: string;
  onSearchChange: (value: string) => void;
  sortDesc: boolean;
  onToggleSort: () => void;
  expanded: Set<string>;
  onToggleExpanded: (id: string) => void;
}

export default function ShiftAssignmentsTable({
  shifts,
  visibleShifts,
  carNumberById,
  logsByShift,
  now,
  search,
  onSearchChange,
  sortDesc,
  onToggleSort,
  expanded,
  onToggleExpanded,
}: ShiftAssignmentsTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">งานทั้งหมด</h2>
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
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="ค้นหาเลขรถ หรือวันที่..."
              className="w-full pl-8 sm:w-64"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={onToggleSort}
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
                      onClick={() => onToggleExpanded(shift.id)}
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
                            onToggleExpanded(shift.id);
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
                              <ShiftLogsTable logs={shiftLogs} now={now} />
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
  );
}
