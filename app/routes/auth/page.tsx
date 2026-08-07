import { useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useAuth } from "~/components/providers/AuthProvider";
import { requestResetPasswordAction } from "~/actions/auth.action";

type AuthMode = "login" | "register" | "forgot_password";

export function meta() {
  return [
    { title: "เข้าสู่ระบบผู้ดูแลระบบ — KUKPS smart talai" },
    {
      name: "description",
      content:
        "ระบบควบคุมและบริหารจัดการ KUKPS smart talai มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน",
    },
  ];
}

export default function AuthPage() {
  const { login, register, isLoading: isAuthLoading } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [resetSuccessEmail, setResetSuccessEmail] = useState<string | null>(
    null
  );

  const isLoading = isAuthLoading || isResetSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "register") {
      if (password !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "ข้อมูลไม่ถูกต้อง",
          text: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน",
        });
        return;
      }
      await register(email, password, inviteCode);
    } else if (mode === "login") {
      await login(email, password);
    } else if (mode === "forgot_password") {
      if (!email) {
        Swal.fire({
          icon: "warning",
          title: "กรุณาระบุอีเมล",
          text: "ระบุอีเมลสถาบันที่ใช้ลงทะเบียนในระบบ",
        });
        return;
      }

      setIsResetSubmitting(true);
      try {
        const result = await requestResetPasswordAction(email);
        if (result.success) {
          setResetSuccessEmail(email);
        } else {
          Swal.fire({
            icon: "error",
            title: "ส่งคำขอไม่สำเร็จ",
            text: result.error,
          });
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถส่งคำขอได้ โปรดลองอีกครั้งในภายหลัง",
        });
      } finally {
        setIsResetSubmitting(false);
      }
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setInviteCode("");
    setConfirmPassword("");
    setPassword("");
    setResetSuccessEmail(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            id="auth-home-link"
          >
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-700 transition-colors">
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
                  d="M8 7h8m-8 4h8m-4 4h4m1 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors block leading-none">
                KUKPS smart talai
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-medium mt-0.5 block">
                มหาวิทยาลัยเกษตรศาสตร์
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-slate-200 bg-slate-100/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono text-slate-600 uppercase tracking-widest select-none">
              Admin Portal
            </span>
          </div>
        </div>
      </header>

      {/* Main Center Auth Surface */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Header Strip */}
            <div className="px-8 pt-8 pb-6 bg-slate-50/60 border-b border-slate-100">
              <div className="w-11 h-11 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-center mb-4 text-emerald-700">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  {mode === "register" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  ) : mode === "forgot_password" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
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
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {mode === "register"
                  ? "ลงทะเบียนผู้ดูแลระบบ"
                  : mode === "forgot_password"
                  ? "ขอลิงก์ตั้งรหัสผ่านใหม่"
                  : "เข้าสู่ระบบผู้ดูแลระบบ"}
              </h1>
              <p className="text-xs text-slate-600 mt-1 font-normal">
                {mode === "register"
                  ? "กรอกข้อมูลและรหัสเชิญจากผู้ดูแลระบบเพื่อเปิดสิทธิ์"
                  : mode === "forgot_password"
                  ? "ระบุอีเมลสถาบันเพื่อรับลิงก์สำหรับรีเซ็ตรหัสผ่าน"
                  : "ระบบควบคุมและบริหารจัดการ KUKPS smart talai"}
              </p>
            </div>

            {/* Forgot Password Success State */}
            {mode === "forgot_password" && resetSuccessEmail ? (
              <div className="px-8 py-8 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-200/80 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    ส่งลิงก์ตั้งรหัสผ่านใหม่แล้ว
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่{" "}
                    <span className="font-semibold text-slate-900">
                      {resetSuccessEmail}
                    </span>{" "}
                    แล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200/80"
                >
                  กลับไปหน้าเข้าสู่ระบบ
                </button>
              </div>
            ) : (
              /* Auth Form */
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-email"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    อีเมลสถาบัน / บุคลากร
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="admin@ku.th"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
                  />
                </div>

                {/* Password Input (Only for Login & Register) */}
                {mode !== "forgot_password" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="auth-password"
                        className="block text-xs font-semibold text-slate-700"
                      >
                        รหัสผ่าน
                      </label>
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => switchMode("forgot_password")}
                          tabIndex={-1}
                          className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                        >
                          ลืมรหัสผ่าน?
                        </button>
                      )}
                    </div>
                    <input
                      id="auth-password"
                      type="password"
                      autoComplete={
                        mode === "register"
                          ? "new-password"
                          : "current-password"
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={isLoading}
                      placeholder="อย่างน้อย 8 ตัวอักษร"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
                    />
                  </div>
                )}

                {/* Confirm Password — Register Mode */}
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-confirm-password"
                      className="block text-xs font-semibold text-slate-700"
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
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
                    />
                  </div>
                )}

                {/* Invite Code — Register Mode */}
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-invite-code"
                      className="block text-xs font-semibold text-slate-700 flex items-center justify-between"
                    >
                      <span>รหัสเชิญ (Invite Code)</span>
                      <span className="text-[10px] text-emerald-700 font-mono font-medium">
                        จำเป็นสำหรับผู้สมัครใหม่
                      </span>
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
                      className="w-full px-3.5 py-2.5 text-sm font-mono tracking-widest uppercase border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.99]"
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
                  ) : mode === "register" ? (
                    "สร้างบัญชีผู้ดูแลระบบ"
                  ) : mode === "forgot_password" ? (
                    "ส่งลิงก์ตั้งรหัสผ่านใหม่"
                  ) : (
                    "เข้าสู่ระบบ"
                  )}
                </button>
              </form>
            )}

            {/* Footer Mode Switch */}
            <div className="px-8 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-center gap-4">
              {mode === "forgot_password" ? (
                <button
                  id="auth-back-to-login"
                  type="button"
                  onClick={() => switchMode("login")}
                  disabled={isLoading}
                  className="text-xs font-medium text-slate-600 hover:text-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  ← กลับสู่หน้าเข้าสู่ระบบ
                </button>
              ) : (
                <button
                  id="auth-mode-toggle"
                  type="button"
                  onClick={() =>
                    switchMode(mode === "register" ? "login" : "register")
                  }
                  disabled={isLoading}
                  className="text-xs font-medium text-slate-600 hover:text-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mode === "register"
                    ? "มีบัญชีผู้ดูแลระบบอยู่แล้ว? เข้าสู่ระบบที่นี่"
                    : "มีรหัสเชิญลงทะเบียน? สมัครสมาชิกที่นี่"}
                </button>
              )}
            </div>
          </div>

          {/* Sub-note */}
          <p className="text-center text-[11px] font-mono text-slate-400 mt-6">
            การเข้าถึงระบบนี้จำกัดเฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต มก.กำแพงแสน
          </p>
        </div>
      </div>
    </div>
  );
}
