import { KeyRound, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useMqttCredentials } from "~/routes/admin/dashboard/hooks/useMqttCredentials";
import CredentialField from "./CredentialField";

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
  const mqtt = useMqttCredentials({ isOpen, carId });

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
          {mqtt.isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="mb-2 h-6 w-6 animate-spin" />
              <span className="text-xs font-medium uppercase tracking-wider">
                กำลังโหลด...
              </span>
            </div>
          ) : mqtt.error ? (
            <div className="py-6 text-center">
              <p className="text-sm font-medium">{mqtt.error}</p>
              <Button
                variant="link"
                onClick={mqtt.refetch}
                className="mt-2"
              >
                ลองอีกครั้ง
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              <CredentialField
                label="Car ID"
                value={carId}
                isCopied={mqtt.copiedField === "carId"}
                onCopy={() => mqtt.copyField(carId, "carId")}
              />
              <CredentialField
                label="Username"
                value={mqtt.username}
                isCopied={mqtt.copiedField === "username"}
                onCopy={() => mqtt.copyField(mqtt.username, "username")}
              />
              <CredentialField
                label="Password"
                value={mqtt.showPassword ? mqtt.password : "••••••••••••"}
                isCopied={mqtt.copiedField === "password"}
                onCopy={() => mqtt.copyField(mqtt.password, "password")}
                trailing={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={mqtt.togglePassword}
                    aria-label={
                      mqtt.showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"
                    }
                  >
                    {mqtt.showPassword ? (
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

        <DialogFooter className="flex flex-row items-center justify-between border-t pt-4 sm:justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={mqtt.requestReset}
            disabled={mqtt.isLoading || !mqtt.credentials}
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
