import { Lock } from "lucide-react";

export default function UserAccessRestricted() {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-8 sm:p-12 text-center shadow-xs">
      <div className="w-14 h-14 bg-amber-50 border border-amber-200/80 rounded-md flex items-center justify-center mx-auto mb-4 text-amber-700">
        <Lock className="w-7 h-7" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 tracking-tight">
        จำกัดการเข้าถึงเฉพาะ Super Admin
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
        ส่วนบริหารจัดการผู้ใช้งาน (User Management) จำกัดการใช้งานเฉพาะผู้ดูแลระบบระดับสูง (Super Admin) เท่านั้น
      </p>
    </div>
  );
}
