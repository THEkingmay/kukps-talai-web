import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "~/components/providers/AuthProvider";
import Loading, { FullPageLoading } from "~/components/ui/Loading";

export default function AuthLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "driver") {
        navigate("/driver/dashboard", { replace: true });
      } else if (user.role === "admin" || user.role === "superadmin") {
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [user, navigate, isLoading]);

  if (isLoading) {
    return <FullPageLoading />;
  }
  if (!user) {
    return <Outlet />;
  }

  return null;
}
