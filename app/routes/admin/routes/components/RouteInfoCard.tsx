import type { Route as RouteType } from "~/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatDate } from "~/helper";

interface RouteInfoCardProps {
  route: RouteType;
}

/** Read-only metadata of a single route. */
export default function RouteInfoCard({ route }: RouteInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ข้อมูลสายการเดินรถ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y text-sm">
          <div className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-muted-foreground">ชื่อสายการเดินรถ</span>
            <span className="truncate pl-4 font-semibold">{route.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-muted-foreground">รหัส (ID)</span>
            <span className="truncate pl-4 font-mono font-semibold">
              {route.id}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-muted-foreground">สร้างเมื่อ</span>
            <span className="font-semibold">{formatDate(route.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-muted-foreground">แก้ไขล่าสุด</span>
            <span className="font-semibold">{formatDate(route.updatedAt)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-muted-foreground">ผู้แก้ไขล่าสุด</span>
            <span className="font-mono font-semibold">
              {route.updatedBy || "-"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
