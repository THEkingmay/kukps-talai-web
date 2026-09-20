import { Lock } from "lucide-react";

export default function InviteAccessRestricted({ role }: { role?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-xs p-8 text-center max-w-xl mx-auto my-4 space-y-6">
      <div className="w-16 h-16 rounded-md bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
        <Lock className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-gray-100 text-gray-900 border border-gray-300">
          <span className="w-1.5 h-1.5 rounded-full bg-black" />
          Access Restricted • สิทธิ์เฉพาะ Super Admin
        </div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          การเข้าถึงถูกจำกัดสิทธิ์
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
          ฟังก์ชันการจัดการรหัสเชิญ เพิ่ม หรือลบผู้ดูแลระบบ สงวนสิทธิ์เฉพาะบัญชีผู้ดูแลระบบระดับสูง (
          <span className="font-semibold text-gray-700">Super Admin</span>) เท่านั้น
        </p>
      </div>
      <div className="p-3 bg-white border border-gray-200 rounded-md flex items-center justify-between text-xs font-mono text-gray-500 max-w-xs mx-auto">
        <span>สิทธิ์ปัจจุบันของคุณ:</span>
        <span className="px-2.5 py-0.5 rounded font-bold uppercase bg-gray-200 text-gray-800">
          {role || "ADMIN"}
        </span>
      </div>
    </div>
  );
}
