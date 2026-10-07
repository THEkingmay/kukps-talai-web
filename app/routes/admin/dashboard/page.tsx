import { useAuth } from "~/components/providers/AuthProvider";
import { Navigate } from "react-router";

export function meta() {
  return [
    { title: "Dashboard — KUKPS smart talai" },
    {
      name: "description",
      content: "ระบบควบคุมและบริหารจัดการ KUKPS smart talai สำหรับผู้ดูแลระบบ",
    },
  ];
}
export default function LegacyDashboardRoute() {
  const { user } = useAuth();

  return (
    <Navigate to={`/admin/${user?.role === "superadmin" ? "users" : "cars"}`} />
  );
}
