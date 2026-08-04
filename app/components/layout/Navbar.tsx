import { useAuth } from "~/components/providers/AuthProvider";
export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div>
      <div>Profile : {user?.email}</div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
