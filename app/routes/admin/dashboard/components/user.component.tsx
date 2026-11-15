import UserMetrics from "./users/UserMetrics";
import UserSearchToolbar from "./users/UserSearchToolbar";
import UserTable from "./users/UserTable";
import UserAccessRestricted from "./users/UserAccessRestricted";
import { useUsers } from "../hooks/useUsers";

import { formatDate } from "~/helper";

export default function UserComponent() {
  const users = useUsers();

  // Access Restriction Guard
  if (!users.isSuperAdmin) {
    return <UserAccessRestricted />;
  }

  return (
    <div className="space-y-6">
      {/* Vercel-style Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ผู้ใช้งาน</h2>
          <p className="text-muted-foreground text-sm">
            จัดการบัญชีผู้ใช้งานและตรวจสอบสถานะการเข้าใช้งานระบบ
          </p>
        </div>
      </div>

      {/* Metrics Overview Cards */}
      <UserMetrics
        total={users.metrics.total}
        active={users.metrics.active}
        deleted={users.metrics.deleted}
        isLoading={users.isLoading}
      />

      {/* Main Table Container */}
      <div className="bg-background border rounded-md shadow-sm overflow-hidden">
        <UserSearchToolbar
          searchQuery={users.searchQuery}
          onSearchChange={users.setSearchQuery}
          statusFilter={users.statusFilter}
          onStatusFilterChange={users.setStatusFilter}
          roleFilter={users.roleFilter}
          onRoleFilterChange={users.setRoleFilter}
          onResetFilters={users.resetFilters}
          isLoading={users.isLoading}
          onRefresh={users.fetchUsers}
        />

        <UserTable
          users={users.users}
          filteredUsers={users.filteredUsers}
          isLoading={users.isLoading}
          error={users.error}
          currentUserId={users.currentUser?.id}
          updatingId={users.updatingId}
          onRestoreUser={users.handleRestoreUser}
          onDeleteUser={users.handleDeleteUser}
          onRefresh={users.fetchUsers}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
}
