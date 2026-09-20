import type { UserRole } from "~/types";
import { RefreshCw, Search, X } from "lucide-react";

type StatusFilter = "all" | "active" | "suspended" | "deleted";
type RoleFilter = "all" | UserRole;

interface UserSearchToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (val: StatusFilter) => void;
  roleFilter: RoleFilter;
  onRoleFilterChange: (val: RoleFilter) => void;
  onResetFilters: () => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function UserSearchToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  onResetFilters,
  isLoading,
  onRefresh,
}: UserSearchToolbarProps) {
  return (
    <div className="p-6 border-b border-gray-200 bg-white/50 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            จัดการบัญชีผู้ใช้งานระบบ
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ตรวจสอบข้อมูล ระงับสิทธิ์การใช้งาน หรือลบบัญชีผู้ใช้ในระบบ
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-white transition-colors disabled:opacity-60 self-start sm:self-auto shadow-2xs"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-gray-500 ${
              isLoading ? "animate-spin text-black" : ""
            }`}
          />
          {isLoading ? "กำลังโหลด..." : "รีเฟรชข้อมูล"}
        </button>
      </div>

      {/* Filter Toolbar Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
        <div className="sm:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาตามอีเมล หรือ User ID..."
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

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
            className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="active">ใช้งานปกติ (Active)</option>
            <option value="suspended">ระงับสิทธิ์ (Suspended)</option>
            <option value="deleted">ถูกลบแล้ว (Deleted)</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value as RoleFilter)}
            className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          >
            <option value="all">บทบาททั้งหมด</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="user">User นิสิต/บุคลากร</option>
          </select>

          {(searchQuery || statusFilter !== "all" || roleFilter !== "all") && (
            <button
              onClick={onResetFilters}
              className="px-3 py-2 text-xs font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300/80 transition-colors shrink-0"
              title="ล้างตัวกรอง"
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
