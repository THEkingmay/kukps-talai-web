import { useEffect, useState } from "react";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  getAdminInvites,
  addAdminInvite,
  deleteAdminInvite,
} from "~/actions/admin-invite.action";
import Alert from "~/components/ui/Alert";
import { useAuth } from "~/components/providers/AuthProvider";
import type { AdminInvite } from "~/types";
import { RefreshCw, Search, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

import InviteAccessRestricted from "./invites/InviteAccessRestricted";
import InviteCreateModal from "./invites/InviteCreateModal";
import InviteTable from "./invites/InviteTable";

export default function AdminInviteComponent() {
  const { alert, confirm } = useDialog();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [adminInvites, setAdminInvites] = useState<AdminInvite[]>([]);
  const [addEmail, setAddEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
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
      setIsCreateModalOpen(false);
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

    confirm({
      title: "ยืนยันการลบรหัสเชิญ?",
      description: `คุณต้องการลบรหัสเชิญสำหรับ ${invite.email} ใช่หรือไม่?`,
      confirmText: "ลบรหัสเชิญ",
      cancelText: "ยกเลิก",
      onConfirm: async () => {
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
      }
    });
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
    <div className="space-y-6">
      {/* Vercel-style Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Invites</h2>
          <p className="text-muted-foreground text-sm">
            สร้างและบริหารจัดการสิทธิ์รหัสเชิญสำหรับเจ้าหน้าที่ผู้ดูแลระบบรายใหม่ (@ku.th)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchAdminInvites} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            รีเฟรช
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มรหัสเชิญ
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
          รออนุมัติ: <strong className="font-bold">{pendingCount}</strong>
        </span>
        <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground border">
          ยืนยันแล้ว: <strong className="font-bold">{acceptedCount}</strong>
        </span>
      </div>

      {alertState && (
        <Alert
          type={alertState.type}
          title={alertState.title}
          message={alertState.message}
          onClose={() => setAlertState(null)}
        />
      )}

      {/* Main Table Card */}
      <div className="bg-background border rounded-md shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาตามอีเมลผู้รับ หรือผู้สร้าง..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-md bg-transparent placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2 pointer-events-none" />
          </div>
          <div className="text-xs text-muted-foreground font-mono self-end sm:self-center">
            แสดง <span className="font-medium text-foreground">{filteredInvites.length}</span> จากทั้งหมด <span className="font-medium text-foreground">{adminInvites.length}</span> รายการ
          </div>
        </div>

        <InviteTable
          filteredInvites={filteredInvites}
          isLoading={isLoading}
          deletingEmail={deletingEmail}
          onDeleteInvite={handleDeleteInvite}
        />
      </div>

      {/* Modal */}
      <InviteCreateModal
        isOpen={isCreateModalOpen}
        email={addEmail}
        isSubmitting={isSubmitting}
        isEmailDuplicate={isEmailDuplicate}
        onChangeEmail={setAddEmail}
        onSubmit={handleAddInvite}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

