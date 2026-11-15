import { Link } from "react-router";
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

interface ResetPasswordCardProps {
  token: string | null;
  isInitializing: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  newPassword: string;
  confirmPassword: string;
  onChangeNewPassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onGoToLogin: () => void;
}

/** Card with the "set a new password" form and its loading / error / success states. */
export default function ResetPasswordCard({
  token,
  isInitializing,
  isSuccess,
  isLoading,
  newPassword,
  confirmPassword,
  onChangeNewPassword,
  onChangeConfirmPassword,
  onSubmit,
  onGoToLogin,
}: ResetPasswordCardProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        {isInitializing ? null : !token ? (
          <>
            <CardTitle className="text-xl text-destructive">
              ไม่พบโทเคน
            </CardTitle>
            <CardDescription>
              ลิงก์อาจไม่ถูกต้อง หมดอายุ หรือใช้ไปแล้ว
            </CardDescription>
          </>
        ) : isSuccess ? (
          <>
            <CardTitle className="text-xl text-green-600">สำเร็จ</CardTitle>
            <CardDescription>
              รหัสผ่านของคุณได้รับการอัปเดตเรียบร้อยแล้ว
            </CardDescription>
          </>
        ) : (
          <>
            <CardTitle className="text-xl">ตั้งรหัสผ่านใหม่</CardTitle>
            <CardDescription>
              กำหนดรหัสผ่านใหม่สำหรับเข้าใช้งานระบบ
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        {isInitializing ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !token ? (
          <div className="grid gap-4">
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth">กลับไปหน้าเข้าสู่ระบบ</Link>
            </Button>
          </div>
        ) : isSuccess ? (
          <div className="grid gap-4">
            <Button className="w-full" onClick={onGoToLogin}>
              ไปที่หน้าเข้าสู่ระบบ
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reset-new-password">รหัสผ่านใหม่</Label>
              <Input
                id="reset-new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                disabled={isLoading}
                value={newPassword}
                onChange={(e) => onChangeNewPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reset-confirm-password">
                ยืนยันรหัสผ่านใหม่
              </Label>
              <Input
                id="reset-confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => onChangeConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              บันทึกรหัสผ่านใหม่
            </Button>
          </form>
        )}
      </CardContent>
      {!isInitializing && token && !isSuccess && (
        <CardFooter>
          <div className="text-center w-full text-sm">
            <Link
              to="/auth"
              className="underline underline-offset-4 hover:text-primary"
            >
              กลับไปยังหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
