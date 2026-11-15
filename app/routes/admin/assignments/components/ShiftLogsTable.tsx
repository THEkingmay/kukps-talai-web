import type { DrivingLog } from "~/types";

import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { formatDate, formatElapsed } from "~/helper";
import { logStatus } from "../hooks/helpers";

interface ShiftLogsTableProps {
  logs: DrivingLog[];
  now: number;
}

export default function ShiftLogsTable({ logs, now }: ShiftLogsTableProps) {
  return (
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
          {logs.map((log) => {
            const status = logStatus(log);
            const duration = log.endedAt
              ? new Date(log.endedAt).getTime() -
                new Date(log.startedAt).getTime()
              : now - new Date(log.startedAt).getTime();
            return (
              <TableRow key={log.id}>
                <TableCell className="text-muted-foreground">
                  {formatDate(log.startedAt)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {log.endedAt ? formatDate(log.endedAt) : "—"}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatElapsed(duration)}
                </TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
