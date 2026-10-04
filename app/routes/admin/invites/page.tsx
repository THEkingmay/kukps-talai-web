import AdminInviteComponent from "../dashboard/components/admin-invite.component";

export function meta() {
  return [
    { title: "รหัสเชิญ — KUKPS smart talai" },
    { name: "description", content: "จัดการรหัสเชิญผู้ใช้งาน" },
  ];
}

export default function InvitesPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <AdminInviteComponent />
    </div>
  );
}
