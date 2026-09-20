import type { Route as RouteType } from "~/types";
import { Route as RouteIcon, Calendar, Clock, User, Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

interface RouteDetailModalProps {
  isOpen: boolean;
  route: RouteType | null;
  isLoading: boolean;
  onClose: () => void;
  formatDate: (isoString?: string | null) => string;
}

export default function RouteDetailModal({
  isOpen,
  route,
  isLoading,
  onClose,
  formatDate,
}: RouteDetailModalProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6 sm:p-8">
        <SheetHeader className="border-b pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <RouteIcon className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle>รายละเอียดเส้นทาง</SheetTitle>
              <SheetDescription className="font-mono text-xs">
                {route ? `ID: ${route.id}` : "Route Information"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mb-4 h-6 w-6 animate-spin" />
            <p>กำลังโหลดข้อมูลรายละเอียดเส้นทาง...</p>
          </div>
        ) : route ? (
          <div className="space-y-6">
            <div className="space-y-1 rounded-lg border bg-muted/30 p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                ชื่อสายการเดินรถ
              </span>
              <span className="block text-xl font-bold tracking-tight">
                {route.name}
              </span>
            </div>

            <div className="space-y-4 rounded-lg border p-4 font-mono text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> สร้างเมื่อ:
                </span>
                <span className="font-semibold">{formatDate(route.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" /> แก้ไขล่าสุด:
                </span>
                <span className="font-semibold">{formatDate(route.updatedAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" /> ผู้แก้ไขล่าสุด:
                </span>
                <span className="font-semibold">{route.updatedBy || "-"}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            ไม่พบข้อมูลเส้นทาง
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
