import type { ResponseCarData } from "~/types";
import {
  Bus,
  Eye,
  Pencil,
  Trash2,
  Route,
  User,
  CheckCircle2,
  XCircle,
  KeyRound,
} from "lucide-react";

interface CarItemCardProps {
  car: ResponseCarData;
  routeNameMap: Record<string, string>;
  deletingId: string | null;
  onOpenDetail: (id: string) => void;
  onOpenEdit: (car: ResponseCarData) => void;
  onDelete: (car: ResponseCarData) => void;
  onOpenCredential: (id: string) => void;
}

export default function CarItemCard({
  car,
  routeNameMap,
  deletingId,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  onOpenCredential,
}: CarItemCardProps) {
  const routeName = car.routeId
    ? routeNameMap[car.routeId] || `สาย: ${car.routeId}`
    : "ยังไม่ได้ระบุสายการเดินรถ";

  return (
    <div className="p-5 border border-gray-200/90 rounded-md bg-white hover:border-black hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
      {/* Top Bar: Bus Icon, Number & Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center border border-gray-200 shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
              <Bus className="w-4 h-4" />
            </div>
            <h4
              onClick={() => onOpenDetail(car.id)}
              className="text-base font-bold text-gray-900 group-hover:text-black cursor-pointer transition-colors truncate"
            >
              {car.carNumber}
            </h4>
          </div>
          <CarStatusBadge status={car.status} />
        </div>

        {/* Info Grid */}
        <div className="space-y-2 font-mono text-xs bg-white/80 p-3.5 rounded-md border border-gray-200">
          <div className="flex items-center justify-between text-gray-500">
            <span className="flex items-center gap-1 text-gray-400">
              <User className="w-3 h-3" /> ID:
            </span>
            <span className="font-semibold text-gray-800">{car.id}</span>
          </div>
          <div className="flex items-center justify-between text-gray-500 gap-2">
            <span className="flex items-center gap-1 text-gray-400 shrink-0">
              <Route className="w-3 h-3" /> สายรถ:
            </span>
            <span
              className="font-semibold text-gray-800 truncate max-w-[170px]"
              title={routeName}
            >
              {routeName}
            </span>
          </div>
        </div>
      </div>

      {/* Footer & Action Buttons Row */}
      <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-[11px] font-mono text-gray-400 truncate">
          แก้ไขโดย: {car.updatedBy || "System"}
        </span>

        {/* Action Buttons with Lucide Icons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenDetail(car.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200/80 hover:bg-sky-100 active:bg-sky-200 transition-all shadow-2xs"
            title="ดูรายละเอียดทั้งหมด"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>ดูข้อมูล</span>
          </button>
          <button
            onClick={() => onOpenEdit(car)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-200 active:bg-gray-200 transition-all shadow-2xs"
            title="แก้ไขข้อมูลรถ"
          >
            <Pencil className="w-3.5 h-3.5 text-gray-500" />
            <span>แก้ไข</span>
          </button>
          <button
            onClick={() => onOpenCredential(car.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 hover:bg-amber-100 active:bg-amber-200 transition-all shadow-2xs"
            title="ดู MQTT Credentials"
          >
            <KeyRound className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(car)}
            disabled={deletingId === car.id}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-gray-900 bg-gray-100 border border-gray-300/80 hover:bg-gray-200 active:bg-gray-300 transition-all disabled:opacity-50 shadow-2xs"
            title="ลบรถตะไล"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CarStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-gray-100 text-black border border-gray-300 shrink-0">
          <CheckCircle2 className="w-3 h-3 text-black animate-pulse" />
          พร้อมใช้งาน
        </span>
      );
    case "inactive":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-gray-200 text-gray-500 border border-gray-200 shrink-0">
          <XCircle className="w-3 h-3 text-gray-400" />
          ปิดใช้งาน
        </span>
      );
  }
}
