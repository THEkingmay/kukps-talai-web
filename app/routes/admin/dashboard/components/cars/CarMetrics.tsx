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
        badgeColor="bg-gray-200 text-gray-700 border-gray-200"
        icon={<Bus className="w-4 h-4 text-gray-500" />}
      />
      <MetricCard
        label="พร้อมใช้งาน"
        value={active}
        subtext="Active"
        badgeColor="bg-gray-100 text-black border-gray-300"
        icon={<CheckCircle2 className="w-4 h-4 text-black" />}
        activeDot
      />
      <MetricCard
        label="ปิดใช้งาน"
        value={inactive}
        subtext="Inactive"
        badgeColor="bg-gray-200 text-gray-500 border-gray-200"
        icon={<XCircle className="w-4 h-4 text-gray-500" />}
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
    <div className="p-4 sm:p-5 border border-gray-200/80 rounded-md bg-white shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <div className="flex items-center gap-1.5">
          {icon}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${badgeColor}`}
          >
            {activeDot && (
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            )}
            {subtext}
          </span>
        </div>
      </div>
      <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-gray-900">
        {value}
      </div>
    </div>
  );
}
