import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../../components/providers/AuthProvider";
import { useEffect } from "react";
import Loading from "~/components/ui/Loading";
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  if (user) {
    return <Outlet />;
  }

  return null;
}
