import { useCallback, useEffect, useMemo, useState } from "react";
import type { User, UserRole } from "~/types";
import { useAuth } from "~/components/providers/AuthProvider";
import { useDialog } from "~/components/providers/DialogProvider";
import { deleteUser, getAll, restoreUser } from "~/actions/user.action";

export type StatusFilter = "all" | "active" | "deleted";
export type RoleFilter = "all" | UserRole;

/**
 * State + behaviour for the admin user list (/admin/users).
 *
 * The component itself only renders markup and wires these values to the
 * presentational components — no fetching, no alert/confirm handling, no
 * derivations.
 */
export function useUsers() {
  const { alert, confirm } = useDialog();
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

  const fetchUsers = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [fetchUsers, isSuperAdmin]);

  // --- Derived data ---

  const metrics = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.deletedAt === null).length;
    const deleted = users.filter((u) => u.deletedAt !== null).length;
    return { total, active, deleted };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        u.email.toLowerCase().includes(query) ||
        u.id.toLowerCase().includes(query) ||
        (u.firstName?.toLowerCase().includes(query) ?? false) ||
        (u.lastName?.toLowerCase().includes(query) ?? false) ||
        (u.phoneNumber?.toLowerCase().includes(query) ?? false);

      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus = u.deletedAt === null;
      } else if (statusFilter === "deleted") {
        matchesStatus = u.deletedAt !== null;
      }

      const matchesRole = roleFilter === "all" || u.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  // --- Filter controls ---

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setRoleFilter("all");
  }, []);

  // --- Mutations ---

  const handleRestoreUser = useCallback(
    async (userToRestore: User) => {
      confirm({
        title: "ยืนยันการกู้คืนผู้ใช้?",
        description: `คุณต้องการกู้คืนบัญชีผู้ใช้ ${userToRestore.email} กลับมาใช้งานหรือไม่?`,
        confirmText: "ยืนยันกู้คืน",
        cancelText: "ยกเลิก",
        onConfirm: async () => {
          setUpdatingId(userToRestore.id);
          try {
            const res = await restoreUser(userToRestore.id);
            if (res.success) {
              alert({
                title: "กู้คืนสำเร็จ",
                description: `กู้คืนบัญชีผู้ใช้เรียบร้อยแล้ว`,
              });
              setUsers((prev) =>
                prev.map((u) =>
                  u.id === userToRestore.id ? { ...u, deletedAt: null } : u,
                ),
              );
            } else {
              alert({
                title: "กู้คืนไม่สำเร็จ",
                description: res.error,
              });
            }
          } catch {
            alert({
              title: "เกิดข้อผิดพลาด",
              description: "ไม่สามารถทำรายการได้ โปรดลองอีกครั้ง",
            });
          } finally {
            setUpdatingId(null);
          }
        },
      });
    },
    [alert, confirm],
  );

  const handleDeleteUser = useCallback(
    async (userToDelete: User) => {
      if (userToDelete.deletedAt !== null) return;

      confirm({
        title: "ยืนยันการลบบัญชี?",
        description: `คุณต้องการลบบัญชีผู้ใช้ ${userToDelete.email} หรือไม่? เมื่อลบแล้ว สถานะจะเปลี่ยนเป็นถูกลบ`,
        confirmText: "ยืนยันลบบัญชี",
        cancelText: "ยกเลิก",
        onConfirm: async () => {
          setUpdatingId(userToDelete.id);
          try {
            const res = await deleteUser(userToDelete.id);
            if (res.success) {
              alert({
                title: "ลบผู้ใช้สำเร็จ",
                description: "เปลี่ยนสถานะผู้ใช้เป็นถูกลบเรียบร้อยแล้ว",
              });
              setUsers((prev) =>
                prev.map((u) =>
                  u.id === userToDelete.id
                    ? { ...u, deletedAt: new Date() }
                    : u,
                ),
              );
            } else {
              alert({
                title: "ลบไม่สำเร็จ",
                description: res.error,
              });
            }
          } catch {
            alert({
              title: "เกิดข้อผิดพลาด",
              description: "ไม่สามารถลบผู้ใช้งานได้",
            });
          } finally {
            setUpdatingId(null);
          }
        },
      });
    },
    [alert, confirm],
  );

  return {
    // data
    users,
    isLoading,
    error,
    metrics,
    filteredUsers,
    // access
    isSuperAdmin,
    currentUser,
    // filters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    resetFilters,
    // table actions
    updatingId,
    fetchUsers,
    handleRestoreUser,
    handleDeleteUser,
  };
}
