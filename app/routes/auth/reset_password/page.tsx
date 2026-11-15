import ResetPasswordCard from "./components/ResetPasswordCard";
import { useResetPasswordPage } from "./hooks/useResetPasswordPage";

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
  const resetPassword = useResetPasswordPage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-6">
          <ResetPasswordCard
            token={resetPassword.token}
            isInitializing={resetPassword.isInitializing}
            isSuccess={resetPassword.isSuccess}
            isLoading={resetPassword.isLoading}
            newPassword={resetPassword.newPassword}
            confirmPassword={resetPassword.confirmPassword}
            onChangeNewPassword={resetPassword.setNewPassword}
            onChangeConfirmPassword={resetPassword.setConfirmPassword}
            onSubmit={resetPassword.handleSubmit}
            onGoToLogin={resetPassword.goToLogin}
          />
        </div>
      </div>
    </div>
  );
}
