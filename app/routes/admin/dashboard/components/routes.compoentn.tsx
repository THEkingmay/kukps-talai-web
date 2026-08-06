import { useState } from "react";
import type { Route } from "~/types";

export default function RoutesComponent() {
  const [routes] = useState<Route[]>([
    {
      id: "route-1",
      name: "สาย 1 — อาคารสารสนเทศ - หอพักนิสิต - คณะวิศวกรรมศาสตร์",
      createdAt: new Date().toISOString(),
      updatedBy: "admin@ku.th",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "route-2",
      name: "สาย 2 — ประตูสาธิต - คณะเกษตร - ศูนย์เรียนรวม 1",
      createdAt: new Date().toISOString(),
      updatedBy: "admin@ku.th",
      updatedAt: new Date().toISOString(),
    },
  ]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              จัดการเส้นทางเดินรถตะไล (Transit Routes)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            กำหนดสายการเดินรถ จุดจอดรถสวัสดิการ และระยะเวลาเดินทางภายใน campus
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
          เปิดใช้งาน: 2 สาย
        </span>
      </div>

      {/* Routes List */}
      <div className="p-6 space-y-3">
        {routes.map((route, idx) => (
          <div
            key={route.id}
            className="p-4 border border-slate-200/80 rounded-xl bg-slate-50/30 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                0{idx + 1}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {route.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1">
                  <span>แก้ไขโดย: {route.updatedBy || "System"}</span>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              เปิดวิ่งปกติ
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

