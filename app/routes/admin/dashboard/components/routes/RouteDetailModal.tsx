import type { Route } from "~/types";
import { Route as RouteIcon, X, Calendar, Clock, User } from "lucide-react";

interface RouteDetailModalProps {
  isOpen: boolean;
  route: Route | null;
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs bg-gray-900/40 animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-lg shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 sm:p-7 border-b border-gray-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
              <RouteIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              รายละเอียดเส้นทางเดินรถ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors text-sm font-semibold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-5 text-xs sm:text-sm overflow-y-auto">
          {isLoading ? (
            <div className="py-12 text-center text-gray-500 font-mono">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-2" />
              กำลังโหลดข้อมูลรายละเอียดเส้นทาง...
            </div>
          ) : route ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-white border border-gray-200 space-y-1">
                <span className="text-gray-400 font-mono block text-xs uppercase tracking-wider">
                  รหัสเส้นทาง (ID)
                </span>
                <span className="font-mono font-bold text-gray-800 text-sm sm:text-base">
                  {route.id}
                </span>
              </div>

              <div>
                <span className="text-gray-500 block text-xs font-medium mb-1">
                  ชื่อสายการเดินรถ
                </span>
                <span className="font-bold text-gray-900 text-base sm:text-lg leading-snug block">
                  {route.name}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2.5 font-mono text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> สร้างเมื่อ:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {formatDate(route.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" /> แก้ไขล่าสุด:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {formatDate(route.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" /> ผู้แก้ไขล่าสุด:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {route.updatedBy || "-"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              ไม่พบข้อมูลเส้นทาง
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 border-t border-gray-200 bg-white/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-md text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-200 active:bg-gray-200 transition-all shadow-2xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
