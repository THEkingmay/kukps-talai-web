import { Loader2 } from "lucide-react";

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
import type { AuthMode } from "../hooks/useAuthPage";

interface AuthFormCardProps {
  mode: AuthMode;
  email: string;
  password: string;
  confirmPassword: string;
  inviteCode: string;
  isLoading: boolean;
  resetSuccessEmail: string | null;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
  onChangeInviteCode: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onSwitchMode: (mode: AuthMode) => void;
}

/** Login / register / forgot-password card of the auth page. */
export default function AuthFormCard({
  mode,
  email,
  password,
  confirmPassword,
  inviteCode,
  isLoading,
  resetSuccessEmail,
  onChangeEmail,
  onChangePassword,
  onChangeConfirmPassword,
  onChangeInviteCode,
  onSubmit,
  onSwitchMode,
}: AuthFormCardProps) {
  return (
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
              onClick={() => onSwitchMode("login")}
            >
              กลับไปหน้าเข้าสู่ระบบ
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-4">
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
                onChange={(e) => onChangeEmail(e.target.value)}
              />
            </div>

            {mode !== "forgot_password" && (
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="auth-password">รหัสผ่าน</Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => onSwitchMode("forgot_password")}
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
                    mode === "register" ? "new-password" : "current-password"
                  }
                  required
                  minLength={8}
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => onChangePassword(e.target.value)}
                />
              </div>
            )}

            {mode === "register" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="auth-confirm-password">ยืนยันรหัสผ่าน</Label>
                  <Input
                    id="auth-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => onChangeConfirmPassword(e.target.value)}
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
                    onChange={(e) => onChangeInviteCode(e.target.value)}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
            {mode === "register" ? "มีบัญชีอยู่แล้ว? " : "ยังไม่มีบัญชี? "}
            <button
              onClick={() =>
                onSwitchMode(mode === "register" ? "login" : "register")
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
              onClick={() => onSwitchMode("login")}
              className="underline underline-offset-4 hover:text-primary font-medium"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
