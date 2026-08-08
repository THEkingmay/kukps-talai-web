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
      bg: "bg-emerald-50/90 border-emerald-200/80 text-emerald-900",
      iconColor: "text-emerald-600",
      titleColor: "text-emerald-950",
      IconComponent: CheckCircle2,
    },
    error: {
      bg: "bg-rose-50/90 border-rose-200/80 text-rose-900",
      iconColor: "text-rose-600",
      titleColor: "text-rose-950",
      IconComponent: AlertCircle,
    },
    warning: {
      bg: "bg-amber-50/90 border-amber-200/80 text-amber-900",
      iconColor: "text-amber-600",
      titleColor: "text-amber-950",
      IconComponent: AlertTriangle,
    },
    info: {
      bg: "bg-sky-50/90 border-sky-200/80 text-sky-900",
      iconColor: "text-sky-600",
      titleColor: "text-sky-950",
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
