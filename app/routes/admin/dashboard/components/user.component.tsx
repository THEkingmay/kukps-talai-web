import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { useAuth } from "~/components/providers/AuthProvider";
import { getAll, updateUserStatus, deleteUser } from "~/actions/user.action";
import type { User, UserRole } from "~/types";

type StatusFilter = "all" | "active" | "suspended" | "deleted";
type RoleFilter = "all" | UserRole;

export default function UserComponent() {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "superadmin";

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  // Action loading per user ID
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch Users
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAll();
      if (res.success) {
        setUsers(res.data.data);
      } else {
        setError(res.error);
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้งาน");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [isSuperAdmin]);

  // Compute Metrics Summary
  const metrics = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "active").length;
    const suspended = users.filter((u) => u.status === "suspended").length;
    const deleted = users.filter((u) => u.status === "deleted").length;
    return { total, active, suspended, deleted };
  }, [users]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search by email or ID
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        u.email.toLowerCase().includes(query) ||
        u.id.toLowerCase().includes(query);

      // Filter by status
      const matchesStatus =
        statusFilter === "all" || u.status === statusFilter;

      // Filter by role
      const matchesRole = roleFilter === "all" || u.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  // Toggle Status Handler (Active <-> Suspended)
  const handleToggleStatus = async (userToUpdate: User) => {
    if (userToUpdate.status === "deleted") {
      Swal.fire({
        icon: "warning",
        title: "ไม่สามารถแก้ไขได้",
        text: "ผู้ใช้งานถูกลบแล้ว ไม่สามารถปรับเปลี่ยนสถานะได้อีก",
      });
      return;
    }

    const nextStatus = userToUpdate.status === "active" ? "suspended" : "active";
    const statusTextTH = nextStatus === "active" ? "เปิดใช้งาน" : "ระงับสิทธิ์";

    const confirmResult = await Swal.fire({
      icon: "question",
      title: `ยืนยันการ${statusTextTH}?`,
      html: `คุณต้องการปรับสถานะบัญชี <b>${userToUpdate.email}</b> เป็น <span class="font-bold">${statusTextTH}</span> หรือไม่?`,
      showCancelButton: true,
      confirmButtonText: `ยืนยัน${statusTextTH}`,
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: nextStatus === "active" ? "#059669" : "#d97706",
    });

    if (!confirmResult.isConfirmed) return;

    setUpdatingId(userToUpdate.id);
    try {
      const res = await updateUserStatus(userToUpdate.id, nextStatus);
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "อัปเดตสำเร็จ",
          text: `เปลี่ยนสถานะเป็น ${statusTextTH} เรียบร้อยแล้ว`,
          timer: 1500,
          showConfirmButton: false,
        });
        // Optimistic update
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userToUpdate.id ? { ...u, status: nextStatus } : u
          )
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "อัปเดตไม่สำเร็จ",
          text: res.error,
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถทำรายการได้ โปรดลองอีกครั้ง",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Soft Delete User Handler
  const handleDeleteUser = async (userToDelete: User) => {
    if (userToDelete.status === "deleted") {
      return;
    }

    const confirmResult = await Swal.fire({
      icon: "warning",
      title: "ยืนยันการลบบัญชี?",
      html: `คุณต้องการลบบัญชีผู้ใช้ <b>${userToDelete.email}</b> หรือไม่?<br/><span class="text-xs text-rose-600">เมื่อลบแล้ว สถานะจะเปลี่ยนเป็น Deleted และไม่สามารถแก้ไขได้อีก</span>`,
      showCancelButton: true,
      confirmButtonText: "ยืนยันลบบัญชี",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
    });

    if (!confirmResult.isConfirmed) return;

    setUpdatingId(userToDelete.id);
    try {
      const res = await deleteUser(userToDelete.id);
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "ลบผู้ใช้สำเร็จ",
          text: "เปลี่ยนสถานะผู้ใช้เป็น Deleted เรียบร้อยแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userToDelete.id ? { ...u, status: "deleted" } : u
          )
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "ลบไม่สำเร็จ",
          text: res.error,
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถลบผู้ใช้งานได้",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Access Restriction Guard
  if (!isSuperAdmin) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
        <div className="w-14 h-14 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-700">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          จำกัดการเข้าถึงเฉพาะ Super Admin
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
          ส่วนบริหารจัดการผู้ใช้งาน (User Management) จำกัดการใช้งานเฉพาะผู้ดูแลระบบระดับสูง (Super Admin) เท่านั้น
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          label="ผู้ใช้ทั้งหมด"
          value={metrics.total}
          subtext="Total Accounts"
          badgeColor="bg-slate-100 text-slate-700 border-slate-200"
        />
        <MetricCard
          label="ใช้งานปกติ"
          value={metrics.active}
          subtext="Active"
          badgeColor="bg-emerald-50 text-emerald-800 border-emerald-200"
          activeDot
        />
        <MetricCard
          label="ระงับสิทธิ์"
          value={metrics.suspended}
          subtext="Suspended"
          badgeColor="bg-amber-50 text-amber-800 border-amber-200"
        />
        <MetricCard
          label="ถูกลบแล้ว"
          value={metrics.deleted}
          subtext="Deleted"
          badgeColor="bg-rose-50 text-rose-800 border-rose-200"
        />
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Header & Controls Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                จัดการบัญชีผู้ใช้งานระบบ
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ตรวจสอบและบริหารจัดการสิทธิ์ของผู้ใช้งานทั้งหมดในระบบ
              </p>
            </div>

            <button
              onClick={fetchUsers}
              disabled={isLoading}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xs"
            >
              <svg
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <span>รีเฟรชข้อมูล</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาด้วยอีเมล หรือ ID ผู้ใช้..."
                className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors cursor-pointer"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="active">Active (ใช้งานปกติ)</option>
                <option value="suspended">Suspended (ระงับสิทธิ์)</option>
                <option value="deleted">Deleted (ถูกลบแล้ว)</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="sm:col-span-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors cursor-pointer"
              >
                <option value="all">บทบาททั้งหมด</option>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3 font.medium">ข้อมูลผู้ใช้</th>
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
                        onClick={fetchUsers}
                        className="text-xs underline hover:text-rose-700"
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
                  const isCurrent = item.id === currentUser?.id;
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
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded border border-slate-200/60 select-none">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                              />
                            </svg>
                            ถูกลบแล้ว (แก้ไขไม่ได้)
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle Active <-> Suspended Button */}
                            <button
                              onClick={() => handleToggleStatus(item)}
                              disabled={isUpdatingThis}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-[0.98] disabled:opacity-50 ${
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

                            {/* Delete Button (Only for non-deleted, non-current) */}
                            {!isCurrent && (
                              <button
                                onClick={() => handleDeleteUser(item)}
                                disabled={isUpdatingThis}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 active:scale-[0.98] transition-all disabled:opacity-50"
                                title="ลบบัญชีผู้ใช้"
                              >
                                ลบ
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
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>แสดง {filteredUsers.length} จาก {users.length} รายการ</span>
          <span>ความปลอดภัย: Super Admin Control</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-components & Helpers
// ----------------------------------------------------------------------

function MetricCard({
  label,
  value,
  subtext,
  badgeColor,
  activeDot,
}: {
  label: string;
  value: number;
  subtext: string;
  badgeColor: string;
  activeDot?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${badgeColor}`}
        >
          {activeDot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          {subtext}
        </span>
      </div>
      <div className="mt-2 text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "active" | "suspended" | "deleted" }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Active
      </span>
    );
  }
  if (status === "suspended") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Suspended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-500 border border-slate-200 opacity-80">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Deleted
    </span>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}
