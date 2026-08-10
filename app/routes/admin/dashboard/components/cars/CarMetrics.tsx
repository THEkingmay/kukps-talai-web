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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <MetricCard
        label="รถตะไลทั้งหมด"
        value={total}
        subtext="Total Fleet"
        badgeColor="bg-slate-100 text-slate-700 border-slate-200"
        icon={<Bus className="w-4 h-4 text-slate-600" />}
      />
      <MetricCard
        label="พร้อมใช้งาน"
        value={active}
        subtext="Active"
        badgeColor="bg-emerald-50 text-emerald-800 border-emerald-200"
        icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        activeDot
      />
      <MetricCard
        label="ปิดใช้งาน"
        value={inactive}
        subtext="Inactive"
        badgeColor="bg-slate-100 text-slate-600 border-slate-200"
        icon={<XCircle className="w-4 h-4 text-slate-500" />}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtext,
  badgeColor,
  icon,
  activeDot = false,
}: {
  label: string;
  value: number;
  subtext: string;
  badgeColor: string;
  icon?: React.ReactNode;
  activeDot?: boolean;
}) {
  return (
    <div className="p-4 sm:p-5 border border-slate-200/80 rounded-2xl bg-white shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className="flex items-center gap-1.5">
          {icon}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${badgeColor}`}
          >
            {activeDot && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
            {subtext}
          </span>
        </div>
      </div>
      <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
        {value}
      </div>
    </div>
  );
}
