import { Plus, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";

interface RoutesPageHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

/** Title row + primary actions of the route list page. */
export default function RoutesPageHeader({
  isLoading,
  onRefresh,
  onCreate,
}: RoutesPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">สายการเดินรถ</h2>
        <p className="text-muted-foreground text-sm">
          จัดการเส้นทางเดินรถและจุดจอดต่างๆ ของรถตะไล
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          รีเฟรช
        </Button>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มเส้นทาง
        </Button>
      </div>
    </div>
  );
}
