import type { ResponseCarData } from "~/types";
import {
  Bus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  KeyRound,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface CarTableProps {
  cars: ResponseCarData[];
  filteredCars: ResponseCarData[];
  routeNameMap: Record<string, string>;
  isLoading: boolean;
  deletingId: string | null;
  onOpenDetail: (id: string) => void;
  onOpenEdit: (car: ResponseCarData) => void;
  onDelete: (car: ResponseCarData) => void;
  onOpenCredential: (id: string) => void;
}

export default function CarTable({
  cars,
  filteredCars,
  routeNameMap,
  isLoading,
  deletingId,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  onOpenCredential,
}: CarTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>หมายเลขรถ / ID</TableHead>
            <TableHead>สายการเดินรถ</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead>แก้ไขโดย</TableHead>
            <TableHead className="text-right">การจัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="mb-2 h-6 w-6 animate-spin" />
                  <span>กำลังโหลดข้อมูล...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredCars.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                ไม่พบข้อมูลรถตะไลที่ตรงกับเงื่อนไขการค้นหา
              </TableCell>
            </TableRow>
          ) : (
            filteredCars.map((car) => {
              const routeName = car.routeId
                ? routeNameMap[car.routeId] || `สาย: ${car.routeId}`
                : "ยังไม่ได้ระบุสาย";

              return (
                <TableRow key={car.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-muted text-muted-foreground flex items-center justify-center border shrink-0">
                        <Bus className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div
                          className="font-bold text-foreground cursor-pointer hover:underline"
                          onClick={() => onOpenDetail(car.id)}
                        >
                          {car.carNumber}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          ID: {car.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={routeName}>
                    {car.routeId ? (
                      <Badge variant="secondary" className="font-mono text-xs">
                        {routeName}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">{routeName}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <CarStatusBadge status={car.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {car.updatedBy || "System"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="default"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onOpenDetail(car.id)}
                        title="ดูรายละเอียดทั้งหมด"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onOpenCredential(car.id)}
                        title="ดู MQTT Credentials"
                      >
                        <KeyRound className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onOpenEdit(car)}
                        title="แก้ไขข้อมูลรถ"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onDelete(car)}
                        disabled={deletingId === car.id}
                        title="ลบรถตะไล"
                      >
                        {deletingId === car.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground font-mono flex items-center justify-between">
        <span>
          แสดง {filteredCars.length} จาก {cars.length} คัน
        </span>
      </div>
    </div>
  );
}

function CarStatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
        <CheckCircle2 className="w-3 h-3 animate-pulse" />
        พร้อมใช้งาน
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground gap-1">
      <XCircle className="w-3 h-3" />
      ปิดใช้งาน
    </Badge>
  );
}
