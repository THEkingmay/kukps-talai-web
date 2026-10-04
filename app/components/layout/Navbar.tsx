import { Link } from "react-router";
import TopBarControls from "~/components/layout/TopBarControls";

/**
 * Top bar for the driver dashboard (and any non-admin surface):
 * brand on the left, shared controls on the right.
 * The admin shell uses its own breadcrumb top bar (routes/admin/shell/TopBar.tsx).
 */
export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center">
        {/* Logo Section */}
        <div className="flex h-full items-center px-4 md:w-56 md:shrink-0 md:border-r border-border">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold tracking-tight">TalaiETA</span>
          </Link>
        </div>

        <TopBarControls />
      </div>
    </header>
  );
}
