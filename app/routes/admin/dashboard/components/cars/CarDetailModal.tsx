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
  MapPin,
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
      <SheetContent className="w-full !max-w-[95vw] overflow-y-auto p-6 sm:p-8 bg-background">
        <SheetHeader className="border-b pb-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Bus className="h-6 w-6" />
            </div>
            <div>
              <SheetTitle className="text-2xl font-bold tracking-tight">
                {car ? `รถตะไล หมายเลข ${car.carNumber}` : "รายละเอียดรถตะไล"}
              </SheetTitle>
              <SheetDescription className="font-mono text-sm mt-1">
                {car
                  ? `System ID: ${car.id}`
                  : "Vehicle Details & GPS History Log"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary/60" />
            <p className="font-medium tracking-tight">
              กำลังโหลดข้อมูลรายละเอียดรถตะไล...
            </p>
          </div>
        ) : car ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Side: Car Info & History Logs */}
            <div className="flex flex-col space-y-8 lg:col-span-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Info className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold tracking-tight text-foreground">
                    ข้อมูลทั่วไป (General Info)
                  </h3>
                </div>

                {/* Car Main Summary Banner */}
                <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground font-mono shadow-sm">
                    {car.carNumber}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      สายการเดินรถปัจจุบัน
                    </span>
                    <div className="flex items-center gap-2 font-semibold text-card-foreground text-lg mt-0.5 truncate">
                      <Route className="h-5 w-5 text-primary shrink-0" />
                      <span className="truncate" title={routeName}>
                        {routeName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key-Value Metadata List */}
                <div className="space-y-3 rounded-xl border bg-card/50 p-4 text-sm font-mono shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-border/50">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Hash className="h-4 w-4" /> รหัสระบบ (ID)
                    </span>
                    <span className="font-semibold text-foreground truncate pl-4">
                      {car.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/50">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" /> ผู้แก้ไขล่าสุด
                    </span>
                    <span className="font-semibold text-foreground">
                      {car.updatedBy || "System Admin"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/50">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" /> สร้างเมื่อ
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatDate(car.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" /> อัปเดตล่าสุด
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatDate(car.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* History Log Table Component */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold tracking-tight text-foreground">
                    ประวัติการเดินทาง (History Log)
                  </h3>
                </div>
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                  <CarHistoryLogList carId={car.id} formatDate={formatDate} />
                </div>
              </div>
            </div>

            {/* Right Side: Leaflet Map View */}
            <div className="flex flex-col space-y-4 lg:col-span-7 h-[50vh] lg:h-auto min-h-[500px]">
              <div className="flex items-center gap-2 border-b pb-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="font-semibold tracking-tight text-foreground">
                  แผนที่ตำแหน่งจริง (Live Location)
                </h3>
              </div>

              <div className="flex-1 overflow-hidden rounded-xl border bg-card shadow-sm relative">
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
          <div className="py-20 text-center text-muted-foreground font-medium">
            ไม่พบข้อมูลรถตะไล (Data Not Found)
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
