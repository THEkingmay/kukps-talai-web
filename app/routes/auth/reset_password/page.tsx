import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { resetPasswordAction } from "~/actions/auth.action";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/*<Link to="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bus className="h-4 w-4" />
          </div>
          TalaiETA
        </Link>*/}
        <div className="flex flex-col gap-6">
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
                  <CardTitle className="text-xl text-green-600">
                    สำเร็จ
                  </CardTitle>
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
                  <Button className="w-full" onClick={() => navigate("/auth")}>
                    ไปที่หน้าเข้าสู่ระบบ
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-4">
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
                      onChange={(e) => setNewPassword(e.target.value)}
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
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
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
        </div>
      </div>
    </div>
  );
}
