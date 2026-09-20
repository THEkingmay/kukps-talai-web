import { AlertCircle, Plus, Loader2 } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

interface InviteCreateFormProps {
  email: string;
  isSubmitting: boolean;
  isEmailDuplicate: boolean;
  onChangeEmail: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function InviteCreateForm({
  email,
  isSubmitting,
  isEmailDuplicate,
  onChangeEmail,
  onSubmit,
}: InviteCreateFormProps) {
  return (
    <div className="p-4 sm:p-5 border-b bg-card">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="invite-email" className="font-semibold text-foreground">
            อีเมลผู้รับรหัสเชิญ <span className="text-muted-foreground font-normal">(เฉพาะโดเมน @ku.th)</span>
          </Label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            placeholder="ตัวอย่าง: newadmin@ku.th"
            disabled={isSubmitting}
            className={isEmailDuplicate ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {isEmailDuplicate && (
            <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              อีเมลนี้ถูกสร้างรหัสเชิญไว้อยู่แล้วในรายการ
            </p>
          )}
        </div>
        <div className="sm:self-end">
          <Button
            type="submit"
            disabled={isSubmitting || isEmailDuplicate}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "กำลังสร้าง..." : "สร้างรหัสเชิญใหม่"}
          </Button>
        </div>
      </form>
    </div>
  );
}
