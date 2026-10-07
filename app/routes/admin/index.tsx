import { Navigate } from "react-router";
import { useAuth } from "~/components/providers/AuthProvider";
export function meta() {
  return [
    { title: "Dashboard — KUKPS smart talai" },
    {
      name: "description",
      content: "ระบบควบคุมและบริหารจัดการ KUKPS smart talai สำหรับผู้ดูแลระบบ",
    },
  ];
}

export default function AdminIndexRoute() {
  const { user } = useAuth();

  return (
    <Navigate to={`/admin/${user?.role === "superadmin" ? "users" : "cars"}`} />
  );
}
