import type { UserRole } from "~/types";
import { RefreshCw, Search, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";

type StatusFilter = "all" | "active" | "deleted";
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
  const isFiltered =
    searchQuery || statusFilter !== "all" || roleFilter !== "all";

  return (
    <div className="flex flex-col gap-4 border-b bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="ค้นหาตามอีเมล หรือ User ID..."
            className="pl-9 pr-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(val) => onStatusFilterChange(val as StatusFilter)}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="สถานะทั้งหมด" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">สถานะทั้งหมด</SelectItem>
              <SelectItem value="active">ใช้งานปกติ</SelectItem>
              <SelectItem value="deleted">ถูกลบแล้ว</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={roleFilter}
            onValueChange={(val) => onRoleFilterChange(val as RoleFilter)}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="บทบาททั้งหมด" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">บทบาททั้งหมด</SelectItem>
              <SelectItem value="superadmin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User ทั่วไป</SelectItem>
              <SelectItem value="driver">คนขับรถ</SelectItem>
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button
              variant="ghost"
              className="h-9 px-2 text-muted-foreground"
              onClick={onResetFilters}
            >
              ล้าง
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-9"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          รีเฟรช
        </Button>
      </div>
    </div>
  );
}
