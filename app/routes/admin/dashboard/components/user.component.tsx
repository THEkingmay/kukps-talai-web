import { useState, useEffect, useMemo } from "react";
import { useDialog } from "~/components/providers/DialogProvider";
import { useAuth } from "~/components/providers/AuthProvider";
import { getAll, restoreUser, deleteUser } from "~/actions/user.action";
import type { User, UserRole } from "~/types";

import UserMetrics from "./users/UserMetrics";
import UserSearchToolbar from "./users/UserSearchToolbar";
import UserTable from "./users/UserTable";
import UserAccessRestricted from "./users/UserAccessRestricted";

type StatusFilter = "all" | "active" | "deleted";
type RoleFilter = "all" | UserRole;

export default function UserComponent() {
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
    const active = users.filter((u) => u.deletedAt === null).length;
    const deleted = users.filter((u) => u.deletedAt !== null).length;
    return { total, active, deleted };
  }, [users]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        u.email.toLowerCase().includes(query) ||
        u.id.toLowerCase().includes(query);

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

  // Restore User Handler
  const handleRestoreUser = async (userToRestore: User) => {
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
  };

  // Soft Delete User Handler
  const handleDeleteUser = async (userToDelete: User) => {
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
                u.id === userToDelete.id ? { ...u, deletedAt: new Date().toISOString() } : u,
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
  };

  const formatDate = (dateStr: string): string => {
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
  };

  // Access Restriction Guard
  if (!isSuperAdmin) {
    return <UserAccessRestricted />;
  }

  return (
    <div className="space-y-6">
      {/* Vercel-style Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground text-sm">
            จัดการบัญชีผู้ใช้งานและตรวจสอบสถานะการเข้าใช้งานระบบ
          </p>
        </div>
      </div>

      {/* Metrics Overview Cards */}
      <UserMetrics
        total={metrics.total}
        active={metrics.active}
        deleted={metrics.deleted}
      />

      {/* Main Table Container */}
      <div className="bg-background border rounded-md shadow-sm overflow-hidden">
        <UserSearchToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          onResetFilters={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setRoleFilter("all");
          }}
          isLoading={isLoading}
          onRefresh={fetchUsers}
        />

        <UserTable
          users={users}
          filteredUsers={filteredUsers}
          isLoading={isLoading}
          error={error}
          currentUserId={currentUser?.id}
          updatingId={updatingId}
          onRestoreUser={handleRestoreUser}
          onDeleteUser={handleDeleteUser}
          onRefresh={fetchUsers}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
}
