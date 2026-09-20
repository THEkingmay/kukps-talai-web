import { Lock } from "lucide-react";

export default function InviteAccessRestricted({ role }: { role?: string }) {
  return (
    <div className="bg-card border text-card-foreground rounded-md shadow-sm p-8 text-center max-w-xl mx-auto my-4 space-y-6">
      <div className="w-16 h-16 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200/80 dark:border-amber-900/30 text-amber-600 dark:text-amber-500 flex items-center justify-center mx-auto shadow-sm">
        <Lock className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-muted text-muted-foreground border">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
          Access Restricted • สิทธิ์เฉพาะ Super Admin
        </div>
        <h3 className="text-xl font-bold tracking-tight">
          การเข้าถึงถูกจำกัดสิทธิ์
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          ฟังก์ชันการจัดการรหัสเชิญ เพิ่ม หรือลบผู้ดูแลระบบ สงวนสิทธิ์เฉพาะบัญชีผู้ดูแลระบบระดับสูง (
          <span className="font-semibold text-foreground">Super Admin</span>) เท่านั้น
        </p>
      </div>
      <div className="p-3 bg-muted/50 border rounded-md flex items-center justify-between text-xs font-mono text-muted-foreground max-w-xs mx-auto">
        <span>สิทธิ์ปัจจุบันของคุณ:</span>
        <span className="px-2.5 py-0.5 rounded font-bold uppercase bg-muted text-foreground border">
          {role || "ADMIN"}
        </span>
      </div>
    </div>
  );
}
