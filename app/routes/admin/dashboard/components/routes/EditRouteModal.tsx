import type { Route as RouteType } from "~/types";
import { Pencil, X, Route as RouteIcon } from "lucide-react";

interface EditRouteModalProps {
  route: RouteType | null;
  editName: string;
  isSubmitting: boolean;
  onChangeName: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function EditRouteModal({
  route,
  editName,
  isSubmitting,
  onChangeName,
  onSubmit,
  onClose,
}: EditRouteModalProps) {
  if (!route) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs bg-gray-900/40 animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-lg shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-gray-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Pencil className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              แก้ไขเส้นทางเดินรถ ({route.id})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors text-sm font-semibold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 sm:p-7 space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
              <RouteIcon className="w-4 h-4 text-gray-500" />
              ชื่อสายการเดินรถ
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => onChangeName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
            />
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
              disabled={isSubmitting || !editName.trim()}
              className="px-6 py-2.5 rounded-md text-xs sm:text-sm font-semibold text-white bg-black hover:bg-gray-600 active:bg-black disabled:opacity-50 transition-all shadow-xs"
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
