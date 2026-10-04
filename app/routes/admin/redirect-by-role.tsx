import { Navigate } from "react-router";
import { useAuth } from "~/components/providers/AuthProvider";
import { FullPageLoading } from "~/components/ui/Loading";

/**
 * Redirects to the default section for the current role:
 * superadmin → users, admin → cars.
 */
export default function RedirectByRole() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoading />;
  }

  return (
    <Navigate
      to={user?.role === "superadmin" ? "/admin/users" : "/admin/cars"}
      replace
    />
  );
}
