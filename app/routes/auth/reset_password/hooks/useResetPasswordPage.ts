import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { resetPasswordAction } from "~/actions/auth.action";
import { useDialog } from "~/components/providers/DialogProvider";

/** Reads the reset token from the query string (`?token=...`). */
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

/**
 * State + behaviour for the reset-password page (/auth/reset-password).
 *
 * The page itself only renders markup: token discovery, the form state, the
 * validation alerts and the redirect after a successful reset live here.
 */
export function useResetPasswordPage() {
  const { token, isInitializing } = useResetToken();
  const { alert } = useDialog();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
    },
    [alert, confirmPassword, newPassword, token],
  );

  const goToLogin = useCallback(() => {
    navigate("/auth");
  }, [navigate]);

  return {
    // reset link
    token,
    isInitializing,
    // form state
    newPassword,
    confirmPassword,
    isLoading,
    isSuccess,
    // actions
    setNewPassword,
    setConfirmPassword,
    handleSubmit,
    goToLogin,
  };
}
