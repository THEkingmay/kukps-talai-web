import { Bus, CheckCircle2, XCircle } from "lucide-react";

interface CarMetricsProps {
  total: number;
  active: number;
  inactive: number;
}

export default function CarMetrics({
  total,
  active,
  inactive,
}: CarMetricsProps) {
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
    </div>
  );
}
