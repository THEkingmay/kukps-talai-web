export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans antialiased">
      <div className="flex flex-col items-center gap-4">
        {/* Brand mark */}
        <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-600/20">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7h8m-8 4h8m-4 4h4m1 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        {/* Brand title */}
        <div className="text-center">
          <span className="text-sm font-bold text-slate-900 tracking-tight block">
            KUKPS smart talai
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-medium">
            มหาวิทยาลัยเกษตรศาสตร์
          </span>
        </div>

        {/* Spinner */}
        <div className="relative w-7 h-7 mt-1">
          <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-600 animate-spin" />
        </div>

        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest select-none pt-1">
          กำลังโหลด...
        </p>
      </div>
    </div>
  );
}

