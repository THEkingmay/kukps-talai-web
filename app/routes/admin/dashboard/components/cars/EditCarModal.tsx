import type { ResponseCarData, Route as RouteType } from "~/types";
import { Pencil, X, Bus, Route as RouteIcon, Lock, CheckCircle2, XCircle } from "lucide-react";

interface EditCarModalProps {
  car: ResponseCarData | null;
  carNumber: string;
  routeId: string;
  routes: RouteType[];
  isSubmitting: boolean;
  onChangeCarNumber: (val: string) => void;
  onChangeRouteId: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function EditCarModal({
  car,
  carNumber,
  routeId,
  routes,
  isSubmitting,
  onChangeCarNumber,
  onChangeRouteId,
  onSubmit,
  onClose,
}: EditCarModalProps) {
  if (!car) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs bg-gray-900/40 animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-lg shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-gray-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Pencil className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              แก้ไขข้อมูลรถตะไล ({car.id})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors text-sm font-semibold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 sm:p-7 space-y-5">
          {/* Readonly Status Info Banner */}
          <div className="p-3.5 bg-white border border-gray-200 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-200/70 text-gray-700 flex items-center justify-center">
                <Lock className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-800 block">
                  สถานะการทำงาน (Server Managed)
                </span>
                <span className="text-[11px] text-gray-500 block">
                  ควบคุมและอัปเดตอัตโนมัติโดยระบบเซิร์ฟเวอร์
                </span>
              </div>
            </div>

            {car.status === "active" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-gray-100 text-black border border-gray-300 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-black animate-pulse" />
                พร้อมใช้งาน
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-gray-200 text-gray-500 border border-gray-200 shrink-0">
                <XCircle className="w-3.5 h-3.5 text-gray-400" />
                ปิดใช้งาน
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
              <Bus className="w-4 h-4 text-gray-500" />
              หมายเลข/ชื่อรถตะไล
            </label>
            <input
              type="text"
              required
              value={carNumber}
              onChange={(e) => onChangeCarNumber(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
              <RouteIcon className="w-4 h-4 text-gray-500" />
              เลือกสายการเดินรถ (Route)
            </label>
            <select
              required
              value={routeId}
              onChange={(e) => onChangeRouteId(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all font-semibold"
            >
              <option value="">-- กรุณาเลือกสายการเดินรถ --</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.id})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-md text-xs sm:text-sm font-semibold text-gray-500 bg-white border border-gray-200 hover:bg-white active:bg-gray-200 transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !carNumber.trim() || !routeId}
              className="px-6 py-2.5 rounded-md text-xs sm:text-sm font-semibold text-white bg-black hover:bg-gray-600 active:bg-black disabled:opacity-50 transition-all shadow-xs cursor-pointer"
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
