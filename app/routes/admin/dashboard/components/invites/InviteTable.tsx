import type { AdminInvite } from "~/types";
import { Trash2, Lock, CheckCircle2, XCircle, Clock } from "lucide-react";

interface InviteTableProps {
  filteredInvites: AdminInvite[];
  isLoading: boolean;
  deletingEmail: string | null;
  onDeleteInvite: (invite: AdminInvite) => void;
}

export default function InviteTable({
  filteredInvites,
  isLoading,
  deletingEmail,
  onDeleteInvite,
}: InviteTableProps) {
  return (
    <div className="overflow-x-auto">
      {isLoading ? (
        <div className="p-6 space-y-3">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="h-12 bg-gray-200/80 animate-pulse rounded-md" />
          ))}
        </div>
      ) : filteredInvites.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-gray-700">ไม่พบรายการรหัสเชิญ</p>
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200/80 bg-white/50 text-[11px] font-mono text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-6 font-semibold">อีเมลผู้รับเชิญ</th>
              <th className="py-3 px-6 font-semibold">สร้างโดย (Added By)</th>
              <th className="py-3 px-6 font-semibold">สถานะ</th>
              <th className="py-3 px-6 font-semibold">วันที่สร้าง</th>
              <th className="py-3 px-6 font-semibold text-right">แอ็กชัน</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
            {filteredInvites.map((invite, index) => (
              <tr key={invite.email || index} className="hover:bg-white/80 transition-colors">
                <td className="py-3.5 px-6 font-semibold text-gray-900">{invite.email}</td>
                <td className="py-3.5 px-6 font-mono text-gray-500 text-xs">
                  <span className="px-2.5 py-1 rounded bg-gray-200 border border-gray-200 font-medium">
                    {invite.addedBy || "Super Admin"}
                  </span>
                </td>
                <td className="py-3.5 px-6">
                  <StatusBadge status={invite.status} />
                </td>
                <td className="py-3.5 px-6 font-mono text-gray-500 text-xs">
                  {invite.createdAt
                    ? new Date(invite.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>
                <td className="py-3.5 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {invite.status === "pending" ? (
                      <button
                        type="button"
                        onClick={() => onDeleteInvite(invite)}
                        disabled={deletingEmail === invite.email}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors disabled:opacity-50 shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{deletingEmail === invite.email ? "กำลังลบ..." : "ลบคำเชิญ"}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-gray-400 bg-gray-200 border border-gray-200 cursor-not-allowed opacity-60"
                      >
                        <Lock className="w-3 h-3 text-gray-400" />
                        <span>ลบไม่ได้</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "accepted":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-gray-100 text-black border border-gray-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-black" />
          ลงทะเบียนแล้ว
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-gray-100 text-gray-900 border border-gray-300">
          <XCircle className="w-3.5 h-3.5 text-black" />
          ยกเลิก
        </span>
      );
    case "pending":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          รอยืนยัน
        </span>
      );
  }
}
