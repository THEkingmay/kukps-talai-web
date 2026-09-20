import { lazy, Suspense } from "react";
import type { ResponseCarData } from "~/types";
import {
  Info,
  Bus,
  Calendar,
  Clock,
  User,
  Route,
  Activity,
  Hash,
  Loader2,
} from "lucide-react";
import CarHistoryLogList from "./CarHistoryLogList";
const CarDetailMap = lazy(() => import("./CarDetailMap"));

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

interface CarDetailModalProps {
  isOpen: boolean;
  car: ResponseCarData | null;
  isLoading: boolean;
  routeNameMap: Record<string, string>;
  onClose: () => void;
  formatDate: (dateInput?: Date | string | null) => string;
}

export default function CarDetailModal({
  isOpen,
  car,
  isLoading,
  routeNameMap,
  onClose,
  formatDate,
}: CarDetailModalProps) {
  const routeName = car?.routeId
    ? routeNameMap[car.routeId] || `สาย: ${car.routeId}`
    : "ยังไม่ได้ระบุสายการเดินรถ";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full !max-w-[95vw] overflow-y-auto p-6 sm:p-8">
        <SheetHeader className="border-b pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bus className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-xl">
                {car ? `รถตะไล หมายเลข ${car.carNumber}` : "รายละเอียดรถตะไล"}
              </SheetTitle>
              <SheetDescription className="font-mono text-xs">
                {car ? `ID: ${car.id}` : "Vehicle Details & GPS History Log"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>กำลังโหลดข้อมูลรายละเอียดรถตะไล...</p>
          </div>
        ) : car ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Side: Car Info & History Logs */}
            <div className="flex flex-col space-y-6 lg:col-span-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Info className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold tracking-tight">
                    ข้อมูลทั่วไปของรถ
                  </h3>
                </div>

                {/* Car Main Summary Banner */}
                <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground text-lg font-bold text-background font-mono shadow-sm">
                    {car.carNumber}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      สายการเดินรถปัจจุบัน
                    </span>
                    <div className="flex items-center gap-2 font-semibold">
                      <Route className="h-4 w-4 text-primary" />
                      {routeName}
                    </div>
                  </div>
                </div>

                {/* Grid Metadata Cards */}
                <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                  <div className="space-y-1 rounded-md border p-3">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Hash className="h-3 w-3" /> รหัสระบบ (ID)
                    </span>
                    <span className="block truncate font-semibold">
                      {car.id}
                    </span>
                  </div>
                  <div className="space-y-1 rounded-md border p-3">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" /> ผู้แก้ไขล่าสุด
                    </span>
                    <span className="block truncate font-semibold">
                      {car.updatedBy || "System Admin"}
                    </span>
                  </div>
                  <div className="space-y-1 rounded-md border p-3">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" /> สร้างในระบบ
                    </span>
                    <span className="block font-semibold">
                      {formatDate(car.createdAt)}
                    </span>
                  </div>
                  <div className="space-y-1 rounded-md border p-3">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> อัปเดตล่าสุด
                    </span>
                    <span className="block font-semibold">
                      {formatDate(car.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* History Log Table Component */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold tracking-tight">
                    ประวัติการเดินทาง
                  </h3>
                </div>
                <CarHistoryLogList carId={car.id} formatDate={formatDate} />
              </div>
            </div>

            {/* Right Side: Leaflet Map View */}
            <div className="flex flex-col space-y-4 lg:col-span-7 h-[50vh] lg:h-auto min-h-[500px]">
              <div className="flex items-center gap-2 border-b pb-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="font-semibold tracking-tight">
                  แผนที่ตำแหน่งจริง
                </h3>
              </div>

              <div className="flex-1 overflow-hidden rounded-lg border bg-muted/20 relative">
                <Suspense
                  fallback={
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                      <span className="text-sm font-medium text-muted-foreground">
                        กำลังโหลดแผนที่...
                      </span>
                    </div>
                  }
                >
                  <CarDetailMap car={car} />
                </Suspense>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            ไม่พบข้อมูลรถตะไล
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
