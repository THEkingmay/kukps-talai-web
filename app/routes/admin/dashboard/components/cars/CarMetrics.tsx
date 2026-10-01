import { Bus, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { MetricsSkeleton } from "~/components/ui/Loading";

interface CarMetricsProps {
  total: number;
  active: number;
  inactive: number;
  deleted: number;
  isLoading?: boolean;
}

export default function CarMetrics({
  total,
  active,
  inactive,
  deleted,
  isLoading,
}: CarMetricsProps) {
  if (isLoading) {
    return <MetricsSkeleton count={4} />;
  }

  return (
    <div className="flex flex-wrap items-center gap-6 py-2 px-1 text-sm">
      <div className="flex items-center gap-2">
        <Bus className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">ทั้งหมด:</span>
        <span className="font-semibold font-mono">{total}</span>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span className="text-muted-foreground">พร้อมใช้งาน:</span>
        <span className="font-semibold font-mono">{active}</span>
      </div>
      <div className="flex items-center gap-2">
        <XCircle className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">ปิดใช้งาน:</span>
        <span className="font-semibold font-mono">{inactive}</span>
      </div>
      <div className="flex items-center gap-2">
        <Trash2 className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">ถูกลบแล้ว:</span>
        <span className="font-semibold font-mono">{deleted}</span>
      </div>
    </div>
  );
}
