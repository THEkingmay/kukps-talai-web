import UserComponent from "../dashboard/components/user.component";

export function meta() {
  return [
    { title: "ผู้ใช้งาน — KUKPS smart talai" },
    { name: "description", content: "จัดการผู้ใช้งานระบบ" },
  ];
}

export default function UsersPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <UserComponent />
    </div>
  );
}
