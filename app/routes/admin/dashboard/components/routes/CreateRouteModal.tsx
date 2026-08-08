import { Plus, X, Route } from "lucide-react";

interface CreateRouteModalProps {
  isOpen: boolean;
  routeName: string;
  isSubmitting: boolean;
  onChangeName: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function CreateRouteModal({
  isOpen,
  routeName,
  isSubmitting,
  onChangeName,
  onSubmit,
  onClose,
}: CreateRouteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs bg-slate-900/40 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              เพิ่มเส้นทางเดินรถใหม่ (Add Route)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-sm font-semibold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 sm:p-7 space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <Route className="w-4 h-4 text-slate-500" />
              ชื่อสายการเดินรถ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={routeName}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="ระบุชื่อสายการเดินรถ..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              ระบุชื่อสายเดินรถให้ชัดเจน ครอบคลุมจุดเริ่มต้นและสถานที่สำคัญในมหาวิทยาลัย
            </p>
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
              disabled={isSubmitting || !routeName.trim()}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition-all shadow-xs"
            >
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยันเพิ่มเส้นทาง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
