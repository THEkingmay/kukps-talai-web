import { lazy, Suspense } from "react";
import type { ResponseCarData } from "~/types";
import {
  Info,
  X,
  Bus,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  User,
  Route,
  Activity,
  Hash,
} from "lucide-react";
import CarHistoryLogList from "./CarHistoryLogList";
const CarDetailMap = lazy(() => import("./CarDetailMap"));

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
  if (!isOpen) return null;

  const routeName = car?.routeId
    ? routeNameMap[car.routeId] || `สาย: ${car.routeId}`
    : "ยังไม่ได้ระบุสายการเดินรถ";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-6 backdrop-blur-xs bg-slate-900/40 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-7xl overflow-hidden flex flex-col max-h-[92vh] transition-all">
        {/* Modal Header */}
        <div className="px-6 py-4.5 sm:px-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {car ? `รถตะไล หมายเลข ${car.carNumber}` : "รายละเอียดรถตะไล"}
                </h3>
                {/*{car && <StatusBadge status={car.status} />}*/}
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {car ? `ID: ${car.id}` : "Vehicle Details & GPS History Log"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-sm font-semibold"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content - Split Left/Right Layout */}
        <div className="p-5 sm:p-6 lg:p-7 overflow-y-auto flex-1 bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isLoading ? (
            <div className="py-16 text-center text-slate-500 font-mono text-sm space-y-3">
              <div className="w-7 h-7 border-2 border-slate-300 border-t-sky-600 rounded-full animate-spin mx-auto" />
              <p>กำลังโหลดข้อมูลรายละเอียดรถตะไล...</p>
            </div>
          ) : car ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Side: Car Info & History Logs */}
              <div className="lg:col-span-5 flex flex-col space-y-5">
                {/* Section Title */}
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-sky-500" />
                    ข้อมูลทั่วไปของรถ (Vehicle Overview)
                  </span>
                </div>

                {/* Car Main Summary Banner */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm font-mono shadow-xs">
                      {car.carNumber}
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-mono block">
                        สายการเดินรถปัจจุบัน
                      </span>
                      <span className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                        <Route className="w-4 h-4 text-sky-600 shrink-0" />
                        {routeName}
                      </span>
                    </div>
                  </div>

                  {/*<StatusBadge status={car.status} />*/}
                </div>

                {/* Grid Metadata Cards */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl space-y-1">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Hash className="w-3 h-3 text-slate-400" /> รหัสระบบ (ID)
                    </span>
                    <span className="font-semibold text-slate-800 break-all block text-[11px]">
                      {car.id}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl space-y-1">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <User className="w-3 h-3 text-slate-400" /> ผู้แก้ไขล่าสุด
                    </span>
                    <span className="font-semibold text-slate-800 block text-[11px] truncate">
                      {car.updatedBy || "System Admin"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl space-y-1">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-400" />{" "}
                      สร้างในระบบ
                    </span>
                    <span className="font-semibold text-slate-800 block text-[11px]">
                      {formatDate(car.createdAt)}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl space-y-1">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" /> อัปเดตล่าสุด
                    </span>
                    <span className="font-semibold text-slate-800 block text-[11px]">
                      {formatDate(car.updatedAt)}
                    </span>
                  </div>
                </div>

                {/* History Log Table Component */}
                <div className="pt-2">
                  <CarHistoryLogList carId={car.id} formatDate={formatDate} />
                </div>
              </div>

              {/* Right Side: Leaflet Map View */}
              <div className="lg:col-span-7 flex flex-col h-full min-h-[380px] lg:min-h-[500px]">
                <div className="flex items-center justify-between pb-1 mb-3 border-b border-slate-100">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    แผนที่ตำแหน่งจริง (Leaflet Map View)
                  </span>
                </div>

                {/* Leaflet Map Component Shell — client-only via lazy */}
                <Suspense
                  fallback={
                    <div className="flex-1 min-h-[380px] lg:min-h-[500px] rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-slate-300 border-t-sky-500 rounded-full animate-spin" />
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        Loading map...
                      </span>
                    </div>
                  }
                >
                  <CarDetailMap car={car} />
                </Suspense>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 font-mono">
              ไม่พบข้อมูลรถตะไล
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 sm:px-7 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>KUKPS Talai Transit Command Center</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 active:bg-slate-200 transition-all shadow-2xs cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          พร้อมใช้งาน
        </span>
      );
    case "inactive":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
          <XCircle className="w-3.5 h-3.5 text-slate-400" />
          ปิดใช้งาน
        </span>
      );
  }
}
