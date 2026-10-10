import * as React from "react";
import { Link } from "react-router";
import { format, isBefore, isAfter } from "date-fns";
import { th } from "date-fns/locale";
import { MoreHorizontal, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Lock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { TableSkeleton } from "~/components/ui/Loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { CarDriverShift, User, ResponseCarData } from "~/types";
import { useDialog } from "~/components/providers/DialogProvider";

interface ExtendedShift extends CarDriverShift {
  driverObj?: User;
  carObj?: ResponseCarData;
}

type SortColumn = "driver" | "car" | "startTime" | "endTime" | "status";
type SortDirection = "asc" | "desc";

interface AssignmentDriverTableProps {
  assignments: ExtendedShift[];
  onEdit: (shift: CarDriverShift) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const formatThaiDate = (dateVal: Date | string) => {
  const d = new Date(dateVal);
  const dayMonth = format(d, "dd MMM", { locale: th });
  const year = d.getFullYear() + 543;
  const time = format(d, "HH:mm");
  return `${dayMonth} ${year}, ${time}`;
};

export function AssignmentDriverTable({
  assignments,
  onEdit,
  onDelete,
  isLoading,
}: AssignmentDriverTableProps) {
  const { confirm } = useDialog();
  const [sortColumn, setSortColumn] = React.useState<SortColumn>("startTime");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc");

  const getStatus = (start: Date, end: Date) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isBefore(now, startDate)) {
      return { label: "Upcoming", variant: "secondary" as const };
    } else if (isAfter(now, endDate)) {
      return { label: "Past", variant: "outline" as const };
    } else {
      return { label: "Active", variant: "default" as const };
    }
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedAssignments = React.useMemo(() => {
    return [...assignments].sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case "driver":
          comparison = (a.driverObj?.email || a.driverId).localeCompare(
            b.driverObj?.email || b.driverId
          );
          break;
        case "car":
          comparison = (a.carObj?.carNumber || a.carId).localeCompare(
            b.carObj?.carNumber || b.carId
          );
          break;
        case "startTime":
          comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          break;
        case "endTime":
          comparison = new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
          break;
        case "status": {
          const statusA = getStatus(a.startTime, a.endTime).label;
          const statusB = getStatus(b.startTime, b.endTime).label;
          comparison = statusA.localeCompare(statusB);
          break;
        }
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [assignments, sortColumn, sortDirection]);

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-foreground" />
    ) : (
      <ArrowDown className="h-4 w-4 text-foreground" />
    );
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "ยืนยันการลบ",
      description: "คุณต้องการลบการมอบหมายงานนี้ใช่หรือไม่?",
      confirmText: "ลบ",
      cancelText: "ยกเลิก",
      onConfirm: () => onDelete(id),
    });
  };

  const renderContent = (data: ExtendedShift[]) => {
    if (isLoading) {
      return (
        <TableSkeleton
          rowCount={5}
          columns={[
            { type: "text" },
            { type: "text" },
            { type: "text" },
            { type: "text" },
            { type: "badge" },
            { type: "actions", className: "text-right" },
          ]}
        />
      );
    }

    if (data.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={6}
            className="h-24 text-center text-muted-foreground"
          >
            ไม่พบข้อมูลการมอบหมายงาน
          </TableCell>
        </TableRow>
      );
    }

    return data.map((shift) => {
      const status = getStatus(shift.startTime, shift.endTime);
      let statusText = "";
      if (status.label === "Upcoming") statusText = "งานในอนาคต";
      else if (status.label === "Past") statusText = "งานจบไปแล้ว";
      else statusText = "งานปัจจุบัน";

      return (
        <TableRow key={shift.id}>
          <TableCell>
            <Link
              to={`/admin/assignments/${shift.driverId}`}
              className="font-bold text-foreground hover:underline"
            >
              {shift.driverObj?.email || shift.driverId}
            </Link>

            <div className="text-xs text-muted-foreground">
              ID: {shift.driverId.slice(0, 8)}...
            </div>
          </TableCell>
          <TableCell>
            <div className="font-medium">
              {shift.carObj?.carNumber || shift.carId}
            </div>
          </TableCell>
          <TableCell>{formatThaiDate(shift.startTime)}</TableCell>
          <TableCell>{formatThaiDate(shift.endTime)}</TableCell>
          <TableCell>
            <Badge variant={status.variant}>{statusText}</Badge>
          </TableCell>
          <TableCell align="right">
            <div className="flex items-center justify-end gap-1">
              {!shift.editOption.isEditable && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{shift.editOption.message}</TooltipContent>
                </Tooltip>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    disabled={!shift.editOption.isEditable}
                    onClick={() => onEdit(shift)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    แก้ไข
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!shift.editOption.isEditable}
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(shift.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    ลบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className="rounded-md border bg-background overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("driver")}>
              <div className="flex items-center gap-1">
                คนขับรถ
                <SortIcon column="driver" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("car")}>
              <div className="flex items-center gap-1">
                รถ (ป้ายทะเบียน)
                <SortIcon column="car" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("startTime")}>
              <div className="flex items-center gap-1">
                เวลาเริ่มงาน
                <SortIcon column="startTime" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("endTime")}>
              <div className="flex items-center gap-1">
                เวลาสิ้นสุด
                <SortIcon column="endTime" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("status")}>
              <div className="flex items-center gap-1">
                สถานะ
                <SortIcon column="status" />
              </div>
            </TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderContent(sortedAssignments)}</TableBody>
      </Table>
    </div>
  );
}
