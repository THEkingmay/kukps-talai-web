import type { Route } from "~/types";
import { Eye, Pencil, Trash2, Route as RouteIcon, MapPin } from "lucide-react";

interface RouteItemCardProps {
  route: Route;
  index: number;
  deletingId: string | null;
  onOpenDetail: (id: string) => void;
  onOpenEdit: (route: Route) => void;
  onOpenPoints: (route: Route) => void;
  onDelete: (route: Route) => void;
  formatDate: (isoString?: string | null) => string;
}

export default function RouteItemCard({
  route,
  index,
  deletingId,
  onOpenDetail,
  onOpenEdit,
  onOpenPoints,
  onDelete,
  formatDate,
}: RouteItemCardProps) {
  return (
    <div className="p-4 border border-slate-200/80 rounded-xl bg-slate-50/20 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-emerald-100">
          0{index + 1}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
            {route.name}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <RouteIcon className="w-3 h-3 text-slate-400" /> ID: {route.id}
            </span>
            {route.updatedBy && <span>• แก้ไขโดย: {route.updatedBy}</span>}
            <span>• อัปเดต: {formatDate(route.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          onClick={() => onOpenDetail(route.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200/80 hover:bg-sky-100 active:bg-sky-200 transition-all shadow-2xs"
          title="ดูรายละเอียดสายรถ"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>ดูข้อมูล</span>
        </button>
        <button
          onClick={() => onOpenPoints(route)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 active:bg-emerald-200 transition-all shadow-2xs"
          title="จัดการจุดจอด"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>จุดจอด</span>
        </button>
        <button
          onClick={() => onOpenEdit(route)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-all shadow-2xs"
          title="แก้ไขชื่อสายรถ"
        >
          <Pencil className="w-3.5 h-3.5 text-slate-500" />
          <span>แก้ไข</span>
        </button>
        <button
          onClick={() => onDelete(route)}
          disabled={deletingId === route.id}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 hover:bg-rose-100 active:bg-rose-200 transition-all disabled:opacity-50 shadow-2xs"
          title="ลบสายการเดินรถ"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>ลบ</span>
        </button>
      </div>
    </div>
  );
}
