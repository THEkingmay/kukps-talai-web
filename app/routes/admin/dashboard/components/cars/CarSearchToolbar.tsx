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
    <div className="p-5 sm:p-6 border-b border-gray-200 bg-white/50 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              จัดการยานพาหนะรถตะไล (Transit Fleet)
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ตรวจสอบสถานะ ปรับปรุงข้อมูล และเพิ่มรถตะไลให้บริการภายใน campus
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-white transition-colors disabled:opacity-60 shadow-2xs"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-gray-500 ${
                isLoading ? "animate-spin text-black" : ""
              }`}
            />
            <span>{isLoading ? "กำลังโหลด..." : "รีเฟรชข้อมูล"}</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-gray-600 active:bg-black transition-all rounded-md shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มรถตะไล</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
        <div className="sm:col-span-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาหมายเลขรถ (เช่น ตะไล 01) หรือ รหัส..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 text-xs"
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
            className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          >
            <option value="all">ทุกสถานะ (All Status)</option>
            <option value="active">พร้อมใช้งาน (Active)</option>
            <option value="inactive">ปิดใช้งาน (Inactive)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
