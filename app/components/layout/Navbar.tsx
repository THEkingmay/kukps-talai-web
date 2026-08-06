import { useAuth } from "~/components/providers/AuthProvider";
import { Link } from "react-router";
import Swal from "sweetalert2";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: "ยืนยันการออกจากระบบ",
      text: "คุณต้องการออกจากระบบผู้ดูแลระบบใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#64748b",
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      customClass: {
        popup: "rounded-2xl font-sans",
        confirmButton: "px-4 py-2 rounded-lg text-sm font-semibold",
        cancelButton: "px-4 py-2 rounded-lg text-sm font-semibold",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand logo */}
        <Link to="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7h8m-8 4h8m-4 4h4m1 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 01-2 2v14a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors leading-none">
                KUKPS smart talai
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                Admin
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
              Control Panel & System Management
            </span>
          </div>
        </Link>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-3">
          {/* User Card */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs font-mono flex items-center justify-center uppercase">
              {user?.email ? user.email.charAt(0) : "A"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 max-w-[160px] truncate leading-tight">
                {user?.email || "ผู้ดูแลระบบ"}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            id="nav-logout-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
}
