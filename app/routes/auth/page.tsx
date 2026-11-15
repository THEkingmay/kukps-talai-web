import { Bus } from "lucide-react";

import AuthBrandingPanel from "./components/AuthBrandingPanel";
import AuthFormCard from "./components/AuthFormCard";
import { useAuthPage } from "./hooks/useAuthPage";

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
  const auth = useAuthPage();

  return (
    <div className="flex min-h-screen">
      {/* Left Pane - Branding */}
      <AuthBrandingPanel year={auth.currentYear} />

      {/* Right Pane - Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex lg:hidden items-center gap-2 self-center font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Bus className="h-4 w-4" />
            </div>
            TalaiETA
          </div>

          <div className="flex flex-col gap-6">
            <AuthFormCard
              mode={auth.mode}
              email={auth.email}
              password={auth.password}
              confirmPassword={auth.confirmPassword}
              inviteCode={auth.inviteCode}
              isLoading={auth.isLoading}
              resetSuccessEmail={auth.resetSuccessEmail}
              onChangeEmail={auth.setEmail}
              onChangePassword={auth.setPassword}
              onChangeConfirmPassword={auth.setConfirmPassword}
              onChangeInviteCode={auth.setInviteCode}
              onSubmit={auth.handleSubmit}
              onSwitchMode={auth.switchMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
