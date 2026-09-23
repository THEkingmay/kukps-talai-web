import { PlusCircle, Loader2, Mail, AlertCircle, Shield } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { InviteRole } from "~/types";

interface InviteCreateModalProps {
  isOpen: boolean;
  email: string;
  role: InviteRole | "";
  isSubmitting: boolean;
  isEmailDuplicate: boolean;
  onChangeEmail: (val: string) => void;
  onChangeRole: (val: InviteRole) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function InviteCreateModal({
  isOpen,
  email,
  role,
  isSubmitting,
  isEmailDuplicate,
  onChangeEmail,
  onChangeRole,
  onSubmit,
  onClose,
}: InviteCreateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>เพิ่มผู้ดูแลระบบ (Admin)</DialogTitle>
              <DialogDescription>
                ส่งรหัสเชิญทางอีเมลเพื่อให้ผู้ใช้สร้างบัญชีแอดมิน
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              อีเมลผู้รับรหัสเชิญ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(e) => onChangeEmail(e.target.value)}
              placeholder="ตัวอย่าง: newadmin@ku.th"
              disabled={isSubmitting}
              className={
                isEmailDuplicate
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            <p className="text-xs text-muted-foreground">
              เฉพาะโดเมน @ku.th เท่านั้น
            </p>
            {isEmailDuplicate && (
              <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                อีเมลนี้ถูกสร้างรหัสเชิญไว้อยู่แล้วในรายการ
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-role" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              ระดับสิทธิ์ (Role) <span className="text-destructive">*</span>
            </Label>
            <Select
              value={role}
              onValueChange={(val) => onChangeRole(val as InviteRole)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="invite-role">
                <SelectValue placeholder="เลือกระดับสิทธิ์ผู้ใช้งาน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">
                  ผู้ดูแลระบบสูงสุด (Superadmin)
                </SelectItem>
                <SelectItem value="admin">ผู้ดูแลระบบ (Admin)</SelectItem>
                <SelectItem value="driver">พนักงานขับรถ (Driver)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || isEmailDuplicate || !email.trim() || !role
              }
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "กำลังสร้าง..." : "ส่งรหัสเชิญ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
