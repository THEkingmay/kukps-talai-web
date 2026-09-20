import type { CarStatus, Route } from "~/types";
import { RefreshCw, Plus, Search, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";

type StatusFilter = "all" | CarStatus;

interface CarSearchToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (val: StatusFilter) => void;
  routeFilter: string;
  onRouteFilterChange: (val: string) => void;
  routes: Route[];
  isLoading: boolean;
  onRefresh: () => void;
  onOpenCreateModal: () => void;
}

export default function CarSearchToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  routeFilter,
  onRouteFilterChange,
  routes,
  isLoading,
  onRefresh,
  onOpenCreateModal,
}: CarSearchToolbarProps) {
  const isFiltered =
    searchQuery || statusFilter !== "all" || routeFilter !== "all";

  return (
    <div className="flex flex-col gap-4 border-b bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="ค้นหาหมายเลข หรือ ID รถ"
            className="pl-9 pr-9 h-9"
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
        <div className="flex gap-2 overflow-x-auto">
          <Select value={routeFilter} onValueChange={onRouteFilterChange}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="สายการเดินรถ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสาย</SelectItem>
              {routes.map((route) => (
                <SelectItem key={route.id} value={route.id}>
                  {route.name}
                </SelectItem>
              ))}
              <SelectItem value="unassigned">ไม่ได้ระบุสาย</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(val) => onStatusFilterChange(val as StatusFilter)}
          >
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="สถานะรถ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="active">พร้อมใช้งาน</SelectItem>
              <SelectItem value="inactive">ปิดใช้งาน</SelectItem>
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button
              variant="ghost"
              className="h-9 px-2 text-muted-foreground"
              onClick={() => {
                onSearchChange("");
                onStatusFilterChange("all");
                onRouteFilterChange("all");
              }}
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
        <Button size="sm" onClick={onOpenCreateModal} className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มรถตะไล
        </Button>
      </div>
    </div>
  );
}
