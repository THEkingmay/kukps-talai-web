import { Link, useLocation } from "react-router";
import TopBarControls from "~/components/layout/TopBarControls";
import { useAdminShell } from "./ShellContext";

const SECTION_LABELS: Record<string, string> = {
  users: "ผู้ใช้งาน",
  invites: "รหัสเชิญ",
  cars: "รถตะไล",
  routes: "สายการเดินรถ",
  assignments: "การจัดการงานผู้ขับรถ",
};

export default function TopBar() {
  const { pathname } = useLocation();
  const { breadcrumb } = useAdminShell();

  const segments = pathname.split("/").filter(Boolean);
  const section = segments[1] === "dashboard" ? "" : segments[1];
  const sectionLabel = SECTION_LABELS[section];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center">
        <div className="flex h-full min-w-0 flex-1 items-center gap-2 pl-4 pr-2 md:pl-6">
          <Link
            to="/"
            className="hidden shrink-0 text-sm font-semibold tracking-tight md:block"
          >
            TalaiETA
          </Link>
          <nav
            aria-label="breadcrumb"
            className="flex min-w-0 items-center gap-1.5 text-sm"
          >
            <span className="hidden text-muted-foreground md:block">Admin</span>
            {sectionLabel && (
              <>
                <span className="hidden text-muted-foreground/50 md:block">
                  /
                </span>
                <span className="truncate font-medium text-foreground">
                  {sectionLabel}
                </span>
              </>
            )}
            {breadcrumb && (
              <>
                <span className="text-muted-foreground/50">/</span>
                <span className="truncate font-mono text-foreground">
                  {breadcrumb}
                </span>
              </>
            )}
          </nav>
        </div>
        <TopBarControls />
      </div>
    </header>
  );
}
