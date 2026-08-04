export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-5">
        {/* Brand mark */}
        <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7v5l3 3"
            />
          </svg>
        </div>

        {/* Spinner */}
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-500 animate-spin" />
        </div>

        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest select-none">
          กำลังโหลด...
        </p>
      </div>
    </div>
  );
}
