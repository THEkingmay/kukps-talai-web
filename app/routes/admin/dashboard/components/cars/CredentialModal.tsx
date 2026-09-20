import { useState, useEffect } from "react";
import { KeyRound, X, Copy, Check, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
import apiClient from "~/configs/axios";
import { useDialog } from "~/components/providers/DialogProvider";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface CredentialModalProps {
  isOpen: boolean;
  carId: string;
  onClose: () => void;
}

export default function CredentialModal({
  isOpen,
  carId,
  onClose,
}: CredentialModalProps) {
  const [credentials, setCredentials] = useState<{
    clientId: string;
    username: string;
    passwordHash: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { confirm, alert } = useDialog();

  const fetchCredentials = async () => {
    if (!carId) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get(`/cars/credentials/${carId}`);
      if (res.data.success) {
        setCredentials(res.data.data);
      } else {
        setError(res.data.message || "Failed to load credentials");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "ไม่สามารถโหลดข้อมูล Credentials ได้"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCredentials();
      setShowPassword(false);
      setCopiedField(null);
    } else {
      setCredentials(null);
      setError(null);
    }
  }, [isOpen, carId]);

  const username = credentials?.username || "";
  const password = credentials?.passwordHash || "";

  function handleCopy(value: string, field: string) {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  async function handleReset() {
    confirm({
      title: "รีเซ็ต Credentials",
      description: "คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ต MQTT Credentials สำหรับรถคันนี้? ข้อมูลเก่าจะใช้ไม่ได้อีกต่อไป",
      confirmText: "รีเซ็ตเลย",
      cancelText: "ยกเลิก",
      variant: "destructive",
      onConfirm: async () => {
        try {
          setIsLoading(true);
          const res = await apiClient.post(`/cars/mqtt-credentials/${carId}/reset`);
          if (res.data.success) {
            fetchCredentials();
            alert({
              title: "รีเซ็ตข้อมูลสำเร็จ",
              description: "รีเซ็ตข้อมูล Credentials เรียบร้อยแล้ว",
            });
          }
        } catch (err: any) {
          alert({
            title: "เกิดข้อผิดพลาด",
            description: err.response?.data?.message || "ไม่สามารถรีเซ็ต Credentials ได้",
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>MQTT Credentials</DialogTitle>
              <DialogDescription>
                จัดการรหัสผ่านและข้อมูลเชื่อมต่อ
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="mb-2 h-6 w-6 animate-spin" />
              <span className="text-xs font-medium uppercase tracking-wider">กำลังโหลด...</span>
            </div>
          ) : error ? (
            <div className="py-6 text-center">
              <p className="text-sm font-medium">{error}</p>
              <Button variant="link" onClick={fetchCredentials} className="mt-2">
                ลองอีกครั้ง
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              <CredentialField
                label="Car ID"
                value={carId}
                isCopied={copiedField === "carId"}
                onCopy={() => handleCopy(carId, "carId")}
              />
              <CredentialField
                label="Username"
                value={username}
                isCopied={copiedField === "username"}
                onCopy={() => handleCopy(username, "username")}
              />
              <CredentialField
                label="Password"
                value={showPassword ? password : "••••••••••••"}
                isCopied={copiedField === "password"}
                onCopy={() => handleCopy(password, "password")}
                trailing={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                }
              />
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 flex flex-row items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleReset}
            disabled={isLoading || !credentials}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            รีเซ็ต
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            ปิด
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CredentialField({
  label,
  value,
  isCopied,
  onCopy,
  trailing,
}: {
  label: string;
  value: string;
  isCopied: boolean;
  onCopy: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
      <div className="flex-1 min-w-0">
        <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="block truncate font-mono text-sm font-semibold select-all">
          {value || "—"}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {trailing}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onCopy}
          aria-label={`คัดลอก ${label}`}
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
