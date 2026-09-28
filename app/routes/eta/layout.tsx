import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../../components/providers/AuthProvider";
import { useEffect } from "react";
import Loading, { FullPageLoading } from "~/components/ui/Loading";
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      //ถ้าเป็นแอดมินให้ไปดูที่หน้า admin dashboard
      if (user && ["superadmin", "admin"].includes(user.role)) {
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <FullPageLoading />;
  }

  if (!user || user.role === "driver") {
    return <Outlet />;
  }

  // กำลังรอ useEffect ทำการ redirect
  return <FullPageLoading />;
}
