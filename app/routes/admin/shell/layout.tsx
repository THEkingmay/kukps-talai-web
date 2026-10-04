import { Outlet } from "react-router";
import GlobalAlert from "~/components/ui/GlobalAlert";
import { AdminShellProvider } from "./ShellContext";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

/**
 * Vercel-style admin shell: top bar (breadcrumb + controls),
 * section sidebar, scrollable content, global WS alerts.
 */
export default function AdminShellLayout() {
  return (
    <AdminShellProvider>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <TopBar />
        <main className="flex min-h-0 w-full flex-1 flex-col md:flex-row">
          <Sidebar />
          <div className="min-h-0 min-w-0 flex-1 overflow-auto outline-none">
            <Outlet />
          </div>
        </main>
        <GlobalAlert />
      </div>
    </AdminShellProvider>
  );
}
