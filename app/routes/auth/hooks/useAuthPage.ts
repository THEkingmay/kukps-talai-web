import { useCallback, useState } from "react";
import { useAuth } from "~/components/providers/AuthProvider";
import { requestResetPasswordAction } from "~/actions/auth.action";
import { useDialog } from "~/components/providers/DialogProvider";

export type AuthMode = "login" | "register" | "forgot_password";

/**
 * State + behaviour for the auth page (/auth).
 *
 * The page itself only renders markup and wires these values to the
 * presentational components — every piece of form state, the mode switching,
 * the validation alerts and the reset-password request live here.
 */
export function useAuthPage() {
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
    },
    [alert, confirmPassword, email, inviteCode, login, mode, password, register],
  );

  const switchMode = useCallback((newMode: AuthMode) => {
    setMode(newMode);
    setInviteCode("");
    setConfirmPassword("");
    setPassword("");
    setResetSuccessEmail(null);
  }, []);

  return {
    // form state
    mode,
    email,
    password,
    confirmPassword,
    inviteCode,
    // feedback
    isLoading,
    resetSuccessEmail,
    // actions
    setEmail,
    setPassword,
    setConfirmPassword,
    setInviteCode,
    handleSubmit,
    switchMode,
    // misc
    currentYear: new Date().getFullYear(),
  };
}
