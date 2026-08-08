interface UserMetricsProps {
  total: number;
  active: number;
  suspended: number;
  deleted: number;
}

export default function UserMetrics({
  total,
  active,
  suspended,
  deleted,
}: UserMetricsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <MetricCard
        label="ผู้ใช้ทั้งหมด"
        value={total}
        subtext="Total Accounts"
        badgeColor="bg-slate-100 text-slate-700 border-slate-200"
      />
      <MetricCard
        label="ใช้งานปกติ"
        value={active}
        subtext="Active"
        badgeColor="bg-emerald-50 text-emerald-800 border-emerald-200"
        activeDot
      />
      <MetricCard
        label="ระงับสิทธิ์"
        value={suspended}
        subtext="Suspended"
        badgeColor="bg-amber-50 text-amber-800 border-amber-200"
      />
      <MetricCard
        label="ถูกลบแล้ว"
        value={deleted}
        subtext="Deleted"
        badgeColor="bg-rose-50 text-rose-800 border-rose-200"
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtext,
  badgeColor,
  activeDot = false,
}: {
  label: string;
  value: number;
  subtext: string;
  badgeColor: string;
  activeDot?: boolean;
}) {
  return (
    <div className="p-4 sm:p-5 border border-slate-200/80 rounded-2xl bg-white shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${badgeColor}`}
        >
          {activeDot && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
          {subtext}
        </span>
      </div>
      <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
        {value}
      </div>
    </div>
  );
}
