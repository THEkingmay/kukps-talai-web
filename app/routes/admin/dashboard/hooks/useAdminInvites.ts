import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminInvite, InviteRole } from "~/types";
import { useAuth } from "~/components/providers/AuthProvider";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  addAdminInvite,
  deleteAdminInvite,
  getAdminInvites,
} from "~/actions/admin-invite.action";

export interface InviteAlertState {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
}

/**
 * State + behaviour for the admin invite list (/admin/invites).
 *
 * The component itself only renders markup and wires these values to the
 * presentational components — no fetching, no validation, no alert/confirm
 * handling, no derivations.
 */
export function useAdminInvites() {
  const { confirm } = useDialog();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [adminInvites, setAdminInvites] = useState<AdminInvite[]>([]);
  const [addEmail, setAddEmail] = useState<string>("");
  const [addRole, setAddRole] = useState<InviteRole | "">("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [alertState, setAlertState] = useState<InviteAlertState | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const isSuperAdmin = user?.role === "superadmin";
  const userRole = user?.role;

  const fetchAdminInvites = useCallback(async () => {
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
  }, [isSuperAdmin]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdminInvites();
    }
  }, [fetchAdminInvites, isSuperAdmin]);

  // --- Derived data ---

  // Validation: Check duplicate email
  const isEmailDuplicate = useMemo(
    () =>
      adminInvites.some(
        (inv) =>
          inv.email.toLowerCase() === addEmail.trim().toLowerCase() &&
          addEmail.trim() !== "",
      ),
    [adminInvites, addEmail],
  );

  const filteredInvites = useMemo(
    () =>
      adminInvites.filter(
        (invite) =>
          invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (invite.addedBy &&
            invite.addedBy.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    [adminInvites, searchTerm],
  );

  const pendingCount = useMemo(
    () => adminInvites.filter((i) => i.status === "pending").length,
    [adminInvites],
  );

  const acceptedCount = useMemo(
    () => adminInvites.filter((i) => i.status === "accepted").length,
    [adminInvites],
  );

  // --- Modal / alert controls ---

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setAddEmail("");
    setAddRole("");
  }, []);

  const dismissAlert = useCallback(() => {
    setAlertState(null);
  }, []);

  // --- Mutations ---

  const handleAddInvite = useCallback(
    async (e: React.FormEvent) => {
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

      if (!addRole) {
        setAlertState({
          type: "warning",
          title: "กรุณาระบุข้อมูล",
          message: "กรุณาเลือกระดับสิทธิ์",
        });
        return;
      }

      setIsSubmitting(true);
      setAlertState(null);

      const result = await addAdminInvite(trimmedEmail, addRole);
      if (result.success) {
        setAdminInvites((prev) => [result.data.data, ...prev]);
        setAddEmail("");
        setAddRole("");
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
    },
    [addEmail, addRole, isEmailDuplicate, isSuperAdmin],
  );

  const handleDeleteInvite = useCallback(
    async (invite: AdminInvite) => {
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
              prev.filter((item) => item.email !== invite.email),
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
        },
      });
    },
    [confirm, isSuperAdmin],
  );

  return {
    // data
    adminInvites,
    isLoading,
    isSubmitting,
    // access
    isSuperAdmin,
    isAuthLoading,
    userRole,
    // filters
    searchTerm,
    setSearchTerm,
    filteredInvites,
    pendingCount,
    acceptedCount,
    // create modal
    isCreateModalOpen,
    setIsCreateModalOpen,
    addEmail,
    setAddEmail,
    addRole,
    setAddRole,
    isEmailDuplicate,
    handleAddInvite,
    closeCreateModal,
    // table actions
    deletingEmail,
    handleDeleteInvite,
    fetchAdminInvites,
    // alerts
    alertState,
    dismissAlert,
  };
}
