import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { resetPasswordAction } from "~/actions/auth.action";
import {
  Bus,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export function meta() {
  return [
    { title: "ตั้งรหัสผ่านใหม่ — KUKPS smart talai" },
    {
      name: "description",
      content:
        "กำหนดรหัสผ่านใหม่สำหรับระบบควบคุม KUKPS smart talai มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน",
    },
  ];
}

// ----------------------------------------------------------------------
// Custom Hooks & Helpers
// ----------------------------------------------------------------------

/** Extract token from query params safely */
function useResetToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setToken(urlParams.get("token"));
      setIsInitializing(false);
    }
  }, []);

  return { token, isInitializing };
}

// ----------------------------------------------------------------------
// UI Components
// ----------------------------------------------------------------------

/** Minimal Brand Header */
function Header() {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0 shadow-xs group-hover:bg-emerald-700 transition-colors">
            <Bus className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors block leading-none">
              KUKPS smart talai
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-medium mt-0.5 block">
              มหาวิทยาลัยเกษตรศาสตร์
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider select-none">
            Admin Portal
          </span>
        </div>
      </div>
    </header>
  );
}

/** Invalid / Missing Token View */
function InvalidTokenCard() {
  return (
    <div className="bg-white border border-rose-200/80 rounded-2xl p-8 text-center shadow-xs">
      <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-rose-600">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h2 className="text-base font-bold text-slate-900 tracking-tight">
        ไม่พบโทเคนรีเซ็ตรหัสผ่าน
      </h2>
      <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
        ลิงก์อาจไม่ถูกต้อง หมดอายุ หรือใช้ไปแล้ว กรุณาขอลิงก์ใหม่อีกครั้ง
      </p>
      <Link
        to="/auth"
        className="mt-6 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>กลับไปหน้าเข้าสู่ระบบ</span>
      </Link>
    </div>
  );
}

/** Success View */
function SuccessCard() {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center shadow-xs">
      <div className="w-12 h-12 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
        ตั้งรหัสผ่านใหม่สำเร็จ
      </h2>
      <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
        รหัสผ่านของคุณได้รับการอัปเดตเรียบร้อยแล้ว สามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที
      </p>
      <button
        onClick={() => navigate("/auth")}
        className="mt-6 w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-xs"
      >
        ไปที่หน้าเข้าสู่ระบบ
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Page
// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  const { token, isInitializing } = useResetToken();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation States
  const hasMinLength = newPassword.length >= 8;
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    if (!hasMinLength) {
      Swal.fire({
        icon: "warning",
        title: "รหัสผ่านสั้นเกินไป",
        text: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณาตรวจสอบการยืนยันรหัสผ่านอีกครั้ง",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPasswordAction(token, newPassword);
      if (result.success) {
        setIsSuccess(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "ตั้งรหัสผ่านไม่สำเร็จ",
          text: result.error,
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "โปรดลองใหม่อีกครั้งในภายหลัง",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {isInitializing ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-mono">กำลังตรวจสอบลิงก์...</p>
            </div>
          ) : !token ? (
            <InvalidTokenCard />
          ) : isSuccess ? (
            <SuccessCard />
          ) : (
            /* Reset Form Card */
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
              {/* Card Title Header */}
              <div className="px-8 pt-8 pb-6 bg-slate-50/60 border-b border-slate-100">
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-center mb-3.5 text-emerald-700">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  ตั้งรหัสผ่านใหม่
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  กำหนดรหัสผ่านใหม่สำหรับเข้าใช้งานระบบ KUKPS smart talai
                </p>
              </div>

              {/* Reset Password Form */}
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-new-password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    รหัสผ่านใหม่
                  </label>
                  <div className="relative">
                    <input
                      id="reset-new-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={isLoading}
                      autoFocus
                      placeholder="อย่างน้อย 8 ตัวอักษร"
                      className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 disabled:bg-slate-50 transition-colors"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-confirm-password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <div className="relative">
                    <input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={isLoading}
                      placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                      className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 disabled:bg-slate-50 transition-colors"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Clean Rule Verification Box */}
                <div className="py-2 px-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        hasMinLength ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                    <span className={hasMinLength ? "text-emerald-700 font-medium" : ""}>
                      ความยาวอย่างน้อย 8 ตัวอักษร
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isMatch ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                    <span className={isMatch ? "text-emerald-700 font-medium" : ""}>
                      รหัสผ่านทั้งสองช่องตรงกัน
                    </span>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  id="reset-password-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-xs active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      <span>กำลังบันทึกรหัสผ่านใหม่...</span>
                    </>
                  ) : (
                    "บันทึกรหัสผ่านใหม่"
                  )}
                </button>
              </form>

              {/* Card Footer Link */}
              <div className="px-8 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-center">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-emerald-700 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>กลับไปยังหน้าเข้าสู่ระบบ</span>
                </Link>
              </div>
            </div>
          )}

          {/* Sub-note */}
          <p className="text-center text-[11px] font-mono text-slate-400 mt-6">
            การเข้าถึงระบบนี้จำกัดเฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต มก.กำแพงแสน
          </p>
        </div>
      </main>
    </div>
  );
}
