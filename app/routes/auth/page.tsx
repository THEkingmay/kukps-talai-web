import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "~/components/providers/AuthProvider";
import { requestResetPasswordAction } from "~/actions/auth.action";
import { Loader2, Bus } from "lucide-react";
import { useDialog } from "~/components/providers/DialogProvider";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";

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
    <div className="flex min-h-screen">
      {/* Left Pane - Branding */}
      <div className="hidden bg-zinc-950 lg:flex flex-col justify-between p-10 text-white w-1/2 lg:max-w-xl xl:max-w-2xl relative overflow-hidden">
        {/* Background Graphic / Vercel-like lines */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="z-10 flex items-center gap-2 font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-zinc-950">
            <Bus className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold">TalaiETA</span>
        </div>

        <div className="z-10 flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Kasetsart University
            <br />
            KamphaengSaen Campus
            <br />
            Talai ETA
          </h1>{" "}
        </div>

        <div className="z-10 text-sm text-zinc-500">
          © {new Date().getFullYear()} KUKPS. All rights reserved.
        </div>
      </div>

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
            <Card className="border-0 shadow-none sm:border sm:shadow-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">
                  {mode === "register"
                    ? "ลงทะเบียน"
                    : mode === "forgot_password"
                      ? "ตั้งรหัสผ่านใหม่"
                      : "เข้าสู่ระบบ"}
                </CardTitle>
                <CardDescription>
                  {mode === "register"
                    ? "สร้างบัญชีผู้ดูแลระบบ KUKPS"
                    : mode === "forgot_password"
                      ? "รับลิงก์สำหรับรีเซ็ตรหัสผ่าน"
                      : "ยินดีต้อนรับกลับเข้าสู่ระบบ"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mode === "forgot_password" && resetSuccessEmail ? (
                  <div className="grid gap-4">
                    <p className="text-sm text-muted-foreground leading-relaxed text-center">
                      ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่{" "}
                      <span className="font-semibold text-foreground">
                        {resetSuccessEmail}
                      </span>{" "}
                      แล้ว กรุณาตรวจสอบกล่องจดหมาย
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => switchMode("login")}
                    >
                      กลับไปหน้าเข้าสู่ระบบ
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="auth-email">อีเมล</Label>
                      <Input
                        id="auth-email"
                        type="email"
                        autoComplete="email"
                        placeholder="admin@ku.th"
                        required
                        disabled={isLoading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    {mode !== "forgot_password" && (
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="auth-password">รหัสผ่าน</Label>
                          {mode === "login" && (
                            <button
                              type="button"
                              onClick={() => switchMode("forgot_password")}
                              className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline"
                            >
                              ลืมรหัสผ่าน?
                            </button>
                          )}
                        </div>
                        <Input
                          id="auth-password"
                          type="password"
                          autoComplete={
                            mode === "register"
                              ? "new-password"
                              : "current-password"
                          }
                          required
                          minLength={8}
                          disabled={isLoading}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    )}

                    {mode === "register" && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="auth-confirm-password">
                            ยืนยันรหัสผ่าน
                          </Label>
                          <Input
                            id="auth-confirm-password"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            disabled={isLoading}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="auth-invite-code">รหัสเชิญ</Label>
                          <Input
                            id="auth-invite-code"
                            type="text"
                            autoComplete="off"
                            className="font-mono uppercase tracking-widest"
                            required
                            disabled={isLoading}
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    <Button
                      type="submit"
                      className="w-full mt-2"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {mode === "register"
                        ? "ลงทะเบียน"
                        : mode === "forgot_password"
                          ? "ส่งคำขอ"
                          : "เข้าสู่ระบบ"}
                    </Button>
                  </form>
                )}
              </CardContent>
              {mode !== "forgot_password" && (
                <CardFooter>
                  <div className="text-center w-full text-sm text-muted-foreground">
                    {mode === "register"
                      ? "มีบัญชีอยู่แล้ว? "
                      : "ยังไม่มีบัญชี? "}
                    <button
                      onClick={() =>
                        switchMode(mode === "register" ? "login" : "register")
                      }
                      className="underline underline-offset-4 hover:text-primary font-medium text-foreground"
                    >
                      {mode === "register" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
                    </button>
                  </div>
                </CardFooter>
              )}
              {mode === "forgot_password" && (
                <CardFooter>
                  <div className="text-center w-full text-sm">
                    <button
                      onClick={() => switchMode("login")}
                      className="underline underline-offset-4 hover:text-primary font-medium"
                    >
                      เข้าสู่ระบบ
                    </button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
