import { AlertCircle, Plus } from "lucide-react";

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
    <div className="p-6 border-b border-gray-200 bg-white">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 space-y-1">
          <label htmlFor="invite-email" className="block text-xs font-semibold text-gray-700">
            อีเมลผู้รับรหัสเชิญ <span className="text-gray-400 font-normal">(เฉพาะโดเมน @ku.th)</span>
          </label>
          <input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            placeholder="ตัวอย่าง: newadmin@ku.th"
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 text-sm border rounded-md bg-white/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 disabled:opacity-60 transition-colors ${
              isEmailDuplicate
                ? "border-gray-300 focus:ring-black/20 focus:border-black"
                : "border-gray-200 focus:ring-black/20 focus:border-black"
            }`}
          />
          {isEmailDuplicate && (
            <p className="text-xs text-black font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              อีเมลนี้ถูกสร้างรหัสเชิญไว้อยู่แล้วในรายการ
            </p>
          )}
        </div>
        <div className="sm:self-end">
          <button
            type="submit"
            disabled={isSubmitting || isEmailDuplicate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-black hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all shadow-xs active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? "กำลังสร้าง..." : "สร้างรหัสเชิญใหม่"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
