import { useEffect, useState, useCallback } from "react";
import type { CarHistoryLog } from "~/types";
import { getCarLogsByCarId } from "~/actions/car-history-log.action";
import { History, RefreshCw, AlertCircle, MapPin, Clock } from "lucide-react";

interface CarHistoryLogListProps {
  carId: string;
  formatDate: (dateInput?: Date | string | null) => string;
}

export default function CarHistoryLogList({
  carId,
  formatDate,
}: CarHistoryLogListProps) {
  const [logs, setLogs] = useState<CarHistoryLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getCarLogsByCarId(carId, 100);
      if (res.success) {
        setLogs(res.data.data || []);
      } else {
        setError(res.error || "ไม่สามารถดึงข้อมูลประวัติการเดินทางได้");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    if (carId) {
      fetchLogs();
    }
  }, [carId, fetchLogs]);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Header Bar with Refresh Button */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <History className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
              ประวัติการเดินทาง
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-gray-200 text-gray-500 border border-gray-200">
                {logs.length} รายการล่าสุด (100 ล่าสุด)
              </span>
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-white border border-gray-200 rounded-lg transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          title="รีเฟรชประวัติการเดินทาง"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-gray-500 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
          <span>รีเฟรช</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto max-h-[280px] lg:max-h-[340px] overflow-y-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            {/* Sticky Table Header */}
            <thead className="bg-white text-gray-500 font-semibold border-b border-gray-200 sticky top-0 z-10 select-none">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>เวลาบันทึก</span>
                  </div>
                </th>
                <th className="py-2.5 px-3">ละติจูด (Lat)</th>
                <th className="py-2.5 px-3">ลองจิจูด (Lng)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-2" />
                    <span>กำลังโหลดประวัติ...</span>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center">
                    <div className="inline-flex items-center gap-2 p-3 rounded-md bg-amber-50 text-amber-800 text-xs border border-amber-200">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{error}</span>
                      <button
                        type="button"
                        onClick={fetchLogs}
                        className="ml-2 font-bold underline hover:text-amber-900"
                      >
                        ลองอีกครั้ง
                      </button>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400">
                    <MapPin className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                    <p className="font-sans text-xs font-semibold text-gray-500">
                      ไม่พบประวัติการเดินทาง
                    </p>
                    <p className="font-sans text-[11px] text-gray-400 mt-0.5">
                      ยังไม่มีการบันทึกพิกัด GPS
                    </p>
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => {
                  const isLatest = index === 0;

                  return (
                    <tr
                      key={log.id}
                      className={`transition-colors ${
                        isLatest
                          ? "bg-gray-100/40 hover:bg-gray-100/80"
                          : "hover:bg-white"
                      }`}
                    >
                      {/* Index Column */}
                      <td className="py-2 px-3 text-center text-gray-400 text-[11px]">
                        {isLatest ? (
                          <span
                            className="inline-block w-2 h-2 rounded-full bg-black animate-pulse"
                            title="ล่าสุด"
                          />
                        ) : (
                          index + 1
                        )}
                      </td>

                      {/* Timestamp Column */}
                      <td className="py-2 px-3 whitespace-nowrap text-gray-800">
                        {formatDate(log.createdAt)}
                        {isLatest && (
                          <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-sans font-bold bg-gray-200 text-black rounded border border-gray-300">
                            ล่าสุด
                          </span>
                        )}
                      </td>

                      {/* Lat Column */}
                      <td className="py-2 px-3 font-semibold text-gray-900">
                        {log.lat.toFixed(5)}
                      </td>

                      {/* Lng Column */}
                      <td className="py-2 px-3 font-semibold text-gray-900">
                        {log.lng.toFixed(5)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
