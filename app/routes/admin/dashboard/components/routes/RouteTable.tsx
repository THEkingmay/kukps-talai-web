import type { Route } from "~/types";
import { Eye, Pencil, Trash2, Route as RouteIcon, MapPin, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";

interface RouteTableProps {
  routes: Route[];
  filteredRoutes: Route[];
  isLoading: boolean;
  deletingId: string | null;
  onOpenDetail: (id: string) => void;
  onOpenEdit: (route: Route) => void;
  onOpenPoints: (route: Route) => void;
  onDelete: (route: Route) => void;
  formatDate: (isoString?: string | null) => string;
}

export default function RouteTable({
  routes,
  filteredRoutes,
  isLoading,
  deletingId,
  onOpenDetail,
  onOpenEdit,
  onOpenPoints,
  onDelete,
  formatDate,
}: RouteTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ลำดับ</TableHead>
            <TableHead>สายการเดินรถ</TableHead>
            <TableHead>รหัส (ID)</TableHead>
            <TableHead>อัปเดตล่าสุด</TableHead>
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
          ) : filteredRoutes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                ไม่พบข้อมูลสายการเดินรถที่ตรงกับเงื่อนไขการค้นหา
              </TableCell>
            </TableRow>
          ) : (
            filteredRoutes.map((route, index) => (
              <TableRow key={route.id}>
                <TableCell className="font-mono text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </TableCell>
                <TableCell>
                  <div 
                    className="font-bold text-foreground cursor-pointer hover:underline flex items-center gap-2"
                    onClick={() => onOpenDetail(route.id)}
                  >
                    <RouteIcon className="w-4 h-4 text-muted-foreground" />
                    {route.name}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {route.id}
                </TableCell>
                <TableCell>
                  <div className="text-xs text-foreground">{formatDate(route.updatedAt)}</div>
                  {route.updatedBy && (
                    <div className="text-[10px] text-muted-foreground font-mono">
                      โดย: {route.updatedBy}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="default"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onOpenDetail(route.id)}
                      title="ดูรายละเอียดสายรถ"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onOpenPoints(route)}
                      title="จัดการจุดจอด"
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onOpenEdit(route)}
                      title="แก้ไขชื่อสายรถ"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDelete(route)}
                      disabled={deletingId === route.id}
                      title="ลบสายการเดินรถ"
                    >
                      {deletingId === route.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground font-mono flex items-center justify-between">
        <span>
          แสดง {filteredRoutes.length} จาก {routes.length} เส้นทาง
        </span>
      </div>
    </div>
  );
}
