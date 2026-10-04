import { Link, NavLink } from "react-router";
import {
  Bus,
  CalendarClock,
  LayoutDashboard,
  MapPinned,
  Route as RouteIcon,
  Ticket,
  Users,
} from "lucide-react";
import { cn } from "cn";
import { useAuth } from "~/components/providers/AuthProvider";

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  superAdminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/admin/users", label: "ผู้ใช้งาน", icon: Users, superAdminOnly: true },
  { to: "/admin/invites", label: "รหัสเชิญ", icon: Ticket, superAdminOnly: true },
  { to: "/admin/cars", label: "รถตะไล", icon: Bus },
  { to: "/admin/routes", label: "สายการเดินรถ", icon: RouteIcon },
  {
    to: "/admin/assignments",
    label: "การจัดการงานผู้ขับรถ",
    icon: CalendarClock,
  },
  { to: "/admin/eta", label: "ดูตำแหน่งรถแบบเรียลไทม์", icon: MapPinned },
];

/**
 * Vercel-style admin sidebar: brand on top, section nav below.
 * Detail routes (e.g. /admin/cars/:carId) keep their section item active.
 */
export default function Sidebar() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  const items = NAV_ITEMS.filter((item) => !item.superAdminOnly || isSuperAdmin);

  return (
    <aside className="w-full shrink-0 border-b border-border bg-sidebar md:w-56 md:border-b-0 md:border-r lg:w-60">
      <div className="flex flex-col p-3 md:p-4">
        {/* Brand */}
        <Link
          to="/"
          className="hidden items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold tracking-tight text-foreground transition-colors hover:bg-muted md:flex"
        >
          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">KUKPS Talai</span>
          <span className="ml-auto rounded-full border bg-muted px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            {user?.role === "superadmin" ? "SA" : "Admin"}
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex gap-1 overflow-x-auto pb-2 md:flex-col md:pb-0 md:[&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-md px-2.5 py-2 text-sm transition-colors md:w-full",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
