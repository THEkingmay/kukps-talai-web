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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs bg-slate-900/40 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Pencil className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              แก้ไขข้อมูลรถตะไล ({car.id})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-sm font-semibold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 sm:p-7 space-y-5">
          {/* Readonly Status Info Banner */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-200/70 text-slate-700 flex items-center justify-center">
                <Lock className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  สถานะการทำงาน (Server Managed)
                </span>
                <span className="text-[11px] text-slate-500 block">
                  ควบคุมและอัปเดตอัตโนมัติโดยระบบเซิร์ฟเวอร์
                </span>
              </div>
            </div>

            {car.status === "active" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                พร้อมใช้งาน
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                <XCircle className="w-3.5 h-3.5 text-slate-400" />
                ปิดใช้งาน
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <Bus className="w-4 h-4 text-slate-500" />
              หมายเลข/ชื่อรถตะไล
            </label>
            <input
              type="text"
              required
              value={carNumber}
              onChange={(e) => onChangeCarNumber(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <RouteIcon className="w-4 h-4 text-slate-500" />
              เลือกสายการเดินรถ (Route)
            </label>
            <select
              required
              value={routeId}
              onChange={(e) => onChangeRouteId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold"
            >
              <option value="">-- กรุณาเลือกสายการเดินรถ --</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.id})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !carNumber.trim() || !routeId}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
