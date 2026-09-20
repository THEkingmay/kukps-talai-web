import type { CarStatus } from "~/types";
import { RefreshCw, Plus, Search, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";

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
  const isFiltered = searchQuery || statusFilter !== "all";

  return (
    <div className="flex flex-col gap-4 border-b bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="ค้นหาหมายเลขรถ (เช่น ตะไล 01) หรือ รหัส..."
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
          <Select value={statusFilter} onValueChange={(val) => onStatusFilterChange(val as StatusFilter)}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="ทุกสถานะ (All Status)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ (All Status)</SelectItem>
              <SelectItem value="active">พร้อมใช้งาน (Active)</SelectItem>
              <SelectItem value="inactive">ปิดใช้งาน (Inactive)</SelectItem>
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button variant="ghost" className="h-9 px-2 text-muted-foreground" onClick={() => {
              onSearchChange("");
              onStatusFilterChange("all");
            }}>
              ล้าง
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading} className="h-9">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
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
