import React from "react";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export default function Alert({
  type = "info",
  title,
  message,
  onClose,
  className = "",
}: AlertProps) {
  const variantStyles = {
    success: {
      bg: "bg-emerald-50/90 border-emerald-200/80 text-emerald-900",
      iconColor: "text-emerald-600",
      titleColor: "text-emerald-950",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    error: {
      bg: "bg-rose-50/90 border-rose-200/80 text-rose-900",
      iconColor: "text-rose-600",
      titleColor: "text-rose-950",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      ),
    },
    warning: {
      bg: "bg-amber-50/90 border-amber-200/80 text-amber-900",
      iconColor: "text-amber-600",
      titleColor: "text-amber-950",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      ),
    },
    info: {
      bg: "bg-sky-50/90 border-sky-200/80 text-sky-900",
      iconColor: "text-sky-600",
      titleColor: "text-sky-950",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12v-.008z"
        />
      ),
    },
  };

  const style = variantStyles[type];

  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-xl shadow-xs transition-all ${style.bg} ${className}`}
    >
      <div className={`p-0.5 shrink-0 ${style.iconColor}`}>
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {style.icon}
        </svg>
      </div>

      <div className="flex-1 text-xs sm:text-sm leading-relaxed">
        {title && (
          <h4 className={`font-bold mb-0.5 tracking-tight ${style.titleColor}`}>
            {title}
          </h4>
        )}
        <p className="opacity-90">{message}</p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="shrink-0 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-black/5 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
