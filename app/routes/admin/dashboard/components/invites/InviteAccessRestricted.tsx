import { Lock } from "lucide-react";

export default function InviteAccessRestricted({ role }: { role?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-8 text-center max-w-xl mx-auto my-4 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
        <Lock className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Access Restricted • สิทธิ์เฉพาะ Super Admin
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          การเข้าถึงถูกจำกัดสิทธิ์
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
          ฟังก์ชันการจัดการรหัสเชิญ เพิ่ม หรือลบผู้ดูแลระบบ สงวนสิทธิ์เฉพาะบัญชีผู้ดูแลระบบระดับสูง (
          <span className="font-semibold text-slate-700">Super Admin</span>) เท่านั้น
        </p>
      </div>
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-mono text-slate-600 max-w-xs mx-auto">
        <span>สิทธิ์ปัจจุบันของคุณ:</span>
        <span className="px-2.5 py-0.5 rounded font-bold uppercase bg-slate-200 text-slate-800">
          {role || "ADMIN"}
        </span>
      </div>
    </div>
  );
}
