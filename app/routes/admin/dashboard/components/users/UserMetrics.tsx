import { Users, ShieldCheck, Trash2 } from "lucide-react";
import { MetricsSkeleton } from "~/components/ui/Loading";

interface UserMetricsProps {
  total: number;
  active: number;
  deleted: number;
  isLoading?: boolean;
}

export default function UserMetrics({
  total,
  active,
  deleted,
  isLoading,
}: UserMetricsProps) {
  if (isLoading) {
    return <MetricsSkeleton count={3} />;
  }

  return (
    <div className="flex flex-wrap items-center gap-6 py-2 px-1 text-sm">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">ทั้งหมด:</span>
        <span className="font-semibold font-mono">{total}</span>
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-green-500" />
        <span className="text-muted-foreground">ใช้งานปกติ:</span>
        <span className="font-semibold font-mono">{active}</span>
      </div>
      <div className="flex items-center gap-2">
        <Trash2 className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">ลบแล้ว:</span>
        <span className="font-semibold font-mono">{deleted}</span>
      </div>
    </div>
  );
}
