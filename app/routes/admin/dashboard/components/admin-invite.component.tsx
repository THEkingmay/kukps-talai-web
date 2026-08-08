import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAdminInvites,
  addAdminInvite,
  deleteAdminInvite,
} from "~/actions/admin-invite.action";
import Alert from "~/components/ui/Alert";
import { useAuth } from "~/components/providers/AuthProvider";
import type { AdminInvite } from "~/types";
import { RefreshCw, Search } from "lucide-react";

import InviteAccessRestricted from "./invites/InviteAccessRestricted";
import InviteCreateForm from "./invites/InviteCreateForm";
import InviteTable from "./invites/InviteTable";

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
    (inv) =>
      inv.email.toLowerCase() === addEmail.trim().toLowerCase() &&
      addEmail.trim() !== ""
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
        message:
          "สามารถลบได้เฉพาะรายการที่สถานะยังเป็น 'รอยืนยัน' (Pending) เท่านั้น",
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
      setAdminInvites((prev) =>
        prev.filter((item) => item.email !== invite.email)
      );
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
    return <InviteAccessRestricted role={user?.role} />;
  }

  const filteredInvites = adminInvites.filter(
    (invite) =>
      invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invite.addedBy &&
        invite.addedBy.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingCount = adminInvites.filter(
    (i) => i.status === "pending"
  ).length;
  const acceptedCount = adminInvites.filter(
    (i) => i.status === "accepted"
  ).length;

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
            สร้างและบริหารจัดการสิทธิ์รหัสเชิญสำหรับเจ้าหน้าที่ผู้ดูแลระบบรายใหม่
            (@ku.th)
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
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 ${
                isLoading ? "animate-spin text-emerald-600" : ""
              }`}
            />
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

      <InviteCreateForm
        email={addEmail}
        isSubmitting={isSubmitting}
        isEmailDuplicate={isEmailDuplicate}
        onChangeEmail={setAddEmail}
        onSubmit={handleAddInvite}
      />

      <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาตามอีเมลผู้รับ หรือผู้สร้าง..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
        </div>
        <div className="text-xs text-slate-500 font-mono self-end sm:self-center">
          แสดง{" "}
          <span className="font-bold text-slate-900">
            {filteredInvites.length}
          </span>{" "}
          จากทั้งหมด{" "}
          <span className="font-bold text-slate-900">
            {adminInvites.length}
          </span>{" "}
          รายการ
        </div>
      </div>

      <InviteTable
        filteredInvites={filteredInvites}
        isLoading={isLoading}
        deletingEmail={deletingEmail}
        onDeleteInvite={handleDeleteInvite}
      />
    </div>
  );
}
