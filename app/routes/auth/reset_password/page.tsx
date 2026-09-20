import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { resetPasswordAction } from "~/actions/auth.action";
import { Loader2 } from "lucide-react";
import { useDialog } from "~/components/providers/DialogProvider";

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

export default function ResetPasswordPage() {
  const { token, isInitializing } = useResetToken();
  const { alert } = useDialog();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    if (newPassword.length < 8) {
      alert({
        title: "รหัสผ่านสั้นเกินไป",
        description: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      alert({
        title: "รหัสผ่านไม่ตรงกัน",
        description: "กรุณาตรวจสอบการยืนยันรหัสผ่านอีกครั้ง",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPasswordAction(token, newPassword);
      if (result.success) {
        setIsSuccess(true);
      } else {
        alert({
          title: "ตั้งรหัสผ่านไม่สำเร็จ",
          description: result.error,
        });
      }
    } catch {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: "โปรดลองใหม่อีกครั้งในภายหลัง",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans text-black antialiased p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 shadow-sm p-8 text-center rounded-lg">
          {isInitializing ? (
            <div className="py-12">
              <Loader2 className="w-5 h-5 text-black animate-spin mx-auto mb-3" />
            </div>
          ) : !token ? (
            <div>
              <h2 className="text-lg font-semibold text-black mb-2">
                ไม่พบโทเคน
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                ลิงก์อาจไม่ถูกต้อง หมดอายุ หรือใช้ไปแล้ว
              </p>
              <Link
                to="/auth"
                className="w-full py-2 px-4 inline-block text-sm font-medium text-black bg-white hover:bg-gray-50 transition-colors border border-gray-200 rounded-md"
              >
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
            </div>
          ) : isSuccess ? (
            <div>
              <h2 className="text-lg font-semibold text-black mb-2">
                สำเร็จ
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                รหัสผ่านของคุณได้รับการอัปเดตเรียบร้อยแล้ว
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="w-full py-2 px-4 text-sm font-medium text-white bg-black hover:bg-gray-900 transition-colors border border-black rounded-md"
              >
                ไปที่หน้าเข้าสู่ระบบ
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-black tracking-tight mb-2">
                ตั้งรหัสผ่านใหม่
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                กำหนดรหัสผ่านใหม่สำหรับเข้าใช้งานระบบ
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-new-password"
                    className="block text-sm font-medium text-black"
                  >
                    รหัสผ่านใหม่
                  </label>
                  <input
                    id="reset-new-password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={isLoading}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:bg-gray-50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-confirm-password"
                    className="block text-sm font-medium text-black"
                  >
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    id="reset-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={isLoading}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:bg-gray-50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium text-white bg-black border border-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading && <Loader2 className="w-4 h-4 text-white animate-spin" />}
                  บันทึกรหัสผ่านใหม่
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/auth"
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            กลับไปยังหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}
