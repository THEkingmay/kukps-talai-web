import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "~/components/providers/AuthProvider";
import { requestResetPasswordAction } from "~/actions/auth.action";
import { Loader2 } from "lucide-react";
import { useDialog } from "~/components/providers/DialogProvider";

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
  const { alert } = useDialog();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [resetSuccessEmail, setResetSuccessEmail] = useState<string | null>(
    null,
  );

  const isLoading = isAuthLoading || isResetSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "register") {
      if (password !== confirmPassword) {
        alert({
          title: "ข้อมูลไม่ถูกต้อง",
          description: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน",
        });
        return;
      }
      await register(email, password, inviteCode);
    } else if (mode === "login") {
      await login(email, password);
    } else if (mode === "forgot_password") {
      if (!email) {
        alert({
          title: "กรุณาระบุอีเมล",
          description: "ระบุอีเมลสถาบันที่ใช้ลงทะเบียนในระบบ",
        });
        return;
      }

      setIsResetSubmitting(true);
      try {
        const result = await requestResetPasswordAction(email);
        if (result.success) {
          setResetSuccessEmail(email);
        } else {
          alert({
            title: "ส่งคำขอไม่สำเร็จ",
            description: result.error,
          });
        }
      } catch {
        alert({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถส่งคำขอได้ โปรดลองอีกครั้งในภายหลัง",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans text-black antialiased p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 shadow-sm p-8 text-center rounded-lg">
          <h1 className="text-xl font-semibold text-black tracking-tight mb-2">
            {mode === "register"
              ? "ลงทะเบียน"
              : mode === "forgot_password"
                ? "ตั้งรหัสผ่านใหม่"
                : "เข้าสู่ระบบ"}
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            {mode === "register"
              ? "สร้างบัญชีผู้ดูแลระบบ KUKPS"
              : mode === "forgot_password"
                ? "รับลิงก์สำหรับรีเซ็ตรหัสผ่าน"
                : "ระบบควบคุมและบริหารจัดการ KUKPS"}
          </p>

          {mode === "forgot_password" && resetSuccessEmail ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed text-left">
                ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่{" "}
                <span className="font-semibold text-black">
                  {resetSuccessEmail}
                </span>{" "}
                แล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ
              </p>
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="w-full py-2 px-4 text-sm font-medium text-black bg-white hover:bg-gray-50 transition-colors border border-gray-200 rounded-md"
              >
                กลับไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label
                  htmlFor="auth-email"
                  className="block text-sm font-medium text-black"
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
                  placeholder="admin@ku.th"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                />
              </div>

              {mode !== "forgot_password" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="auth-password"
                      className="block text-sm font-medium text-black"
                    >
                      รหัสผ่าน
                    </label>
                  </div>
                  <input
                    id="auth-password"
                    type="password"
                    autoComplete={
                      mode === "register" ? "new-password" : "current-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={isLoading}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                  />
                </div>
              )}

              {mode === "register" && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-confirm-password"
                    className="block text-sm font-medium text-black"
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
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                  />
                </div>
              )}

              {mode === "register" && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-invite-code"
                    className="block text-sm font-medium text-black flex items-center justify-between"
                  >
                    <span>รหัสเชิญ</span>
                  </label>
                  <input
                    id="auth-invite-code"
                    type="text"
                    autoComplete="off"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-3 py-2 text-sm font-mono tracking-widest uppercase border border-gray-200 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium text-white bg-black border border-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isLoading && <Loader2 className="w-4 h-4 text-white animate-spin" />}
                {mode === "register"
                  ? "ลงทะเบียน"
                  : mode === "forgot_password"
                    ? "ส่งคำขอ"
                    : "เข้าสู่ระบบ"}
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center space-y-2">
          {mode === "forgot_password" ? (
            <button
              onClick={() => switchMode("login")}
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              กลับสู่หน้าเข้าสู่ระบบ
            </button>
          ) : (
            <>
              {mode === "login" && (
                <div>
                  <button
                    onClick={() => switchMode("forgot_password")}
                    className="text-sm text-gray-500 hover:text-black transition-colors"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
              )}
              <div>
                <button
                  onClick={() =>
                    switchMode(mode === "register" ? "login" : "register")
                  }
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  {mode === "register"
                    ? "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ"
                    : "สมัครสมาชิก"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
