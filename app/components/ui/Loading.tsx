import { Bus, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans antialiased">
      <div className="flex flex-col items-center gap-4">
        {/* Brand mark */}
        <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-600/20">
          <Bus className="w-6 h-6 text-white" />
        </div>

        {/* Brand title */}
        <div className="text-center">
          <span className="text-sm font-bold text-slate-900 tracking-tight block">
            Talai ETA
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-medium">
            มหาวิทยาลัยเกษตรศาสตร์
          </span>
        </div>

        {/* Spinner */}
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mt-1" />

        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest select-none pt-1">
          กำลังโหลด...
        </p>
      </div>
    </div>
  );
}
