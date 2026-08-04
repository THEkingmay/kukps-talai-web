import { useState, useEffect } from "react";
import { useAuth } from "~/components/providers/AuthProvider";
import { useNavigate, Link } from "react-router";
import Swal from "sweetalert2";

export default function AuthPage() {
  const { login, register, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (password !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "ข้อมูลไม่ถูกต้อง",
          text: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน",
        });
        return;
      }
      await register(email, password, inviteCode);
    } else {
      await login(email, password);
    }
  };

  const switchMode = () => {
    setIsRegister((v) => !v);
    setInviteCode("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            id="auth-home-link"
          >
            <div className="w-7 h-7 bg-sky-500 rounded flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7v5l3 3"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900 tracking-tight group-hover:text-sky-600 transition-colors">
              KUKPS Talai Transit
            </span>
          </Link>
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest select-none">
            Admin Portal
          </span>
        </div>
      </header>

      {/* Center card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Header strip */}
            <div className="px-7 pt-7 pb-5 border-b border-gray-100">
              {/* Icon */}
              <div className="w-10 h-10 bg-sky-50 border border-sky-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-sky-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  {isRegister ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  )}
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                {isRegister ? "ลงทะเบียนผู้ดูแลระบบ" : "เข้าสู่ระบบ"}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {isRegister ? "กรอกรหัสเชิญจากผู้ดูแลระบบ" : "ระบบจัดการรถตะไล"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="px-7 py-6 space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="auth-email"
                  className="block text-xs font-medium text-gray-700"
                >
                  อีเมล
                </label>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="xxxx@ku.th"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="auth-password"
                  className="block text-xs font-medium text-gray-700"
                >
                  รหัสผ่าน
                </label>
                <input
                  id="auth-password"
                  type="password"
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                />
              </div>

              {/* Confirm Password — register only */}
              {isRegister && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-confirm-password"
                    className="block text-xs font-medium text-gray-700"
                  >
                    ยืนยันรหัสผ่าน
                  </label>
                  <input
                    id="auth-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={isLoading}
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                  />
                </div>
              )}

              {/* Invite code — register only */}
              {isRegister && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-invite-code"
                    className="block text-xs font-medium text-gray-700"
                  >
                    รหัสเชิญ
                  </label>
                  <input
                    id="auth-invite-code"
                    type="text"
                    autoComplete="off"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="xxxxxx"
                    className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                  />
                </div>
              )}

              {/* Submit */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 text-white/80"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    กำลังดำเนินการ...
                  </>
                ) : isRegister ? (
                  "สมัครสมาชิก"
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </button>
            </form>

            {/* Footer toggle */}
            <div className="px-7 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center">
              <button
                id="auth-mode-toggle"
                type="button"
                onClick={switchMode}
                disabled={isLoading}
                className="text-xs text-gray-500 hover:text-sky-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isRegister
                  ? "มีบัญชีอยู่แล้ว? เข้าสู่ระบบที่นี่"
                  : "รับรหัสเชิญแล้ว? ลงทะเบียนที่นี่"}
              </button>
            </div>
          </div>

          {/* Below card note */}
          <p className="text-center text-xs font-mono text-gray-400 mt-5">
            การเข้าถึงระบบนี้จำกัดเฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต
          </p>
        </div>
      </div>
    </div>
  );
}
