import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../../components/providers/AuthProvider";
import { useEffect } from "react";
import Loading, { FullPageLoading } from "~/components/ui/Loading";
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth", { replace: true });
      } else if (user.role === "driver") {
        navigate("/driver/dashboard", { replace: true });
      }
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <FullPageLoading />;
  }

  if (user && (user.role === "superadmin" || user.role === "admin")) {
    return <Outlet />;
  }

  // กำลังรอ useEffect ทำการ redirect
  return <FullPageLoading />;
}
