import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAdminInvites, addAdminInvite, deleteAdminInvite } from "~/actions/admin-invite.action";
import Alert from "~/components/ui/Alert";
import { useAuth } from "~/components/providers/AuthProvider";
import type { AdminInvite } from "~/types";

export default function AdminInviteComponent() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [adminInvites, setAdminInvites] = useState<AdminInvite[]>([]);
  const [addEmail, setAddEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alertState, setAlertState] = useState<{
    type: "success" | "error" | "warning" | "info";
    title?: string;
    message: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const isSuperAdmin = user?.role === "superadmin";

  const fetchAdminInvites = async () => {
    if (!isSuperAdmin) return;
    setIsLoading(true);
    const result = await getAdminInvites();
    if (result.success) {
      setAdminInvites(result.data.data);
    } else {
      setAlertState({
        type: "error",
        title: "ดึงข้อมูลไม่สำเร็จ",
        message: result.error,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdminInvites();
    }
  }, [isSuperAdmin]);

  // Validation: Check duplicate email
  const isEmailDuplicate = adminInvites.some(
    (inv) => inv.email.toLowerCase() === addEmail.trim().toLowerCase() && addEmail.trim() !== ""
  );

  const handleAddInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    const trimmedEmail = addEmail.trim();

    if (!trimmedEmail) {
      setAlertState({
        type: "warning",
        title: "กรุณาระบุข้อมูล",
        message: "กรุณากรอกอีเมลที่ต้องการส่งรหัสเชิญ",
      });
      return;
    }

    if (!trimmedEmail.endsWith("@ku.th")) {
      setAlertState({
        type: "warning",
        title: "อีเมลไม่ถูกต้อง",
        message: "กรุณากรอกอีเมลที่มีโดเมน @ku.th เท่านั้น",
      });
      return;
    }

    if (isEmailDuplicate) {
      setAlertState({
        type: "warning",
        title: "อีเมลนี้มีอยู่ในระบบแล้ว",
        message: `อีเมล "${trimmedEmail}" มีการสร้างรหัสเชิญไว้อยู่แล้วในระบบ`,
      });
      return;
    }

    setIsSubmitting(true);
    setAlertState(null);

    const result = await addAdminInvite(trimmedEmail);
    if (result.success) {
      setAdminInvites((prev) => [result.data.data, ...prev]);
      setAddEmail("");
      setAlertState({
        type: "success",
        title: "สร้างคำเชิญสำเร็จ!",
        message: `ส่งคำเชิญลงทะเบียนผู้ดูแลระบบไปยัง ${result.data.data.email} เรียบร้อยแล้ว`,
      });
    } else {
      setAlertState({
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: result.error,
      });
    }
    setIsSubmitting(false);
  };

  const handleDeleteInvite = async (invite: AdminInvite) => {
    if (!isSuperAdmin) return;
    if (invite.status !== "pending") {
      setAlertState({
        type: "warning",
        title: "ไม่สามารถลบได้",
        message: "สามารถลบได้เฉพาะรายการที่สถานะยังเป็น 'รอยืนยัน' (Pending) เท่านั้น",
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "ยืนยันการลบรหัสเชิญ?",
      text: `คุณต้องการลบรหัสเชิญสำหรับ ${invite.email} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "ลบรหัสเชิญ",
      cancelButtonText: "ยกเลิก",
      customClass: {
        popup: "rounded-2xl font-sans",
        confirmButton: "rounded-xl px-4 py-2 text-sm font-semibold",
        cancelButton: "rounded-xl px-4 py-2 text-sm font-semibold",
      },
    });

    if (!confirmResult.isConfirmed) return;

    setDeletingEmail(invite.email);
    setAlertState(null);

    const result = await deleteAdminInvite(invite.email);
    if (result.success) {
      setAdminInvites((prev) => prev.filter((item) => item.email !== invite.email));
      setAlertState({
        type: "success",
        title: "ลบรหัสเชิญสำเร็จ",
        message: `ลบรหัสเชิญสำหรับ ${invite.email} เรียบร้อยแล้ว`,
      });
    } else {
      setAlertState({
        type: "error",
        title: "เกิดข้อผิดพลาดในการลบ",
        message: result.error,
      });
    }
    setDeletingEmail(null);
  };

  /* Permission Guard for Regular Admin */
  if (!isAuthLoading && !isSuperAdmin) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-8 text-center max-w-xl mx-auto my-4 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Access Restricted • สิทธิ์เฉพาะ Super Admin
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            การเข้าถึงถูกจำกัดสิทธิ์
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            ฟังก์ชันการจัดการรหัสเชิญ เพิ่ม หรือลบผู้ดูแลระบบ สงวนสิทธิ์เฉพาะบัญชีผู้ดูแลระบบระดับสูง (<span className="font-semibold text-slate-700">Super Admin</span>) เท่านั้น
          </p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-mono text-slate-600 max-w-xs mx-auto">
          <span>สิทธิ์ปัจจุบันของคุณ:</span>
          <span className="px-2.5 py-0.5 rounded font-bold uppercase bg-slate-200 text-slate-800">
            {user?.role || "ADMIN"}
          </span>
        </div>
      </div>
    );
  }

  const filteredInvites = adminInvites.filter((invite) =>
    invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invite.addedBy && invite.addedBy.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingCount = adminInvites.filter((i) => i.status === "pending").length;
  const acceptedCount = adminInvites.filter((i) => i.status === "accepted").length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200">
              Super Admin Level
            </span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              จัดการรหัสเชิญผู้ดูแลระบบ (Admin Invites)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            สร้างและบริหารจัดการสิทธิ์รหัสเชิญสำหรับเจ้าหน้าที่ผู้ดูแลระบบรายใหม่ (@ku.th)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              รออนุมัติ: <strong className="font-bold">{pendingCount}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              ยืนยันแล้ว: <strong className="font-bold">{acceptedCount}</strong>
            </span>
          </div>
          <button
            onClick={fetchAdminInvites}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-60 shadow-2xs"
          >
            <svg
              className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? "animate-spin" : ""}`}
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
            รีเฟรชข้อมูล
          </button>
        </div>
      </div>

      {alertState && (
        <div className="p-6 pb-0">
          <Alert
            type={alertState.type}
            title={alertState.title}
            message={alertState.message}
            onClose={() => setAlertState(null)}
          />
        </div>
      )}

      <div className="p-6 border-b border-slate-100 bg-white">
        <form onSubmit={handleAddInvite} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-1">
            <label htmlFor="invite-email" className="block text-xs font-semibold text-slate-700">
              อีเมลผู้รับรหัสเชิญ <span className="text-slate-400 font-normal">(เฉพาะโดเมน @ku.th)</span>
            </label>
            <input
              id="invite-email"
              type="email"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              placeholder="ตัวอย่าง: newadmin@ku.th"
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 disabled:opacity-60 transition-colors ${
                isEmailDuplicate
                  ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
                  : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-600"
              }`}
            />
            {isEmailDuplicate && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                อีเมลนี้ถูกสร้างรหัสเชิญไว้อยู่แล้วในรายการ
              </p>
            )}
          </div>
          <div className="sm:self-end">
            <button
              type="submit"
              disabled={isSubmitting || isEmailDuplicate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 disabled:opacity-50 transition-all shadow-xs active:scale-[0.99]"
            >
              {isSubmitting ? "กำลังสร้าง..." : "สร้างรหัสเชิญใหม่"}
            </button>
          </div>
        </form>
      </div>

      <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาตามอีเมลผู้รับ หรือผู้สร้าง..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <div className="text-xs text-slate-500 font-mono self-end sm:self-center">
          แสดง <span className="font-bold text-slate-900">{filteredInvites.length}</span> จากทั้งหมด <span className="font-bold text-slate-900">{adminInvites.length}</span> รายการ
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((idx) => <div key={idx} className="h-12 bg-slate-100/80 animate-pulse rounded-xl" />)}
          </div>
        ) : filteredInvites.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">ไม่พบรายการรหัสเชิญ</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6 font-semibold">อีเมลผู้รับเชิญ</th>
                <th className="py-3 px-6 font-semibold">สร้างโดย (Added By)</th>
                <th className="py-3 px-6 font-semibold">สถานะ</th>
                <th className="py-3 px-6 font-semibold">วันที่สร้าง</th>
                <th className="py-3 px-6 font-semibold text-right">แอ็กชัน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredInvites.map((invite, index) => (
                <tr key={invite.email || index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{invite.email}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-600 text-xs">
                    <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 font-medium">
                      {invite.addedBy || "Super Admin"}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <StatusBadge status={invite.status} />
                  </td>
                  <td className="py-3.5 px-6 font-mono text-slate-500 text-xs">
                    {invite.createdAt ? new Date(invite.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {invite.status === "pending" ? (
                        <button type="button" onClick={() => handleDeleteInvite(invite)} disabled={deletingEmail === invite.email} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50">
                          {deletingEmail === invite.email ? "กำลังลบ..." : "ลบคำเชิญ"}
                        </button>
                      ) : (
                        <button type="button" disabled className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed opacity-60">
                          ลบไม่ได้
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
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "accepted":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          ลงทะเบียนแล้ว
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-50 text-rose-800 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          ยกเลิก
        </span>
      );
    case "pending":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          รอยืนยัน
        </span>
      );
  }
}
