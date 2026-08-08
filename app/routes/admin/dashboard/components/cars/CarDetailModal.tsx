import type { ResponseCarData } from "~/types";
import {
  Info,
  X,
  Bus,
  CheckCircle2,
  Wrench,
  XCircle,
  Calendar,
  Clock,
  User,
  Route,
} from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs bg-slate-900/40 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
              <Info className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              รายละเอียดรถตะไล (Vehicle Details)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-sm font-semibold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-5 text-xs sm:text-sm overflow-y-auto">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500 font-mono">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin mx-auto mb-2" />
              กำลังโหลดข้อมูลรถตะไล...
            </div>
          ) : car ? (
            <div className="space-y-4">
              <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono block text-xs uppercase tracking-wider">
                      หมายเลขรถ (Car Number)
                    </span>
                    <span className="font-extrabold text-slate-900 text-lg sm:text-xl">
                      {car.carNumber}
                    </span>
                  </div>
                </div>
                <StatusBadge status={car.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <User className="w-3 h-3" /> รหัสรถ (ID)
                  </span>
                  <span className="font-semibold text-slate-800 break-all block">
                    {car.id}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Route className="w-3 h-3" /> สายการเดินรถ
                  </span>
                  <span className="font-semibold text-slate-800 block">
                    {routeName}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2.5 font-mono text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> สร้างในระบบเมื่อ:
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {formatDate(car.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> อัปเดตล่าสุดเมื่อ:
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {formatDate(car.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> ผู้แก้ไขล่าสุด:
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {car.updatedBy || "System"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500">
              ไม่พบข้อมูลรถตะไล
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 active:bg-slate-200 transition-all shadow-2xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          พร้อมใช้งาน
        </span>
      );
    case "maintenance":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <Wrench className="w-3.5 h-3.5 text-amber-600" />
          ซ่อมบำรุง
        </span>
      );
    case "inactive":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <XCircle className="w-3.5 h-3.5 text-slate-400" />
          ปิดใช้งาน
        </span>
      );
  }
}
