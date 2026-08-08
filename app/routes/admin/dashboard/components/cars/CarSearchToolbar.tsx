import type { CarStatus } from "~/types";
import { RefreshCw, Plus, Search, X } from "lucide-react";

type StatusFilter = "all" | CarStatus;

interface CarSearchToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (val: StatusFilter) => void;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenCreateModal: () => void;
}

export default function CarSearchToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isLoading,
  onRefresh,
  onOpenCreateModal,
}: CarSearchToolbarProps) {
  return (
    <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              จัดการยานพาหนะรถตะไล (Transit Fleet)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ตรวจสอบสถานะ ปรับปรุงข้อมูล และเพิ่มรถตะไลให้บริการภายใน campus
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-60 shadow-2xs"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 ${
                isLoading ? "animate-spin text-emerald-600" : ""
              }`}
            />
            <span>{isLoading ? "กำลังโหลด..." : "รีเฟรชข้อมูล"}</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มรถตะไล</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
        <div className="sm:col-span-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาหมายเลขรถ (เช่น ตะไล 01) หรือ รหัส..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as StatusFilter)
            }
            className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          >
            <option value="all">ทุกสถานะ (All Status)</option>
            <option value="active">พร้อมใช้งาน (Active)</option>
            <option value="maintenance">ซ่อมบำรุง (Maintenance)</option>
            <option value="inactive">ปิดใช้งาน (Inactive)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
