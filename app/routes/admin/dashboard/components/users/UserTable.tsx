import type { User } from "~/types";
import { Lock, CheckCircle2, AlertTriangle, XCircle, Trash2 } from "lucide-react";

interface UserTableProps {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  error: string | null;
  currentUserId?: string;
  updatingId: string | null;
  onToggleStatus: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onRefresh: () => void;
  formatDate: (dateStr: string) => string;
}

export default function UserTable({
  users,
  filteredUsers,
  isLoading,
  error,
  currentUserId,
  updatingId,
  onToggleStatus,
  onDeleteUser,
  onRefresh,
  formatDate,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            <th className="px-6 py-3 font-medium">ข้อมูลผู้ใช้</th>
            <th className="px-6 py-3 font-medium">บทบาท (Role)</th>
            <th className="px-6 py-3 font-medium">สถานะ (Status)</th>
            <th className="px-6 py-3 font-medium">วันที่สร้าง</th>
            <th className="px-6 py-3 font-medium text-right">การจัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {isLoading ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <div className="inline-flex items-center gap-2 text-slate-500">
                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono text-xs">กำลังโหลดข้อมูล...</span>
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <div className="text-rose-600 font-medium space-y-1">
                  <p>{error}</p>
                  <button
                    onClick={onRefresh}
                    className="text-xs underline hover:text-rose-700 font-semibold"
                  >
                    ลองใหม่อีกครั้ง
                  </button>
                </div>
              </td>
            </tr>
          ) : filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                ไม่พบข้อมูลผู้ใช้งานที่ตรงกับเงื่อนไข
              </td>
            </tr>
          ) : (
            filteredUsers.map((item) => {
              const isDeleted = item.status === "deleted";
              const isCurrent = item.id === currentUserId;
              const isUpdatingThis = updatingId === item.id;

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isDeleted ? "bg-slate-50/40 text-slate-400" : ""
                  }`}
                >
                  {/* Email & ID */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span>{item.email}</span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                          บัญชีของคุณ
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5 select-all">
                      ID: {item.id}
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${
                        item.role === "superadmin"
                          ? "bg-amber-50 text-amber-900 border-amber-200"
                          : item.role === "admin"
                          ? "bg-sky-50 text-sky-800 border-sky-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {item.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4 font-mono text-slate-500 text-[11px]">
                    {formatDate(item.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    {isDeleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200/60 select-none">
                        <Lock className="w-3 h-3 text-slate-400" />
                        ถูกลบแล้ว (แก้ไขไม่ได้)
                      </span>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Active <-> Suspended Button */}
                        <button
                          onClick={() => onToggleStatus(item)}
                          disabled={isUpdatingThis}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xs ${
                            item.status === "active"
                              ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {isUpdatingThis ? (
                            "กำลังบันทึก..."
                          ) : item.status === "active" ? (
                            "ระงับสิทธิ์"
                          ) : (
                            "เปิดใช้งาน"
                          )}
                        </button>

                        {/* Delete Button */}
                        {!isCurrent && (
                          <button
                            onClick={() => onDeleteUser(item)}
                            disabled={isUpdatingThis}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xs"
                            title="ลบบัญชีผู้ใช้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ลบ</span>
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Footer Summary */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>
          แสดง {filteredUsers.length} จาก {users.length} รายการ
        </span>
        <span>ความปลอดภัย: Super Admin Control</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "active" | "suspended" | "deleted" }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-600 animate-pulse" />
        Active
      </span>
    );
  }
  if (status === "suspended") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
        <AlertTriangle className="w-3 h-3 text-amber-600" />
        Suspended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-500 border border-slate-200 opacity-80">
      <XCircle className="w-3 h-3 text-slate-400" />
      Deleted
    </span>
  );
}
