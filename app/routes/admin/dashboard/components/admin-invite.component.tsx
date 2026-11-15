import { RefreshCw, Search, Plus } from "lucide-react";
import Alert from "~/components/ui/Alert";
import { Button } from "~/components/ui/button";

import InviteAccessRestricted from "./invites/InviteAccessRestricted";
import InviteCreateModal from "./invites/InviteCreateModal";
import InviteTable from "./invites/InviteTable";
import { useAdminInvites } from "../hooks/useAdminInvites";

export default function AdminInviteComponent() {
  const invites = useAdminInvites();

  /* Permission Guard for Regular Admin */
  if (!invites.isAuthLoading && !invites.isSuperAdmin) {
    return <InviteAccessRestricted role={invites.userRole} />;
  }

  return (
    <div className="space-y-6">
      {/* Vercel-style Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            การเชิญผู้ดูแลระบบและเจ้าหน้าที่
          </h2>
          <p className="text-muted-foreground text-sm">
            สร้างและบริหารจัดการสิทธิ์รหัสเชิญสำหรับเจ้าหน้าที่ผู้ดูแลระบบรายใหม่
            (@ku.th)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={invites.fetchAdminInvites}
            disabled={invites.isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${invites.isLoading ? "animate-spin" : ""}`}
            />
            รีเฟรช
          </Button>
          <Button onClick={() => invites.setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มรหัสเชิญ
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
          รออนุมัติ: <strong className="font-bold">{invites.pendingCount}</strong>
        </span>
        <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground border">
          ยืนยันแล้ว:{" "}
          <strong className="font-bold">{invites.acceptedCount}</strong>
        </span>
      </div>

      {invites.alertState && (
        <Alert
          type={invites.alertState.type}
          title={invites.alertState.title}
          message={invites.alertState.message}
          onClose={invites.dismissAlert}
        />
      )}

      {/* Main Table Card */}
      <div className="bg-background border rounded-md shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={invites.searchTerm}
              onChange={(e) => invites.setSearchTerm(e.target.value)}
              placeholder="ค้นหาตามอีเมลผู้รับ หรือผู้สร้าง..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-md bg-transparent placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2 pointer-events-none" />
          </div>
          <div className="text-xs text-muted-foreground font-mono self-end sm:self-center">
            แสดง{" "}
            <span className="font-medium text-foreground">
              {invites.filteredInvites.length}
            </span>{" "}
            จากทั้งหมด{" "}
            <span className="font-medium text-foreground">
              {invites.adminInvites.length}
            </span>{" "}
            รายการ
          </div>
        </div>

        <InviteTable
          filteredInvites={invites.filteredInvites}
          isLoading={invites.isLoading}
          deletingEmail={invites.deletingEmail}
          onDeleteInvite={invites.handleDeleteInvite}
        />
      </div>

      {/* Modal */}
      <InviteCreateModal
        isOpen={invites.isCreateModalOpen}
        email={invites.addEmail}
        role={invites.addRole}
        isSubmitting={invites.isSubmitting}
        isEmailDuplicate={invites.isEmailDuplicate}
        onChangeEmail={invites.setAddEmail}
        onChangeRole={invites.setAddRole}
        onSubmit={invites.handleAddInvite}
        onClose={invites.closeCreateModal}
      />
    </div>
  );
}
