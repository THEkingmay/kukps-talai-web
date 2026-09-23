import * as React from "react"
import { format, isBefore, isAfter } from "date-fns"
import { th } from "date-fns/locale"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import type { CarDriverShift, User, ResponseCarData } from "~/types"
import { useDialog } from "~/components/providers/DialogProvider"

interface ExtendedShift extends CarDriverShift {
  driverObj?: User;
  carObj?: ResponseCarData;
}

interface AssignmentDriverTableProps {
  assignments: ExtendedShift[];
  onEdit: (shift: CarDriverShift) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const formatThaiDate = (dateVal: Date | string) => {
  const d = new Date(dateVal)
  const dayMonth = format(d, "dd MMM", { locale: th })
  const year = d.getFullYear() + 543
  const time = format(d, "HH:mm")
  return `${dayMonth} ${year}, ${time}`
}

export function AssignmentDriverTable({
  assignments,
  onEdit,
  onDelete,
  isLoading
}: AssignmentDriverTableProps) {
  const { confirm } = useDialog()

  const getStatus = (start: Date, end: Date) => {
    const now = new Date()
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    if (isBefore(now, startDate)) {
      return { label: "Upcoming", variant: "secondary" as const }
    } else if (isAfter(now, endDate)) {
      return { label: "Past", variant: "outline" as const }
    } else {
      return { label: "Active", variant: "default" as const }
    }
  }

  const handleDelete = (id: string) => {
    confirm({
      title: "ยืนยันการลบ",
      description: "คุณต้องการลบการมอบหมายงานนี้ใช่หรือไม่?",
      confirmText: "ลบ",
      cancelText: "ยกเลิก",
      onConfirm: () => onDelete(id)
    })
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">กำลังโหลดข้อมูล...</div>
  }

  if (assignments.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">ไม่พบข้อมูลการมอบหมายงาน</div>
  }

  return (
    <div className="rounded-md border bg-background overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>คนขับรถ</TableHead>
            <TableHead>รถ (ป้ายทะเบียน)</TableHead>
            <TableHead>เวลาเริ่มงาน</TableHead>
            <TableHead>เวลาสิ้นสุด</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((shift) => {
            const status = getStatus(shift.startTime, shift.endTime)
            let statusText = ""
            if (status.label === "Upcoming") statusText = "งานในอนาคต"
            else if (status.label === "Past") statusText = "จบไปแล้ว"
            else statusText = "กำลังทำงาน"
            
            return (
              <TableRow key={shift.id}>
                <TableCell>
                  <div className="font-medium">{shift.driverObj?.email || shift.driverId}</div>
                  <div className="text-xs text-muted-foreground">ID: {shift.driverId.slice(0, 8)}...</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{shift.carObj?.carNumber || shift.carId}</div>
                </TableCell>
                <TableCell>{formatThaiDate(shift.startTime)}</TableCell>
                <TableCell>{formatThaiDate(shift.endTime)}</TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{statusText}</Badge>
                </TableCell>
                <TableCell align="right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(shift)}>
                        <Edit className="mr-2 h-4 w-4" />
                        แก้ไข
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(shift.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        ลบ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
