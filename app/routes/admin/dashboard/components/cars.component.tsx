import { useState } from "react";
import type { Car } from "~/types";

export default function CarsComponent() {
  // Mock initial cars data for clean dashboard preview
  const [cars] = useState<Car[]>([
    {
      id: "car-1",
      carNumber: "ตะไล 01",
      carMqttUsername: "talai_kps_01",
      status: "active",
      routeId: "route-1",
      updatedBy: "admin@ku.th",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "car-2",
      carNumber: "ตะไล 02",
      carMqttUsername: "talai_kps_02",
      status: "active",
      routeId: "route-1",
      updatedBy: "admin@ku.th",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "car-3",
      carNumber: "ตะไล 03",
      carMqttUsername: "talai_kps_03",
      status: "maintenance",
      routeId: null,
      updatedBy: "admin@ku.th",
      createdAt: new Date().toISOString(),
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
              จัดการยานพาหนะรถตะไล (Transit Fleet)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ตรวจสอบและจัดการสถานะรถตะไลทุกคันที่เปิดใช้งานในระบบ
          </p>
        </div>

        {/* Fleet Summary Badges */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            ใช้งาน: 2 คัน
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
            ซ่อมบำรุง: 1 คัน
          </span>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {cars.map((car) => (
          <div
            key={car.id}
            className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/30 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900">
                  {car.carNumber}
                </span>
                <CarStatusBadge status={car.status} />
              </div>

              <div className="space-y-1 font-mono text-xs">
                <div className="text-slate-500">
                  MQTT User: <span className="text-slate-800 font-semibold">{car.carMqttUsername}</span>
                </div>
                <div className="text-slate-500">
                  สายการเดินรถ:{" "}
                  <span className="text-slate-800 font-semibold">
                    {car.routeId === "route-1" ? "สาย 1 (รอบเมือง)" : "ยังไม่ได้ระบุ"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>แก้ไขล่าสุด: {car.updatedBy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CarStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          พร้อมใช้งาน
        </span>
      );
    case "maintenance":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          ซ่อมบำรุง
        </span>
      );
    case "inactive":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          ปิดใช้งาน
        </span>
      );
  }
}

