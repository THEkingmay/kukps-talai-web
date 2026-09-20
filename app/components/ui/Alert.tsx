import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

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
      bg: "bg-emerald-50/90 dark:bg-emerald-500/10 border-emerald-200/80 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-200",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      titleColor: "text-emerald-950 dark:text-emerald-100",
      IconComponent: CheckCircle2,
    },
    error: {
      bg: "bg-rose-50/90 dark:bg-rose-500/10 border-rose-200/80 dark:border-rose-500/20 text-rose-900 dark:text-rose-200",
      iconColor: "text-rose-600 dark:text-rose-400",
      titleColor: "text-rose-950 dark:text-rose-100",
      IconComponent: AlertCircle,
    },
    warning: {
      bg: "bg-amber-50/90 dark:bg-amber-500/10 border-amber-200/80 dark:border-amber-500/20 text-amber-900 dark:text-amber-200",
      iconColor: "text-amber-600 dark:text-amber-400",
      titleColor: "text-amber-950 dark:text-amber-100",
      IconComponent: AlertTriangle,
    },
    info: {
      bg: "bg-sky-50/90 dark:bg-sky-500/10 border-sky-200/80 dark:border-sky-500/20 text-sky-900 dark:text-sky-200",
      iconColor: "text-sky-600 dark:text-sky-400",
      titleColor: "text-sky-950 dark:text-sky-100",
      IconComponent: Info,
    },
  };

  const style = variantStyles[type];
  const Icon = style.IconComponent;

  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-xl shadow-xs transition-all ${style.bg} ${className}`}
    >
      <div className={`p-0.5 shrink-0 ${style.iconColor}`}>
        <Icon className="w-5 h-5" />
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
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
