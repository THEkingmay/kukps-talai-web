import { useAuth } from "~/components/providers/AuthProvider";
import { Link } from "react-router";
import { useDialog } from "~/components/providers/DialogProvider";
import { Bus, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { confirm } = useDialog();

  const handleLogout = () => {
    confirm({
      title: "ยืนยันการออกจากระบบ",
      description: "คุณต้องการออกจากระบบผู้ดูแลระบบใช่หรือไม่?",
      confirmText: "ออกจากระบบ",
      cancelText: "ยกเลิก",
      onConfirm: () => {
        logout();
      }
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand logo */}
        <Link to="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center shrink-0 shadow-sm shadow-black/20 group-hover:bg-gray-800 transition-colors">
            <Bus className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-gray-900 tracking-tight group-hover:text-gray-800 transition-colors leading-none">
                TalaiETA
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-gray-100 text-black border border-gray-300">
                Admin
              </span>
            </div>
            <span className="text-[11px] font-mono text-gray-400 block mt-0.5">
              Control Panel & System Management
            </span>
          </div>
        </Link>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-3">
          {/* User Card */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-bg-white border border-gray-200/80 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-gray-200 text-black font-bold text-xs font-mono flex items-center justify-center uppercase">
              {user?.email ? user.email.charAt(0) : "A"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-800 max-w-[160px] truncate leading-tight">
                {user?.email || "ผู้ดูแลระบบ"}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-1000 animate-pulse" />
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            id="nav-logout-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-900 bg-white hover:bg-gray-100 border border-gray-300/80 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
}
