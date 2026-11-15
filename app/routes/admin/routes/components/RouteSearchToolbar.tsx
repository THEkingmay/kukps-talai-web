import { Search, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface RouteSearchToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalRoutes: number;
}

/** Search field + route counter of the route list page. */
export default function RouteSearchToolbar({
  searchQuery,
  onSearchChange,
  totalRoutes,
}: RouteSearchToolbarProps) {
  return (
    <div className="p-4 sm:p-5 border-b bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ค้นหาชื่อเส้นทาง หรือ ID..."
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-9 w-9 text-muted-foreground"
            onClick={() => onSearchChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-muted text-muted-foreground border">
          ทั้งหมด: {totalRoutes} สาย
        </span>
      </div>
    </div>
  );
}
